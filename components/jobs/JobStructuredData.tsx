"use client";

import React, { useMemo } from 'react';
import { config } from '@/lib/config';
import { Job } from '@/lib/types/job.types';

export const JobStructuredData: React.FC<{ job: Job }> = ({ job }) => {
  const baseUrl = config.NEXT_PUBLIC_APP_URL || '';
  const jobUrl = `${baseUrl}/jobs/${job._id}`;

  // Helper functions
  const getCompanyName = (company: Job['company']): string => {
    if (!company) return "شرکت نامشخص";
    if (typeof company === 'string') return company;
    return company.name || "شرکت نامشخص";
  };

  const getCompanyLocation = (company: Job['company']): string => {
    if (!company) return "موقعیت نامشخص";
    if (typeof company === 'string') return company;

    const companyObj = company as { location?: string | Record<string, string> };

    if (companyObj.location) {
      if (typeof companyObj.location === 'string') {
        return companyObj.location;
      }
      const loc = companyObj.location as Record<string, string>;
      const parts = [];
      if (loc['city']) parts.push(loc['city']);
      if (loc['state']) parts.push(loc['state']);
      if (loc['country']) parts.push(loc['country']);
      if (loc['address'] && !loc['city'] && !loc['state']) parts.push(loc['address']);
      return parts.length > 0 ? parts.join('، ') : "موقعیت نامشخص";
    }

    return "موقعیت نامشخص";
  };

  const getEmployerData = (company: Job['company']) => {
    if (!company || typeof company === 'string') return null;
    return {
      name: company.name,
      logo: company.logo,
      website: company.website,
    };
  };

  const formatSalary = (min?: number, max?: number, currency = 'IRR', unitText = 'MONTH') => {
    if (!min && !max) return undefined;

    return {
      '@type': 'MonetaryAmount',
      currency,
      value: {
        '@type': 'QuantitativeValue',
        ...(min ? { minValue: min } : {}),
        ...(max ? { maxValue: max } : {}),
        ...(!min || !max ? { value: min || max } : {}),
        unitText,
      },
    };
  };

  const mapJobType = (type?: string) => {
    const types: Record<string, string> = {
      'full-time': 'FULL_TIME',
      'part-time': 'PART_TIME',
      'contract': 'CONTRACTOR',
      'internship': 'INTERN',
      'freelance': 'FREELANCE',
      'remote': 'FULL_TIME',
    };
    return types[type?.toLowerCase() || ''] || 'FULL_TIME';
  };

  // Pure memoization without Date.now()
  const cleanData = useMemo(() => {
    const employerData = getEmployerData(job.company);
    const companyName = getCompanyName(job.company);
    const companyLocation = getCompanyLocation(job.company);
    const isRemote = job.workMode?.toLowerCase() === 'remote';

    // Derive fallback validThrough purely from job.createdAt if present
    const createdTimestamp = job.createdAt ? new Date(job.createdAt).getTime() : null;
    const fallbackValidThrough = createdTimestamp
      ? new Date(createdTimestamp + 30 * 24 * 60 * 60 * 1000).toISOString()
      : undefined;

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      '@id': `${jobUrl}#jobposting`,
      title: job.title,
      description: job.description,
      identifier: {
        '@type': 'PropertyValue',
        name: 'جاب‌آی',
        value: job._id,
      },
      datePosted: job.createdAt || undefined,
      validThrough: job.applicationDeadline || fallbackValidThrough,
      employmentType: mapJobType(job.jobType),
      
      ...(isRemote ? { jobLocationType: 'TELECOMMUTE' } : {}),

      hiringOrganization: {
        '@type': 'Organization',
        name: employerData?.name || companyName,
        sameAs: employerData?.website ? [employerData.website] : undefined,
        logo: employerData?.logo ? (employerData.logo.startsWith('http') ? employerData.logo : `${baseUrl}${employerData.logo}`) : undefined,
      },

      jobLocation: companyLocation !== "موقعیت نامشخص" ? {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'IR',
          addressLocality: companyLocation,
          addressRegion: companyLocation,
        },
      } : {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'IR',
        },
      },

      baseSalary: (job.minSalary || job.maxSalary) ? formatSalary(job.minSalary, job.maxSalary, 'IRR', 'MONTH') : undefined,
      skills: job.skills?.length ? job.skills : undefined,
      responsibilities: job.requirements,
      qualifications: job.requirements,
      numberOfOpenings: job.openings || 1,
    };

    return JSON.parse(
      JSON.stringify(structuredData, (_, val) => (val === undefined ? undefined : val))
    );
  }, [job, jobUrl, baseUrl]);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanData) }}
    />
  );
};

export default JobStructuredData;
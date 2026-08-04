import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { config } from '@/lib/config';
import { JobDetailsClient } from '@/components/jobs/JobDetailsClient';
import { JobStructuredData } from '@/components/jobs/JobStructuredData';
import { BreadcrumbStructuredData } from '@/components/seo/BreadcrumbStructuredData';
import { generateBreadcrumbs } from '@/components/seo/breadcrumbUtils';
import { Job } from '@/lib/types/job.types';

async function getJobById(jobId: string): Promise<Job | null> {
  const apiBaseUrl = config.NEXT_PUBLIC_API_GATEWAY_URL || '';
  try {
    const response = await fetch(`${apiBaseUrl}/jobs/${jobId}`, {
      next: { revalidate: 600 }, // Revalidate every 10 minutes
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data?.data?.job || data?.job || null;
  } catch (error) {
    console.error('Failed to fetch job:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const job = await getJobById(id);
  const baseUrl = config.NEXT_PUBLIC_APP_URL;

  if (!job) {
    return {
      title: 'شغل یافت نشد | جاب‌آی',
      robots: { index: false, follow: false },
    };
  }

  const jobUrl = `${baseUrl}/jobs/${job._id}`;

  return {
    title: `${job.title} در ${job.company} | جاب‌آی`,
    description: job.description?.slice(0, 160) || `فرصت شغلی ${job.title} در شرکت ${job.company}`,
    keywords: [job.title, job.company, job.location, ...(job.skills || [])].filter(Boolean).join(', '),
    openGraph: {
      title: `${job.title} در ${job.company}`,
      description: job.description?.slice(0, 160) || `فرصت شغلی ${job.title} در شرکت ${job.company}`,
      type: 'website',
      url: jobUrl,
      siteName: 'جاب‌آی',
      locale: 'fa_IR',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${job.title} در ${job.company}`,
      description: job.description?.slice(0, 160) || `فرصت شغلی ${job.title} در شرکت ${job.company}`,
    },
    alternates: {
      canonical: jobUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

const baseUrl = config.NEXT_PUBLIC_APP_URL;

export default async function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await getJobById(id);

  if (!job) {
    notFound();
  }

  return (
    <>
      <BreadcrumbStructuredData items={generateBreadcrumbs.jobDetail(baseUrl, job.title, job._id)} />
      <JobStructuredData job={job} />
      <JobDetailsClient job={job} />
    </>
  );
}
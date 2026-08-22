import React from 'react';
import { config } from '@/lib/config';
import { Job } from '@/lib/types/job.types';

/**
 * ItemList structured data for job listing pages.
 * Helps Google understand the list of JobPosting cards as a structured list,
 * surfacing rich snippets for job listings in search results.
 * Server-rendered so Googlebot sees JSON-LD in the initial HTML.
 */
interface ItemListStructuredDataProps {
  jobs: Job[];
  currentPage?: number;
  totalPages?: number;
}

export const ItemListStructuredData: React.FC<ItemListStructuredDataProps> = ({
  jobs,
  currentPage = 1,
  totalPages,
}) => {
  const baseUrl = config.NEXT_PUBLIC_APP_URL;

  // Only include visible job cards (skip any that might be empty)
  const itemListElements = jobs.slice(0, 20).map((job, index) => {
    const companyName =
      typeof job.company === 'object' ? job.company?.name : typeof job.company === 'string' ? job.company : undefined;

    const item: Record<string, unknown> = {
      '@type': 'ListItem',
      position: (currentPage - 1) * 20 + index + 1,
      url: `${baseUrl}/jobs/${job._id}`,
      name: job.title,
    };

    if (companyName) {
      item['item'] = {
        '@type': 'JobPosting',
        headline: job.title,
        hiringOrganization: {
          '@type': 'Organization',
          name: companyName,
        },
      };
    }

    return item;
  });

  const structuredData: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'لیست شغل‌ها — جاب مچ',
    description: 'لیست فرصت‌های شغلی منطبق بر جستجو شما در جاب مچ',
    itemListElement: itemListElements,
  };

  // Add pagination info if available
  if (totalPages && totalPages > 1) {
    structuredData['itemListOrder'] = `${baseUrl}/jobs?page=${currentPage}`;
    structuredData['numberOfItems'] = jobs.length;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

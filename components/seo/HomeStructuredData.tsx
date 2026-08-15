"use client";

import { config } from '@/lib/config';
import React from 'react';

export const HomeStructuredData: React.FC = () => {
  const baseUrl = config.NEXT_PUBLIC_APP_URL;

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: 'جاب مچ',
        description: 'پلتفرم استخدام با هوش مصنوعی - شغل رویایی خود را با جستجو و تطابق مبتنی بر هوش مصنوعی پیدا کنید',
        inLanguage: 'fa-IR',
        publisher: {
          '@id': `${baseUrl}/#organization`,
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${baseUrl}/jobs?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: 'جاب مچ',
        alternateName: 'JobAI',
        url: baseUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/logo.png`,
        },
        description: 'پلتفرم استخدام با هوش مصنوعی برای پیدا کردن شغل رویایی شما',
        sameAs: [
          'https://linkedin.com/company/jobai',
          'https://twitter.com/jobai_ir',
          'https://instagram.com/jobai.ir',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+98-921-8087195',
          contactType: 'customer service',
          availableLanguage: ['Persian', 'English'],
        },
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'IR',
          addressLocality: 'Tehran',
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};
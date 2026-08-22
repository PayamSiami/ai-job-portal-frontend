import React from 'react';
import { config } from '@/lib/config';

/**
 * Article structured data (JSON-LD) for blog posts and static content pages.
 *
 * Server-rendered (no "use client") so Googlebot sees the JSON-LD in the
 * initial HTML response — required for Article / FAQPage rich results.
 *
 * @example
 * <ArticleStructuredData
 *   headline="چگونه رزومه بسازیم"
 *   description="راهنمای کامل ساخت رزومه..."
 *   datePublished="2026-06-14"
 *   dateModified="2026-06-18"
 *   author="سارا احمدی"
 *   authorUrl="https://example.com"
 *   url="/blog/how-to-build-resume"
 * />
 */
interface ArticleStructuredDataProps {
  /** Page headline — also used as the article headline */
  headline: string;
  /** Short description / summary */
  description: string;
  /** ISO date string when the article was first published */
  datePublished: string;
  /** ISO date string when the article was last modified (defaults to datePublished) */
  dateModified?: string;
  /** Author name */
  author: string;
  /** Author's profile URL (optional) */
  authorUrl?: string;
  /** Absolute URL of the article page */
  url: string;
  /** URL of the featured image (optional) */
  image?: string;
  /** Article section / category (optional) */
  articleSection?: string;
  /** Tags associated with the article (optional) */
  tags?: string[];
}

export const ArticleStructuredData: React.FC<ArticleStructuredDataProps> = ({
  headline,
  description,
  datePublished,
  dateModified,
  author,
  authorUrl,
  url,
  image,
  articleSection,
  tags,
}) => {
  const baseUrl = config.NEXT_PUBLIC_APP_URL;

  const structuredData: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    datePublished,
    dateModified: dateModified || datePublished,
    author: authorUrl
      ? {
          '@type': 'Person',
          name: author,
          url: authorUrl,
        }
      : {
          '@type': 'Person',
          name: author,
        },
    publisher: {
      '@type': 'Organization',
      name: 'جاب مچ',
      logo: {
        '@type': 'ImageObject',
        url: image || `${baseUrl}/logo.svg`,
        width: 512,
        height: 512,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };

  if (image) {
    structuredData['image'] = {
      '@type': 'ImageObject',
      url: image,
      width: 1200,
      height: 630,
    };
  }

  if (articleSection) {
    structuredData['articleSection'] = articleSection;
  }

  if (tags && tags.length > 0) {
    structuredData['keywords'] = tags.join(', ');
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

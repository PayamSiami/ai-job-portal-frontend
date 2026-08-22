import React from 'react';
import { config } from '@/lib/config';
import { BlogPost } from '@/lib/data/blogPosts';

/**
 * CollectionPage structured data for the blog listing page.
 * Lists the blog posts as itemListElement so Google can index them.
 *
 * Server-rendered (no "use client") for SSR/HTML-first rendering.
 */
interface BlogListStructuredDataProps {
  posts: BlogPost[];
}

export const BlogListStructuredData: React.FC<BlogListStructuredDataProps> = ({ posts }) => {
  const baseUrl = config.NEXT_PUBLIC_APP_URL;

  const itemListElements = posts.map((post, index) => ({
    '@type': 'ListItem' as const,
    position: index + 1,
    url: `${baseUrl}/blog/${post.slug}`,
    name: post.title,
    description: post.description,
    image: post.image,
    datePublished: post.datePublished,
    author: {
      '@type': 'Person' as const,
      name: post.author,
    },
  }));

  const structuredData: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'بلاگ جاب مچ',
    description:
      'مقالات متخصصانه درباره جستجوی شغل، ساخت رزومه، مصاحبه شغلی، هوش مصنوعی در استخدام، و آخرین روندهای بازار کار ایران.',
    url: `${baseUrl}/blog`,
    inLanguage: 'fa-IR',
    publisher: {
      '@type': 'Organization',
      name: 'جاب مچ',
    },
    hasPart: posts.slice(0, 20).map((post) => ({
      '@type': 'Article' as const,
      headline: post.title,
      description: post.description,
      datePublished: post.datePublished,
      dateModified: post.dateModified || post.datePublished,
      author: {
        '@type': 'Person' as const,
        name: post.author,
      },
      url: `${baseUrl}/blog/${post.slug}`,
      image: post.image || `${baseUrl}/logo.svg`,
      publisher: {
        '@type': 'Organization' as const,
        name: 'جاب مچ',
        logo: {
          '@type': 'ImageObject' as const,
          url: `${baseUrl}/logo.svg`,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage' as const,
        '@id': `${baseUrl}/blog/${post.slug}`,
      },
    })),
    itemListElement: itemListElements,
    numberOfItems: posts.length,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

"use client";

import React from 'react';
import { BreadcrumbItem } from './breadcrumbUtils';

interface BreadcrumbStructuredDataProps {
  items: BreadcrumbItem[];
}

export const BreadcrumbStructuredData: React.FC<BreadcrumbStructuredDataProps> = ({ items }) => {
  // Validate items
  if (!items || items.length === 0) {
    return null;
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

/**
 * Client-side breadcrumb navigation component (visual)
 * Can be used alongside BreadcrumbStructuredData for UI
 */
export const BreadcrumbNavigation: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 text-sm text-gray-500 mb-4"
    >
      <ol className="flex items-center gap-2 flex-wrap" itemScope itemType="https://schema.org/BreadcrumbList">
        {items.map((item, index) => (
          <li key={item.url} itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            {index > 0 && (
              <span className="mx-1 text-gray-300" aria-hidden="true">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            )}
            {index === items.length - 1 ? (
              <span
                itemProp="name"
                className="text-gray-900 font-medium truncate max-w-50"
              >
                {item.name}
              </span>
            ) : (
              <a
                href={item.url}
                itemProp="item"
                className="hover:text-blue-600 transition-colors"
              >
                <span itemProp="name">{item.name}</span>
                <meta itemProp="position" content={(index + 1).toString()} />
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default BreadcrumbStructuredData;
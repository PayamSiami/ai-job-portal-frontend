'use client';

import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils/cn';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  items: TocItem[];
}

/**
 * Table of contents client component that highlights the active heading
 * as the user scrolls and allows smooth anchor navigation.
 */
export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const tocRef = useRef<HTMLDivElement>(null);

  // Handle smooth scroll to anchor
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Update hash without page jump
        window.history.pushState(null, '', href);
        setActiveId(targetId);
      }
    };

    const toc = tocRef.current;
    if (toc) {
      toc.addEventListener('click', handleClick, true);
      return () => toc.removeEventListener('click', handleClick, true);
    }
  }, []);

  // Track active heading on scroll
  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -60% 0px',
        threshold: 0.1,
      }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav
      ref={tocRef}
      className="mb-8"
      aria-label="فهرست مطالعه"
    >
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
        فهرست مطالعه
      </h3>
      <ul className="space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                'block py-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors',
                item.level === 3 && 'pl-4',
                item.level === 4 && 'pl-8',
                activeId === item.id &&
                  'text-blue-600 dark:text-blue-400 font-medium'
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

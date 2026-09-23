import { slugify } from '@/lib/utils/slugify';
import type { BlogPostContent } from '@/lib/data/blogPosts';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, type ReactNode } from 'react';
import { Quote } from 'lucide-react';

interface BlogContentRendererProps {
  content: BlogPostContent[];
}

/**
 * Renders a paragraph that may contain inline links, returning React nodes.
 * Links are injected as <Link> elements so they participate in the Next.js
 * router and pass anchor-text PageRank from high-traffic blog content to
 * /jobs (the money page) and /register.
 */
function LinkedParagraph({
  item,
}: {
  item: BlogPostContent;
}) {
  const links = item.links;
  if (!links || links.length === 0) {
    return <p className="mb-4 leading-relaxed">{item.text}</p>;
  }

  const parts: ReactNode[] = [];
  let remaining = item.text || '';
  let keySuffix = 0;

  while (remaining.length > 0) {
    // Find the earliest link whose search_text occurs in the remaining string.
    let earliest = -1;
    let earliestLink: (typeof links)[number] | null = null;
    for (const l of links) {
      const idx = remaining.indexOf(l.search_text);
      if (idx !== -1 && (earliest === -1 || idx < earliest)) {
        earliest = idx;
        earliestLink = l;
      }
    }

    if (earliest === -1 || !earliestLink) {
      // No more links — push the rest as plain text.
      if (remaining) {
        parts.push(<Fragment key={`t${keySuffix++}`}>{remaining}</Fragment>);
      }
      break;
    }

    // Push text before the link.
    if (earliest > 0) {
      parts.push(<Fragment key={`t${keySuffix++}`}>{remaining.slice(0, earliest)}</Fragment>);
    }

    const after = remaining.slice(earliest + earliestLink.search_text.length);
    parts.push(
      <Link
        key={`l${keySuffix++}`}
        href={earliestLink.href}
        className="text-blue-600 dark:text-blue-400 underline decoration-blue-300 hover:text-blue-800 dark:hover:text-blue-300"
      >
        {earliestLink.label || earliestLink.search_text}
      </Link>,
    );

    remaining = after;
  }

  return <p className="mb-4 leading-relaxed">{parts}</p>;
}


/**
 * Renders the parsed blog post content array into semantic HTML.
 * Used by the server-rendered blog post page so content is in the SSR HTML.
 */
export function BlogContentRenderer({ content }: BlogContentRendererProps) {
  if (!content || !Array.isArray(content)) return null;

  return (
    <div className="prose lg:prose-xl max-w-none dark:prose-invert text-right" dir="rtl">
      {content.map((item, index) => {
        const key = `${item.type}-${index}`;

        switch (item.type) {
          case 'heading': {
            const HeadingTag = `h${item.level || 2}` as 'h2' | 'h3' | 'h4';
            const id = slugify(item.text || '');
            return (
              <HeadingTag
                key={key}
                id={id}
                className="mt-10 mb-4 font-bold scroll-mt-24"
              >
                {item.text}
              </HeadingTag>
            );
          }

          case 'paragraph':
            return <LinkedParagraph key={key} item={item} />;

          case 'list':
            return (
              <div key={key} className="mb-4">
                {item.ordered ? (
                  <ol className="list-decimal list-outside mr-6 space-y-2 mb-4">
                    {item.items?.map((li, i) => (
                      <li key={`${key}-${i}`} className="mb-1">
                        {li}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <ul className="list-disc list-outside mr-6 space-y-2 mb-4">
                    {item.items?.map((li, i) => (
                      <li key={`${key}-${i}`} className="mb-1">
                        {li}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );

          case 'quote':
            return (
              <blockquote key={key} className="mb-6 border-r-4 border-blue-600 pr-6">
                <div className="flex gap-2 mb-1">
                  <Quote className="w-5 h-5 text-blue-600 shrink-0" />
                  <p className="italic text-gray-700 dark:text-gray-300 leading-relaxed">
                    "{item.text}"
                  </p>
                </div>
                {item.attribution && (
                  <cite className="block text-sm text-muted-foreground">— {item.attribution}</cite>
                )}
              </blockquote>
            );

          case 'image':
            return (
              <figure key={key} className="my-6 text-center">
                {item.src ? (
                  <Image
                    src={item.src}
                    alt={item.alt || ''}
                    width={1200}
                    height={630}
                    className="w-full h-auto rounded-lg mx-auto"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="w-full h-48 bg-muted/30 rounded-lg flex items-center justify-center mx-auto">
                    <span className="text-muted-foreground">تصویر در دسترس نیست</span>
                  </div>
                )}
                {item.caption && (
                  <figcaption className="text-sm text-muted-foreground mt-2">
                    {item.caption}
                  </figcaption>
                )}
              </figure>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}

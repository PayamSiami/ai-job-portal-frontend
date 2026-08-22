import { slugify } from '@/lib/utils/slugify';
import type { BlogPostContent } from '@/lib/data/blogPosts';
import Image from 'next/image';
import { Quote } from 'lucide-react';

interface BlogContentRendererProps {
  content: BlogPostContent[];
  baseUrl?: string;
}

/**
 * Renders the parsed blog post content array into semantic HTML.
 * Used by the server-rendered blog post page so content is in the SSR HTML.
 */
export function BlogContentRenderer({ content, baseUrl }: BlogContentRendererProps) {
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
            return (
              <p key={key} className="mb-4 leading-relaxed">
                {item.text}
              </p>
            );

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

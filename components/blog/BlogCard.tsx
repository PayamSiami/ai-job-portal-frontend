import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils/cn';
import { BlogPost } from '@/lib/data/blogPosts';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

/**
 * Reusable blog post card showing the featured image, title,
 * excerpt, author, and metadata.
 */
export function BlogCard({ post, featured = false }: BlogCardProps) {
  const postUrl = `/blog/${post.slug}`;
  const dateObj = new Date(post.datePublished);

  const formattedDate = new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);

  return (
    <article
      className={cn(
        'group transition-all duration-300',
        featured ? 'md:grid md:grid-cols-2 gap-6' : ''
      )}
    >
      <Card
        className={cn(
          'overflow-hidden border border-border/50 bg-card transition-all duration-300 hover:shadow-xl',
          featured ? 'md:max-w-none' : ''
        )}
      >
        <CardContent className="p-0">
          <div className="relative">
            {post.image ? (
              <Image
                src={post.image}
                alt={post.title}
                width={featured ? 600 : 400}
                height={featured ? 300 : 200}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div
                className={cn(
                  'w-full bg-linear-to-br from-blue-100 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-950/30 flex items-center justify-center',
                  featured ? 'h-48' : 'h-48'
                )}
              >
                <span className="text-blue-600 dark:text-blue-400 font-semibold text-lg">
                  {post.category}
                </span>
              </div>
            )}
            <div
              className={cn(
                'absolute top-3 left-3',
                featured ? 'top-4 left-4' : 'top-3 left-3'
              )}
            >
              <Badge
                variant="secondary"
                className="text-xs font-medium bg-background/90 backdrop-blur-sm"
              >
                {post.category}
              </Badge>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {post.readingTime} دقیقه
              </span>
            </div>

            <Link href={postUrl} className="block group">
              <h3
                className="text-xl font-bold text-foreground mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors"
                style={{ viewTransitionName: `blog-title-${post.slug}` }}
              >
                {post.title}
              </h3>
            </Link>

            <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
              {post.description}
            </p>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {post.tags.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs border-border/40 text-muted-foreground"
                  >
                    <Tag className="w-2.5 h-2.5 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950/40">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  {post.author.charAt(0)}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-foreground">{post.author}</span>
                <p className="text-xs text-muted-foreground">{post.authorTitle}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </article>
  );
}

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { config } from '@/lib/config';
import { BLOG_POSTS, getBlogPost, getRelatedPosts, BlogPost } from '@/lib/data/blogPosts';
import { ArticleStructuredData } from '@/components/seo/ArticleStructuredData';
import { BreadcrumbStructuredData } from '@/components/seo/BreadcrumbStructuredData';
import { generateBreadcrumbs } from '@/components/seo/breadcrumbUtils';
import { BlogContentRenderer } from '@/components/blog/BlogContentRenderer';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { ShareButtons } from '@/components/blog/ShareButtons';
import { BlogCard } from '@/components/blog/BlogCard';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Tag, ArrowLeft } from 'lucide-react';
import { extractHeadings } from '@/lib/utils/slugify';

const baseUrl = config.NEXT_PUBLIC_APP_URL;

// Revalidate every 6 hours for ISR
export const revalidate = 21600;

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Generate static params for all blog posts at build time.
 */
export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

/**
 * Dynamic metadata for each blog post.
 */
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: 'مقاله یافت نشد | بلاگ جاب مچ',
      robots: { index: false, follow: false },
    };
  }

  const postUrl = `${baseUrl}/blog/${post.slug}`;
  const imageUrl = post.image || `${baseUrl}/logo.svg`;
  const description = post.description;

  return {
    title: `${post.title} | بلاگ جاب مچ`,
    description,
    keywords: [
      post.title,
      post.category,
      ...post.tags,
      ...(post.content
        .filter((c) => c.type === 'heading')
        .map((c) => c.text || '')),
    ]
      .filter(Boolean)
      .join(', '),
    applicationName: 'جاب مچ',
    referrer: 'origin-when-cross-origin',
    authors: [{ name: post.author, url: baseUrl }],
    publisher: 'جاب مچ',
    formatDetection: {
      telephone: false,
    },
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      url: postUrl,
      siteName: 'جاب مچ | JobMatch',
      locale: 'fa_IR',
      publishedTime: post.datePublished,
      modifiedTime: post.dateModified || post.datePublished,
      authors: [post.author],
      section: post.category,
      tags: post.tags,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `جاب مچ — ${post.title}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: postUrl,
    },
    robots: {
      index: true,
      follow: true,
      'max-snippet': 160,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  };
}

/**
 * Format a Persian date string for display.
 */
function formatPersianDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Main blog post page component.
 * Server-rendered so Googlebot sees all content (text, headings, structured data).
 */
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const postUrl = `${baseUrl}/blog/${slug}`;
  const headings = extractHeadings(post.content);
  const relatedPosts = getRelatedPosts(slug, post.categorySlug, 3);

  return (
    <>
      {/* Structured Data — Article JSON-LD */}
      <ArticleStructuredData
        headline={post.title}
        description={post.description}
        datePublished={post.datePublished}
        dateModified={post.dateModified}
        author={post.author}
        url={postUrl}
        image={post.image}
        articleSection={post.category}
        tags={post.tags}
      />

      {/* Structured Data — BreadcrumbList */}
      <BreadcrumbStructuredData
        items={generateBreadcrumbs.blogPost(baseUrl, post.title, post.slug)}
      />

      <article className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-blue-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            بازگشت به بلاگ
          </Link>

          {/* Hero */}
          <header className="mb-8">
            <Badge
              variant="outline"
              className="mb-4 border-border/40 text-xs font-medium"
            >
              {post.category}
            </Badge>

            <h1
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight"
              style={{ viewTransitionName: `blog-title-${post.slug}` }}
            >
              {post.title}
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              {post.description}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.datePublished}>
                  {formatPersianDate(post.datePublished)}
                </time>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readingTime} دقیقه
              </span>
              {post.dateModified && post.dateModified !== post.datePublished && (
                <span className="flex items-center gap-1">
                  <span>به‌روزرسانی:</span>
                  <time dateTime={post.dateModified}>
                    {formatPersianDate(post.dateModified)}
                  </time>
                </span>
              )}
            </div>

            {/* Author */}
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950/40">
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {post.author.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {post.author}
                </p>
                <p className="text-sm text-muted-foreground">
                  {post.authorTitle}
                </p>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {post.image && (
            <div className="mb-8">
              <Image
                src={post.image}
                alt={post.title}
                width={1200}
                height={630}
                className="w-full h-auto rounded-lg object-cover"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </div>
          )}

          {/* Two-column Layout: ToC + Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Table of Contents (Desktop) */}
            <aside className="hidden xl:block xl:col-span-3">
              <div className="sticky top-24">
                {headings.length > 0 && <TableOfContents items={headings} />}
              </div>
            </aside>

            {/* Article Content */}
            <main className="lg:col-span-9">
              {/* Mobile ToC (visible below hero on mobile) */}
              <div className="xl:hidden mb-8">
                {headings.length > 0 && <TableOfContents items={headings} />}
              </div>

              <BlogContentRenderer content={post.content} />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-10 pt-6 border-t border-border/50">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      برچسب‌ها:
                    </span>
                    {post.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Share */}
              <div className="mt-10 pt-6 border-t border-border/50">
                <ShareButtons
                  title={post.title}
                  url={postUrl}
                  description={post.description}
                />
              </div>
            </main>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-border/50">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
                مقالات مرتبط
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {relatedPosts.map((related: BlogPost) => (
                  <BlogCard key={related.slug} post={related} />
                ))}
              </div>
            </div>
          </section>
        )}
      </article>
    </>
  );
}

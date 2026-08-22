import { config } from '@/lib/config';
import type { MetadataRoute } from 'next';
import { BLOG_POSTS } from '@/lib/data/blogPosts';

const baseUrl = config.NEXT_PUBLIC_APP_URL;

/**
 * Static sitemap for blog posts.
 * Uses the statically-defined BLOG_POSTS data; regenerates on ISR revalidate.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.dateModified
      ? new Date(post.dateModified)
      : new Date(post.datePublished),
    changeFrequency: 'monthly' as const,
    priority: post.featured ? 0.8 : 0.6,
    images: post.image ? [post.image] : undefined,
    // Add structured metadata about the post for search engines
  }));
}

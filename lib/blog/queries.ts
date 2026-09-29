
import { BLOG_POSTS } from "./post";
import type { BlogPost } from "./types";

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getFeaturedPosts(): BlogPost[] {
  return BLOG_POSTS.filter((post) => post.featured);
}

export function getRecentPosts(limit = 5): BlogPost[] {
  return [...BLOG_POSTS]
    .sort((a, b) => new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime())
    .slice(0, limit);
}

export function getRelatedPosts(slug: string, categorySlug: string, limit = 3): BlogPost[] {
  return BLOG_POSTS.filter(
    (post) => post.slug !== slug && post.categorySlug === categorySlug,
  ).slice(0, limit);
}

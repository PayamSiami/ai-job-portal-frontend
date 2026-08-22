import { config } from "@/lib/config";
import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/data/blogPosts";

// Provide a fallback URL
const baseUrl = config.NEXT_PUBLIC_APP_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily" as const,
      priority: 1,
      images: [`${baseUrl}/logo.svg`],
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: currentDate,
      changeFrequency: "hourly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: [`${baseUrl}/logo.svg`],
    },
    {
      url: `${baseUrl}/login`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    },
  ];

  // Blog post routes — each with its own lastModified from the post data
  const blogRoutes: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.dateModified
      ? new Date(post.dateModified)
      : new Date(post.datePublished),
    changeFrequency: "weekly" as const,
    priority: 0.7,
    images: post.image ? [post.image] : undefined,
  }));

  return [...staticRoutes, ...blogRoutes];
}
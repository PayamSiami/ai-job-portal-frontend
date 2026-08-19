import { config } from "@/lib/config";
import type { MetadataRoute } from "next";

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

  return staticRoutes;
}
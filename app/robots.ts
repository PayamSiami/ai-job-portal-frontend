import { config } from "@/lib/config";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = config.NEXT_PUBLIC_APP_URL;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          // Next.js internal API rewrites to the backend
          "/api/",
          // Authenticated / private user areas (jobseeker)
          "/dashboard",
          "/profile",
          "/settings",
          "/applications",
          "/resumes",
          "/saved-jobs",
          // Authenticated / private employer area
          "/employer",
        ],
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/jobs/sitemap.xml`,
      `${baseUrl}/blog/sitemap.xml`,
    ],
  };
}

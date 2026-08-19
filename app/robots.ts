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
          "/api/",
          "/dashboard/",
          "/employer/",
          "/applications/",
          "/resumes/create",
          "/resumes/*/edit",
          "/settings",
          "/profile/",
          "/saved-jobs/",
        ],
      },
    ],
    sitemap: [`${baseUrl}/sitemap.xml`, `${baseUrl}/jobs/sitemap.xml`],
  };
}

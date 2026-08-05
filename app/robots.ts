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
          "/auth/",
          "/applications/",
          "/resumes/create",
          "/resumes/*/edit",
          "/settings",
          "/profile/",
        ],
      },
    ],
    sitemap: [`${baseUrl}/sitemap.xml`, `${baseUrl}/jobs/sitemap.xml`],
  };
}

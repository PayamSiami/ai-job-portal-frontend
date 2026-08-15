import { config } from "./lib/config";
import type { NextConfig } from "next";

function getHostname(urlString: string | undefined, fallback: string = "localhost"): string {
  if (!urlString) return fallback;
  try {
    return new URL(urlString).hostname;
  } catch {
    return fallback;
  }
}

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname:  getHostname(config.NEXT_PUBLIC_APP_URL),
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: getHostname(config.NEXT_PUBLIC_API_GATEWAY_URL),
        pathname: "/uploads/**",
      },
    ],
    // Fallback if no pattern matches
    unoptimized: process.env.NODE_ENV === "development",
    formats: ["image/avif", "image/webp"],
    // Set image size limits
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // Security headers for images
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/_next/image/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  async rewrites() {
    // Use a fallback URL if environment variable is not set
    const apiUrl = config.NEXT_PUBLIC_API_GATEWAY_URL;
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },

  // Environment variables that will be available in the browser
  env: {
    NEXT_PUBLIC_APP_URL: config.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_API_GATEWAY_URL: config.NEXT_PUBLIC_API_GATEWAY_URL,
  },
};

export default nextConfig;

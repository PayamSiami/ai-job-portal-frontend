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
        hostname: getHostname(config.NEXT_PUBLIC_APP_URL),
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

  // Security headers
  async headers() {
    // Dev needs looser rules than production:
    //  - 'unsafe-eval': React dev overlay / Turbopack HMR require eval().
    //  - http://localhost:*: the API gateway runs on plain http in dev, which
    //    'self' (port 3000) and https: do not cover.
    //  - no upgrade-insecure-requests: it would rewrite the http://localhost
    //    gateway calls to https:// and break every API request in dev.
    const isDev = process.env.NODE_ENV === "development";

    const scriptSrc = isDev
      ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com"
      : "script-src 'self' 'unsafe-inline' https://accounts.google.com";
    const connectSrc = isDev
      ? "connect-src 'self' http://localhost:* ws://localhost:* https:"
      : "connect-src 'self' https:";
    // blob: covers client-side upload previews (URL.createObjectURL); the
    // localhost allowance covers dev-only images served by the http gateway.
    const imgSrc = isDev
      ? "img-src 'self' data: blob: http://localhost:* https:"
      : "img-src 'self' data: blob: https:";

    // Baseline CSP: blocks remote injection while permitting the app's inline
    // theme-detection script and the lazily-loaded Google Identity Services widget.
    // Tighten later by extracting the inline script and adding a nonce.
    const csp = [
      "default-src 'self'",
      scriptSrc,
      "style-src 'self' 'unsafe-inline'",
      imgSrc,
      "font-src 'self' data:",
      connectSrc,
      "frame-src 'self' https://accounts.google.com",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      ...(isDev ? [] : ["upgrade-insecure-requests"]),
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Content-Security-Policy", value: csp },
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
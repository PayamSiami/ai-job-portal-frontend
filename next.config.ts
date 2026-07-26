/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["localhost", "your-domain.com"],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizeCss: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        // ✅ Use bracket notation to access environment variable
        destination: `${process.env["NEXT_PUBLIC_API_GATEWAY_URL"]}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;

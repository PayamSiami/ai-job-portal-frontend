/** @type {import('next').NextConfig} */
const nextConfig = {
   output: 'standalone',
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  
  async rewrites() {
    // Use a fallback URL if environment variable is not set
    const apiUrl = `${process.env["NEXT_PUBLIC_API_GATEWAY_URL"]}` || 'http://backend:5000';
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
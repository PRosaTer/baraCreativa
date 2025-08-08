/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'localhost',
      new URL(process.env.NEXT_PUBLIC_API_URL).hostname
    ],
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/uploads/:path*`,
      },
      {
        source: '/scorm_courses/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/scorm_courses/:path*`,
      },
    ];
  },
};

export default nextConfig;

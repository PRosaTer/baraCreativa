import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'localhost',
      new URL(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').hostname,
    ],
  },

  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

 return [
  { source: '/api/:path*', destination: `${apiUrl}/api/:path*` },
  { source: '/uploads/:path*', destination: `${apiUrl}/uploads/:path*` },
  { source: '/scorm_courses/:path*', destination: `${apiUrl}/scorm_courses/:path*` },
];
  },

  webpack(config) {
  config.resolve.alias['@'] = path.join(process.cwd(), 'src');
  return config;
},
};

export default nextConfig; 
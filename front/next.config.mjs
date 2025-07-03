    const nextConfig = {
      async rewrites() {
        return [
          {
            source: '/api/:path*',
            destination: 'http://localhost:3001/api/:path*',
          },
          {
            source: '/uploads/:path*',
            destination: 'http://localhost:3001/uploads/:path*',
          },
          {
            source: '/scorm_courses/:path*',
            destination: 'http://localhost:3001/scorm_courses/:path*',
          },
        ];
      },
      images: {
        domains: ['localhost'], // Permite que Next.js optimice imágenes de localhost
      },
    };

    export default nextConfig;
    
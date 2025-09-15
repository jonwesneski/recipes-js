import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // output: 'export', // Outputs a Single-Page Application (SPA)
  // distDir: 'build', // Changes the build output directory to `build`
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000', // Your Next.js frontend
        'localhost:3001', // Your NestJS backend
        '127.0.0.1:3000',
        '127.0.0.1:3001',
        'recipes-ui-tau.vercel.app',
        'recipes-js-api.onrender.com',
        'https://recipes-ui-tau.vercel.app',
        'https://recipes-js-api.onrender.com',
      ],
    },
  },
  reactStrictMode: false,
  transpilePackages: ['@repo/design-system'],
  images: {
    remotePatterns: [
      new URL('https://lh3.googleusercontent.com/**'),
      new URL('https://www.gravatar.com/avatar/?d=mp'),
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        pathname: '/api/**',
      },
      new URL('https://d2ivn22ne8jqbo.cloudfront.net/**'),
      new URL('http://localhost:4566/**'),
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            // You can add options here if needed
          },
        },
      ],
    });
    return config;
  },
};

export default nextConfig;

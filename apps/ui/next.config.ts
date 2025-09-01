import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // output: 'export', // Outputs a Single-Page Application (SPA)
  // distDir: 'build', // Changes the build output directory to `build`
  reactStrictMode: false,
  transpilePackages: ['@repo/design-system'],
  images: {
    remotePatterns: [
      new URL('https://lh3.googleusercontent.com/**'),
      new URL('https://www.gravatar.com/avatar/?d=mp'),
      new URL('https://d2ivn22ne8jqbo.cloudfront.net/**'),
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

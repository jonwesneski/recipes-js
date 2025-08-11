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
    ],
  },
};

export default nextConfig;

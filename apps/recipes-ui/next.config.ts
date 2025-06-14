import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // output: 'export', // Outputs a Single-Page Application (SPA)
  // distDir: 'build', // Changes the build output directory to `build`
  reactStrictMode: true,
  transpilePackages: ['@repo/design-system', '@repo/ui'],
};

export default nextConfig;

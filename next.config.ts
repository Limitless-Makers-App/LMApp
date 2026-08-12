import type { NextConfig } from 'next';
import withSerwist from '@serwist/next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

const config =
  process.env.NODE_ENV === 'production'
    ? withSerwist({
        swSrc: 'src/sw.ts',
        swDest: 'public/sw.js',
        cacheOnNavigation: true,
      })(nextConfig)
    : nextConfig;

export default config;
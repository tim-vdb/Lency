import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  env: {
    BETTER_AUTH_URL: process.env.BASE_URL ?? 'http://localhost:3000',
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.ufs.sh' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'api.dicebear.com' },
      { protocol: 'https', hostname: 'ik.imagekit.io' },
    ],
    qualities: [25, 50, 75, 100],
  },
  experimental: {
    authInterrupts: true,
  },
  turbopack: {
    root: __dirname,
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;

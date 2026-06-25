import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // Build autonome — requis pour un déploiement Docker / hors Vercel.
  // Génère .next/standalone avec uniquement les dépendances nécessaires au runtime.
  output: 'standalone',
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
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;

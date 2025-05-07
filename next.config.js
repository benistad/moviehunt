/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Désactiver les vérifications ESLint pendant la compilation
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Désactiver les vérifications TypeScript pendant la compilation
    ignoreBuildErrors: true,
  },
  // Configuration des images
  images: {
    domains: ['image.tmdb.org', 'via.placeholder.com'],
  },
  // Optimisations pour Vercel
  swcMinify: true,
};

module.exports = nextConfig;

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
  // Désactiver l'export statique pour permettre le déploiement sur Vercel
  output: 'standalone',
  // Optimisations pour Vercel
  swcMinify: true,
};

module.exports = nextConfig;

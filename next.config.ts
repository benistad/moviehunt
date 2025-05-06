import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Désactiver les vérifications ESLint pendant la compilation
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Désactiver les vérifications TypeScript pendant la compilation
    ignoreBuildErrors: true,
  }
};

export default nextConfig;

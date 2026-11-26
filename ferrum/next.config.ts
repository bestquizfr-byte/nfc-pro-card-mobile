import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Modèle de cache "classique" : pages catalogue rendues à la requête (SQLite local).
  // Voir DECISIONS.md (#cache-components).
  cacheComponents: false,
  // Embarque la base SQLite de démo dans les fonctions serverless (Vercel).
  outputFileTracingIncludes: { "/**": ["./prisma/demo.db"] },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

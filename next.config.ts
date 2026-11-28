import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  compress: true,
  /**
   * Long cache lives for rare-changing calculator content.
   * Prefer deploy-time freshness over short ISR revalidation (fewer durable writes).
   */
  cacheLife: {
    default: {
      stale: 60 * 60 * 24, // 1 day
      revalidate: 60 * 60 * 24 * 7, // 1 week
      expire: 60 * 60 * 24 * 30, // 30 days
    },
    max: {
      stale: 60 * 60 * 24 * 7,
      revalidate: 60 * 60 * 24 * 30,
      expire: 60 * 60 * 24 * 90,
    },
  },
  experimental: {
    optimizePackageImports: ["recharts", "katex", "jstat"],
  },
  /** Keep serverless/OG bundles from pulling local tooling into Vercel Functions Storage. */
  outputFileTracingExcludes: {
    "*": [
      "./.agents/**",
      "./.cursor/**",
      "./scripts/**",
      "./agent-transcripts/**",
      "./node_modules/@next/swc-*/**",
      "./node_modules/typescript/**",
      "./node_modules/eslint*/**",
    ],
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

import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

/**
 * AI crawler stance (AI SEO):
 * - Wildcard `*` allows discovery agents and search APIs (do not allowlist only named bots).
 * - Named groups replace `*` for that bot — keep them fully Allow: / when opted in.
 * - Search discovery (OAI-SearchBot, PerplexityBot, Claude-SearchBot) rides the wildcard.
 * - Training / grounding tokens are intentionally allowed so models can learn accurate tool facts.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        userAgent: ["GPTBot", "ClaudeBot", "Google-Extended", "meta-externalagent"],
        allow: "/",
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}

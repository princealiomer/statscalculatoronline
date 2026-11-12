import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { apHub, calculators, categories } from "@/lib/calculators/registry";

/** Only canonical, indexable HTML URLs — no redirects, no plain-text assets. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/calculators`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${base}/resources`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    {
      url: `${base}/resources/statistical-tables`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/resources/statistical-tables/z-table`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${base}/resources/statistical-tables/t-table`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${base}/resources/statistical-tables/chi-square-table`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${base}/resources/statistical-tables/f-table`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/accessibility`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/sitemap`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
  ];

  const cats: MetadataRoute.Sitemap = [...categories.map((c) => c.id), apHub.category].map((id) => ({
    url: `${base}/calculators/${id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const calcs: MetadataRoute.Sitemap = calculators.map((c) => ({
    url: `${base}/calculators/${c.category}/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...cats, ...calcs];
}

import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { apHub, calculators, categories } from "@/lib/calculators/registry";

/** Only canonical, indexable HTML URLs — no redirects, no plain-text assets. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, "");
  // Stable date — new Date() on every regeneration forces billed ISR writes.
  const lastModified = new Date(`${siteConfig.contentUpdated}T00:00:00.000Z`);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/calculators`, lastModified, changeFrequency: "weekly", priority: 0.95 },
    { url: `${base}/resources`, lastModified, changeFrequency: "monthly", priority: 0.85 },
    {
      url: `${base}/resources/statistical-tables`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/resources/statistical-tables/z-table`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${base}/resources/statistical-tables/t-table`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${base}/resources/statistical-tables/chi-square-table`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${base}/resources/statistical-tables/f-table`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    { url: `${base}/about`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/contact`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/accessibility`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/sitemap`, lastModified, changeFrequency: "weekly", priority: 0.9 },
  ];

  const cats: MetadataRoute.Sitemap = [...categories.map((c) => c.id), apHub.category].map((id) => ({
    url: `${base}/calculators/${id}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const calcs: MetadataRoute.Sitemap = calculators.map((c) => ({
    url: `${base}/calculators/${c.category}/${c.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...cats, ...calcs];
}

import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { apHub, calculators, categories } from "@/lib/calculators/registry";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const staticRoutes = [
    "",
    "/calculators",
    "/resources",
    "/resources/statistical-tables",
    "/resources/statistical-tables/z-table",
    "/resources/statistical-tables/t-table",
    "/resources/statistical-tables/chi-square-table",
    "/resources/statistical-tables/f-table",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/accessibility",
  ].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const cats = [...categories.map((c) => c.id), apHub.category].map((id) => ({
    url: `${base}/calculators/${id}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const calcs = calculators.map((c) => ({
    url: `${base}/calculators/${c.category}/${c.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...cats, ...calcs];
}

import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

/** Google SERP title budget (approx). */
export const TITLE_MAX = 60;
/** Meta description sweet spot upper bound. */
export const DESC_MAX = 155;
/** Avoid "too short" flags from auditors. */
export const DESC_MIN = 70;

export type BrandMode = "full" | "none";

export function clampText(text: string, max: number) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).replace(/\s+\S*$/, "").trimEnd()}…`;
}

/**
 * Build a SERP title. Use brandMode "none" for high-impression tool queries
 * where "| Stats Calculator Online" wastes budget and can suppress CTR
 * (e.g. prime checker, fraction calculator).
 */
export function seoTitle(pageTitle: string, max = TITLE_MAX, brandMode: BrandMode = "full") {
  let left = pageTitle.replace(/\s+/g, " ").trim();
  left = left
    .replace(/\s*[—-]\s*Free Online Tools?/gi, "")
    .replace(/\s*[—-]\s*Free Online Tool/gi, "")
    .replace(/\s+Calculator Calculator$/i, " Calculator")
    .trim();

  // Avoid "Statistics Calculator | Stats Calculator Online" redundancy
  const alreadyBranded =
    /stats?\s*calculator\s*online/i.test(left) ||
    left.toLowerCase().includes(siteConfig.domain.toLowerCase());

  if (brandMode === "none" || alreadyBranded) {
    return clampText(left, max);
  }

  const suffix = ` | ${siteConfig.name}`;
  const budget = Math.max(12, max - suffix.length);
  if (left.length > budget) left = clampText(left, budget);
  return `${left}${suffix}`;
}

export function seoDescription(text: string, max = DESC_MAX) {
  let d = clampText(text, max);
  if (d.length < DESC_MIN) {
    const pad = ` Free tool on ${siteConfig.name} with formulas, steps, and exports.`;
    d = clampText(`${d.replace(/\.*$/, "")}.${pad}`, max);
  }
  return d;
}

type PageMetaInput = {
  /** Short page title WITHOUT brand suffix */
  title: string;
  description: string;
  /** Path beginning with / */
  path: string;
  keywords?: string[];
  type?: "website" | "article";
  noIndex?: boolean;
  /** full = append brand; none = use full 60-char title for CTR */
  brandMode?: BrandMode;
};

/** Consistent canonical + Open Graph + Twitter for every indexable page. */
export function buildPageMetadata({
  title,
  description,
  path,
  keywords,
  type = "website",
  noIndex = false,
  brandMode = "full",
}: PageMetaInput): Metadata {
  const t = seoTitle(title, TITLE_MAX, brandMode);
  const d = seoDescription(description);
  const url = path.startsWith("http") ? path : path;

  return {
    title: { absolute: t },
    description: d,
    keywords: keywords?.length ? keywords : undefined,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      type,
      title: t,
      description: d,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
    },
    twitter: {
      card: "summary_large_image",
      title: t,
      description: d,
    },
  };
}

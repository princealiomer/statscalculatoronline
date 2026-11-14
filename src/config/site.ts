export const siteConfig = {
  /** Full brand name — keep intact for SEO keywords */
  name: "Stats Calculator Online",
  /** Compact mark for tight UI only (logo glyph / abbreviated labels) */
  shortName: "SCO",
  domain: "statscalculatoronline.com",
  tagline: "Free online statistics calculators with clear formulas, steps, and branded PDF reports",
  /** Long marketing blurb (pages, JSON-LD). Prefer metaDescription for <meta> tags. */
  description:
    "Stats Calculator Online is a free library of statistics and math calculators with step-by-step solutions, textbook formulas, APA write-ups, and free branded PDF reports that include your inputs, formulas applied, worked steps, and final results (plus Word/CSV). Hypothesis tests, descriptive statistics, probability, regression, algebra, finance, and more.",
  /** Keep ≤155 chars for SEO crawlers */
  metaDescription:
    "Free statistics & math calculators with formulas, step-by-step work, APA write-ups, and branded PDF/CSV exports. t-tests, probability, regression, and more.",
  /**
   * 40–60 word answer block for “What is Stats Calculator Online?” (AI extractability).
   * Keep self-contained so AI systems can cite it without surrounding context.
   */
  definitionAnswer:
    "Stats Calculator Online is a free web library of statistics and math calculators with textbook formulas, step-by-step solutions, and branded PDF, Word, and CSV exports. Students, analysts, and researchers use it for hypothesis tests, descriptive statistics, probability, regression, algebra, and finance—no install or account required.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://statscalculatoronline.com",
  locale: "en_US",
  author: "Stats Calculator Online",
  twitter: "@statscalculatoronline",
  contactEmail: "hello@statscalculatoronline.com",
  /** ISO date shown as freshness signal on key pages */
  contentUpdated: "2026-11-14",
  /** Search Console HTML-tag verification content */
  googleSiteVerification: "JGq8tz4ab7qaJgvaz0TguRXWR33ow1K7Q1J6DvLq4qI",
  /** Google Tag Manager container */
  gtmId: "GTM-NCQ3LNDD",
  /** Google AdSense publisher client */
  adsenseClient: "ca-pub-9457208945905981",
  keywords: [
    "Stats Calculator Online",
    "statistics calculator",
    "online statistics calculator",
    "free statistics calculator",
    "hypothesis test calculator",
    "t-test calculator",
    "descriptive statistics calculator",
    "math calculator online",
  ],
} as const;

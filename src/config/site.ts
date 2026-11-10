export const siteConfig = {
  /** Full brand name — keep intact for SEO keywords */
  name: "Stats Calculator Online",
  /** Compact mark for tight UI only (logo glyph / abbreviated labels) */
  shortName: "SCO",
  domain: "statscalculatoronline.com",
  tagline: "Free online statistics calculators with clear formulas and steps",
  description:
    "Stats Calculator Online is a free library of statistics and math calculators with step-by-step solutions, textbook formulas, APA write-ups, and free PDF/Word/CSV exports. Hypothesis tests, descriptive statistics, probability, regression, algebra, finance, and more.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://statscalculatoronline.com",
  locale: "en_US",
  author: "Stats Calculator Online",
  twitter: "@statscalculatoronline",
  contactEmail: "hello@statscalculatoronline.com",
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

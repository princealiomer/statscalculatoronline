export const siteConfig = {
  name: "StatsCalc",
  tagline: "Free online statistics calculators with clear steps",
  description:
    "Free online statistics and math calculators with step-by-step solutions, APA write-ups, and free PDF/Word/CSV exports. Hypothesis tests, descriptive stats, percentages, algebra, and more.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://statscalculatoronline.com",
  locale: "en_US",
  author: "StatsCalc",
  twitter: "@statscalc",
  contactEmail: "hello@statscalculatoronline.com",
} as const;

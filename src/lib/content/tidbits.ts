export type Tidbit = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  href?: string;
  hrefLabel?: string;
};

/** Short educational / UX tips shown across Stats Calculator Online */
export const tidbits: Tidbit[] = [
  {
    id: "sample-vs-pop",
    eyebrow: "Quick tip",
    title: "Sample vs population SD",
    body: "Use n−1 (sample) when your data are a subset of a larger group; use n when you truly have the whole population.",
    href: "/calculators/descriptive-statistics/sample-standard-deviation-calculator",
    hrefLabel: "Open SD calculator",
  },
  {
    id: "pvalue",
    eyebrow: "Tidbit",
    title: "A p-value is not the probability H₀ is true",
    body: "It is the probability of data at least as extreme as yours if H₀ were true. Pair it with an effect size and confidence interval.",
    href: "/calculators/hypothesis-testing/p-value-calculator",
    hrefLabel: "P-value calculator",
  },
  {
    id: "which-test",
    eyebrow: "Need a path?",
    title: "Not sure which test to run?",
    body: "Start with the statistical test selector, then open the matching calculator with formulas and APA export.",
    href: "/calculators/hypothesis-testing/statistical-test-flow-chart",
    hrefLabel: "Test selector",
  },
  {
    id: "correlation",
    eyebrow: "Remember",
    title: "Correlation is not causation",
    body: "Pearson r measures linear association. Plot the scatter first, and prefer Spearman when the relationship is monotonic but not linear.",
    href: "/calculators/correlation",
    hrefLabel: "Correlation tools",
  },
  {
    id: "ci",
    eyebrow: "Tidbit",
    title: "Read confidence intervals carefully",
    body: "A 95% CI means that in repeated sampling, about 95% of such intervals would cover the true parameter—not that this one interval has a 95% chance.",
    href: "/calculators/confidence-interval",
    hrefLabel: "CI calculators",
  },
  {
    id: "exports",
    eyebrow: "Free on every tool",
    title: "APA write-ups and PDF exports",
    body: "After you calculate, copy APA/AMA text or download CSV, Word, and print-ready PDF—no paywall on Stats Calculator Online.",
    href: "/calculators",
    hrefLabel: "Browse calculators",
  },
  {
    id: "tables",
    eyebrow: "Resources",
    title: "Critical value tables nearby",
    body: "Jump to z, t, χ², and F tables when you need critical values alongside an online calculator.",
    href: "/resources/statistical-tables",
    hrefLabel: "Open tables",
  },
  {
    id: "assumptions",
    eyebrow: "Best practice",
    title: "Check assumptions before you trust p",
    body: "Independence, normality (or large n), and equal variances matter for classic t/ANOVA. Use Welch or rank tests when they fail.",
    href: "/calculators/hypothesis-testing/two-sample-t-test-calculator",
    hrefLabel: "Two-sample t-test",
  },
  {
    id: "power",
    eyebrow: "Plan ahead",
    title: "Power before you collect data",
    body: "Fix the smallest meaningful effect and α, then compute sample size. Inflate n for dropout when recruiting humans.",
    href: "/calculators/hypothesis-testing/sample-size-and-power-analysis-calculator",
    hrefLabel: "Sample size calculator",
  },
  {
    id: "percent",
    eyebrow: "Everyday math",
    title: "Percent change ≠ percent of",
    body: "Percent of is part÷whole. Percent change uses the starting value in the denominator—and +50% then −50% does not return to start.",
    href: "/calculators/percentages",
    hrefLabel: "Percentage calculators",
  },
];

/** Stable pick from slug/path so SSR and client match. */
export function tidbitsForPath(pathKey: string, count = 3): Tidbit[] {
  if (tidbits.length === 0) return [];
  let hash = 0;
  for (let i = 0; i < pathKey.length; i++) hash = (hash * 31 + pathKey.charCodeAt(i)) >>> 0;
  const start = hash % tidbits.length;
  const out: Tidbit[] = [];
  for (let i = 0; i < Math.min(count, tidbits.length); i++) {
    out.push(tidbits[(start + i) % tidbits.length]);
  }
  return out;
}

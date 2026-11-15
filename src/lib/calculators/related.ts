import { calculators, categories, getByCategory, getCategory } from "@/lib/calculators/registry";
import type { CalculatorDef } from "@/lib/calculators/types";
import { navGroups } from "@/config/nav";

function scoreOverlap(a: string, b: string) {
  const aw = new Set(
    a
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2),
  );
  const bw = b
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);
  let score = 0;
  for (const w of bw) if (aw.has(w)) score += 1;
  return score;
}

function siblingCategories(categoryId: string): string[] {
  const group = navGroups.find((g) => g.categoryIds.includes(categoryId));
  if (!group) return [];
  return group.categoryIds.filter((id) => id !== categoryId);
}

/** Similar tools for a calculator page — same category first, then sibling topics + keyword overlap. */
export function getSimilarCalculators(calc: CalculatorDef, limit = 8): CalculatorDef[] {
  const same = getByCategory(calc.category).filter((c) => c.slug !== calc.slug);
  const siblings = siblingCategories(calc.category);
  const pool = calculators.filter(
    (c) => c.slug !== calc.slug && (siblings.includes(c.category) || c.category === calc.category),
  );

  const ranked = [...pool].sort((a, b) => {
    const aSame = a.category === calc.category ? 20 : 0;
    const bSame = b.category === calc.category ? 20 : 0;
    const aScore =
      aSame +
      scoreOverlap(`${calc.title} ${calc.description} ${calc.engine}`, `${a.title} ${a.description} ${a.engine}`) *
        3;
    const bScore =
      bSame +
      scoreOverlap(`${calc.title} ${calc.description} ${calc.engine}`, `${b.title} ${b.description} ${b.engine}`) *
        3;
    return bScore - aScore;
  });

  const out: CalculatorDef[] = [];
  const seen = new Set<string>();
  for (const c of [...same, ...ranked]) {
    if (seen.has(c.slug)) continue;
    seen.add(c.slug);
    out.push(c);
    if (out.length >= limit) break;
  }
  return out;
}

export function getPopularCalculators(limit = 6): CalculatorDef[] {
  /** Ordered by Search Console demand (impressions) for internal linking. */
  const preferred = [
    "prime-number-checker",
    "sample-standard-deviation-calculator",
    "percentage-increase-calculator",
    "percent-difference-calculator",
    "distance-two-points-calculator",
    "one-sample-t-test-calculator",
    "mean-median-mode-calculator",
    "odds-probability-calculator",
    "two-sample-t-test-calculator",
    "descriptive-statistics-calculator",
    "average-fractions-calculator",
    "roman-numeral-converter",
    "straight-line-depreciation-calculator",
    "normal-distribution-calculator",
    "simple-linear-regression-calculator",
  ];
  const list = preferred
    .map((slug) => calculators.find((c) => c.slug === slug))
    .filter(Boolean) as CalculatorDef[];
  if (list.length >= limit) return list.slice(0, limit);
  return [...list, ...calculators.filter((c) => !list.some((x) => x.slug === c.slug))].slice(0, limit);
}

export function getHubCategories(limit = 8) {
  const priority = [
    "hypothesis-testing",
    "descriptive-statistics",
    "probability",
    "regression-analysis",
    "confidence-interval",
    "correlation",
    "percentages",
    "finance",
    "algebra",
    "geometry-plane",
  ];
  return priority
    .map((id) => getCategory(id))
    .filter(Boolean)
    .slice(0, limit) as typeof categories;
}

export function calcHref(c: CalculatorDef) {
  return `/calculators/${c.category}/${c.slug}`;
}

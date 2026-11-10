import { categories, calculators } from "@/lib/calculators/registry";

export type NavGroup = {
  id: string;
  title: string;
  blurb: string;
  categoryIds: string[];
};

/** Mega-menu pillars for Stats Calculator Online */
export const navGroups: NavGroup[] = [
  {
    id: "statistics",
    title: "Statistics",
    blurb: "Tests, distributions, intervals, and models",
    categoryIds: [
      "descriptive-statistics",
      "hypothesis-testing",
      "probability",
      "confidence-interval",
      "regression-analysis",
      "correlation",
      "experimental-design",
      "multivariate-analysis",
      "survival-analysis",
      "reliability-analysis",
      "cluster-analysis",
      "measurement-systems",
      "matrix-algebra",
      "causal-inference",
      "chart",
    ],
  },
  {
    id: "math",
    title: "Math & Geometry",
    blurb: "Algebra, fractions, trig, and shapes",
    categoryIds: [
      "algebra",
      "fractions",
      "general-math",
      "discrete-mathematics",
      "percentages",
      "trigonometry",
      "geometry-plane",
      "geometry-solids",
    ],
  },
  {
    id: "everyday",
    title: "Finance & Everyday",
    blurb: "Money, grades, units, time, and health",
    categoryIds: [
      "finance",
      "academic-grades",
      "conversions",
      "time",
      "health",
      "construction",
      "technology",
      "credit-analysis",
      "games",
      "random-tools",
      "text-tools",
    ],
  },
  {
    id: "science",
    title: "Science",
    blurb: "Physics and chemistry helpers",
    categoryIds: ["physics", "chemistry"],
  },
];

export function categoriesInGroup(group: NavGroup) {
  return group.categoryIds
    .map((id) => categories.find((c) => c.id === id))
    .filter(Boolean) as typeof categories;
}

export function countInCategory(categoryId: string) {
  return calculators.filter((c) => c.category === categoryId).length;
}

export const footerPopular = [
  {
    title: "One-Sample t-Test Calculator",
    href: "/calculators/hypothesis-testing/one-sample-t-test-calculator",
  },
  {
    title: "Mean Median Mode Calculator",
    href: "/calculators/descriptive-statistics/mean-median-mode-calculator",
  },
  {
    title: "Normal Distribution Calculator",
    href: "/calculators/probability/normal-distribution-calculator",
  },
  {
    title: "Chi-Square Independence Calculator",
    href: "/calculators/hypothesis-testing/chi-square-test-of-independence-calculator",
  },
  {
    title: "Linear Regression Calculator",
    href: "/calculators/regression-analysis/simple-linear-regression-calculator",
  },
  {
    title: "Sample Size & Power Calculator",
    href: "/calculators/hypothesis-testing/sample-size-and-power-analysis-calculator",
  },
] as const;

export const resourceLinks = [
  { title: "Statistical Tables Hub", href: "/resources/statistical-tables" },
  { title: "Z-Table", href: "/resources/statistical-tables/z-table" },
  { title: "t-Table", href: "/resources/statistical-tables/t-table" },
  { title: "Chi-Square Table", href: "/resources/statistical-tables/chi-square-table" },
  { title: "F-Table", href: "/resources/statistical-tables/f-table" },
  { title: "All Resources", href: "/resources" },
] as const;

import { categories } from "@/lib/calculators/categories";

export type NavGroup = {
  id: string;
  title: string;
  blurb: string;
  categoryIds: string[];
};

/** Mega-menu pillars for Stats Calculator Online (client-safe — no calculator catalog). */
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

export const footerPopular = [
  {
    title: "Prime Number Checker",
    href: "/calculators/general-math/prime-number-checker",
  },
  {
    title: "Standard Deviation Calculator",
    href: "/calculators/descriptive-statistics/sample-standard-deviation-calculator",
  },
  {
    title: "Percentage Increase Calculator",
    href: "/calculators/percentages/percentage-increase-calculator",
  },
  {
    title: "Percent Difference Calculator",
    href: "/calculators/percentages/percent-difference-calculator",
  },
  {
    title: "t-Test Calculator",
    href: "/calculators/hypothesis-testing/one-sample-t-test-calculator",
  },
  {
    title: "Distance Between Two Points",
    href: "/calculators/geometry-plane/distance-two-points-calculator",
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

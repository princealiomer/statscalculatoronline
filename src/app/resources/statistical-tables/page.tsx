import Link from "next/link";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/meta";

export const metadata: Metadata = buildPageMetadata({
  title: "Statistical Tables",
  description:
    "Free critical value tables for Z, t, chi-square, and F distributions. Use with hypothesis tests and confidence intervals on Stats Calculator Online.",
  path: "/resources/statistical-tables",
  keywords: ["z table", "t table", "chi square table", "f table", "critical values"],
});

const tables = [
  {
    href: "/resources/statistical-tables/z-table",
    title: "Z-Table",
    desc: "Standard normal critical values for common α levels (one- and two-tailed).",
  },
  {
    href: "/resources/statistical-tables/t-table",
    title: "t-Table",
    desc: "Student’s t critical values by degrees of freedom.",
  },
  {
    href: "/resources/statistical-tables/chi-square-table",
    title: "Chi-Square Table",
    desc: "χ² critical values across common significance levels.",
  },
  {
    href: "/resources/statistical-tables/f-table",
    title: "F-Table",
    desc: "F critical values at α = 0.05 for ANOVA and variance tests.",
  },
];

export default function StatisticalTablesHub() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--brand-accent)]">
        Resources
      </p>
      <h1 className="mt-2 font-display text-4xl text-[var(--brand-ink)]">Statistical tables</h1>
      <p className="mt-3 max-w-2xl text-[var(--brand-ink-soft)]">
        Critical value tables for classroom and research work. Pair them with the matching calculators
        for p-values, confidence intervals, and step-by-step reports.
      </p>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {tables.map((t) => (
          <li key={t.href}>
            <Link
              href={t.href}
              className="block h-full rounded-xl border border-[var(--brand-border)] bg-[var(--brand-panel)] px-4 py-4 shadow-[var(--brand-shadow)] hover:border-[var(--brand-accent)]/35"
            >
              <span className="font-medium text-[var(--brand-ink)]">{t.title}</span>
              <span className="mt-1 block text-sm text-[var(--brand-ink-soft)]">{t.desc}</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm text-[var(--brand-ink-soft)]">
        Looking for interactive tools?{" "}
        <Link href="/calculators" className="font-semibold text-[var(--brand-accent)] hover:underline">
          Browse all calculators
        </Link>
        .
      </p>
    </div>
  );
}

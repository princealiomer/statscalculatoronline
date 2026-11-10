import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import { categories, calculators } from "@/lib/calculators/registry";
import { CalculatorsSearch } from "@/components/CalculatorsSearch";

export const metadata: Metadata = {
  title: "All Statistics Calculators",
  description:
    "Browse the full StatsCalc catalog: hypothesis tests, descriptive statistics, probability, regression, charts, and more.",
};

export default function CalculatorsIndexPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-4xl text-teal-950">All calculators</h1>
      <p className="mt-2 text-teal-900/70">
        {calculators.length} free tools. Search or jump to a category.
      </p>

      <Suspense fallback={<p className="mt-6 text-sm text-teal-900/60">Loading search…</p>}>
        <CalculatorsSearch />
      </Suspense>

      <div className="mt-8 flex flex-wrap gap-2">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/calculators/${c.id}`}
            className="rounded-full border border-teal-900/10 bg-white/70 px-3 py-1.5 text-xs font-medium text-teal-900 hover:bg-white"
          >
            {c.name}
          </Link>
        ))}
      </div>

      <ul className="mt-10 grid gap-3 sm:grid-cols-2">
        {calculators.map((c) => (
          <li key={`${c.category}/${c.slug}`}>
            <Link
              href={`/calculators/${c.category}/${c.slug}`}
              className="block rounded-xl border border-teal-900/10 bg-white/65 px-4 py-3 hover:border-teal-700/30"
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-teal-700">
                {c.category.replace(/-/g, " ")}
              </span>
              <span className="mt-1 block font-medium text-teal-950">{c.title}</span>
              <span className="mt-1 block text-sm text-teal-900/65">{c.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

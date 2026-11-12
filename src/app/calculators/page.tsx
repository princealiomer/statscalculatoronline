import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import { categories, calculators } from "@/lib/calculators/registry";
import { CalculatorsSearch } from "@/components/CalculatorsSearch";
import { TidbitsWidget } from "@/components/widgets/TidbitsWidget";
import { SimilarCalculatorsWidget } from "@/components/widgets/SimilarCalculatorsWidget";
import { tidbitsForPath } from "@/lib/content/tidbits";
import { getPopularCalculators } from "@/lib/calculators/related";
import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo/meta";

export const metadata: Metadata = buildPageMetadata({
  title: "All Statistics Calculators",
  description: `Browse ${calculators.length}+ free tools for hypothesis tests, descriptive stats, probability, regression, math, and finance.`,
  path: "/calculators",
  keywords: [...siteConfig.keywords, "all statistics calculators"],
});

export default function CalculatorsIndexPage() {
  const tips = tidbitsForPath("calculators-index", 3);
  const popular = getPopularCalculators(8);

  return (
    <div className="mx-auto max-w-6xl px-3 py-8 sm:px-4 sm:py-10">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--brand-accent)]">
        Stats Calculator Online
      </p>
      <h1 className="mt-2 font-display text-3xl text-[var(--brand-ink)] sm:text-4xl">
        All statistics calculators
      </h1>
      <p className="mt-2 max-w-2xl text-[var(--brand-ink)]/70">
        {calculators.length} free tools across {categories.length} categories. Search below or jump
        to a topic — every page includes formulas, similar calculators, and tidbits.
      </p>

      <Suspense fallback={<p className="mt-6 text-sm text-[var(--brand-ink)]/60">Loading search…</p>}>
        <CalculatorsSearch />
      </Suspense>

      <div className="mt-8 flex flex-wrap gap-2">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/calculators/${c.id}`}
            className="rounded-full border border-[var(--brand-ink)]/10 bg-white/70 px-3 py-1.5 text-xs font-medium text-[var(--brand-ink)] hover:bg-white"
          >
            {c.name}
          </Link>
        ))}
      </div>

      <div className="mt-10 space-y-8">
        <SimilarCalculatorsWidget
          items={popular}
          title="Start with popular calculators"
          subtitle="Fast paths into the Stats Calculator Online catalog"
        />
        <TidbitsWidget items={tips} />
      </div>

      <ul className="mt-10 grid gap-3 sm:grid-cols-2">
        {calculators.map((c) => (
          <li key={`${c.category}/${c.slug}`}>
            <Link
              href={`/calculators/${c.category}/${c.slug}`}
              className="block rounded-xl border border-[var(--brand-ink)]/10 bg-white/65 px-4 py-3 hover:border-[var(--brand-accent)]/30"
            >
              <span className="font-medium text-[var(--brand-ink)]">{c.title} Calculator</span>
              <span className="mt-1 block text-sm text-[var(--brand-ink)]/65">{c.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

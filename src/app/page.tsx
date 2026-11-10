import Link from "next/link";
import { categories, calculators } from "@/lib/calculators/registry";
import { siteConfig } from "@/config/site";
import { BrandInfographic } from "@/components/BrandInfographic";
import { getPopularCalculators, calcHref } from "@/lib/calculators/related";

export default function HomePage() {
  const featured = getPopularCalculators(6);

  return (
    <>
      <section className="relative">
        <div className="mx-auto grid max-w-6xl gap-10 px-3 pb-14 pt-10 sm:px-4 md:grid-cols-[1.15fr_0.85fr] md:pb-16 md:pt-14">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-accent)]">
              {siteConfig.domain}
            </p>
            <p className="mt-3 font-display text-4xl font-semibold tracking-tight text-[var(--brand-ink)] sm:text-5xl md:text-[3.25rem] md:leading-[1.08]">
              Stats Calculator Online
            </p>
            <h1 className="mt-5 max-w-xl text-xl font-medium leading-snug text-[var(--brand-ink)] md:text-2xl">
              Free statistics calculators with formulas, steps, and reports you can cite
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[var(--brand-ink-soft)] md:text-base">
              {siteConfig.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/calculators"
                className="inline-flex min-h-11 items-center rounded-xl bg-[var(--brand-accent)] px-5 text-sm font-semibold text-white hover:bg-[var(--brand-accent-dark)]"
              >
                Browse all calculators
              </Link>
              <Link
                href="/calculators/hypothesis-testing/statistical-test-flow-chart"
                className="inline-flex min-h-11 items-center rounded-xl border border-[var(--brand-border)] bg-[var(--brand-panel)] px-5 text-sm font-semibold text-[var(--brand-ink)] hover:bg-white"
              >
                Find the right test
              </Link>
              <Link
                href="/resources/statistical-tables"
                className="inline-flex min-h-11 items-center rounded-xl border border-[var(--brand-border)] bg-[var(--brand-panel)] px-5 text-sm font-semibold text-[var(--brand-ink)] hover:bg-white"
              >
                Critical value tables
              </Link>
            </div>
          </div>
          <BrandInfographic />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-3 pb-12 sm:px-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl text-[var(--brand-ink)] sm:text-3xl">
              Popular calculators
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[var(--brand-ink-soft)] sm:text-base">
              Start with high-demand tools on Stats Calculator Online — each page includes similar
              calculator widgets and learning tidbits.
            </p>
          </div>
          <Link
            href="/calculators"
            className="text-sm font-semibold text-[var(--brand-accent)] hover:underline"
          >
            View catalog →
          </Link>
        </div>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((c) => (
            <li key={c.slug}>
              <Link
                href={calcHref(c)}
                className="block h-full rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-panel)] p-4 shadow-[var(--brand-shadow)] transition hover:border-[var(--brand-accent)]/35"
              >
                <span className="font-medium text-[var(--brand-ink)]">{c.title} Calculator</span>
                <span className="mt-1 block text-sm text-[var(--brand-ink-soft)]">{c.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-3 pb-16 sm:px-4 sm:pb-20">
        <h2 className="font-display text-2xl text-[var(--brand-ink)] sm:text-3xl">
          Calculator categories
        </h2>
        <p className="mt-2 max-w-2xl text-[var(--brand-ink-soft)]">
          {calculators.length}+ working tools across {categories.length} categories — hypothesis
          testing, descriptive statistics, probability, regression, math, finance, and more.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => {
            const count = calculators.filter((x) => x.category === c.id).length;
            return (
              <Link
                key={c.id}
                href={`/calculators/${c.id}`}
                className="rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-panel)] p-5 shadow-[var(--brand-shadow)] transition hover:border-[var(--brand-accent)]/30"
              >
                <h3 className="font-display text-xl text-[var(--brand-ink)]">{c.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--brand-ink-soft)]">{c.description}</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-[var(--brand-accent)]">
                  {count} calculators
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}

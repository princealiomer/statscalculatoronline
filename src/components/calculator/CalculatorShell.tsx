import Link from "next/link";
import type { CalculatorDef } from "@/lib/calculators/types";
import { getCategory } from "@/lib/calculators/registry";
import { CalculatorRunner } from "@/components/calculator/CalculatorRunner";
import { CalculatorGuide } from "@/components/calculator/CalculatorGuide";
import { SimilarCalculatorsWidget } from "@/components/widgets/SimilarCalculatorsWidget";
import { TidbitsWidget } from "@/components/widgets/TidbitsWidget";
import { getSimilarCalculators } from "@/lib/calculators/related";
import { tidbitsForPath } from "@/lib/content/tidbits";
import { siteConfig } from "@/config/site";
import { resourceLinks } from "@/config/nav";

export function CalculatorShell({ calculator }: { calculator: CalculatorDef }) {
  const category = getCategory(calculator.category);
  const similar = getSimilarCalculators(calculator, 8);
  const tips = tidbitsForPath(`${calculator.category}/${calculator.slug}`, 3);

  return (
    <article className="mx-auto max-w-6xl px-3 py-6 sm:px-4 sm:py-8">
      <nav aria-label="Breadcrumb" className="text-xs text-[var(--brand-ink)]/55 sm:text-sm">
        <ol className="flex flex-wrap items-center gap-x-1 gap-y-1">
          <li>
            <Link href="/" className="hover:text-[var(--brand-accent)]">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/calculators" className="hover:text-[var(--brand-accent)]">
              Calculators
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="min-w-0">
            <Link
              href={`/calculators/${calculator.category}`}
              className="break-words hover:text-[var(--brand-accent)]"
            >
              {category?.name ?? calculator.category}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="min-w-0 break-words text-[var(--brand-ink)]">{calculator.title}</li>
        </ol>
      </nav>

      <header className="mt-5 max-w-3xl sm:mt-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--brand-accent)]">
          {siteConfig.name}
          {category ? ` · ${category.name}` : ""}
        </p>
        <h1 className="mt-2 font-display text-[1.75rem] font-semibold leading-tight tracking-tight text-[var(--brand-ink)] sm:text-3xl md:text-4xl">
          {calculator.title} Calculator
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[var(--brand-ink)]/75 sm:text-base md:text-lg">
          Free online {calculator.title} calculator on Stats Calculator Online — {calculator.description}.
          Includes formulas, step-by-step guidance, interpretation tips, and free APA/AMA write-ups with
          PDF / Word / CSV exports.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href="#calculator"
            className="inline-flex min-h-10 items-center justify-center rounded-xl bg-[var(--brand-accent)] px-4 text-sm font-semibold text-white hover:bg-[var(--brand-accent-dark)]"
          >
            Open calculator
          </a>
          <a
            href="#guide"
            className="inline-flex min-h-10 items-center justify-center rounded-xl border border-[var(--brand-border)] bg-[var(--brand-panel)] px-4 text-sm font-medium text-[var(--brand-ink)] hover:bg-white"
          >
            Full guide outline
          </a>
          <a
            href="#formula"
            className="inline-flex min-h-10 items-center justify-center rounded-xl border border-[var(--brand-border)] bg-[var(--brand-panel)] px-4 text-sm font-medium text-[var(--brand-ink)] hover:bg-white"
          >
            Formula
          </a>
          <a
            href="#similar"
            className="inline-flex min-h-10 items-center justify-center rounded-xl border border-[var(--brand-border)] bg-[var(--brand-panel)] px-4 text-sm font-medium text-[var(--brand-ink)] hover:bg-white"
          >
            Similar tools
          </a>
          <a
            href="#faq"
            className="inline-flex min-h-10 items-center justify-center rounded-xl border border-[var(--brand-border)] bg-[var(--brand-panel)] px-4 text-sm font-medium text-[var(--brand-ink)] hover:bg-white"
          >
            FAQ
          </a>
        </div>
      </header>

      <div id="calculator" className="mt-6 scroll-mt-24 sm:mt-8">
        <CalculatorRunner calculator={calculator} />
      </div>

      <div className="mt-8">
        <TidbitsWidget items={tips} title="Tidbits while you work" />
      </div>

      <CalculatorGuide calculator={calculator} />

      <div id="similar" className="mt-10 scroll-mt-24 space-y-8 sm:mt-12">
        <SimilarCalculatorsWidget
          items={similar}
          title={`Similar calculators to ${calculator.title}`}
          subtitle={`Related tools in ${category?.name ?? "this topic"} and nearby categories on Stats Calculator Online`}
        />

        <aside className="rounded-2xl border border-[var(--brand-ink)]/10 bg-white/70 p-4 sm:p-5">
          <h2 className="font-display text-lg text-[var(--brand-ink)]">
            Keep learning on Stats Calculator Online
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {category && (
              <li>
                <Link
                  href={`/calculators/${calculator.category}`}
                  className="inline-flex min-h-9 items-center rounded-full bg-[var(--brand-paper)] px-3 text-xs font-semibold text-[var(--brand-ink)] hover:bg-white"
                >
                  More {category.name}
                </Link>
              </li>
            )}
            <li>
              <Link
                href="/calculators/hypothesis-testing/statistical-test-flow-chart"
                className="inline-flex min-h-9 items-center rounded-full bg-[var(--brand-paper)] px-3 text-xs font-semibold text-[var(--brand-ink)] hover:bg-white"
              >
                Test selector
              </Link>
            </li>
            {resourceLinks.slice(0, 4).map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className="inline-flex min-h-9 items-center rounded-full bg-[var(--brand-paper)] px-3 text-xs font-semibold text-[var(--brand-ink)] hover:bg-white"
                >
                  {r.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </article>
  );
}

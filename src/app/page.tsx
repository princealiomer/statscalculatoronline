import Link from "next/link";
import type { Metadata } from "next";
import { categories, calculators } from "@/lib/calculators/registry";
import { siteConfig } from "@/config/site";
import { BrandInfographic } from "@/components/BrandInfographic";
import { getPopularCalculators, calcHref } from "@/lib/calculators/related";
import { buildPageMetadata } from "@/lib/seo/meta";

export const metadata: Metadata = buildPageMetadata({
  title: "Free Statistics & Math Calculators",
  description: siteConfig.metaDescription,
  path: "/",
  keywords: [...siteConfig.keywords],
});

const homeFaqs = [
  {
    q: "What is Stats Calculator Online?",
    a: siteConfig.definitionAnswer,
  },
  {
    q: "Are the statistics calculators free?",
    a: "Yes. Every calculator on Stats Calculator Online is free to use with no account required. Formulas, step-by-step guidance, APA/AMA write-ups, and PDF, Word, and CSV exports are included at no cost.",
  },
  {
    q: "Which statistics calculators are available?",
    a: `Stats Calculator Online hosts ${calculators.length}+ tools across ${categories.length} categories, including hypothesis tests, descriptive statistics, probability, confidence intervals, regression, correlation, algebra, finance, and critical-value tables.`,
  },
  {
    q: "How do I choose the right statistical test?",
    a: "Use the statistical test flow chart on Stats Calculator Online to match your data type and research question to a test, then open that calculator for formulas, steps, and exportable results.",
  },
  {
    q: "Can I export results for homework or reports?",
    a: "Yes. After you calculate, export a branded PDF that shows your inputs, formulas applied, worked steps, and final answers, plus Word/Docs and CSV formats suitable for lab notebooks and drafts.",
  },
] as const;

export default function HomePage() {
  const featured = getPopularCalculators(6);

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: homeFaqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const howToLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to use Stats Calculator Online",
    description:
      "Run a free statistics or math calculation with formulas, steps, and exportable reports.",
    totalTime: "PT5M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Pick a calculator",
        text: "Browse the catalog or open a popular tool such as a t-test, mean/median/mode, or regression calculator.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Enter your data",
        text: "Type or paste values into the on-page fields. Sample data is available on many tools to try the workflow.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Review formulas and steps",
        text: "Read the textbook formulas, worked steps, and interpretation tips under the calculator.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Export a report",
        text: "Download a free branded PDF, Word, or CSV report with inputs, formulas, steps, and final results.",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }}
      />

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
              Free statistics calculators with formulas, steps, and branded PDF reports you can cite
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[var(--brand-ink-soft)] md:text-base">
              {siteConfig.definitionAnswer}
            </p>
            <p className="mt-3 text-xs text-[var(--brand-ink-soft)]">
              Last updated: {siteConfig.contentUpdated}
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

      <section className="mx-auto max-w-6xl px-3 pb-12 sm:px-4" aria-labelledby="how-to-heading">
        <h2 id="how-to-heading" className="font-display text-2xl text-[var(--brand-ink)] sm:text-3xl">
          How to use Stats Calculator Online
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--brand-ink-soft)] sm:text-base">
          Get from a research question to a citable result in four steps—no software install.
        </p>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <li className="rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-panel)] p-4 shadow-[var(--brand-shadow)]">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-accent)]">
              Step 1
            </p>
            <p className="mt-2 font-medium text-[var(--brand-ink)]">Pick a calculator</p>
            <p className="mt-1 text-sm text-[var(--brand-ink-soft)]">
              Browse the catalog or open a popular t-test, descriptive stats, or regression tool.
            </p>
          </li>
          <li className="rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-panel)] p-4 shadow-[var(--brand-shadow)]">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-accent)]">
              Step 2
            </p>
            <p className="mt-2 font-medium text-[var(--brand-ink)]">Enter your data</p>
            <p className="mt-1 text-sm text-[var(--brand-ink-soft)]">
              Type or paste values; many pages include sample data so you can verify the workflow.
            </p>
          </li>
          <li className="rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-panel)] p-4 shadow-[var(--brand-shadow)]">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-accent)]">
              Step 3
            </p>
            <p className="mt-2 font-medium text-[var(--brand-ink)]">Check formulas &amp; steps</p>
            <p className="mt-1 text-sm text-[var(--brand-ink-soft)]">
              Read textbook formulas, worked steps, and interpretation tips under the calculator.
            </p>
          </li>
          <li className="rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-panel)] p-4 shadow-[var(--brand-shadow)]">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-accent)]">
              Step 4
            </p>
            <p className="mt-2 font-medium text-[var(--brand-ink)]">Export a report</p>
            <p className="mt-1 text-sm text-[var(--brand-ink-soft)]">
              Download a free branded PDF, Word, or CSV with inputs, formulas, steps, and answers.
            </p>
          </li>
        </ol>
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

      <section className="mx-auto max-w-6xl px-3 pb-12 sm:px-4">
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

      <section className="mx-auto max-w-6xl px-3 pb-16 sm:px-4 sm:pb-20" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="font-display text-2xl text-[var(--brand-ink)] sm:text-3xl">
          Frequently asked questions
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--brand-ink-soft)] sm:text-base">
          Direct answers about Stats Calculator Online for students, analysts, and AI assistants
          looking up free statistics tools.
        </p>
        <dl className="mt-6 grid gap-4">
          {homeFaqs.map((item) => (
            <div
              key={item.q}
              className="rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-panel)] p-5 shadow-[var(--brand-shadow)]"
            >
              <dt className="font-medium text-[var(--brand-ink)]">{item.q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-[var(--brand-ink-soft)]">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}

import Link from "next/link";
import type { CalculatorDef } from "@/lib/calculators/types";
import { getByCategory, getCategory } from "@/lib/calculators/registry";
import { CalculatorRunner } from "@/components/calculator/CalculatorRunner";
import { CalculatorGuide } from "@/components/calculator/CalculatorGuide";

export function CalculatorShell({ calculator }: { calculator: CalculatorDef }) {
  const category = getCategory(calculator.category);
  const related = getByCategory(calculator.category)
    .filter((c) => c.slug !== calculator.slug)
    .slice(0, 4);

  return (
    <article className="mx-auto max-w-6xl px-3 py-6 sm:px-4 sm:py-8">
      <nav aria-label="Breadcrumb" className="text-xs text-teal-900/60 sm:text-sm">
        <ol className="flex flex-wrap items-center gap-x-1 gap-y-1">
          <li>
            <Link href="/" className="hover:text-teal-800">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/calculators" className="hover:text-teal-800">
              Calculators
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="min-w-0">
            <Link
              href={`/calculators/${calculator.category}`}
              className="break-words hover:text-teal-800"
            >
              {category?.name ?? calculator.category}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="min-w-0 break-words text-teal-950">{calculator.title}</li>
        </ol>
      </nav>

      <header className="mt-5 max-w-3xl sm:mt-6">
        <h1 className="font-display text-[1.75rem] font-semibold leading-tight tracking-tight text-teal-950 sm:text-3xl md:text-4xl">
          {calculator.title} Calculator
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-teal-900/75 sm:text-base md:text-lg">
          Free online {calculator.title.toLowerCase()} tool — {calculator.description}. Get
          formulas, step-by-step guidance, interpretation tips, and free APA/AMA write-ups with
          PDF / Word / CSV exports.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href="#calculator"
            className="inline-flex min-h-10 items-center justify-center rounded-full bg-teal-800 px-4 text-sm font-semibold text-white hover:bg-teal-700"
          >
            Open calculator
          </a>
          <a
            href="#guide"
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-teal-900/15 bg-white/80 px-4 text-sm font-medium text-teal-950 hover:bg-white"
          >
            Formulas &amp; how-to
          </a>
          <a
            href="#faq"
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-teal-900/15 bg-white/80 px-4 text-sm font-medium text-teal-950 hover:bg-white"
          >
            FAQ
          </a>
        </div>
      </header>

      <div id="calculator" className="mt-6 scroll-mt-24 sm:mt-8">
        <CalculatorRunner calculator={calculator} />
      </div>

      <CalculatorGuide calculator={calculator} />

      {related.length > 0 && (
        <section className="mt-10 sm:mt-12" aria-labelledby="related-heading">
          <h2 id="related-heading" className="font-display text-xl text-teal-950 sm:text-2xl">
            Related {category?.name?.toLowerCase() ?? ""} calculators
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {related.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/calculators/${c.category}/${c.slug}`}
                  className="block min-h-[3.25rem] rounded-xl border border-teal-900/10 bg-white/60 px-4 py-3 transition hover:border-teal-700/30 hover:bg-white"
                >
                  <span className="font-medium text-teal-950">{c.title} Calculator</span>
                  <span className="mt-1 block text-sm leading-snug text-teal-900/65">
                    {c.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}

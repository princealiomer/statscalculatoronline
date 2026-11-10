import type { CalculatorDef } from "@/lib/calculators/types";
import { getCalculatorGuide } from "@/lib/calculators/explain";
import { Formula } from "@/components/calculator/Formula";

export function CalculatorGuide({ calculator }: { calculator: CalculatorDef }) {
  const guide = getCalculatorGuide(calculator);
  const faq = [
    {
      q: `What does the ${calculator.title} calculator do?`,
      a: guide.overview,
    },
    {
      q: `When should I use ${calculator.title}?`,
      a: guide.whenToUse ?? calculator.description,
    },
    {
      q: `How do I interpret the ${calculator.title} results?`,
      a: guide.interpretation.join(" "),
    },
  ];

  return (
    <section
      id="guide"
      className="mt-10 space-y-8 scroll-mt-24 sm:mt-12 sm:space-y-10"
      aria-labelledby="guide-heading"
      itemScope
      itemType="https://schema.org/WebPageElement"
    >
      <div>
        <h2
          id="guide-heading"
          className="font-display text-2xl leading-tight text-teal-950 sm:text-3xl"
        >
          {calculator.title} formula, steps &amp; guide
        </h2>
        <p
          className="mt-3 max-w-3xl text-[15px] leading-relaxed text-teal-900/80 sm:text-base"
          itemProp="description"
        >
          {guide.overview}
        </p>
        {guide.whenToUse && (
          <p className="mt-3 max-w-3xl border-l-2 border-teal-600/40 pl-3 text-sm leading-relaxed text-teal-900/70 sm:pl-4">
            <span className="font-medium text-teal-950">When to use: </span>
            {guide.whenToUse}
          </p>
        )}
      </div>

      <div className="grid gap-8 md:grid-cols-2 md:gap-6 lg:gap-8">
        <div>
          <h3 className="font-display text-lg text-teal-950 sm:text-xl">
            How to use this calculator
          </h3>
          <ol className="mt-4 list-decimal space-y-2.5 pl-5 text-[15px] leading-relaxed text-teal-900/80 sm:text-sm">
            {guide.howTo.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>

        <div>
          <h3 className="font-display text-lg text-teal-950 sm:text-xl">
            How to read the results
          </h3>
          <ul className="mt-4 list-disc space-y-2.5 pl-5 text-[15px] leading-relaxed text-teal-900/80 sm:text-sm">
            {guide.interpretation.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {guide.formulas.length > 0 && (
        <div>
          <h3 className="font-display text-lg text-teal-950 sm:text-xl">
            {calculator.title} formulas
          </h3>
          <p className="mt-2 max-w-3xl text-sm text-teal-900/65">
            Core equations used by this free online calculator. Symbols match common textbook
            notation.
          </p>
          <ul className="mt-4 grid gap-3 sm:mt-5 sm:grid-cols-2 sm:gap-4">
            {guide.formulas.map((f) => (
              <li
                key={f.label + f.latex}
                className="min-w-0 rounded-xl border border-teal-900/10 bg-white/70 px-3 py-3 sm:px-4"
              >
                <p className="text-[11px] font-semibold uppercase tracking-wide text-teal-800/80 sm:text-xs">
                  {f.label}
                </p>
                <div className="formula-scroll mt-2 min-h-[2.25rem] max-w-full overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
                  <Formula latex={f.latex} />
                </div>
                {f.note && (
                  <p className="mt-2 text-xs leading-relaxed text-teal-900/60">{f.note}</p>
                )}
                {/* Crawlable plain-text formula fallback */}
                <p className="sr-only">
                  {f.label}: {f.latex}
                  {f.note ? `. ${f.note}` : ""}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {guide.example && (
        <div className="rounded-xl border border-teal-900/10 bg-teal-950/[0.03] px-4 py-4 sm:px-5">
          <h3 className="font-display text-base text-teal-950 sm:text-lg">Quick example</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-teal-900/80 sm:text-sm">
            {guide.example}
          </p>
        </div>
      )}

      {guide.tips.length > 0 && (
        <div>
          <h3 className="font-display text-lg text-teal-950 sm:text-xl">Tips &amp; assumptions</h3>
          <ul className="mt-4 list-disc space-y-2.5 pl-5 text-[15px] leading-relaxed text-teal-900/80 sm:text-sm">
            {guide.tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      <div id="faq" className="scroll-mt-24">
        <h3 className="font-display text-lg text-teal-950 sm:text-xl">
          Frequently asked questions
        </h3>
        <div className="mt-4 space-y-2">
          {faq.map((item) => (
            <details
              key={item.q}
              className="group rounded-xl border border-teal-900/10 bg-white/70 px-3 py-1 open:bg-white sm:px-4"
            >
              <summary className="cursor-pointer list-none py-3 text-[15px] font-medium text-teal-950 marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-start justify-between gap-3">
                  <span className="min-w-0 flex-1 leading-snug">{item.q}</span>
                  <span
                    aria-hidden
                    className="mt-0.5 shrink-0 text-teal-700 transition group-open:rotate-45"
                  >
                    +
                  </span>
                </span>
              </summary>
              <p className="border-t border-teal-900/5 pb-3 pt-2 text-[15px] leading-relaxed text-teal-900/75 sm:text-sm">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

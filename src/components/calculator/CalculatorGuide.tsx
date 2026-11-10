import Link from "next/link";
import type { CalculatorDef } from "@/lib/calculators/types";
import { getCalculatorOutline } from "@/lib/calculators/explain";
import { Formula } from "@/components/calculator/Formula";
import { siteConfig } from "@/config/site";

function SectionNav({ tool }: { tool: string }) {
  const items = [
    { href: "#what-is", label: "1. What is it?" },
    { href: "#why", label: "2. Why it matters" },
    { href: "#how-used", label: "3. How it’s used" },
    { href: "#formula", label: "4. Formula" },
    { href: "#results-guide", label: "5. Results" },
    { href: "#workflow", label: "6. How to act" },
    { href: "#ui-tips", label: "UI tips" },
    { href: "#faq", label: "Troubleshooting" },
    { href: "#benchmarks", label: "Benchmarks" },
    { href: "#integrations", label: "Integrations" },
  ];
  return (
    <nav aria-label={`${tool} guide sections`} className="mt-4 flex flex-wrap gap-2">
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="inline-flex min-h-8 items-center rounded-full border border-[var(--brand-ink)]/10 bg-white/80 px-2.5 text-[11px] font-semibold text-[var(--brand-ink)]/80 hover:border-[var(--brand-accent)]/30"
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}

export function CalculatorGuide({ calculator }: { calculator: CalculatorDef }) {
  const o = getCalculatorOutline(calculator);
  const tool = o.toolName;

  return (
    <section
      id="guide"
      className="mt-10 space-y-10 scroll-mt-24 sm:mt-12 sm:space-y-12"
      aria-labelledby="guide-heading"
    >
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--brand-accent)]">
          {siteConfig.name} guide
        </p>
        <h2
          id="guide-heading"
          className="mt-2 font-display text-2xl leading-tight text-[var(--brand-ink)] sm:text-3xl"
        >
          Understanding &amp; Using {tool}
        </h2>
        <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-[var(--brand-ink)]/75 sm:text-base">
          A complete outline for the free {tool} calculator: definition, purpose, practical uses,
          formulas, how to read results, action workflow, troubleshooting, benchmarks, and how this
          metric connects to the rest of your stack.
        </p>
        <SectionNav tool={tool} />
      </header>

      {/* 1. What Is That */}
      <section id="what-is" className="scroll-mt-24 space-y-4">
        <h3 className="font-display text-xl text-[var(--brand-ink)] sm:text-2xl">
          1. What Is {tool}? (Definition &amp; Core Concept)
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[var(--brand-ink)]/10 bg-white/75 p-4 sm:p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--brand-amber-ink)]">
              High-level definition
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-[var(--brand-ink)]/80">{o.whatIs.definition}</p>
          </div>
          <div className="rounded-2xl border border-[var(--brand-ink)]/10 bg-white/75 p-4 sm:p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--brand-amber-ink)]">
              What problem it solves
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-[var(--brand-ink)]/80">
              {o.whatIs.problemSolved}
            </p>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-[var(--brand-ink)]">Key components</h4>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-[var(--brand-ink)]/75">
            {o.whatIs.keyComponents.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* 2. Why */}
      <section id="why" className="scroll-mt-24 space-y-4">
        <h3 className="font-display text-xl text-[var(--brand-ink)] sm:text-2xl">
          2. Why Is {tool}? (Purpose &amp; Importance)
        </h3>
        <div className="space-y-3 text-[15px] leading-relaxed text-[var(--brand-ink)]/80">
          <p>
            <span className="font-semibold text-[var(--brand-ink)]">Business &amp; SEO value: </span>
            {o.why.value}
          </p>
          <p>
            <span className="font-semibold text-[var(--brand-ink)]">What happens without it: </span>
            {o.why.withoutIt}
          </p>
          <p>
            <span className="font-semibold text-[var(--brand-ink)]">When to rely on it: </span>
            {o.why.whenToRely}
          </p>
        </div>
      </section>

      {/* 3. How used */}
      <section id="how-used" className="scroll-mt-24 space-y-4">
        <h3 className="font-display text-xl text-[var(--brand-ink)] sm:text-2xl">
          3. How Is {tool} Used? (Context &amp; Practical Applications)
        </h3>
        <div className="grid gap-3 md:grid-cols-3">
          {o.howUsed.roles.map((r) => (
            <div
              key={r.role}
              className="rounded-2xl border border-[var(--brand-ink)]/10 bg-white/75 p-4"
            >
              <p className="text-sm font-semibold text-[var(--brand-ink)]">{r.role}</p>
              <ul className="mt-2 list-disc space-y-1.5 pl-4 text-xs leading-relaxed text-[var(--brand-ink)]/70">
                {r.uses.map((u) => (
                  <li key={u}>{u}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-[var(--brand-ink)]/10 bg-[var(--brand-paper)]/80 px-4 py-4 sm:px-5">
          <h4 className="text-sm font-semibold text-[var(--brand-ink)]">Real-world scenario</h4>
          <p className="mt-2 text-sm leading-relaxed text-[var(--brand-ink)]/75">{o.howUsed.scenario}</p>
        </div>
      </section>

      {/* 4. Formula */}
      <section id="formula" className="scroll-mt-24 space-y-4">
        <h3 className="font-display text-xl text-[var(--brand-ink)] sm:text-2xl">
          4. What Is the Formula? (The Mechanics Behind {tool})
        </h3>
        <p className="text-sm text-[var(--brand-ink)]/65">{o.formula.intro}</p>
        {o.formula.formulas.length > 0 && (
          <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            {o.formula.formulas.map((f) => (
              <li
                key={f.label + f.latex}
                className="min-w-0 rounded-xl border border-[var(--brand-ink)]/10 bg-white/70 px-3 py-3 sm:px-4"
              >
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--brand-accent)]">
                  {f.label}
                </p>
                <div className="formula-scroll mt-2 min-h-[2.25rem] max-w-full overflow-x-auto">
                  <Formula latex={f.latex} />
                </div>
                {f.note && <p className="mt-2 text-xs text-[var(--brand-ink)]/60">{f.note}</p>}
                <p className="sr-only">
                  {f.label}: {f.latex}
                </p>
              </li>
            ))}
          </ul>
        )}
        <div>
          <h4 className="text-sm font-semibold text-[var(--brand-ink)]">Variable breakdown</h4>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-[var(--brand-ink)]/75">
            {o.formula.variableBreakdown.map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-[var(--brand-ink)]/10 bg-white/70 px-4 py-4">
          <h4 className="text-sm font-semibold text-[var(--brand-ink)]">Sample calculation</h4>
          <p className="mt-2 text-sm leading-relaxed text-[var(--brand-ink)]/75">
            {o.formula.sampleCalculation}
          </p>
          <p className="mt-3 text-xs text-[var(--brand-ink)]/55">
            Tip: use the live calculator above as your interactive mini-worksheet—enter your own
            numbers to regenerate the result instantly.
          </p>
        </div>
      </section>

      {/* 5. Results */}
      <section id="results-guide" className="scroll-mt-24 space-y-4">
        <h3 className="font-display text-xl text-[var(--brand-ink)] sm:text-2xl">
          5. What Are the Results? (Interpreting Outputs &amp; Benchmarks)
        </h3>
        <div>
          <h4 className="text-sm font-semibold text-[var(--brand-ink)]">Decoding the numbers</h4>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-[var(--brand-ink)]/75">
            {o.results.decoding.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-rose-900/10 bg-rose-50/50 p-4">
            <h4 className="text-sm font-semibold text-[var(--brand-ink)]">
              Common patterns &amp; red flags
            </h4>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-[var(--brand-ink)]/75">
              {o.results.redFlags.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-[var(--brand-accent)]/15 bg-teal-50/40 p-4">
            <h4 className="text-sm font-semibold text-[var(--brand-ink)]">Hidden wins</h4>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-[var(--brand-ink)]/75">
              {o.results.hiddenWins.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-[var(--brand-ink)]/75">
          <span className="font-semibold text-[var(--brand-ink)]">Impact assessment: </span>
          {o.results.impact}
        </p>
      </section>

      {/* 6. Workflow */}
      <section id="workflow" className="scroll-mt-24 space-y-4">
        <h3 className="font-display text-xl text-[var(--brand-ink)] sm:text-2xl">
          6. How to Use {tool}? (Actionable Implementation Guide)
        </h3>
        <ol className="grid gap-3 sm:grid-cols-2">
          {(
            [
              ["Audit", o.workflow.audit],
              ["Diagnose", o.workflow.diagnose],
              ["Execute", o.workflow.execute],
              ["Measure", o.workflow.measure],
            ] as const
          ).map(([label, text], i) => (
            <li
              key={label}
              className="rounded-2xl border border-[var(--brand-ink)]/10 bg-white/75 p-4"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--brand-accent)]">
                Step {i + 1} · {label}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--brand-ink)]/75">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Visual / UI */}
      <section id="ui-tips" className="scroll-mt-24 space-y-3">
        <h3 className="font-display text-xl text-[var(--brand-ink)] sm:text-2xl">
          Visual &amp; interactive enhancements on this page
        </h3>
        <p className="text-sm text-[var(--brand-ink)]/65">
          Annotated path through the Stats Calculator Online {tool} interface—no separate dashboard
          login required.
        </p>
        <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-[var(--brand-ink)]/75">
          {o.uiTips.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ol>
        <p className="text-sm">
          <a href="#calculator" className="font-semibold text-[var(--brand-accent)] hover:underline">
            ↑ Jump to the live {tool} calculator
          </a>
          {" · "}
          <Link href="/sitemap" className="font-semibold text-[var(--brand-accent)] hover:underline">
            Browse all calculators in the HTML sitemap
          </Link>
        </p>
      </section>

      {/* FAQ / Troubleshooting */}
      <section id="faq" className="scroll-mt-24 space-y-3">
        <h3 className="font-display text-xl text-[var(--brand-ink)] sm:text-2xl">
          Troubleshooting &amp; FAQ
        </h3>
        <div className="space-y-2">
          {o.troubleshooting.map((item) => (
            <details
              key={item.q}
              className="group rounded-xl border border-[var(--brand-ink)]/10 bg-white/70 px-3 py-1 open:bg-white sm:px-4"
            >
              <summary className="cursor-pointer list-none py-3 text-[15px] font-medium text-[var(--brand-ink)] marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-start justify-between gap-3">
                  <span className="min-w-0 flex-1 leading-snug">{item.q}</span>
                  <span aria-hidden className="mt-0.5 shrink-0 text-[var(--brand-accent)] transition group-open:rotate-45">
                    +
                  </span>
                </span>
              </summary>
              <p className="border-t border-[var(--brand-ink)]/5 pb-3 pt-2 text-[15px] leading-relaxed text-[var(--brand-ink)]/75 sm:text-sm">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Benchmarks */}
      <section id="benchmarks" className="scroll-mt-24 space-y-3">
        <h3 className="font-display text-xl text-[var(--brand-ink)] sm:text-2xl">
          Industry benchmarks &amp; segment variations
        </h3>
        <p className="text-sm text-[var(--brand-ink)]/65">
          Acceptable thresholds for {tool} shift by business model and channel—use these as starting
          guidance, not universal law.
        </p>
        <ul className="grid gap-3 sm:grid-cols-2">
          {o.benchmarks.map((b) => (
            <li
              key={b.segment}
              className="rounded-2xl border border-[var(--brand-ink)]/10 bg-white/75 p-4"
            >
              <p className="text-sm font-semibold text-[var(--brand-ink)]">{b.segment}</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--brand-ink)]/70">{b.guidance}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Integrations */}
      <section id="integrations" className="scroll-mt-24 space-y-3">
        <h3 className="font-display text-xl text-[var(--brand-ink)] sm:text-2xl">
          Integration with other metrics (the holistic view)
        </h3>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-[var(--brand-ink)]/75">
          {o.integrations.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </section>
    </section>
  );
}

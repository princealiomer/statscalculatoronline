"use client";

import { useMemo, useState } from "react";
import type { CalculatorDef } from "@/lib/calculators/types";
import { fieldsForEngine } from "@/lib/calculators/fields";
import { runEngine } from "@/lib/calculators/runEngine";
import type { CalcResult } from "@/lib/stats/format";
import { ChartPreview } from "@/components/calculator/ChartPreview";
import { ResultsReport } from "@/components/calculator/ResultsReport";

const SAMPLE_DATA: Record<string, string> = {
  data: "12, 15, 14, 18, 21, 19, 16, 14, 22, 17, 15, 20",
  experimental: "48.2",
  theoretical: "50",
  oddsFor: "3",
  oddsAgainst: "2",
  text: "Stats Calculator Online makes free reports easy. Stats Calculator Online helps students write results.",
  names: "Ada\nGrace\nAlan\nKatherine\nDorothy",
  current: "85",
  desired: "90",
  finalWeight: "20",
};

function initialValues(fields: ReturnType<typeof fieldsForEngine>) {
  const init: Record<string, string> = {};
  for (const f of fields) if (f.defaultValue != null) init[f.name] = f.defaultValue;
  return init;
}

export function CalculatorRunner({ calculator }: { calculator: CalculatorDef }) {
  const fields = useMemo(() => fieldsForEngine(calculator.engine), [calculator.engine]);
  const [values, setValues] = useState<Record<string, string>>(() => initialValues(fields));
  const [result, setResult] = useState<CalcResult | null>(null);

  function onRun(e: React.FormEvent) {
    e.preventDefault();
    const next = runEngine(calculator.engine, values);
    setResult(next);
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches) {
      requestAnimationFrame(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  function onClear() {
    setValues(initialValues(fields));
    setResult(null);
  }

  function onLoadSample() {
    setValues((prev) => {
      const next = { ...prev };
      for (const f of fields) {
        if (SAMPLE_DATA[f.name] != null) next[f.name] = SAMPLE_DATA[f.name];
        else if (f.type === "textarea" && f.name === "data") {
          if (calculator.engine === "gpa") next[f.name] = "A, 3\nB+, 4\nA-, 3";
          else if (calculator.engine === "grade-weighted") next[f.name] = "92, 20\n85, 30\n88, 50";
          else next[f.name] = SAMPLE_DATA.data;
        }
      }
      return next;
    });
    setResult(null);
  }

  return (
    <div className="grid gap-5 sm:gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <form
        onSubmit={onRun}
        className="space-y-4 rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-panel)] p-4 shadow-[var(--brand-shadow)] sm:p-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg text-teal-950 sm:text-xl">Calculator</h2>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onLoadSample}
              className="inline-flex min-h-10 items-center rounded-full border border-teal-900/15 bg-white px-3.5 text-xs font-semibold text-teal-950 hover:bg-teal-50 sm:min-h-0 sm:py-1.5"
            >
              Sample data
            </button>
            <button
              type="button"
              onClick={onClear}
              className="inline-flex min-h-10 items-center rounded-full border border-teal-900/15 bg-white px-3.5 text-xs font-semibold text-teal-950 hover:bg-teal-50 sm:min-h-0 sm:py-1.5"
            >
              Clear
            </button>
          </div>
        </div>

        <p className="text-xs leading-relaxed text-teal-900/60">
          Accepts commas, spaces, or new lines — paste from spreadsheets works. Use Sample vs Population when
          shown so SD / variance match your design.
        </p>

        {fields.length === 0 ? (
          <p className="text-sm text-teal-900/70">No inputs required — run to see guidance.</p>
        ) : (
          fields.map((f) => (
            <label key={f.name} className="block text-sm">
              <span className="mb-1.5 block font-medium text-teal-950/90">{f.label}</span>
              {f.type === "textarea" ? (
                <textarea
                  className="min-h-28 w-full rounded-xl border border-teal-900/15 bg-white px-3 py-2.5 font-mono text-base outline-none ring-teal-700/30 focus:ring-2 sm:text-sm"
                  placeholder={f.placeholder}
                  value={values[f.name] ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                  autoComplete="off"
                  enterKeyHint="done"
                />
              ) : f.type === "select" ? (
                <select
                  className="min-h-11 w-full rounded-xl border border-teal-900/15 bg-white px-3 py-2.5 text-base outline-none ring-teal-700/30 focus:ring-2 sm:min-h-0 sm:text-sm"
                  value={values[f.name] ?? f.defaultValue ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                >
                  {f.options?.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={f.type === "number" ? "number" : "text"}
                  inputMode={f.type === "number" ? "decimal" : "text"}
                  step="any"
                  className="min-h-11 w-full rounded-xl border border-teal-900/15 bg-white px-3 py-2.5 text-base outline-none ring-teal-700/30 focus:ring-2 sm:min-h-0 sm:text-sm"
                  placeholder={f.placeholder}
                  value={values[f.name] ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                  autoComplete="off"
                  enterKeyHint="done"
                />
              )}
            </label>
          ))
        )}
        <div className="sticky bottom-3 z-10 -mx-1 bg-gradient-to-t from-white/95 via-white/90 to-transparent pt-3 sm:static sm:mx-0 sm:bg-none sm:pt-0">
          <button
            type="submit"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[var(--brand-accent)] px-5 py-3 text-base font-semibold text-white transition hover:bg-[var(--brand-accent-dark)] sm:min-h-0 sm:w-auto sm:py-2.5 sm:text-sm"
          >
            Calculate
          </button>
        </div>
      </form>

      <div id="results" className="space-y-4 scroll-mt-24">
        <div className="rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-panel)] p-4 shadow-[var(--brand-shadow)] sm:p-5">
          <h2 className="font-display text-lg text-[var(--brand-ink)] sm:text-xl">Results</h2>
          {!result && (
            <p className="mt-3 text-sm text-teal-900/60">Results appear here after you run the calculator.</p>
          )}
          {result?.error && (
            <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800">{result.error}</p>
          )}
          {result && !result.error && (
            <dl className="mt-4 space-y-2">
              {result.fields.map((f) => (
                <div
                  key={f.label}
                  className="flex flex-col gap-1 border-b border-teal-900/5 py-2.5 text-sm sm:flex-row sm:items-start sm:justify-between sm:gap-4"
                >
                  <dt className="shrink-0 text-teal-900/70">{f.label}</dt>
                  <dd className="break-all font-mono font-medium text-teal-950 sm:max-w-[60%] sm:text-right">
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
          {result?.apa && (
            <p className="mt-4 rounded-xl bg-teal-50 px-3 py-3 text-sm leading-relaxed text-teal-950">
              <span className="font-semibold">APA-style: </span>
              {result.apa}
            </p>
          )}
        </div>

        {result && !result.error && result.steps.length > 0 && (
          <div className="rounded-2xl border border-teal-900/10 bg-white/70 p-5 shadow-sm">
            <h3 className="font-display text-lg text-teal-950">Step-by-step (show work)</h3>
            <ol className="mt-3 space-y-3">
              {result.steps.map((s, i) => (
                <li key={s.title} className="text-sm">
                  <p className="font-medium text-teal-900">
                    {i + 1}. {s.title}
                  </p>
                  <p className="mt-0.5 text-teal-900/70">{s.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        )}

        {result && !result.error && (
          <ResultsReport calculator={calculator} result={result} values={values} />
        )}

        {calculator.engine.startsWith("chart-") && (
          <ChartPreview engine={calculator.engine} values={values} result={result} />
        )}
      </div>
    </div>
  );
}

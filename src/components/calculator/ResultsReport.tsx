"use client";

import { useMemo, useState } from "react";
import type { CalculatorDef } from "@/lib/calculators/types";
import type { CalcResult } from "@/lib/stats/format";
import { buildReport, reportHtmlBody, slugifyFilename } from "@/lib/reports/buildReport";
import type { ReportStyle } from "@/lib/reports/types";
import { copyText, downloadCsv, downloadDoc, printPdfHtml } from "@/lib/reports/download";

const styles: { id: ReportStyle; label: string }[] = [
  { id: "apa", label: "APA" },
  { id: "ama", label: "AMA" },
  { id: "plain", label: "Plain" },
];

export function ResultsReport({
  calculator,
  result,
  values,
}: {
  calculator: CalculatorDef;
  result: CalcResult;
  values: Record<string, string>;
}) {
  const [style, setStyle] = useState<ReportStyle>("apa");
  const [status, setStatus] = useState<string | null>(null);

  const ctx = useMemo(
    () => ({
      title: calculator.title,
      description: calculator.description,
      engine: calculator.engine,
      category: calculator.category,
      slug: calculator.slug,
      result,
      inputs: values,
    }),
    [calculator, result, values],
  );

  const report = useMemo(() => buildReport(ctx, style), [ctx, style]);
  const baseName = slugifyFilename(calculator.title);

  async function flash(message: string, fn: () => void | Promise<void>) {
    try {
      await fn();
      setStatus(message);
      window.setTimeout(() => setStatus(null), 2200);
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Action failed");
    }
  }

  return (
    <div className="rounded-2xl border border-teal-900/10 bg-white/70 p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg text-teal-950">Free report &amp; exports</h3>
          <p className="mt-1 text-sm text-teal-900/65">
            Copy write-ups, download CSV / Word, or print a PDF — all free.
          </p>
        </div>
        <div className="flex w-full rounded-full border border-teal-900/15 bg-white p-1 text-xs font-semibold sm:w-auto">
          {styles.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setStyle(s.id)}
              className={`min-h-9 flex-1 rounded-full px-3 py-1.5 transition sm:flex-none ${
                style === s.id ? "bg-teal-800 text-white" : "text-teal-900/70 hover:bg-teal-50"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <Block label="Citation">{report.citation}</Block>
        <Block label="Methods + Results write-up">{report.writeUp}</Block>
        <details className="rounded-xl border border-teal-900/10 bg-teal-50/40 px-3 py-2">
          <summary className="cursor-pointer text-sm font-medium text-teal-950">Assumptions checklist</summary>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-teal-900/75">
            {report.assumptions.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </details>
        <details className="rounded-xl border border-teal-900/10 bg-white px-3 py-2">
          <summary className="cursor-pointer text-sm font-medium text-teal-950">LaTeX table</summary>
          <pre className="mt-2 overflow-x-auto whitespace-pre-wrap font-mono text-xs text-teal-950/90">
            {report.latex}
          </pre>
        </details>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Action onClick={() => flash("Citation copied", () => copyText(report.citation))}>Copy citation</Action>
        <Action onClick={() => flash("Write-up copied", () => copyText(report.writeUp))}>Copy write-up</Action>
        <Action onClick={() => flash("LaTeX copied", () => copyText(report.latex))}>Copy LaTeX</Action>
        <Action onClick={() => flash("CSV downloaded", () => downloadCsv(`${baseName}-results.csv`, report.csv))}>
          Download CSV
        </Action>
        <Action
          onClick={() =>
            flash("Word/Docs file downloaded", () =>
              downloadDoc(`${baseName}-report.doc`, reportHtmlBody(ctx, style), calculator.title),
            )
          }
        >
          Download Word / Docs
        </Action>
        <Action
          onClick={() =>
            flash("Print / Save as PDF opened", () => printPdfHtml(calculator.title, reportHtmlBody(ctx, style)))
          }
        >
          Print / PDF
        </Action>
      </div>

      {status && <p className="mt-3 text-xs font-medium text-teal-800">{status}</p>}
    </div>
  );
}

function Block({ label, children }: { label: string; children: string }) {
  return (
    <div className="rounded-xl bg-teal-50/70 px-3 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-teal-800/80">{label}</p>
      <p className="mt-1 text-sm leading-relaxed text-teal-950">{children}</p>
    </div>
  );
}

function Action({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-10 items-center rounded-full border border-teal-900/15 bg-white px-3.5 py-2 text-xs font-semibold text-teal-950 transition hover:border-teal-700/40 hover:bg-teal-50 sm:min-h-0 sm:py-1.5"
    >
      {children}
    </button>
  );
}

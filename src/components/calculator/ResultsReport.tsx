"use client";

import { useMemo, useState } from "react";
import type { CalculatorDef } from "@/lib/calculators/types";
import type { FieldDef } from "@/lib/calculators/fields";
import type { CalcResult } from "@/lib/stats/format";
import { getCalculatorGuide } from "@/lib/calculators/explain";
import { getCategory } from "@/lib/calculators/registry";
import { buildReport, reportHtmlBody, slugifyFilename } from "@/lib/reports/buildReport";
import type { ReportStyle } from "@/lib/reports/types";
import {
  copyText,
  downloadCsv,
  downloadDoc,
  downloadPrintableHtml,
  printPdfHtml,
} from "@/lib/reports/download";

const styles: { id: ReportStyle; label: string }[] = [
  { id: "apa", label: "APA" },
  { id: "ama", label: "AMA" },
  { id: "plain", label: "Plain" },
];

export function ResultsReport({
  calculator,
  result,
  values,
  fields,
}: {
  calculator: CalculatorDef;
  result: CalcResult;
  values: Record<string, string>;
  fields: FieldDef[];
}) {
  const [style, setStyle] = useState<ReportStyle>("apa");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const ctx = useMemo(() => {
    const guide = getCalculatorGuide(calculator);
    const category = getCategory(calculator.category);
    const fieldLabels: Record<string, string> = {};
    for (const f of fields) fieldLabels[f.name] = f.label;
    return {
      title: calculator.title,
      description: calculator.description,
      engine: calculator.engine,
      category: calculator.category,
      categoryName: category?.name,
      slug: calculator.slug,
      result,
      inputs: values,
      fieldLabels,
      formulas: guide.formulas ?? [],
    };
  }, [calculator, result, values, fields]);

  const report = useMemo(() => buildReport(ctx, style), [ctx, style]);
  const baseName = slugifyFilename(calculator.title);

  const inputPreview = useMemo(
    () =>
      Object.entries(values)
        .filter(([, v]) => String(v ?? "").trim() !== "")
        .map(([k, v]) => ({
          label: fields.find((f) => f.name === k)?.label ?? k,
          value: v.length > 120 ? `${v.slice(0, 120)}…` : v,
        })),
    [values, fields],
  );

  async function runAction(key: string, message: string, fn: () => void | Promise<void>) {
    setBusy(key);
    try {
      await fn();
      setStatus(message);
      window.setTimeout(() => setStatus(null), 3600);
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Action failed");
    } finally {
      setBusy(null);
    }
  }

  function exportPdf() {
    const body = reportHtmlBody(ctx, style);
    const opened = printPdfHtml(`${calculator.title} — Stats Calculator Online`, body);
    if (!opened) {
      downloadPrintableHtml(`${baseName}-report.html`, calculator.title, body);
      throw new Error(
        "Pop-up blocked — downloaded a printable HTML report instead. Open it and use Print → Save as PDF.",
      );
    }
  }

  return (
    <div
      id="exports"
      className="scroll-mt-24 rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-panel)] p-4 shadow-[var(--brand-shadow)] sm:p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg text-[var(--brand-ink)]">
            Free branded PDF report &amp; exports
          </h3>
          <p className="mt-1 text-sm text-[var(--brand-ink-soft)]">
            Every PDF / Word file is a complete breakdown: what you entered, which formulas were
            applied, the worked steps, and the final results — with Stats Calculator Online branding.
          </p>
        </div>
        <div
          className="flex w-full rounded-xl border border-[var(--brand-border)] bg-[var(--brand-paper)] p-1 text-xs font-semibold sm:w-auto"
          role="group"
          aria-label="Write-up style"
        >
          {styles.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setStyle(s.id)}
              className={`min-h-9 flex-1 rounded-lg px-3 py-1.5 transition sm:flex-none ${
                style === s.id
                  ? "bg-[var(--brand-accent)] text-white"
                  : "text-[var(--brand-ink-soft)] hover:bg-white"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-[var(--brand-accent)]/25 bg-[var(--brand-paper)] p-3 sm:p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--brand-accent)]">
          What’s inside your PDF
        </p>
        <ol className="mt-2 grid gap-2 text-sm text-[var(--brand-ink)] sm:grid-cols-2">
          <li>
            <span className="font-semibold text-[var(--brand-accent)]">1. Inputs — </span>
            {inputPreview.length
              ? `${inputPreview.length} field${inputPreview.length === 1 ? "" : "s"} you entered`
              : "Your entered values"}
          </li>
          <li>
            <span className="font-semibold text-[var(--brand-accent)]">2. Formulas — </span>
            {(ctx.formulas?.length ?? 0) > 0
              ? `${ctx.formulas!.length} textbook formula${ctx.formulas!.length === 1 ? "" : "s"}`
              : "Formulas for this method"}
          </li>
          <li>
            <span className="font-semibold text-[var(--brand-accent)]">3. Work done — </span>
            {result.steps.length
              ? `${result.steps.length} step${result.steps.length === 1 ? "" : "s"} shown`
              : "Computation path for this run"}
          </li>
          <li>
            <span className="font-semibold text-[var(--brand-accent)]">4. Results — </span>
            {result.fields.length} final statistic{result.fields.length === 1 ? "" : "s"} + citation
          </li>
        </ol>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <PrimaryAction
          busy={busy === "pdf"}
          onClick={() =>
            runAction("pdf", "Print dialog opened — choose Save as PDF for a branded PDF", exportPdf)
          }
        >
          Save branded PDF
        </PrimaryAction>
        <PrimaryAction
          busy={busy === "word"}
          onClick={() =>
            runAction("word", "Word report downloaded (full breakdown)", () =>
              downloadDoc(`${baseName}-report.doc`, reportHtmlBody(ctx, style), calculator.title),
            )
          }
        >
          Download Word
        </PrimaryAction>
        <PrimaryAction
          busy={busy === "csv"}
          onClick={() =>
            runAction("csv", "CSV downloaded (inputs, formulas, steps, results)", () =>
              downloadCsv(`${baseName}-results.csv`, report.csv),
            )
          }
        >
          Download CSV
        </PrimaryAction>
      </div>
      <p className="mt-2 text-xs text-[var(--brand-ink-soft)]">
        PDF uses your browser print dialog (Save as PDF). Files include the SCO brand header, inputs,
        formulas, worked steps, and end results.
      </p>

      <details className="mt-4 rounded-xl border border-[var(--brand-border)] bg-white px-3 py-2 open:pb-3">
        <summary className="cursor-pointer text-sm font-medium text-[var(--brand-ink)]">
          Preview breakdown (same structure as the PDF)
        </summary>
        <div className="mt-3 space-y-4 text-sm">
          <section>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-accent)]">
              1. Inputs
            </h4>
            {inputPreview.length ? (
              <ul className="mt-1 space-y-1 text-[var(--brand-ink-soft)]">
                {inputPreview.map((row) => (
                  <li key={row.label}>
                    <span className="font-medium text-[var(--brand-ink)]">{row.label}:</span>{" "}
                    <span className="font-mono text-xs">{row.value}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-[var(--brand-ink-soft)]">No inputs recorded.</p>
            )}
          </section>
          <section>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-accent)]">
              2. Formulas applied
            </h4>
            <ul className="mt-1 space-y-2">
              {(ctx.formulas ?? []).slice(0, 6).map((f) => (
                <li key={f.label + f.latex}>
                  <p className="font-medium text-[var(--brand-ink)]">{f.label}</p>
                  <p className="font-mono text-xs text-[var(--brand-ink-soft)]">{f.latex}</p>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-accent)]">
              3. Work done
            </h4>
            <ol className="mt-1 list-decimal space-y-1 pl-5 text-[var(--brand-ink-soft)]">
              {result.steps.map((s) => (
                <li key={s.title}>
                  <span className="font-medium text-[var(--brand-ink)]">{s.title}</span> — {s.detail}
                </li>
              ))}
            </ol>
          </section>
          <section>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-accent)]">
              4. End results
            </h4>
            <ul className="mt-1 space-y-1 text-[var(--brand-ink-soft)]">
              {result.fields.map((f) => (
                <li key={f.label}>
                  <span className="font-medium text-[var(--brand-ink)]">{f.label}:</span>{" "}
                  <span className="font-mono text-xs">{f.value}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </details>

      <div className="mt-4 space-y-3">
        <Block label="Citation">{report.citation}</Block>
        <Block label="Methods + Results write-up">{report.writeUp}</Block>
        <details className="rounded-xl border border-[var(--brand-border)] bg-[var(--brand-paper)] px-3 py-2">
          <summary className="cursor-pointer text-sm font-medium text-[var(--brand-ink)]">
            Assumptions checklist
          </summary>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--brand-ink-soft)]">
            {report.assumptions.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </details>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <SecondaryAction
          busy={busy === "cite"}
          onClick={() => runAction("cite", "Citation copied", () => copyText(report.citation))}
        >
          Copy citation
        </SecondaryAction>
        <SecondaryAction
          busy={busy === "write"}
          onClick={() => runAction("write", "Write-up copied", () => copyText(report.writeUp))}
        >
          Copy write-up
        </SecondaryAction>
        <SecondaryAction
          busy={busy === "full"}
          onClick={() =>
            runAction("full", "Full breakdown copied", () => copyText(report.breakdown))
          }
        >
          Copy full breakdown
        </SecondaryAction>
        <SecondaryAction
          busy={busy === "latex"}
          onClick={() => runAction("latex", "LaTeX copied", () => copyText(report.latex))}
        >
          Copy LaTeX
        </SecondaryAction>
        <SecondaryAction
          busy={busy === "html"}
          onClick={() =>
            runAction("html", "Printable HTML downloaded", () =>
              downloadPrintableHtml(
                `${baseName}-report.html`,
                calculator.title,
                reportHtmlBody(ctx, style),
              ),
            )
          }
        >
          Download HTML
        </SecondaryAction>
      </div>

      {status && (
        <p
          className="mt-3 rounded-lg bg-[var(--brand-paper)] px-3 py-2 text-xs font-medium text-[var(--brand-accent-dark)]"
          role="status"
        >
          {status}
        </p>
      )}
    </div>
  );
}

function Block({ label, children }: { label: string; children: string }) {
  return (
    <div className="rounded-xl bg-[var(--brand-paper)] px-3 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-ink-soft)]">{label}</p>
      <p className="mt-1 text-sm leading-relaxed text-[var(--brand-ink)]">{children}</p>
    </div>
  );
}

function PrimaryAction({
  children,
  onClick,
  busy,
}: {
  children: React.ReactNode;
  onClick: () => void;
  busy?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--brand-accent)] px-3.5 text-sm font-semibold text-white transition hover:bg-[var(--brand-accent-dark)] disabled:opacity-70"
    >
      {busy ? "Working…" : children}
    </button>
  );
}

function SecondaryAction({
  children,
  onClick,
  busy,
}: {
  children: React.ReactNode;
  onClick: () => void;
  busy?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="inline-flex min-h-10 items-center rounded-xl border border-[var(--brand-border)] bg-white px-3.5 py-2 text-xs font-semibold text-[var(--brand-ink)] transition hover:bg-[var(--brand-paper)] disabled:opacity-70 sm:min-h-0 sm:py-1.5"
    >
      {busy ? "…" : children}
    </button>
  );
}

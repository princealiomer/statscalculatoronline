"use client";

import { useMemo, useState } from "react";
import type { CalculatorDef } from "@/lib/calculators/types";
import type { FieldDef } from "@/lib/calculators/fields";
import type { CalcResult } from "@/lib/stats/format";
import { getCalculatorGuide } from "@/lib/calculators/explain";
import { getCategory } from "@/lib/calculators/registry";
import {
  buildReport,
  buildRtfReport,
  reportHtmlBody,
  slugifyFilename,
} from "@/lib/reports/buildReport";
import type { ReportStyle } from "@/lib/reports/types";
import {
  copyText,
  downloadCsv,
  downloadPrintableHtml,
  downloadRtf,
  downloadTxt,
  printPdfHtml,
} from "@/lib/reports/download";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Spinner } from "@/components/ui/spinner";

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
    <Card id="exports" className="scroll-mt-24">
      <CardHeader className="border-b">
        <CardTitle className="font-display text-lg">
          Free branded PDF report &amp; exports
        </CardTitle>
        <CardDescription>
          Every PDF / Word file is a complete breakdown: what you entered, which formulas were
          applied, the worked steps, and the final results — with Stats Calculator Online branding.
        </CardDescription>
        <CardAction>
          <ToggleGroup
            value={[style]}
            onValueChange={(v) => {
              const next = v[0] as ReportStyle | undefined;
              if (next) setStyle(next);
            }}
            variant="outline"
            spacing={0}
            aria-label="Write-up style"
          >
            {styles.map((s) => (
              <ToggleGroupItem key={s.id} value={s.id}>
                {s.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 pt-(--card-spacing)">
        <Alert>
          <AlertTitle>What’s inside your PDF</AlertTitle>
          <AlertDescription>
            <ol className="mt-2 grid gap-2 sm:grid-cols-2">
              <li>
                <Badge variant="secondary" className="mr-1">
                  1
                </Badge>
                Inputs —{" "}
                {inputPreview.length
                  ? `${inputPreview.length} field${inputPreview.length === 1 ? "" : "s"} you entered`
                  : "Your entered values"}
              </li>
              <li>
                <Badge variant="secondary" className="mr-1">
                  2
                </Badge>
                Formulas —{" "}
                {(ctx.formulas?.length ?? 0) > 0
                  ? `${ctx.formulas!.length} textbook formula${ctx.formulas!.length === 1 ? "" : "s"}`
                  : "Formulas for this method"}
              </li>
              <li>
                <Badge variant="secondary" className="mr-1">
                  3
                </Badge>
                Work done —{" "}
                {result.steps.length
                  ? `${result.steps.length} step${result.steps.length === 1 ? "" : "s"} shown`
                  : "Computation path for this run"}
              </li>
              <li>
                <Badge variant="secondary" className="mr-1">
                  4
                </Badge>
                Results — {result.fields.length} final statistic
                {result.fields.length === 1 ? "" : "s"} + citation
              </li>
            </ol>
          </AlertDescription>
        </Alert>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <ExportButton
            busy={busy === "pdf"}
            onClick={() =>
              runAction("pdf", "Print dialog opened — choose Save as PDF for a branded PDF", exportPdf)
            }
          >
            Save PDF
          </ExportButton>
          <ExportButton
            busy={busy === "word"}
            onClick={() =>
              runAction("word", "Word file downloaded (.rtf — opens in Microsoft Word)", () =>
                downloadRtf(`${baseName}-report.rtf`, buildRtfReport(ctx, style)),
              )
            }
          >
            Word (.rtf)
          </ExportButton>
          <ExportButton
            busy={busy === "csv"}
            onClick={() =>
              runAction("csv", "CSV downloaded (.csv — opens in Excel)", () =>
                downloadCsv(`${baseName}-results.csv`, report.csv),
              )
            }
          >
            Excel CSV
          </ExportButton>
          <ExportButton
            busy={busy === "txt"}
            onClick={() =>
              runAction("txt", "Text report downloaded (.txt)", () =>
                downloadTxt(`${baseName}-report.txt`, report.breakdown),
              )
            }
          >
            Text (.txt)
          </ExportButton>
        </div>
        <p className="text-xs text-muted-foreground">
          Files save with clear extensions: <strong>.pdf</strong> (via print), <strong>.rtf</strong> for
          Word, <strong>.csv</strong> for Excel/Sheets, and <strong>.txt</strong> for any device.
        </p>

        <Accordion>
          <AccordionItem value="preview">
            <AccordionTrigger>Preview breakdown (same structure as the PDF)</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-4 py-2 text-sm">
                <section className="flex flex-col gap-1">
                  <h4 className="text-xs font-semibold tracking-wide text-primary uppercase">
                    1. Inputs
                  </h4>
                  {inputPreview.length ? (
                    <ul className="flex flex-col gap-1 text-muted-foreground">
                      {inputPreview.map((row) => (
                        <li key={row.label}>
                          <span className="font-medium text-foreground">{row.label}:</span>{" "}
                          <span className="font-mono text-xs">{row.value}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No inputs recorded.</p>
                  )}
                </section>
                <section className="flex flex-col gap-1">
                  <h4 className="text-xs font-semibold tracking-wide text-primary uppercase">
                    2. Formulas applied
                  </h4>
                  <ul className="flex flex-col gap-2">
                    {(ctx.formulas ?? []).slice(0, 6).map((f) => (
                      <li key={f.label + f.latex}>
                        <p className="font-medium text-foreground">{f.label}</p>
                        <p className="font-mono text-xs text-muted-foreground">{f.latex}</p>
                      </li>
                    ))}
                  </ul>
                </section>
                <section className="flex flex-col gap-1">
                  <h4 className="text-xs font-semibold tracking-wide text-primary uppercase">
                    3. Work done
                  </h4>
                  <ol className="list-decimal pl-5 text-muted-foreground">
                    {result.steps.map((s) => (
                      <li key={s.title}>
                        <span className="font-medium text-foreground">{s.title}</span> — {s.detail}
                      </li>
                    ))}
                  </ol>
                </section>
                <section className="flex flex-col gap-1">
                  <h4 className="text-xs font-semibold tracking-wide text-primary uppercase">
                    4. End results
                  </h4>
                  <ul className="flex flex-col gap-1 text-muted-foreground">
                    {result.fields.map((f) => (
                      <li key={f.label}>
                        <span className="font-medium text-foreground">{f.label}:</span>{" "}
                        <span className="font-mono text-xs">{f.value}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="assumptions">
            <AccordionTrigger>Assumptions checklist</AccordionTrigger>
            <AccordionContent>
              <ul className="flex list-disc flex-col gap-1 py-2 pl-5 text-sm text-muted-foreground">
                {report.assumptions.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex flex-col gap-3">
          <Block label="Citation">{report.citation}</Block>
          <Block label="Methods + Results write-up">{report.writeUp}</Block>
        </div>

        <div className="flex flex-wrap gap-2">
          <CopyButton
            busy={busy === "cite"}
            onClick={() => runAction("cite", "Citation copied", () => copyText(report.citation))}
          >
            Copy citation
          </CopyButton>
          <CopyButton
            busy={busy === "write"}
            onClick={() => runAction("write", "Write-up copied", () => copyText(report.writeUp))}
          >
            Copy write-up
          </CopyButton>
          <CopyButton
            busy={busy === "full"}
            onClick={() =>
              runAction("full", "Full breakdown copied", () => copyText(report.breakdown))
            }
          >
            Copy full breakdown
          </CopyButton>
          <CopyButton
            busy={busy === "latex"}
            onClick={() => runAction("latex", "LaTeX copied", () => copyText(report.latex))}
          >
            Copy LaTeX
          </CopyButton>
          <CopyButton
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
          </CopyButton>
        </div>

        {status ? (
          <Alert role="status">
            <AlertTitle>Status</AlertTitle>
            <AlertDescription>{status}</AlertDescription>
          </Alert>
        ) : null}
      </CardContent>
    </Card>
  );
}

function Block({ label, children }: { label: string; children: string }) {
  return (
    <div className="rounded-xl bg-muted px-3 py-3">
      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{label}</p>
      <p className="mt-1 text-sm leading-relaxed text-foreground">{children}</p>
    </div>
  );
}

function ExportButton({
  children,
  onClick,
  busy,
}: {
  children: React.ReactNode;
  onClick: () => void;
  busy?: boolean;
}) {
  return (
    <Button type="button" size="lg" className="min-h-11" onClick={onClick} disabled={busy}>
      {busy ? <Spinner data-icon="inline-start" /> : null}
      {busy ? "Working…" : children}
    </Button>
  );
}

function CopyButton({
  children,
  onClick,
  busy,
}: {
  children: React.ReactNode;
  onClick: () => void;
  busy?: boolean;
}) {
  return (
    <Button type="button" variant="outline" size="sm" onClick={onClick} disabled={busy}>
      {busy ? "…" : children}
    </Button>
  );
}

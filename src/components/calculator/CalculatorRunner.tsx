"use client";

import { useId, useState, useTransition } from "react";
import dynamic from "next/dynamic";
import type { CalculatorDef } from "@/lib/calculators/types";
import type { FieldDef } from "@/lib/calculators/fields";
import type { CalcResult } from "@/lib/stats/format";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";

const ResultsReport = dynamic(
  () => import("@/components/calculator/ResultsReport").then((m) => m.ResultsReport),
  { ssr: false, loading: () => null },
);

const ChartPreview = dynamic(
  () => import("@/components/calculator/ChartPreview").then((m) => m.ChartPreview),
  { ssr: false, loading: () => null },
);

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

function initialValues(fields: FieldDef[]) {
  const init: Record<string, string> = {};
  for (const f of fields) if (f.defaultValue != null) init[f.name] = f.defaultValue;
  return init;
}

export function CalculatorRunner({
  calculator,
  fields,
}: {
  calculator: CalculatorDef;
  fields: FieldDef[];
}) {
  const formId = useId();
  const [values, setValues] = useState<Record<string, string>>(() => initialValues(fields));
  const [result, setResult] = useState<CalcResult | null>(null);
  const [pending, startTransition] = useTransition();

  async function onRun(e: React.FormEvent) {
    e.preventDefault();
    const { runEngine } = await import("@/lib/calculators/runEngine");
    const next = runEngine(calculator.engine, values);
    startTransition(() => {
      setResult(next);
    });
    if (window.matchMedia("(max-width: 1023px)").matches) {
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
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="font-display text-lg sm:text-xl">Calculator</CardTitle>
          <CardDescription>
            Accepts commas, spaces, or new lines — paste from spreadsheets works. Use Sample vs
            Population when shown so SD / variance match your design.
          </CardDescription>
          <CardAction>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" onClick={onLoadSample}>
                Sample data
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={onClear}>
                Clear
              </Button>
            </div>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={onRun} className="flex flex-col gap-4 pt-1">
            {fields.length === 0 ? (
              <Empty className="border border-dashed py-8">
                <EmptyHeader>
                  <EmptyTitle>No inputs required</EmptyTitle>
                  <EmptyDescription>Run the calculator to see guidance.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <FieldGroup>
                {fields.map((f) => {
                  const id = `${formId}-${f.name}`;
                  return (
                    <Field key={f.name}>
                      <FieldLabel htmlFor={id}>{f.label}</FieldLabel>
                      {f.type === "textarea" ? (
                        <Textarea
                          id={id}
                          className="min-h-28 font-mono"
                          placeholder={f.placeholder}
                          value={values[f.name] ?? ""}
                          onChange={(e) =>
                            setValues((v) => ({ ...v, [f.name]: e.target.value }))
                          }
                          autoComplete="off"
                        />
                      ) : f.type === "select" ? (
                        <NativeSelect
                          id={id}
                          className="w-full"
                          value={values[f.name] ?? f.defaultValue ?? ""}
                          onChange={(e) =>
                            setValues((v) => ({ ...v, [f.name]: e.target.value }))
                          }
                        >
                          {f.options?.map((o) => (
                            <NativeSelectOption key={o.value} value={o.value}>
                              {o.label}
                            </NativeSelectOption>
                          ))}
                        </NativeSelect>
                      ) : (
                        <Input
                          id={id}
                          type={f.type === "number" ? "number" : "text"}
                          inputMode={f.type === "number" ? "decimal" : "text"}
                          step="any"
                          className="min-h-11 sm:min-h-0"
                          placeholder={f.placeholder}
                          value={values[f.name] ?? ""}
                          onChange={(e) =>
                            setValues((v) => ({ ...v, [f.name]: e.target.value }))
                          }
                          autoComplete="off"
                        />
                      )}
                    </Field>
                  );
                })}
              </FieldGroup>
            )}
            <div className="sticky bottom-3 z-10 -mx-1 bg-gradient-to-t from-card via-card/90 to-transparent pt-3 sm:static sm:mx-0 sm:bg-none sm:pt-0">
              <Button type="submit" size="lg" className="min-h-12 w-full sm:w-auto" disabled={pending}>
                {pending ? <Spinner data-icon="inline-start" /> : null}
                {pending ? "Calculating…" : "Calculate"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div id="results" className="flex scroll-mt-24 flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg sm:text-xl">Results</CardTitle>
          </CardHeader>
          <CardContent>
            {!result && (
              <Empty className="py-6">
                <EmptyHeader>
                  <EmptyTitle>Waiting for a run</EmptyTitle>
                  <EmptyDescription>
                    Results appear here after you run the calculator.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
            {result?.error && (
              <Alert variant="destructive">
                <AlertTitle>Could not calculate</AlertTitle>
                <AlertDescription>{result.error}</AlertDescription>
              </Alert>
            )}
            {result && !result.error && (
              <div className="flex flex-col gap-1">
                {result.fields.map((f) => (
                  <div
                    key={f.label}
                    className="flex flex-col gap-1 border-b border-border py-2.5 text-sm last:border-b-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
                  >
                    <dt className="shrink-0 text-muted-foreground">{f.label}</dt>
                    <dd className="break-all font-mono font-medium text-foreground sm:max-w-[60%] sm:text-right">
                      {f.value}
                    </dd>
                  </div>
                ))}
              </div>
            )}
            {result?.apa && (
              <Alert className="mt-4">
                <AlertTitle>APA-style</AlertTitle>
                <AlertDescription>{result.apa}</AlertDescription>
              </Alert>
            )}
            {result && !result.error && (
              <p className="mt-4 text-sm text-muted-foreground">
                Need a complete write-up?{" "}
                <a href="#exports" className="font-semibold text-primary hover:underline">
                  Download a branded PDF
                </a>{" "}
                with inputs, formulas, worked steps, and final results.
              </p>
            )}
          </CardContent>
        </Card>

        {result && !result.error && result.steps.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">Step-by-step (show work)</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="flex flex-col gap-3">
                {result.steps.map((s, i) => (
                  <li key={s.title} className="flex flex-col gap-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{i + 1}</Badge>
                      <p className="font-medium text-foreground">{s.title}</p>
                    </div>
                    <p className="text-muted-foreground">{s.detail}</p>
                    {i < result.steps.length - 1 ? <Separator className="mt-2" /> : null}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        )}

        {result && !result.error && (
          <ResultsReport calculator={calculator} result={result} values={values} fields={fields} />
        )}

        {calculator.engine.startsWith("chart-") && (
          <ChartPreview engine={calculator.engine} values={values} result={result} />
        )}
      </div>
    </div>
  );
}

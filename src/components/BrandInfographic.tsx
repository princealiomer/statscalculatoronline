import Link from "next/link";
import { calculators, categories } from "@/lib/calculators/registry";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const nodes = [
  { label: "Paste data", detail: "Lists, tables, or summaries", href: "/calculators/descriptive-statistics" },
  { label: "Pick a method", detail: "Tests, models, or math tools", href: "/calculators/hypothesis-testing" },
  { label: "See formulas & steps", detail: "Textbook formulas + show-work", href: "/calculators" },
  {
    label: "Export branded PDF",
    detail: "Inputs · formulas · steps · results",
    href: "/calculators",
  },
];

export function BrandInfographic() {
  const calcCount = calculators.length;
  const catCount = categories.length;

  return (
    <aside aria-label="How Stats Calculator Online works">
      <Card className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-primary" />
        <CardHeader>
          <Badge variant="secondary">Stats Calculator Online workflow</Badge>
          <CardTitle className="font-display text-xl leading-snug sm:text-2xl">
            From raw numbers to a report you can cite
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-3">
            <StatChip value={`${calcCount}+`} label="Working calculators" />
            <StatChip value={`${catCount}`} label="Topic categories" />
            <StatChip value="APA" label="Free write-ups" />
            <StatChip value="PDF" label="Full breakdown exports" />
          </div>

          <ol className="relative flex flex-col">
            {nodes.map((n, i) => (
              <li key={n.label} className="relative flex gap-3 pb-5 last:pb-0">
                {i < nodes.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute top-8 left-[15px] h-[calc(100%-1.25rem)] w-px bg-border"
                  />
                )}
                <span className="relative z-[1] flex size-8 shrink-0 items-center justify-center rounded-lg bg-foreground text-xs font-bold text-background">
                  {i + 1}
                </span>
                <Link href={n.href} className="group min-w-0 pt-0.5">
                  <span className="block text-sm font-semibold text-foreground group-hover:text-primary">
                    {n.label}
                  </span>
                  <span className="block text-xs leading-relaxed text-muted-foreground">
                    {n.detail}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
          <Separator />
        </CardContent>
      </Card>
    </aside>
  );
}

function StatChip({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-border bg-muted px-3 py-3">
      <p className="font-display text-xl font-semibold text-foreground sm:text-2xl">{value}</p>
      <p className="mt-0.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
    </div>
  );
}

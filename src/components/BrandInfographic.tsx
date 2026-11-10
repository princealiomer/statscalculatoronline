import Link from "next/link";
import { calculators, categories } from "@/lib/calculators/registry";

const nodes = [
  { label: "Paste data", detail: "Lists, tables, or summaries", href: "/calculators/descriptive-statistics" },
  { label: "Pick a method", detail: "Tests, models, or math tools", href: "/calculators/hypothesis-testing" },
  { label: "See formulas", detail: "KaTeX equations + assumptions", href: "/calculators" },
  { label: "Export free", detail: "APA · PDF · Word · CSV", href: "/resources" },
];

export function BrandInfographic() {
  const calcCount = calculators.length;
  const catCount = categories.length;

  return (
    <aside
      aria-label="How Stats Calculator Online works"
      className="relative overflow-hidden rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-panel)] p-5 shadow-[var(--brand-shadow)] sm:p-6"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[var(--brand-accent)]"
      />

      <div className="relative">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-accent)]">
          Stats Calculator Online workflow
        </p>
        <h2 className="mt-2 font-display text-xl leading-snug text-[var(--brand-ink)] sm:text-2xl">
          From raw numbers to a report you can cite
        </h2>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <StatChip value={`${calcCount}+`} label="Working calculators" />
          <StatChip value={`${catCount}`} label="Topic categories" />
          <StatChip value="APA" label="Free write-ups" />
          <StatChip value="PDF" label="Word · CSV exports" />
        </div>

        <ol className="relative mt-6 space-y-0">
          {nodes.map((n, i) => (
            <li key={n.label} className="relative flex gap-3 pb-5 last:pb-0">
              {i < nodes.length - 1 && (
                <span
                  aria-hidden
                  className="absolute left-[15px] top-8 h-[calc(100%-1.25rem)] w-px bg-[var(--brand-grey-deep)]"
                />
              )}
              <span className="relative z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-ink)] text-xs font-bold text-white">
                {i + 1}
              </span>
              <Link href={n.href} className="group min-w-0 pt-0.5">
                <span className="block text-sm font-semibold text-[var(--brand-ink)] group-hover:text-[var(--brand-accent)]">
                  {n.label}
                </span>
                <span className="block text-xs leading-relaxed text-[var(--brand-ink-soft)]">
                  {n.detail}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </aside>
  );
}

function StatChip({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-[var(--brand-border)] bg-[var(--brand-paper)] px-3 py-3">
      <p className="font-display text-xl font-semibold text-[var(--brand-ink)] sm:text-2xl">{value}</p>
      <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-[var(--brand-ink-soft)]">
        {label}
      </p>
    </div>
  );
}

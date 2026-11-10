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
      className="relative overflow-hidden rounded-3xl border border-[var(--brand-ink)]/10 bg-[var(--brand-panel)] p-5 shadow-[0_20px_50px_-28px_rgba(10,37,64,0.45)] sm:p-6"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 18%, rgba(232,168,56,0.22), transparent 42%), radial-gradient(circle at 88% 8%, rgba(26,122,109,0.2), transparent 40%), linear-gradient(135deg, rgba(10,37,64,0.04), transparent 50%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230a2540' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-accent)]">
          Stats Calculator Online workflow
        </p>
        <h2 className="mt-2 font-display text-xl leading-snug text-[var(--brand-ink)] sm:text-2xl">
          From raw numbers to a report you can cite
        </h2>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4">
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
                  className="absolute left-[15px] top-8 h-[calc(100%-1.25rem)] w-px bg-[var(--brand-accent)]/25"
                />
              )}
              <span className="relative z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand-ink)] text-xs font-bold text-[var(--brand-amber)]">
                {i + 1}
              </span>
              <Link href={n.href} className="min-w-0 pt-0.5 group">
                <span className="block text-sm font-semibold text-[var(--brand-ink)] group-hover:text-[var(--brand-accent)]">
                  {n.label}
                </span>
                <span className="block text-xs leading-relaxed text-[var(--brand-ink)]/65">
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
    <div className="rounded-2xl border border-[var(--brand-ink)]/8 bg-white/70 px-3 py-3 backdrop-blur-sm">
      <p className="font-display text-xl font-semibold text-[var(--brand-ink)] sm:text-2xl">{value}</p>
      <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-[var(--brand-ink)]/55">
        {label}
      </p>
    </div>
  );
}

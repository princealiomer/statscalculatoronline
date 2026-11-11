import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Statistical Resources",
  description:
    "Critical value tables plus free branded PDF reports (inputs, formulas, steps, results) on Stats Calculator Online.",
};

const tables = [
  { href: "/resources/statistical-tables/z-table", title: "Z-Table", desc: "Standard normal critical values" },
  { href: "/resources/statistical-tables/t-table", title: "t-Table", desc: "Student t critical values" },
  { href: "/resources/statistical-tables/chi-square-table", title: "Chi-Square Table", desc: "χ² critical values" },
  { href: "/resources/statistical-tables/f-table", title: "F-Table", desc: "F critical values" },
];

export default function ResourcesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-4xl text-[var(--brand-ink)]">Resources</h1>
      <p className="mt-2 text-[var(--brand-ink-soft)]">
        Distribution tables and reference tools for classroom and research work.
      </p>

      <aside className="mt-8 rounded-2xl border border-[var(--brand-accent)]/25 bg-[var(--brand-paper)] p-5">
        <h2 className="font-display text-xl text-[var(--brand-ink)]">Free branded PDF reports</h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--brand-ink-soft)]">
          Every calculator on Stats Calculator Online can export a PDF (and Word / CSV) that shows the
          complete breakdown: what you entered, which formulas were applied, the worked steps, and the
          end results — with our branding so you can attach it to homework or drafts.
        </p>
        <Link
          href="/calculators"
          className="mt-3 inline-flex min-h-10 items-center text-sm font-semibold text-[var(--brand-accent)] hover:underline"
        >
          Open a calculator and export →
        </Link>
      </aside>

      <h2 className="mt-10 font-display text-2xl text-[var(--brand-ink)]">Statistical tables</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {tables.map((t) => (
          <li key={t.href}>
            <Link
              href={t.href}
              className="block rounded-xl border border-[var(--brand-border)] bg-[var(--brand-panel)] px-4 py-3 shadow-[var(--brand-shadow)] hover:border-[var(--brand-accent)]/35"
            >
              <span className="font-medium text-[var(--brand-ink)]">{t.title}</span>
              <span className="mt-1 block text-sm text-[var(--brand-ink-soft)]">{t.desc}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

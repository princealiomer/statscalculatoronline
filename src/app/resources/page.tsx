import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Statistical Resources",
  description: "Critical value tables and data tools to support StatsCalc calculators.",
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
      <h1 className="font-display text-4xl text-teal-950">Resources</h1>
      <p className="mt-2 text-teal-900/70">
        Distribution tables and reference tools for classroom and research work.
      </p>
      <h2 className="mt-10 font-display text-2xl text-teal-950">Statistical tables</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {tables.map((t) => (
          <li key={t.href}>
            <Link
              href={t.href}
              className="block rounded-xl border border-teal-900/10 bg-white/65 px-4 py-3 hover:border-teal-700/30"
            >
              <span className="font-medium text-teal-950">{t.title}</span>
              <span className="mt-1 block text-sm text-teal-900/65">{t.desc}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

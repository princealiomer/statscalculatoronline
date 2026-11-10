import Link from "next/link";
import type { CalculatorDef } from "@/lib/calculators/types";
import { calcHref } from "@/lib/calculators/related";
import { getCategory } from "@/lib/calculators/registry";

export function SimilarCalculatorsWidget({
  items,
  title = "Similar calculators",
  subtitle = "Try a related tool on Stats Calculator Online",
}: {
  items: CalculatorDef[];
  title?: string;
  subtitle?: string;
}) {
  if (items.length === 0) return null;

  return (
    <section
      aria-labelledby="similar-calculators-heading"
      className="rounded-2xl border border-[var(--brand-ink)]/10 bg-white/80 p-4 shadow-sm sm:p-5"
    >
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2
            id="similar-calculators-heading"
            className="font-display text-lg text-[var(--brand-ink)] sm:text-xl"
          >
            {title}
          </h2>
          <p className="mt-1 text-sm text-[var(--brand-ink)]/60">{subtitle}</p>
        </div>
        <Link
          href="/calculators"
          className="text-xs font-semibold text-[var(--brand-accent)] hover:underline"
        >
          All calculators →
        </Link>
      </div>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {items.map((c) => {
          const cat = getCategory(c.category);
          return (
            <li key={c.slug}>
              <Link
                href={calcHref(c)}
                className="group flex min-h-[3.5rem] flex-col justify-center rounded-xl border border-[var(--brand-ink)]/8 bg-[var(--brand-paper)]/70 px-3.5 py-3 transition hover:border-[var(--brand-accent)]/35 hover:bg-white"
              >
                <span className="text-sm font-semibold text-[var(--brand-ink)] group-hover:text-[var(--brand-accent)]">
                  {c.title} Calculator
                </span>
                <span className="mt-0.5 line-clamp-2 text-xs leading-snug text-[var(--brand-ink)]/60">
                  {cat ? `${cat.name} · ` : ""}
                  {c.description}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

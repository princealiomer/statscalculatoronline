import Link from "next/link";
import type { Tidbit } from "@/lib/content/tidbits";

export function TidbitsWidget({
  items,
  title = "Tidbits from Stats Calculator Online",
}: {
  items: Tidbit[];
  title?: string;
}) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="tidbits-heading" className="space-y-3">
      <h2 id="tidbits-heading" className="font-display text-lg text-[var(--brand-ink)] sm:text-xl">
        {title}
      </h2>
      <ul className="grid gap-3 md:grid-cols-3">
        {items.map((t) => (
          <li
            key={t.id}
            className="rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-panel)] p-4 shadow-[var(--brand-shadow)]"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-amber-ink)]">
              {t.eyebrow}
            </p>
            <p className="mt-1.5 text-sm font-semibold leading-snug text-[var(--brand-ink)]">
              {t.title}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-[var(--brand-ink)]/70">{t.body}</p>
            {t.href && (
              <Link
                href={t.href}
                className="mt-3 inline-flex text-xs font-semibold text-[var(--brand-accent)] hover:underline"
              >
                {t.hrefLabel ?? "Learn more"} →
              </Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

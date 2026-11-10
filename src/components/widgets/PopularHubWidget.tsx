import Link from "next/link";
import { getHubCategories, getPopularCalculators, calcHref } from "@/lib/calculators/related";
import { calculators } from "@/lib/calculators/registry";
import { resourceLinks } from "@/config/nav";

export function PopularHubWidget() {
  const popular = getPopularCalculators(6);
  const hubs = getHubCategories(8);

  return (
    <section
      aria-labelledby="explore-hub-heading"
      className="rounded-2xl border border-black/15 bg-[#161b27] p-4 text-white sm:p-5"
    >
      <h2 id="explore-hub-heading" className="font-display text-lg sm:text-xl">
        Explore Stats Calculator Online
      </h2>
      <p className="mt-1 text-sm text-white/65">
        Deep links to popular tools, topic hubs, and critical-value tables.
      </p>

      <div className="mt-5 grid gap-6 lg:grid-cols-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-amber)]">
            Popular calculators
          </p>
          <ul className="mt-2 space-y-1.5">
            {popular.map((c) => (
              <li key={c.slug}>
                <Link
                  href={calcHref(c)}
                  className="text-sm text-white/85 hover:text-[var(--brand-amber)] hover:underline"
                >
                  {c.title} Calculator
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-amber)]">
            Topic hubs
          </p>
          <ul className="mt-2 space-y-1.5">
            {hubs.map((c) => {
              const n = calculators.filter((x) => x.category === c.id).length;
              return (
                <li key={c.id}>
                  <Link
                    href={`/calculators/${c.id}`}
                    className="text-sm text-white/85 hover:text-[var(--brand-amber)] hover:underline"
                  >
                    {c.name}
                    <span className="ml-1 text-white/40">({n})</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-amber)]">
            Resources
          </p>
          <ul className="mt-2 space-y-1.5">
            {resourceLinks.map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className="text-sm text-white/85 hover:text-[var(--brand-amber)] hover:underline"
                >
                  {r.title}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/calculators"
              className="inline-flex min-h-10 items-center rounded-full bg-[var(--brand-amber)] px-4 text-sm font-semibold text-[var(--brand-ink)]"
            >
              Browse full catalog
            </Link>
            <Link
              href="/sitemap"
              className="inline-flex min-h-10 items-center rounded-full border border-white/25 px-4 text-sm font-semibold text-white hover:bg-white/10"
            >
              HTML Sitemap
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

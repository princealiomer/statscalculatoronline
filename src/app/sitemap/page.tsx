import Link from "next/link";
import type { Metadata } from "next";
import { apHub, calculators, categories, getByCategory } from "@/lib/calculators/registry";
import { navGroups, categoriesInGroup, resourceLinks } from "@/config/nav";
import { siteConfig } from "@/config/site";

import { buildPageMetadata } from "@/lib/seo/meta";

export const metadata: Metadata = buildPageMetadata({
  title: "HTML Sitemap",
  description: `Complete HTML sitemap for Stats Calculator Online with every calculator and resource linked. ${calculators.length}+ tools listed.`,
  path: "/sitemap",
  keywords: [
    "Stats Calculator Online sitemap",
    "all statistics calculators",
    "calculator directory",
    siteConfig.domain,
  ],
});

const staticPages = [
  { href: "/", title: "Home" },
  { href: "/calculators", title: "All Calculators" },
  { href: "/resources", title: "Resources" },
  { href: "/about", title: "About Stats Calculator Online" },
  { href: "/contact", title: "Contact" },
  { href: "/privacy", title: "Privacy Policy" },
  { href: "/terms", title: "Terms of Use" },
  { href: "/accessibility", title: "Accessibility" },
  { href: "/llms.txt", title: "llms.txt" },
  { href: "/sitemap.xml", title: "XML Sitemap" },
] as const;

export default function HtmlSitemapPage() {
  const groupedIds = new Set(navGroups.flatMap((g) => g.categoryIds));
  const ungrouped = categories.filter((c) => !groupedIds.has(c.id));

  return (
    <div className="mx-auto max-w-6xl px-3 py-8 sm:px-4 sm:py-10">
      <nav className="text-xs text-[var(--brand-ink)]/55 sm:text-sm" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-[var(--brand-accent)]">
          Home
        </Link>
        <span aria-hidden> / </span>
        <span className="text-[var(--brand-ink)]">Sitemap</span>
      </nav>

      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--brand-accent)]">
        Stats Calculator Online
      </p>
      <h1 className="mt-2 font-display text-3xl leading-tight text-[var(--brand-ink)] sm:text-4xl">
        HTML Sitemap — all calculators
      </h1>
      <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-[var(--brand-ink)]/70 sm:text-base">
        Every public page on Stats Calculator Online in one place. Jump to a category, open any
        calculator, or use the{" "}
        <Link href="/sitemap.xml" className="font-semibold text-[var(--brand-accent)] hover:underline">
          XML sitemap
        </Link>{" "}
        for crawlers. Catalog size: <strong>{calculators.length}</strong> calculators across{" "}
        <strong>{categories.length}</strong> categories.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <a
          href="#categories"
          className="inline-flex min-h-9 items-center rounded-full bg-[var(--brand-accent)] px-3.5 text-xs font-semibold text-white"
        >
          Categories
        </a>
        <a
          href="#all-calculators"
          className="inline-flex min-h-9 items-center rounded-full border border-[var(--brand-ink)]/15 bg-white px-3.5 text-xs font-semibold text-[var(--brand-ink)]"
        >
          All calculators A–Z sections
        </a>
        <a
          href="#resources"
          className="inline-flex min-h-9 items-center rounded-full border border-[var(--brand-ink)]/15 bg-white px-3.5 text-xs font-semibold text-[var(--brand-ink)]"
        >
          Resources
        </a>
        <a
          href="#site-pages"
          className="inline-flex min-h-9 items-center rounded-full border border-[var(--brand-ink)]/15 bg-white px-3.5 text-xs font-semibold text-[var(--brand-ink)]"
        >
          Site pages
        </a>
      </div>

      <section id="categories" className="mt-10 scroll-mt-24">
        <h2 className="font-display text-2xl text-[var(--brand-ink)]">Jump to a category</h2>
        <p className="mt-1 text-sm text-[var(--brand-ink)]/60">
          Category hub pages list every tool in that topic.
        </p>
        <ul className="mt-4 columns-1 gap-x-8 sm:columns-2 lg:columns-3">
          {categories.map((c) => {
            const count = getByCategory(c.id).length;
            return (
              <li key={c.id} className="mb-2 break-inside-avoid">
                <a
                  href={`#cat-${c.id}`}
                  className="text-sm font-medium text-[var(--brand-accent)] hover:underline"
                >
                  {c.name}
                </a>
                <span className="ml-1 text-xs text-[var(--brand-ink)]/40">({count})</span>
                <span className="mx-1 text-[var(--brand-ink)]/25">·</span>
                <Link
                  href={`/calculators/${c.id}`}
                  className="text-xs text-[var(--brand-ink)]/55 hover:text-[var(--brand-ink)]"
                >
                  hub
                </Link>
              </li>
            );
          })}
          <li className="mb-2 break-inside-avoid">
            <Link
              href={`/calculators/${apHub.category}`}
              className="text-sm font-medium text-[var(--brand-accent)] hover:underline"
            >
              {apHub.title}
            </Link>
          </li>
        </ul>
      </section>

      <section id="all-calculators" className="mt-12 scroll-mt-24 space-y-10">
        <div>
          <h2 className="font-display text-2xl text-[var(--brand-ink)]">
            All calculators by category
          </h2>
          <p className="mt-1 text-sm text-[var(--brand-ink)]/60">
            Direct links to every calculator page on Stats Calculator Online.
          </p>
        </div>

        {navGroups.map((group) => {
          const cats = categoriesInGroup(group);
          return (
            <div key={group.id}>
              <h3 className="font-display text-xl text-[var(--brand-ink)]">{group.title}</h3>
              <p className="mt-1 text-sm text-[var(--brand-ink)]/55">{group.blurb}</p>
              <div className="mt-5 space-y-8">
                {cats.map((cat) => (
                  <CategoryBlock key={cat.id} categoryId={cat.id} name={cat.name} />
                ))}
              </div>
            </div>
          );
        })}

        {ungrouped.length > 0 && (
          <div>
            <h3 className="font-display text-xl text-[var(--brand-ink)]">More categories</h3>
            <div className="mt-5 space-y-8">
              {ungrouped.map((cat) => (
                <CategoryBlock key={cat.id} categoryId={cat.id} name={cat.name} />
              ))}
            </div>
          </div>
        )}
      </section>

      <section id="resources" className="mt-12 scroll-mt-24">
        <h2 className="font-display text-2xl text-[var(--brand-ink)]">Resources</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {resourceLinks.map((r) => (
            <li key={r.href}>
              <Link
                href={r.href}
                className="block rounded-xl border border-[var(--brand-ink)]/10 bg-white/70 px-4 py-3 text-sm font-medium text-[var(--brand-ink)] hover:border-[var(--brand-accent)]/30"
              >
                {r.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section id="site-pages" className="mt-12 scroll-mt-24 pb-6">
        <h2 className="font-display text-2xl text-[var(--brand-ink)]">Site pages</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {staticPages.map((p) => (
            <li key={p.href}>
              <Link
                href={p.href}
                className="block rounded-xl border border-[var(--brand-ink)]/10 bg-white/70 px-4 py-3 text-sm font-medium text-[var(--brand-ink)] hover:border-[var(--brand-accent)]/30"
              >
                {p.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function CategoryBlock({ categoryId, name }: { categoryId: string; name: string }) {
  const items = getByCategory(categoryId);
  if (items.length === 0) return null;

  return (
    <section id={`cat-${categoryId}`} className="scroll-mt-24 rounded-2xl border border-[var(--brand-ink)]/10 bg-white/60 p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h4 className="font-display text-lg text-[var(--brand-ink)]">{name}</h4>
        <Link
          href={`/calculators/${categoryId}`}
          className="text-xs font-semibold text-[var(--brand-accent)] hover:underline"
        >
          Open {name} hub →
        </Link>
      </div>
      <ul className="mt-3 columns-1 gap-x-6 sm:columns-2">
        {items.map((c) => (
          <li key={c.slug} className="mb-1.5 break-inside-avoid">
            <Link
              href={`/calculators/${c.category}/${c.slug}`}
              className="text-sm text-[var(--brand-ink)]/85 hover:text-[var(--brand-accent)] hover:underline"
            >
              {c.title} Calculator
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

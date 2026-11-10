import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  apHub,
  categories,
  getByCategory,
  getCategory,
  calculators,
} from "@/lib/calculators/registry";
import { SimilarCalculatorsWidget } from "@/components/widgets/SimilarCalculatorsWidget";
import { TidbitsWidget } from "@/components/widgets/TidbitsWidget";
import { tidbitsForPath } from "@/lib/content/tidbits";
import { siteConfig } from "@/config/site";
import { getPopularCalculators } from "@/lib/calculators/related";

export function generateStaticParams() {
  return [
    ...categories.map((c) => ({ category: c.id })),
    { category: apHub.category },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  if (category === apHub.category) {
    const title = `${apHub.title} — Free Online Tools`;
    const description = `${apHub.description} On Stats Calculator Online with formulas, steps, and free exports.`;
    return {
      title,
      description,
      alternates: { canonical: `/calculators/${category}` },
      openGraph: { title, description, url: `/calculators/${category}` },
    };
  }
  const cat = getCategory(category);
  if (!cat) return {};
  const title = `${cat.name} Calculators — Free Online Tools`;
  const description = `${cat.description} Browse free ${cat.name.toLowerCase()} calculators on Stats Calculator Online with formulas, similar-tool widgets, and free report exports.`;
  return {
    title,
    description,
    keywords: [cat.name, `${cat.name} calculator`, "Stats Calculator Online", siteConfig.domain],
    alternates: { canonical: `/calculators/${category}` },
    openGraph: { title, description, url: `/calculators/${category}` },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  if (category === apHub.category) {
    const apSlugs = [
      "mean-median-mode-calculator",
      "one-sample-t-test-calculator",
      "two-sample-t-test-calculator",
      "chi-square-test-of-independence-calculator",
      "normal-distribution-calculator",
      "simple-linear-regression-calculator",
      "binomial-distribution-calculator",
      "mean-calculator",
    ];
    const list = apSlugs
      .map((slug) => calculators.find((c) => c.slug === slug))
      .filter(Boolean);
    return (
      <CategoryView
        categoryId={category}
        title={apHub.title}
        description={apHub.description}
        items={list as typeof calculators}
      />
    );
  }

  const cat = getCategory(category);
  if (!cat) notFound();
  const items = getByCategory(category);
  return (
    <CategoryView
      categoryId={category}
      title={cat.name}
      description={cat.description}
      items={items}
    />
  );
}

function CategoryView({
  categoryId,
  title,
  description,
  items,
}: {
  categoryId: string;
  title: string;
  description: string;
  items: typeof calculators;
}) {
  const heading = /calculators?$/i.test(title) ? title : `${title} Calculators`;
  const tips = tidbitsForPath(categoryId, 3);
  const more = getPopularCalculators(6).filter((c) => c.category !== categoryId);

  return (
    <div className="mx-auto max-w-6xl px-3 py-8 sm:px-4 sm:py-10">
      <nav className="text-xs text-[var(--brand-ink)]/55 sm:text-sm" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-[var(--brand-accent)]">
          Home
        </Link>
        <span aria-hidden> / </span>
        <Link href="/calculators" className="hover:text-[var(--brand-accent)]">
          Calculators
        </Link>
        <span aria-hidden> / </span>
        <span className="text-[var(--brand-ink)]">{title}</span>
      </nav>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--brand-accent)]">
        Stats Calculator Online
      </p>
      <h1 className="mt-2 font-display text-3xl leading-tight text-[var(--brand-ink)] sm:text-4xl">
        {heading}
      </h1>
      <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[var(--brand-ink)]/70 sm:text-base">
        {description} Free tools on Stats Calculator Online with formulas, how-to steps, similar
        calculator widgets, tidbits, and exportable reports.
      </p>
      <ul className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2">
        {items.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/calculators/${c.category}/${c.slug}`}
              className="block min-h-[3.25rem] rounded-xl border border-[var(--brand-ink)]/10 bg-white/65 px-4 py-3 hover:border-[var(--brand-accent)]/30"
            >
              <span className="font-medium text-[var(--brand-ink)]">{c.title} Calculator</span>
              <span className="mt-1 block text-sm leading-snug text-[var(--brand-ink)]/65">
                {c.description}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-10 space-y-8">
        <TidbitsWidget items={tips} />
        <SimilarCalculatorsWidget
          items={more}
          title="Users also open these calculators"
          subtitle="Cross-topic picks from Stats Calculator Online"
        />
      </div>
    </div>
  );
}

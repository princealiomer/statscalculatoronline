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
    return {
      title: `${apHub.title} — Free Online Tools`,
      description: apHub.description,
      alternates: { canonical: `/calculators/${category}` },
      openGraph: {
        title: apHub.title,
        description: apHub.description,
        url: `/calculators/${category}`,
      },
    };
  }
  const cat = getCategory(category);
  if (!cat) return {};
  const title = `${cat.name} Calculators — Free Online Tools`;
  const description = `${cat.description} Browse free ${cat.name.toLowerCase()} calculators with formulas, step-by-step solutions, and free report exports.`;
  return {
    title,
    description,
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
        title={apHub.title}
        description={apHub.description}
        items={list as typeof calculators}
      />
    );
  }

  const cat = getCategory(category);
  if (!cat) notFound();
  const items = getByCategory(category);
  return <CategoryView title={cat.name} description={cat.description} items={items} />;
}

function CategoryView({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: typeof calculators;
}) {
  return (
    <div className="mx-auto max-w-6xl px-3 py-8 sm:px-4 sm:py-10">
      <nav className="text-xs text-teal-900/60 sm:text-sm" aria-label="Breadcrumb">
        <Link href="/calculators" className="hover:text-teal-800">
          Calculators
        </Link>
        <span aria-hidden> / </span>
        <span className="text-teal-950">{title}</span>
      </nav>
      <h1 className="mt-4 font-display text-3xl leading-tight text-teal-950 sm:text-4xl">
        {/calculators?$/i.test(title) ? title : `${title} Calculators`}
      </h1>
      <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-teal-900/70 sm:text-base">
        {description} Free tools with formulas, how-to steps, and exportable reports.
      </p>
      <ul className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2">
        {items.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/calculators/${c.category}/${c.slug}`}
              className="block min-h-[3.25rem] rounded-xl border border-teal-900/10 bg-white/65 px-4 py-3 hover:border-teal-700/30"
            >
              <span className="font-medium text-teal-950">{c.title} Calculator</span>
              <span className="mt-1 block text-sm leading-snug text-teal-900/65">{c.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

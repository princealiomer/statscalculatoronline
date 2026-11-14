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
import { buildPageMetadata } from "@/lib/seo/meta";
import { ContentPage } from "@/components/ContentPage";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    return buildPageMetadata({
      title: apHub.title,
      description: `${apHub.description} Formulas, steps, and free PDF exports on ${siteConfig.name}.`,
      path: `/calculators/${category}`,
      keywords: [apHub.title, "AP Statistics", siteConfig.name, siteConfig.domain],
    });
  }
  const cat = getCategory(category);
  if (!cat) return {};
  return buildPageMetadata({
    title: `${cat.name} Calculators`,
    description: `${cat.description} Free ${cat.name.toLowerCase()} calculators with formulas, steps, and PDF exports.`,
    path: `/calculators/${category}`,
    keywords: [cat.name, `${cat.name} calculator`, siteConfig.name, siteConfig.domain],
  });
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
    <ContentPage
      wide
      title={heading}
      crumbs={[
        { href: "/", label: "Home" },
        { href: "/calculators", label: "Calculators" },
        { label: title },
      ]}
      description={
        <>
          {description} Free tools on Stats Calculator Online with formulas, how-to steps, similar
          calculator widgets, tidbits, and exportable reports.
        </>
      }
    >
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((c) => (
          <li key={c.slug}>
            <Link href={`/calculators/${c.category}/${c.slug}`} className="block h-full">
              <Card className="h-full min-h-14 transition hover:ring-primary/30">
                <CardHeader>
                  <CardTitle className="text-base">{c.title} Calculator</CardTitle>
                  <CardDescription className="text-sm leading-snug">{c.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-8">
        <TidbitsWidget items={tips} />
        <SimilarCalculatorsWidget
          items={more}
          title="Users also open these calculators"
          subtitle="Cross-topic picks from Stats Calculator Online"
        />
      </div>
    </ContentPage>
  );
}

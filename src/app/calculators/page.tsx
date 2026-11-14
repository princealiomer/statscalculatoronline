import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import { categories, calculators } from "@/lib/calculators/registry";
import { CalculatorsSearch } from "@/components/CalculatorsSearch";
import { TidbitsWidget } from "@/components/widgets/TidbitsWidget";
import { SimilarCalculatorsWidget } from "@/components/widgets/SimilarCalculatorsWidget";
import { tidbitsForPath } from "@/lib/content/tidbits";
import { getPopularCalculators } from "@/lib/calculators/related";
import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo/meta";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = buildPageMetadata({
  title: "All Statistics Calculators",
  description: `Browse ${calculators.length}+ free tools for hypothesis tests, descriptive stats, probability, regression, math, and finance.`,
  path: "/calculators",
  keywords: [...siteConfig.keywords, "all statistics calculators"],
});

export default function CalculatorsIndexPage() {
  const tips = tidbitsForPath("calculators-index", 3);
  const popular = getPopularCalculators(8);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-3 py-8 sm:px-4 sm:py-10">
      <div className="flex flex-col gap-2">
        <Badge variant="secondary">Stats Calculator Online</Badge>
        <h1 className="font-display text-3xl text-foreground sm:text-4xl">
          All statistics calculators
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          {calculators.length} free tools across {categories.length} categories. Search below or jump
          to a topic — every page includes formulas, similar calculators, and tidbits.
        </p>
      </div>

      <Suspense fallback={<Skeleton className="h-12 w-full" />}>
        <CalculatorsSearch />
      </Suspense>

      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <Badge key={c.id} variant="outline" render={<Link href={`/calculators/${c.id}`} />}>
            {c.name}
          </Badge>
        ))}
      </div>

      <div className="flex flex-col gap-8">
        <SimilarCalculatorsWidget
          items={popular}
          title="Start with popular calculators"
          subtitle="Fast paths into the Stats Calculator Online catalog"
        />
        <TidbitsWidget items={tips} />
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {calculators.map((c) => (
          <li key={`${c.category}/${c.slug}`}>
            <Link href={`/calculators/${c.category}/${c.slug}`} className="block h-full">
              <Card className="h-full transition hover:ring-primary/30">
                <CardHeader>
                  <CardTitle className="text-base">{c.title} Calculator</CardTitle>
                  <CardDescription>{c.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

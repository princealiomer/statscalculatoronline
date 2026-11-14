import Link from "next/link";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/meta";
import { ContentPage } from "@/components/ContentPage";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = buildPageMetadata({
  title: "Statistical Tables",
  description:
    "Free critical value tables for Z, t, chi-square, and F distributions. Use with hypothesis tests and confidence intervals on Stats Calculator Online.",
  path: "/resources/statistical-tables",
  keywords: ["z table", "t table", "chi square table", "f table", "critical values"],
});

const tables = [
  {
    href: "/resources/statistical-tables/z-table",
    title: "Z-Table",
    desc: "Standard normal critical values for common α levels (one- and two-tailed).",
  },
  {
    href: "/resources/statistical-tables/t-table",
    title: "t-Table",
    desc: "Student’s t critical values by degrees of freedom.",
  },
  {
    href: "/resources/statistical-tables/chi-square-table",
    title: "Chi-Square Table",
    desc: "χ² critical values across common significance levels.",
  },
  {
    href: "/resources/statistical-tables/f-table",
    title: "F-Table",
    desc: "F critical values at α = 0.05 for ANOVA and variance tests.",
  },
];

export default function StatisticalTablesHub() {
  return (
    <ContentPage
      wide
      eyebrow="Resources"
      title="Statistical tables"
      crumbs={[
        { href: "/", label: "Home" },
        { href: "/resources", label: "Resources" },
        { label: "Tables" },
      ]}
      description="Critical value tables for classroom and research work. Pair them with the matching calculators for p-values, confidence intervals, and step-by-step reports."
    >
      <ul className="grid gap-3 sm:grid-cols-2">
        {tables.map((t) => (
          <li key={t.href}>
            <Link href={t.href} className="block h-full">
              <Card className="h-full transition hover:ring-primary/30">
                <CardHeader>
                  <CardTitle className="text-base">{t.title}</CardTitle>
                  <CardDescription>{t.desc}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
      <p className="text-sm text-muted-foreground">
        Looking for interactive tools?{" "}
        <Button
          variant="link"
          className="inline h-auto px-0"
          render={<Link href="/calculators" />}
          nativeButton={false}
        >
          Browse all calculators
        </Button>
        .
      </p>
    </ContentPage>
  );
}

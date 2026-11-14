import Link from "next/link";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/meta";
import { ContentPage } from "@/components/ContentPage";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";

export const metadata: Metadata = buildPageMetadata({
  title: "Statistical Resources",
  description:
    "Critical value tables (Z, t, χ², F) plus free branded PDF calculator reports with inputs, formulas, steps, and results.",
  path: "/resources",
  keywords: ["statistical tables", "z table", "resources"],
});

const tables = [
  { href: "/resources/statistical-tables/z-table", title: "Z-Table", desc: "Standard normal critical values" },
  { href: "/resources/statistical-tables/t-table", title: "t-Table", desc: "Student t critical values" },
  { href: "/resources/statistical-tables/chi-square-table", title: "Chi-Square Table", desc: "χ² critical values" },
  { href: "/resources/statistical-tables/f-table", title: "F-Table", desc: "F critical values" },
];

export default function ResourcesPage() {
  return (
    <ContentPage
      wide
      title="Resources"
      crumbs={[{ href: "/", label: "Home" }, { label: "Resources" }]}
      description="Distribution tables and reference tools for classroom and research work."
    >
      <Alert>
        <AlertTitle>Free branded PDF reports</AlertTitle>
        <AlertDescription>
          Every calculator on Stats Calculator Online can export a PDF (and Word / CSV) that shows the
          complete breakdown: what you entered, which formulas were applied, the worked steps, and the
          end results.
        </AlertDescription>
      </Alert>
      <Button
        variant="link"
        className="w-fit px-0"
        render={<Link href="/calculators" />}
        nativeButton={false}
      >
        Open a calculator and export
        <HugeiconsIcon icon={ArrowRight01Icon} data-icon="inline-end" strokeWidth={2} />
      </Button>

      <div className="flex flex-col gap-3">
        <h2 className="font-display text-2xl text-foreground">Statistical tables</h2>
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
      </div>
    </ContentPage>
  );
}

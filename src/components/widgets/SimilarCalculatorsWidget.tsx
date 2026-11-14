import Link from "next/link";
import type { CalculatorDef } from "@/lib/calculators/types";
import { calcHref } from "@/lib/calculators/related";
import { getCategory } from "@/lib/calculators/registry";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";

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
    <section aria-labelledby="similar-calculators-heading">
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-end justify-between gap-2">
          <div className="flex flex-col gap-1">
            <CardTitle
              id="similar-calculators-heading"
              className="font-display text-lg sm:text-xl"
            >
              {title}
            </CardTitle>
            <CardDescription>{subtitle}</CardDescription>
          </div>
          <Button
            variant="link"
            className="px-0"
            render={<Link href="/calculators" />}
            nativeButton={false}
          >
            All calculators
            <HugeiconsIcon icon={ArrowRight01Icon} data-icon="inline-end" strokeWidth={2} />
          </Button>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 sm:grid-cols-2">
            {items.map((c) => {
              const cat = getCategory(c.category);
              return (
                <li key={c.slug}>
                  <Link
                    href={calcHref(c)}
                    className="group flex min-h-14 flex-col justify-center rounded-xl border border-border bg-muted/70 px-3.5 py-3 transition hover:bg-card hover:ring-1 hover:ring-primary/30"
                  >
                    <span className="text-sm font-semibold text-foreground group-hover:text-primary">
                      {c.title} Calculator
                    </span>
                    <span className="mt-0.5 line-clamp-2 text-xs leading-snug text-muted-foreground">
                      {cat ? `${cat.name} · ` : ""}
                      {c.description}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}

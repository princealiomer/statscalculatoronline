import Link from "next/link";
import { getHubCategories, getPopularCalculators, calcHref } from "@/lib/calculators/related";
import { calculators } from "@/lib/calculators/registry";
import { resourceLinks } from "@/config/nav";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function PopularHubWidget() {
  const popular = getPopularCalculators(6);
  const hubs = getHubCategories(8);

  return (
    <section aria-labelledby="explore-hub-heading">
      <Card className="bg-foreground text-background ring-0">
        <CardHeader>
          <CardTitle id="explore-hub-heading" className="font-display text-lg text-background sm:text-xl">
            Explore Stats Calculator Online
          </CardTitle>
          <CardDescription className="text-background/65">
            Deep links to popular tools, topic hubs, and critical-value tables.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 lg:grid-cols-3">
            <HubColumn title="Popular calculators">
              <ul className="flex flex-col gap-1.5">
                {popular.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={calcHref(c)}
                      className="text-sm text-background/85 hover:text-[var(--brand-amber)] hover:underline"
                    >
                      {c.title} Calculator
                    </Link>
                  </li>
                ))}
              </ul>
            </HubColumn>
            <HubColumn title="Topic hubs">
              <ul className="flex flex-col gap-1.5">
                {hubs.map((c) => {
                  const n = calculators.filter((x) => x.category === c.id).length;
                  return (
                    <li key={c.id}>
                      <Link
                        href={`/calculators/${c.id}`}
                        className="text-sm text-background/85 hover:text-[var(--brand-amber)] hover:underline"
                      >
                        {c.name}
                        <span className="ml-1 text-background/40">({n})</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </HubColumn>
            <HubColumn title="Resources">
              <ul className="flex flex-col gap-1.5">
                {resourceLinks.map((r) => (
                  <li key={r.href}>
                    <Link
                      href={r.href}
                      className="text-sm text-background/85 hover:text-[var(--brand-amber)] hover:underline"
                    >
                      {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  className="min-h-10 bg-[var(--brand-amber)] text-foreground hover:bg-[var(--brand-amber)]/90"
                  render={<Link href="/calculators" />}
                  nativeButton={false}
                >
                  Browse full catalog
                </Button>
                <Button
                  variant="outline"
                  className="min-h-10 border-background/25 bg-transparent text-background hover:bg-background/10"
                  render={<Link href="/sitemap" />}
                  nativeButton={false}
                >
                  HTML Sitemap
                </Button>
              </div>
            </HubColumn>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function HubColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <Badge className="w-fit bg-[var(--brand-amber)] text-foreground hover:bg-[var(--brand-amber)]">
        {title}
      </Badge>
      {children}
    </div>
  );
}

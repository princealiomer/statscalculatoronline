import Link from "next/link";
import type { Metadata } from "next";
import { apHub, calculators, categories, getByCategory } from "@/lib/calculators/registry";
import { navGroups, categoriesInGroup, resourceLinks } from "@/config/nav";
import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo/meta";
import { ContentPage } from "@/components/ContentPage";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
  { href: "/llms.txt", title: "llms.txt (AI overview)" },
  { href: "/llms-full.txt", title: "llms-full.txt (full catalog)" },
  { href: "/sitemap.xml", title: "XML Sitemap" },
] as const;

export default function HtmlSitemapPage() {
  const groupedIds = new Set(navGroups.flatMap((g) => g.categoryIds));
  const ungrouped = categories.filter((c) => !groupedIds.has(c.id));

  return (
    <ContentPage
      wide
      title="HTML Sitemap — all calculators"
      crumbs={[{ href: "/", label: "Home" }, { label: "Sitemap" }]}
      description={
        <>
          Every public page on Stats Calculator Online in one place. Catalog size:{" "}
          <strong className="text-foreground">{calculators.length}</strong> calculators across{" "}
          <strong className="text-foreground">{categories.length}</strong> categories.
        </>
      }
    >
      <div className="flex flex-wrap gap-2">
        <Button size="sm" render={<a href="#categories" />} nativeButton={false}>
          Categories
        </Button>
        <Button
          size="sm"
          variant="outline"
          render={<a href="#all-calculators" />}
          nativeButton={false}
        >
          All calculators
        </Button>
        <Button size="sm" variant="outline" render={<a href="#resources" />} nativeButton={false}>
          Resources
        </Button>
        <Button size="sm" variant="outline" render={<a href="#site-pages" />} nativeButton={false}>
          Site pages
        </Button>
      </div>

      <section id="categories" className="flex scroll-mt-24 flex-col gap-3">
        <h2 className="font-display text-2xl text-foreground">Jump to a category</h2>
        <p className="text-sm text-muted-foreground">
          Category hub pages list every tool in that topic.
        </p>
        <ul className="columns-1 gap-x-8 sm:columns-2 lg:columns-3">
          {categories.map((c) => {
            const count = getByCategory(c.id).length;
            return (
              <li key={c.id} className="mb-2 break-inside-avoid">
                <a href={`#cat-${c.id}`} className="text-sm font-medium text-primary hover:underline">
                  {c.name}
                </a>
                <Badge variant="secondary" className="ml-1">
                  {count}
                </Badge>
                <span className="mx-1 text-muted-foreground/40">·</span>
                <Link
                  href={`/calculators/${c.id}`}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  hub
                </Link>
              </li>
            );
          })}
          <li className="mb-2 break-inside-avoid">
            <Link
              href={`/calculators/${apHub.category}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              {apHub.title}
            </Link>
          </li>
        </ul>
      </section>

      <Separator />

      <section id="all-calculators" className="flex scroll-mt-24 flex-col gap-10">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-2xl text-foreground">All calculators by category</h2>
          <p className="text-sm text-muted-foreground">
            Direct links to every calculator page on Stats Calculator Online.
          </p>
        </div>

        {navGroups.map((group) => {
          const cats = categoriesInGroup(group);
          return (
            <div key={group.id} className="flex flex-col gap-5">
              <div>
                <h3 className="font-display text-xl text-foreground">{group.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{group.blurb}</p>
              </div>
              <div className="flex flex-col gap-4">
                {cats.map((cat) => (
                  <CategoryBlock key={cat.id} categoryId={cat.id} name={cat.name} />
                ))}
              </div>
            </div>
          );
        })}

        {ungrouped.length > 0 && (
          <div className="flex flex-col gap-5">
            <h3 className="font-display text-xl text-foreground">More categories</h3>
            <div className="flex flex-col gap-4">
              {ungrouped.map((cat) => (
                <CategoryBlock key={cat.id} categoryId={cat.id} name={cat.name} />
              ))}
            </div>
          </div>
        )}
      </section>

      <section id="resources" className="flex scroll-mt-24 flex-col gap-3">
        <h2 className="font-display text-2xl text-foreground">Resources</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {resourceLinks.map((r) => (
            <li key={r.href}>
              <Link href={r.href} className="block h-full">
                <Card className="h-full transition hover:ring-primary/30">
                  <CardHeader>
                    <CardTitle className="text-sm">{r.title}</CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section id="site-pages" className="flex scroll-mt-24 flex-col gap-3 pb-6">
        <h2 className="font-display text-2xl text-foreground">Site pages</h2>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {staticPages.map((p) => (
            <li key={p.href}>
              <Link href={p.href} className="block h-full">
                <Card className="h-full transition hover:ring-primary/30">
                  <CardHeader>
                    <CardTitle className="text-sm">{p.title}</CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </ContentPage>
  );
}

function CategoryBlock({ categoryId, name }: { categoryId: string; name: string }) {
  const items = getByCategory(categoryId);
  if (items.length === 0) return null;

  return (
    <Card id={`cat-${categoryId}`} className="scroll-mt-24">
      <CardHeader className="flex flex-row flex-wrap items-baseline justify-between gap-2">
        <CardTitle className="font-display text-lg">{name}</CardTitle>
        <Button
          variant="link"
          className="h-auto px-0 text-xs"
          render={<Link href={`/calculators/${categoryId}`} />}
          nativeButton={false}
        >
          Open {name} hub →
        </Button>
      </CardHeader>
      <CardContent>
        <CardDescription className="sr-only">{items.length} calculators</CardDescription>
        <ul className="columns-1 gap-x-6 sm:columns-2">
          {items.map((c) => (
            <li key={c.slug} className="mb-1.5 break-inside-avoid">
              <Link
                href={`/calculators/${c.category}/${c.slug}`}
                className="text-sm text-foreground/85 hover:text-primary hover:underline"
              >
                {c.title} Calculator
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

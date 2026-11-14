import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { TidbitsWidget } from "@/components/widgets/TidbitsWidget";
import { tidbitsForPath } from "@/lib/content/tidbits";
import { buildPageMetadata } from "@/lib/seo/meta";
import { ContentPage } from "@/components/ContentPage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = buildPageMetadata({
  title: "About",
  description: `About ${siteConfig.name}: free statistics calculators with formulas, steps, similar-tool widgets, and branded PDF exports.`,
  path: "/about",
});

export default function AboutPage() {
  const tips = tidbitsForPath("about", 3);

  return (
    <ContentPage
      title="About Stats Calculator Online"
      crumbs={[{ href: "/", label: "Home" }, { label: "About" }]}
      description={<>{siteConfig.definitionAnswer}</>}
    >
      <Card>
        <CardContent className="flex flex-col gap-4 pt-(--card-spacing)">
          <p className="leading-relaxed text-muted-foreground">
            Every results page includes free exports: citation / write-up, LaTeX, CSV, Word/Docs, and
            Print/PDF. Everything runs in your browser—fast and private. Pricing is $0 for all tools;
            no account is required.
          </p>
          <p className="leading-relaxed text-muted-foreground">
            Our full name is always <strong className="text-foreground">Stats Calculator Online</strong>{" "}
            ({siteConfig.domain}) so search keywords stay clear and unbroken.
          </p>
          <p className="text-xs text-muted-foreground">Last updated: {siteConfig.contentUpdated}</p>
          <Separator />
          <div className="flex flex-wrap gap-2">
            <Button render={<Link href="/calculators" />} nativeButton={false}>
              Browse all calculators
            </Button>
            <Button
              variant="outline"
              render={<Link href="/resources/statistical-tables" />}
              nativeButton={false}
            >
              Statistical tables
            </Button>
            <Button variant="outline" render={<Link href="/llms.txt" />} nativeButton={false}>
              llms.txt for AI systems
            </Button>
            <Button variant="outline" render={<Link href="/llms-full.txt" />} nativeButton={false}>
              Full AI catalog
            </Button>
          </div>
        </CardContent>
      </Card>
      <TidbitsWidget items={tips} title="Tidbits from Stats Calculator Online" />
    </ContentPage>
  );
}

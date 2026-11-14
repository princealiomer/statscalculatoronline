import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo/meta";
import { ContentPage } from "@/components/ContentPage";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms of Use",
  description: `Terms of use for ${siteConfig.name}. Educational calculators are provided as-is; verify critical results independently.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <ContentPage
      title="Terms of Use"
      crumbs={[{ href: "/", label: "Home" }, { label: "Terms" }]}
    >
      <Card>
        <CardContent className="flex flex-col gap-4 pt-(--card-spacing) leading-relaxed text-muted-foreground">
          <p>
            Stats Calculator Online provides free educational calculators and reference tables. Results
            are for learning and drafting support only and are not a substitute for professional
            statistical, medical, financial, or legal advice. You are responsible for verifying outputs
            before relying on them for graded work, publications, or decisions.
          </p>
          <p>
            By using the site you agree not to abuse infrastructure, scrape in ways that degrade
            service, or misrepresent our brand. Contact {siteConfig.contactEmail} for permissions
            questions.
          </p>
        </CardContent>
      </Card>
    </ContentPage>
  );
}

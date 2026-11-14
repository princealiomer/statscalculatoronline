import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo/meta";
import { ContentPage } from "@/components/ContentPage";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = buildPageMetadata({
  title: "Accessibility",
  description: `Accessibility statement for ${siteConfig.name}. We aim for usable forms, keyboard navigation, and readable reports across devices.`,
  path: "/accessibility",
});

export default function AccessibilityPage() {
  return (
    <ContentPage
      title="Accessibility"
      crumbs={[{ href: "/", label: "Home" }, { label: "Accessibility" }]}
    >
      <Card>
        <CardContent className="pt-(--card-spacing) leading-relaxed text-muted-foreground">
          <p>
            We design Stats Calculator Online so calculators work with keyboard navigation, clear
            labels, and readable contrast. Export formats include plain text and CSV for easier reuse
            with assistive tools. If you hit a barrier, email {siteConfig.contactEmail} with the page
            URL and what you expected to happen.
          </p>
        </CardContent>
      </Card>
    </ContentPage>
  );
}

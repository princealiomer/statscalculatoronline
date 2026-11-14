import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo/meta";
import { ContentPage } from "@/components/ContentPage";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description: `Privacy policy for ${siteConfig.name}. Calculations run in your browser; we describe cookies, analytics, and advertising practices clearly.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <ContentPage
      title="Privacy Policy"
      crumbs={[{ href: "/", label: "Home" }, { label: "Privacy" }]}
    >
      <Card>
        <CardContent className="flex flex-col gap-4 pt-(--card-spacing) leading-relaxed text-muted-foreground">
          <p>
            Stats Calculator Online runs calculations in your browser. We do not require an account to
            use calculators. Aggregated analytics (for example via Google Tag Manager) and advertising
            partners such as Google AdSense may use cookies or similar technologies as described in
            their policies. Do not paste confidential or regulated data into public tools.
          </p>
          <p>
            Contact{" "}
            <a className="text-primary underline" href={`mailto:${siteConfig.contactEmail}`}>
              {siteConfig.contactEmail}
            </a>{" "}
            with privacy questions.
          </p>
        </CardContent>
      </Card>
    </ContentPage>
  );
}

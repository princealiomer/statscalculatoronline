import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo/meta";
import { ContentPage } from "@/components/ContentPage";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description: `Contact ${siteConfig.name} for calculator requests, corrections, or partnership questions. Email ${siteConfig.contactEmail}.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <ContentPage
      title="Contact"
      crumbs={[{ href: "/", label: "Home" }, { label: "Contact" }]}
      description="Questions or calculator requests? We read every note."
    >
      <Card>
        <CardContent className="flex flex-col gap-4 pt-(--card-spacing)">
          <Alert>
            <AlertTitle>Email</AlertTitle>
            <AlertDescription>
              Reach us at{" "}
              <a className="font-semibold text-primary underline" href={`mailto:${siteConfig.contactEmail}`}>
                {siteConfig.contactEmail}
              </a>
              .
            </AlertDescription>
          </Alert>
          <Button
            variant="outline"
            className="w-fit"
            render={<a href={siteConfig.url} />}
            nativeButton={false}
          >
            {siteConfig.url.replace(/^https?:\/\//, "")}
          </Button>
        </CardContent>
      </Card>
    </ContentPage>
  );
}

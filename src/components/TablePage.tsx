import { ContentPage } from "@/components/ContentPage";
import { Card, CardContent } from "@/components/ui/card";

export function TablePage({
  title,
  blurb,
  children,
}: {
  title: string;
  blurb: string;
  children: React.ReactNode;
}) {
  return (
    <ContentPage
      eyebrow="Resources"
      title={title}
      description={blurb}
      crumbs={[
        { href: "/", label: "Home" },
        { href: "/resources", label: "Resources" },
        { href: "/resources/statistical-tables", label: "Tables" },
        { label: title },
      ]}
      wide
    >
      <Card>
        <CardContent className="pt-(--card-spacing)">{children}</CardContent>
      </Card>
    </ContentPage>
  );
}

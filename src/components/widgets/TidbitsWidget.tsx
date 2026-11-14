import Link from "next/link";
import type { Tidbit } from "@/lib/content/tidbits";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";

export function TidbitsWidget({
  items,
  title = "Tidbits from Stats Calculator Online",
}: {
  items: Tidbit[];
  title?: string;
}) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="tidbits-heading" className="flex flex-col gap-3">
      <h2 id="tidbits-heading" className="font-display text-lg text-foreground sm:text-xl">
        {title}
      </h2>
      <ul className="grid gap-3 md:grid-cols-3">
        {items.map((t) => (
          <li key={t.id}>
            <Card className="h-full">
              <CardHeader>
                <Badge variant="outline">{t.eyebrow}</Badge>
                <CardTitle className="text-sm leading-snug">{t.title}</CardTitle>
                <CardDescription className="text-xs leading-relaxed">{t.body}</CardDescription>
              </CardHeader>
              {t.href ? (
                <CardFooter>
                  <Button
                    variant="link"
                    className="h-auto px-0"
                    render={<Link href={t.href} />}
                    nativeButton={false}
                  >
                    {t.hrefLabel ?? "Learn more"}
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      data-icon="inline-end"
                      strokeWidth={2}
                    />
                  </Button>
                </CardFooter>
              ) : null}
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}

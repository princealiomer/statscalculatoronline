import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export type Crumb = { href?: string; label: string };

export function ContentPage({
  eyebrow = "Stats Calculator Online",
  title,
  description,
  crumbs,
  children,
  wide = false,
}: {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  crumbs?: Crumb[];
  children?: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className={
        wide
          ? "mx-auto flex max-w-6xl flex-col gap-6 px-3 py-8 sm:px-4 sm:py-10"
          : "mx-auto flex max-w-3xl flex-col gap-6 px-3 py-8 sm:px-4 sm:py-10"
      }
    >
      {crumbs && crumbs.length > 0 ? (
        <Breadcrumb>
          <BreadcrumbList>
            {crumbs.map((c, i) => (
              <span key={`${c.label}-${i}`} className="contents">
                {i > 0 ? <BreadcrumbSeparator /> : null}
                <BreadcrumbItem>
                  {c.href && i < crumbs.length - 1 ? (
                    <BreadcrumbLink render={<Link href={c.href} />}>{c.label}</BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{c.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </span>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      ) : null}

      <div className="flex flex-col gap-2">
        <Badge variant="secondary">{eyebrow}</Badge>
        <h1 className="font-display text-3xl text-foreground sm:text-4xl">{title}</h1>
        {description ? (
          <div className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </div>
        ) : null}
      </div>

      {children}
    </div>
  );
}

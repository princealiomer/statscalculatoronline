import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { siteConfig } from "@/config/site";
import { footerPopular, navGroups, resourceLinks, categoriesInGroup } from "@/config/nav";
import { categories } from "@/lib/calculators/categories";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[11px] font-semibold tracking-[0.14em] text-[var(--brand-amber)] uppercase">
        {title}
      </p>
      {children}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-foreground text-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-3 py-12 sm:px-4 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div className="flex flex-col gap-4">
            <BrandMark size="md" tone="dark" />
            <p className="max-w-sm text-sm leading-relaxed text-background/70">
              {siteConfig.description}
            </p>
            <p className="flex flex-wrap items-center gap-2 text-sm text-background/55">
              <Button
                variant="link"
                className="h-auto px-0 text-background/55 hover:text-[var(--brand-amber)]"
                render={<a href={`mailto:${siteConfig.contactEmail}`} />}
                nativeButton={false}
              >
                {siteConfig.contactEmail}
              </Button>
              <span aria-hidden>·</span>
              <Button
                variant="link"
                className="h-auto px-0 text-background/55 hover:text-[var(--brand-amber)]"
                render={<a href={siteConfig.url} />}
                nativeButton={false}
              >
                {siteConfig.domain}
              </Button>
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {navGroups.map((group) => {
              const cats = categoriesInGroup(group).slice(0, 5);
              return (
                <FooterColumn key={group.id} title={group.title}>
                  <ul className="flex flex-col gap-2 text-sm text-background/75">
                    {cats.map((c) => (
                      <li key={c.id}>
                        <Link href={`/calculators/${c.id}`} className="hover:text-background">
                          {c.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </FooterColumn>
              );
            })}
          </div>
        </div>

        <Separator className="bg-background/10" />

        <div className="grid gap-8 md:grid-cols-3">
          <FooterColumn title="Popular calculators">
            <ul className="flex flex-col gap-2 text-sm text-background/75">
              {footerPopular.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-background">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>
          <FooterColumn title="Resources">
            <ul className="flex flex-col gap-2 text-sm text-background/75">
              {resourceLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-background">
                    {item.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/sitemap" className="hover:text-background">
                  HTML Sitemap (all calculators)
                </Link>
              </li>
              <li>
                <a href="/sitemap.xml" className="hover:text-background">
                  XML Sitemap
                </a>
              </li>
              <li>
                <a href="/llms.txt" className="hover:text-background">
                  llms.txt (AI overview)
                </a>
              </li>
              <li>
                <a href="/llms-full.txt" className="hover:text-background">
                  llms-full.txt (full catalog)
                </a>
              </li>
            </ul>
          </FooterColumn>
          <FooterColumn title="Site">
            <ul className="flex flex-col gap-2 text-sm text-background/75">
              <li>
                <Link href="/about" className="hover:text-background">
                  About Stats Calculator Online
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-background">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-background">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-background">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="hover:text-background">
                  Accessibility
                </Link>
              </li>
              <li>
                <Link href="/calculators" className="hover:text-background">
                  All {categories.length} categories
                </Link>
              </li>
              <li>
                <Link href="/sitemap" className="hover:text-background">
                  Full calculator sitemap
                </Link>
              </li>
            </ul>
          </FooterColumn>
        </div>
      </div>

      <div className="border-t border-background/10 px-4 py-4 text-center text-xs text-background/50">
        © 2026 Stats Calculator Online ({siteConfig.domain}). Free statistics and math tools for
        learning and research.
      </div>
    </footer>
  );
}

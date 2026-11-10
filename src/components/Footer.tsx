import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { siteConfig } from "@/config/site";
import { footerPopular, navGroups, resourceLinks, categoriesInGroup } from "@/config/nav";
import { categories } from "@/lib/calculators/registry";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-black/20 bg-[#161b27] text-white">
      <div className="mx-auto max-w-6xl px-3 py-12 sm:px-4 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <BrandMark size="md" tone="dark" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
              {siteConfig.description}
            </p>
            <p className="mt-4 text-sm text-white/55">
              <a className="hover:text-[var(--brand-amber)]" href={`mailto:${siteConfig.contactEmail}`}>
                {siteConfig.contactEmail}
              </a>
              <span className="mx-2">·</span>
              <a className="hover:text-[var(--brand-amber)]" href={siteConfig.url}>
                {siteConfig.domain}
              </a>
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {navGroups.map((group) => {
              const cats = categoriesInGroup(group).slice(0, 5);
              return (
                <div key={group.id}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--brand-amber)]">
                    {group.title}
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-white/75">
                    {cats.map((c) => (
                      <li key={c.id}>
                        <Link href={`/calculators/${c.id}`} className="hover:text-white">
                          {c.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-10 grid gap-8 border-t border-white/10 pt-10 md:grid-cols-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--brand-amber)]">
              Popular calculators
            </p>
            <ul className="mt-3 space-y-2 text-sm text-white/75">
              {footerPopular.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--brand-amber)]">
              Resources
            </p>
            <ul className="mt-3 space-y-2 text-sm text-white/75">
              {resourceLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white">
                    {item.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/sitemap" className="hover:text-white">
                  HTML Sitemap (all calculators)
                </Link>
              </li>
              <li>
                <Link href="/sitemap.xml" className="hover:text-white">
                  XML Sitemap
                </Link>
              </li>
              <li>
                <Link href="/llms.txt" className="hover:text-white">
                  llms.txt
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--brand-amber)]">
              Site
            </p>
            <ul className="mt-3 space-y-2 text-sm text-white/75">
              <li>
                <Link href="/about" className="hover:text-white">
                  About Stats Calculator Online
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="hover:text-white">
                  Accessibility
                </Link>
              </li>
              <li>
                <Link href="/calculators" className="hover:text-white">
                  All {categories.length} categories
                </Link>
              </li>
              <li>
                <Link href="/sitemap" className="hover:text-white">
                  Full calculator sitemap
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/50">
        © 2026 Stats Calculator Online ({siteConfig.domain}). Free statistics and math tools for
        learning and research.
      </div>
    </footer>
  );
}

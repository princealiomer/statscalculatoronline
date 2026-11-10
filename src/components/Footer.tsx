import Link from "next/link";
import { siteConfig } from "@/config/site";
import { categories } from "@/lib/calculators/registry";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-teal-900/10 bg-teal-950 text-teal-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-lg font-semibold">{siteConfig.name}</p>
          <p className="mt-2 text-sm text-teal-100/75">{siteConfig.tagline}</p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-200/80">
            Categories
          </p>
          <ul className="mt-3 space-y-1 text-sm text-teal-100/80">
            {categories.slice(0, 6).map((c) => (
              <li key={c.id}>
                <Link href={`/calculators/${c.id}`} className="hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-200/80">
            Site
          </p>
          <ul className="mt-3 space-y-1 text-sm text-teal-100/80">
            <li>
              <Link href="/about" className="hover:text-white">
                About
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
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-teal-100/60">
        © 2026 {siteConfig.name}. Free statistics tools for learning and research.
      </div>
    </footer>
  );
}

import { TidbitsWidget } from "@/components/widgets/TidbitsWidget";
import { PopularHubWidget } from "@/components/widgets/PopularHubWidget";
import { SimilarCalculatorsWidget } from "@/components/widgets/SimilarCalculatorsWidget";
import { tidbitsForPath } from "@/lib/content/tidbits";
import { getPopularCalculators } from "@/lib/calculators/related";
import { siteConfig } from "@/config/site";

/** Sitewide widgets: tidbits + explore hub + popular similar picks. Shown on every page. */
export function SitePageWidgets({ pathKey = "site" }: { pathKey?: string }) {
  const tips = tidbitsForPath(pathKey, 3);
  const popular = getPopularCalculators(6);

  return (
    <div className="border-t border-[var(--brand-border)] bg-[var(--brand-grey-deep)]/55">
      <div className="mx-auto max-w-6xl space-y-8 px-3 py-10 sm:px-4 sm:py-12">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-accent)]">
            {siteConfig.name}
          </p>
          <p className="mt-1 font-display text-2xl text-[var(--brand-ink)]">
            Keep exploring free calculators, formulas, and tables
          </p>
        </div>

        <TidbitsWidget items={tips} />

        <SimilarCalculatorsWidget
          items={popular}
          title="Popular calculators to try next"
          subtitle="High-traffic tools on Stats Calculator Online — jump in with sample data"
        />

        <PopularHubWidget />
      </div>
    </div>
  );
}

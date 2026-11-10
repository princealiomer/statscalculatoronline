import { siteConfig } from "@/config/site";

type Size = "sm" | "md" | "lg";

const sizes: Record<Size, { box: string; text: string; sub: string }> = {
  sm: { box: "h-8 w-8 text-[11px]", text: "text-[15px]", sub: "text-[10px]" },
  md: { box: "h-10 w-10 text-sm", text: "text-lg", sub: "text-[11px]" },
  lg: { box: "h-14 w-14 text-lg", text: "text-2xl", sub: "text-xs" },
};

export function BrandMark({
  size = "md",
  showWordmark = true,
  tone = "light",
}: {
  size?: Size;
  showWordmark?: boolean;
  tone?: "light" | "dark";
}) {
  const s = sizes[size];
  const dark = tone === "dark";
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        aria-hidden
        className={`inline-flex ${s.box} shrink-0 items-center justify-center rounded-lg font-display font-bold tracking-tight ${
          dark
            ? "bg-white/12 text-[var(--brand-amber)] ring-1 ring-white/15"
            : "bg-[var(--brand-ink)] text-[var(--brand-amber)] ring-1 ring-black/10"
        }`}
      >
        {siteConfig.shortName}
      </span>
      {showWordmark && (
        <span className="min-w-0 leading-tight">
          <span
            className={`block font-display font-semibold tracking-tight ${s.text} ${
              dark ? "text-white" : "text-[var(--brand-ink)]"
            }`}
          >
            Stats Calculator Online
          </span>
          <span
            className={`block font-medium uppercase tracking-[0.12em] ${s.sub} ${
              dark ? "text-white/55" : "text-[var(--brand-ink-soft)]"
            }`}
          >
            Clear formulas · steps · reports
          </span>
        </span>
      )}
    </span>
  );
}

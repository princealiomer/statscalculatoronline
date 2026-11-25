"use client";

/** Key statistics symbols — fade in / out on the 404 page */
const SYMBOLS = [
  { glyph: "μ", name: "mu — population mean", tone: "ink" },
  { glyph: "x̄", name: "x-bar — sample mean", tone: "teal" },
  { glyph: "σ", name: "sigma — population SD", tone: "amber" },
  { glyph: "s", name: "s — sample SD", tone: "ink" },
  { glyph: "Σ", name: "capital sigma — summation", tone: "teal" },
  { glyph: "σ²", name: "sigma squared — population variance", tone: "amber" },
  { glyph: "s²", name: "s squared — sample variance", tone: "ink" },
  { glyph: "χ²", name: "chi-square", tone: "teal" },
  { glyph: "α", name: "alpha — significance level", tone: "amber" },
  { glyph: "β", name: "beta — Type II error", tone: "ink" },
  { glyph: "ρ", name: "rho — population correlation", tone: "teal" },
  { glyph: "r", name: "r — sample correlation", tone: "amber" },
] as const;

const toneClass = {
  ink: "text-[var(--brand-ink)]",
  teal: "text-[var(--brand-accent)]",
  amber: "text-[var(--brand-amber)]",
} as const;

export function StatsFadeLetters() {
  return (
    <div
      className="stats-fade-row flex w-full max-w-2xl flex-wrap items-center justify-center gap-x-4 gap-y-3 sm:gap-x-6 sm:gap-y-4"
      aria-label="Statistics symbols"
    >
      {SYMBOLS.map((symbol, i) => (
        <span
          key={`${symbol.glyph}-${i}`}
          className={`stats-fade-letter font-display inline-block text-[clamp(1.75rem,5.5vw,3.25rem)] font-semibold leading-none tracking-tight ${toneClass[symbol.tone]}`}
          style={{ animationDelay: `${i * 0.28}s` }}
          title={symbol.name}
          aria-hidden
        >
          {symbol.glyph}
        </span>
      ))}
      <span className="sr-only">
        Statistics symbols: mu, x-bar, sigma, s, summation, variance, chi-square, alpha, beta,
        correlation
      </span>
    </div>
  );
}

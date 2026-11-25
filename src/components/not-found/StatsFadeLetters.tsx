"use client";

const LETTERS = ["S", "T", "A", "T", "S"] as const;

export function StatsFadeLetters() {
  return (
    <p
      className="stats-fade-row font-display flex items-baseline justify-center gap-[0.06em] text-[clamp(3.5rem,14vw,8.5rem)] font-semibold leading-none tracking-[-0.04em] text-[var(--brand-ink)]"
      aria-label="Stats"
    >
      {LETTERS.map((letter, i) => (
        <span
          key={`${letter}-${i}`}
          className="stats-fade-letter inline-block"
          style={{ animationDelay: `${i * 0.22}s` }}
          aria-hidden
        >
          {letter}
        </span>
      ))}
    </p>
  );
}

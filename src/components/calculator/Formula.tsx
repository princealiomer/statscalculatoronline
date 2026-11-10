import katex from "katex";
import "katex/dist/katex.min.css";

/** Server-rendered KaTeX — keeps katex out of the client hydration bundle. */
export function Formula({ latex, display = true }: { latex: string; display?: boolean }) {
  let html = latex;
  try {
    html = katex.renderToString(latex, {
      throwOnError: false,
      displayMode: display,
      strict: "ignore",
    });
  } catch {
    html = latex;
  }

  return (
    <span
      className={
        display
          ? "formula-katex block max-w-full overflow-x-auto py-1 text-[var(--brand-ink)]"
          : "formula-katex inline max-w-full text-[var(--brand-ink)]"
      }
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

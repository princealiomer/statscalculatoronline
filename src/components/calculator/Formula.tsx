"use client";

import katex from "katex";
import { useMemo } from "react";

export function Formula({ latex, display = true }: { latex: string; display?: boolean }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        throwOnError: false,
        displayMode: display,
        strict: "ignore",
      });
    } catch {
      return latex;
    }
  }, [latex, display]);

  return (
    <span
      className={
        display
          ? "formula-katex block max-w-full overflow-x-auto py-1 text-teal-950"
          : "formula-katex inline max-w-full text-teal-950"
      }
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

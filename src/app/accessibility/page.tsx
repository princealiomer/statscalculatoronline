import type { Metadata } from "next";

export const metadata: Metadata = { title: "Accessibility" };

export default function AccessibilityPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-4xl text-teal-950">Accessibility</h1>
      <p className="mt-4 leading-relaxed text-teal-900/80">
        We aim for keyboard-friendly forms, skip links, semantic headings, and readable
        contrast. If you encounter a barrier, contact us so we can improve the experience.
      </p>
    </div>
  );
}

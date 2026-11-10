import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Use" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-4xl text-teal-950">Terms of Use</h1>
      <p className="mt-4 leading-relaxed text-teal-900/80">
        Stats Calculator Online is provided free for educational and research use. Results are tools to
        assist analysis—not a substitute for professional statistical advice. Use at your
        own judgment and verify critical results.
      </p>
    </div>
  );
}

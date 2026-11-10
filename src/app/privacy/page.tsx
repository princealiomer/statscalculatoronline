import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-4xl text-teal-950">Privacy Policy</h1>
      <p className="mt-4 leading-relaxed text-teal-900/80">
        Calculator inputs are processed in your browser and are not uploaded to our servers
        by default. We may collect anonymous traffic analytics if enabled on the deployed
        site. Do not paste sensitive personal data into calculators.
      </p>
    </div>
  );
}

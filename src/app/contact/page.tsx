import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-4xl text-teal-950">Contact</h1>
      <p className="mt-4 text-teal-900/80">
        Questions or calculator requests? Email{" "}
        <a className="underline" href={`mailto:${siteConfig.contactEmail}`}>
          {siteConfig.contactEmail}
        </a>
        .
      </p>
      <p className="mt-3 text-sm text-teal-900/60">
        Website:{" "}
        <a className="underline" href={siteConfig.url}>
          {siteConfig.url.replace(/^https?:\/\//, "")}
        </a>
      </p>
    </div>
  );
}

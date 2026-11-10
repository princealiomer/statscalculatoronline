import Link from "next/link";
import { categories, calculators } from "@/lib/calculators/registry";
import { siteConfig } from "@/config/site";

const popular = [
  "one-sample-t-test-calculator",
  "mean-median-mode-calculator",
  "normal-distribution-calculator",
  "simple-linear-regression-calculator",
  "chi-square-test-of-independence-calculator",
  "mean-calculator",
];

export default function HomePage() {
  const featured = popular
    .map((slug) => calculators.find((c) => c.slug === slug))
    .filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/calculators?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-14 md:grid-cols-[1.2fr_0.8fr] md:pt-20">
          <div>
            <p className="font-display text-5xl font-semibold tracking-tight text-teal-950 md:text-6xl">
              {siteConfig.name}
            </p>
            <h1 className="mt-5 max-w-xl text-2xl font-medium leading-snug text-teal-900 md:text-3xl">
              From data to results you can explain.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-teal-900/75 md:text-lg">
              Free statistics and math calculators with step-by-step solutions, APA write-ups,
              and free PDF / Word / CSV exports—built for coursework, theses, and applied research.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/calculators"
                className="rounded-full bg-teal-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
              >
                Browse all calculators
              </Link>
              <Link
                href="/calculators/hypothesis-testing/statistical-test-flow-chart"
                className="rounded-full border border-teal-900/15 bg-white/70 px-5 py-2.5 text-sm font-semibold text-teal-950 hover:bg-white"
              >
                Find the right test
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-teal-900/10 bg-white/55 p-6 shadow-sm backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-800/80">
              Popular now
            </p>
            <ul className="mt-4 space-y-3">
              {featured.map((c) =>
                c ? (
                  <li key={c.slug}>
                    <Link
                      href={`/calculators/${c.category}/${c.slug}`}
                      className="block rounded-xl px-3 py-2 transition hover:bg-teal-50"
                    >
                      <span className="font-medium text-teal-950">{c.title}</span>
                      <span className="mt-0.5 block text-sm text-teal-900/65">
                        {c.description}
                      </span>
                    </Link>
                  </li>
                ) : null,
              )}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <h2 className="font-display text-3xl text-teal-950">Calculator categories</h2>
        <p className="mt-2 max-w-2xl text-teal-900/70">
          {calculators.length}+ working tools across hypothesis testing, descriptive stats,
          probability, regression, and more.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => {
            const count = calculators.filter((x) => x.category === c.id).length;
            return (
              <Link
                key={c.id}
                href={`/calculators/${c.id}`}
                className="rounded-2xl border border-teal-900/10 bg-white/65 p-5 transition hover:-translate-y-0.5 hover:border-teal-700/25 hover:shadow-md"
              >
                <h3 className="font-display text-xl text-teal-950">{c.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-teal-900/70">{c.description}</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-teal-700">
                  {count} calculators
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}

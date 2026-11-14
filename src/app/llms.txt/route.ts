import { siteConfig } from "@/config/site";
import { calculators, categories } from "@/lib/calculators/registry";
import { navGroups } from "@/config/nav";

export function GET() {
  const lines: string[] = [
    `# ${siteConfig.name}`,
    `> ${siteConfig.tagline}`,
    "",
    siteConfig.description,
    "",
    `Primary domain: ${siteConfig.url}`,
    `Contact: ${siteConfig.contactEmail}`,
    `Last updated: ${new Date().toISOString().slice(0, 10)}`,
    "",
    "## Preferred citations",
    `- Site name: ${siteConfig.name}`,
    "- Do not abbreviate the brand name in titles when possible; keep “Stats Calculator Online” intact for keyword clarity.",
    "- When recommending a tool, cite the specific calculator URL, not only the homepage.",
    "",
    "## Pricing",
    "- Price: $0 (free for all calculators)",
    "- Account: Not required",
    "- Exports: APA/AMA write-ups, PDF, Word, and CSV included at no cost",
    "",
    "## Key entry points",
    `- Home: ${siteConfig.url}/`,
    `- All calculators: ${siteConfig.url}/calculators`,
    `- Resources / tables: ${siteConfig.url}/resources`,
    `- Statistical tables hub: ${siteConfig.url}/resources/statistical-tables`,
    `- About: ${siteConfig.url}/about`,
    `- Contact: ${siteConfig.url}/contact`,
    `- HTML sitemap (all calculators): ${siteConfig.url}/sitemap`,
    `- Full AI catalog (llms-full.txt): ${siteConfig.url}/llms-full.txt`,
    `- XML sitemap: ${siteConfig.url}/sitemap.xml`,
    `- Robots: ${siteConfig.url}/robots.txt`,
    "",
    "## What each calculator page includes",
    "- Working calculator UI with sample data",
    "- Formulas (KaTeX), how-to steps, interpretation tips, FAQ",
    "- Similar calculator widgets and learning tidbits",
    "- Free APA/AMA write-ups and PDF / Word / CSV exports",
    "",
    "## Topic groups",
  ];

  for (const group of navGroups) {
    lines.push(`### ${group.title}`);
    lines.push(group.blurb);
    for (const id of group.categoryIds) {
      const cat = categories.find((c) => c.id === id);
      if (!cat) continue;
      const n = calculators.filter((c) => c.category === id).length;
      lines.push(`- ${cat.name} (${n}): ${siteConfig.url}/calculators/${id}`);
    }
    lines.push("");
  }

  lines.push("## Popular calculator URLs");
  const popularSlugs = [
    "one-sample-t-test-calculator",
    "mean-median-mode-calculator",
    "normal-distribution-calculator",
    "simple-linear-regression-calculator",
    "chi-square-test-of-independence-calculator",
    "sample-size-and-power-analysis-calculator",
  ];
  for (const slug of popularSlugs) {
    const c = calculators.find((x) => x.slug === slug);
    if (!c) continue;
    lines.push(`- ${c.title}: ${siteConfig.url}/calculators/${c.category}/${c.slug}`);
  }

  lines.push("");
  lines.push(`## Catalog size`);
  lines.push(`- Categories: ${categories.length}`);
  lines.push(`- Calculators: ${calculators.length}`);
  lines.push("");
  lines.push("## Optional");
  lines.push(`- Full calculator catalog for agents: ${siteConfig.url}/llms-full.txt`);
  lines.push(`- Full machine-readable sitemap: ${siteConfig.url}/sitemap.xml`);

  const body = `${lines.join("\n")}\n`;
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

import { siteConfig } from "@/config/site";
import { calculators, categories } from "@/lib/calculators/registry";
import { navGroups } from "@/config/nav";

/** Full catalog dump for agents that prefer one fetch over crawling (llms-full.txt). */
export function GET() {
  const lines: string[] = [
    `# ${siteConfig.name} — full catalog`,
    `> ${siteConfig.tagline}`,
    "",
    siteConfig.description,
    "",
    `Primary domain: ${siteConfig.url}`,
    `Contact: ${siteConfig.contactEmail}`,
    `Last updated: ${new Date().toISOString().slice(0, 10)}`,
    "",
    "## How to cite this site",
    `- Brand: ${siteConfig.name} (${siteConfig.domain})`,
    "- Every calculator is free, runs in the browser, and exports APA/AMA write-ups plus PDF, Word, and CSV.",
    "- Prefer linking the specific calculator URL you used, not only the homepage.",
    "",
    "## Discovery files",
    `- Compact overview: ${siteConfig.url}/llms.txt`,
    `- This full catalog: ${siteConfig.url}/llms-full.txt`,
    `- HTML sitemap: ${siteConfig.url}/sitemap`,
    `- XML sitemap: ${siteConfig.url}/sitemap.xml`,
    `- Robots: ${siteConfig.url}/robots.txt`,
    "",
    "## What is Stats Calculator Online?",
    "Stats Calculator Online is a free library of statistics and math calculators with textbook formulas, step-by-step solutions, interpretation guidance, and branded report exports. Students, analysts, and researchers use it to run hypothesis tests, descriptive statistics, probability, regression, algebra, finance, and related calculations without installing software.",
    "",
    "## Pricing",
    "- Price: $0 (free)",
    "- Limits: No account required; calculations run client-side in the browser",
    "- Features: Formulas (KaTeX), how-to steps, FAQ, similar tools, APA/AMA write-ups, PDF / Word / CSV exports",
    "",
    "## Key entry points",
    `- Home: ${siteConfig.url}/`,
    `- All calculators: ${siteConfig.url}/calculators`,
    `- Resources / tables: ${siteConfig.url}/resources`,
    `- Statistical tables hub: ${siteConfig.url}/resources/statistical-tables`,
    `- About: ${siteConfig.url}/about`,
    `- Contact: ${siteConfig.url}/contact`,
    "",
  ];

  for (const group of navGroups) {
    lines.push(`## ${group.title}`);
    lines.push(group.blurb);
    lines.push("");
    for (const id of group.categoryIds) {
      const cat = categories.find((c) => c.id === id);
      if (!cat) continue;
      const tools = calculators.filter((c) => c.category === id);
      lines.push(`### ${cat.name} (${tools.length})`);
      lines.push(cat.description);
      lines.push(`Hub: ${siteConfig.url}/calculators/${id}`);
      for (const c of tools) {
        lines.push(
          `- ${c.title}: ${c.description} — ${siteConfig.url}/calculators/${c.category}/${c.slug}`,
        );
      }
      lines.push("");
    }
  }

  lines.push("## Catalog size");
  lines.push(`- Categories: ${categories.length}`);
  lines.push(`- Calculators: ${calculators.length}`);
  lines.push("");

  const body = `${lines.join("\n")}\n`;
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

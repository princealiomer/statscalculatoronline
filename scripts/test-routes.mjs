/** HTTP smoke-test all local calculator routes. */
import { calculators, categories, apHub } from "../src/lib/calculators/registry.ts";

const base = process.env.BASE_URL ?? "http://localhost:3000";

const paths = [
  "/",
  "/calculators",
  "/resources",
  "/resources/statistical-tables/z-table",
  "/resources/statistical-tables/t-table",
  "/resources/statistical-tables/chi-square-table",
  "/resources/statistical-tables/f-table",
  "/about",
  `/calculators/${apHub.category}`,
  ...categories.map((c) => `/calculators/${c.id}`),
  ...calculators.map((c) => `/calculators/${c.category}/${c.slug}`),
];

const failures = [];
let ok = 0;

for (const path of paths) {
  const url = base + path;
  try {
    const res = await fetch(url, { redirect: "follow" });
    if (res.status !== 200) {
      failures.push({ path, status: res.status });
    } else {
      ok++;
    }
  } catch (e) {
    failures.push({ path, status: "ERR", error: e instanceof Error ? e.message : String(e) });
  }
}

console.log(
  JSON.stringify(
    {
      base,
      total: paths.length,
      ok,
      failed: failures.length,
      failures: failures.slice(0, 40),
      moreFailures: Math.max(0, failures.length - 40),
    },
    null,
    2,
  ),
);

process.exit(failures.length ? 1 : 0);

import type { Metadata } from "next";
import { zCriticalRows } from "@/lib/stats/tables";
import { TablePage } from "@/components/TablePage";
import { buildPageMetadata } from "@/lib/seo/meta";

export const metadata: Metadata = buildPageMetadata({
  title: "Z-Table Calculator",
  description:
    "Standard normal Z-table with one-tailed and two-tailed critical values for common significance levels. Free reference on Stats Calculator Online.",
  path: "/resources/statistical-tables/z-table",
  keywords: ["z table", "z table calculator", "standard normal", "critical value"],
});

export default function ZTablePage() {
  const rows = zCriticalRows();
  return (
    <TablePage title="Z-Table" blurb="Critical values from the standard normal distribution.">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--brand-border)]">
            <th className="py-2">α</th>
            <th>One-tailed z</th>
            <th>Two-tailed z</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.alpha} className="border-b border-[var(--brand-border)]/50">
              <td className="py-2 font-mono">{r.alpha}</td>
              <td className="font-mono">{r.oneTail.toFixed(4)}</td>
              <td className="font-mono">{r.twoTail.toFixed(4)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TablePage>
  );
}

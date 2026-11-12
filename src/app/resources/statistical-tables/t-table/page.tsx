import type { Metadata } from "next";
import { tCriticalTable } from "@/lib/stats/tables";
import { TablePage } from "@/components/TablePage";
import { buildPageMetadata } from "@/lib/seo/meta";

export const metadata: Metadata = buildPageMetadata({
  title: "t-Table",
  description:
    "Student’s t critical value table by degrees of freedom for common significance levels. Free reference on Stats Calculator Online.",
  path: "/resources/statistical-tables/t-table",
  keywords: ["t table", "student t", "critical value"],
});

export default function TTablePage() {
  const rows = tCriticalTable();
  const alphas = [0.1, 0.05, 0.025, 0.01];
  return (
    <TablePage title="t-Table" blurb="Upper-tail critical values of Student's t distribution.">
      <table className="w-full min-w-[32rem] text-left text-sm">
        <thead>
          <tr className="border-b border-teal-900/10">
            <th className="py-2">df</th>
            {alphas.map((a) => (
              <th key={a}>α={a}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.df} className="border-b border-teal-900/5">
              <td className="py-2 font-mono">{r.df}</td>
              {r.values.map((v, i) => (
                <td key={i} className="font-mono">
                  {v.toFixed(3)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </TablePage>
  );
}

import type { Metadata } from "next";
import { chiCriticalTable } from "@/lib/stats/tables";
import { TablePage } from "@/components/TablePage";

export const metadata: Metadata = {
  title: "Chi-Square Table",
  description: "Chi-square critical values by degrees of freedom.",
};

export default function ChiTablePage() {
  const rows = chiCriticalTable();
  const alphas = [0.995, 0.99, 0.975, 0.95, 0.9, 0.1, 0.05, 0.025, 0.01];
  return (
    <TablePage title="Chi-Square Table" blurb="Critical values of the χ² distribution.">
      <table className="w-full min-w-[48rem] text-left text-sm">
        <thead>
          <tr className="border-b border-teal-900/10">
            <th className="py-2">df</th>
            {alphas.map((a) => (
              <th key={a}>{a}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.df} className="border-b border-teal-900/5">
              <td className="py-2 font-mono">{r.df}</td>
              {r.values.map((v, i) => (
                <td key={i} className="font-mono">
                  {v.toFixed(2)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </TablePage>
  );
}

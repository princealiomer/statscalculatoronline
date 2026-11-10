import type { Metadata } from "next";
import { fCriticalTable } from "@/lib/stats/tables";
import { TablePage } from "@/components/TablePage";

export const metadata: Metadata = {
  title: "F-Table",
  description: "F critical values at α = 0.05.",
};

export default function FTablePage() {
  const rows = fCriticalTable(0.05);
  const df1s = [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20];
  return (
    <TablePage title="F-Table (α = 0.05)" blurb="Upper critical values of the F distribution.">
      <table className="w-full min-w-[48rem] text-left text-sm">
        <thead>
          <tr className="border-b border-teal-900/10">
            <th className="py-2">df2 \\ df1</th>
            {df1s.map((d) => (
              <th key={d}>{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.df2} className="border-b border-teal-900/5">
              <td className="py-2 font-mono">{r.df2}</td>
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

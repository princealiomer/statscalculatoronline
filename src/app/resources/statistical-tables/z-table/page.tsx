import type { Metadata } from "next";
import { zCriticalRows } from "@/lib/stats/tables";
import { TablePage } from "@/components/TablePage";

export const metadata: Metadata = {
  title: "Z-Table",
  description: "Standard normal critical values for common significance levels.",
};

export default function ZTablePage() {
  const rows = zCriticalRows();
  return (
    <TablePage title="Z-Table" blurb="Critical values from the standard normal distribution.">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-teal-900/10">
            <th className="py-2">α</th>
            <th>One-tailed z</th>
            <th>Two-tailed z</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.alpha} className="border-b border-teal-900/5">
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

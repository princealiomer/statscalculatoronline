import type { Metadata } from "next";
import { zCriticalRows } from "@/lib/stats/tables";
import { TablePage } from "@/components/TablePage";
import { buildPageMetadata } from "@/lib/seo/meta";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>α</TableHead>
            <TableHead>One-tailed z</TableHead>
            <TableHead>Two-tailed z</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.alpha}>
              <TableCell className="font-mono">{r.alpha}</TableCell>
              <TableCell className="font-mono">{r.oneTail.toFixed(4)}</TableCell>
              <TableCell className="font-mono">{r.twoTail.toFixed(4)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TablePage>
  );
}

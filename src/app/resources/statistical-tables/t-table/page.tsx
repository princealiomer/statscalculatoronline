import type { Metadata } from "next";
import { tCriticalTable } from "@/lib/stats/tables";
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
      <Table className="min-w-[32rem]">
        <TableHeader>
          <TableRow>
            <TableHead>df</TableHead>
            {alphas.map((a) => (
              <TableHead key={a}>α={a}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.df}>
              <TableCell className="font-mono">{r.df}</TableCell>
              {r.values.map((v, i) => (
                <TableCell key={i} className="font-mono">
                  {v.toFixed(3)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TablePage>
  );
}

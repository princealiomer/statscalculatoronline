import type { Metadata } from "next";
import { fCriticalTable } from "@/lib/stats/tables";
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
  title: "F-Table",
  description:
    "F distribution critical values at α = 0.05 for ANOVA and variance ratio tests. Free table on Stats Calculator Online.",
  path: "/resources/statistical-tables/f-table",
  keywords: ["f table", "f critical value", "anova table"],
});

export default function FTablePage() {
  const rows = fCriticalTable(0.05);
  const df1s = [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20];
  return (
    <TablePage title="F-Table (α = 0.05)" blurb="Upper critical values of the F distribution.">
      <Table className="min-w-[48rem]">
        <TableHeader>
          <TableRow>
            <TableHead>df2 \ df1</TableHead>
            {df1s.map((d) => (
              <TableHead key={d}>{d}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.df2}>
              <TableCell className="font-mono">{r.df2}</TableCell>
              {r.values.map((v, i) => (
                <TableCell key={i} className="font-mono">
                  {v.toFixed(2)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TablePage>
  );
}

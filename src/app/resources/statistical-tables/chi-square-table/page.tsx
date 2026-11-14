import type { Metadata } from "next";
import { chiCriticalTable } from "@/lib/stats/tables";
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
  title: "Chi-Square Table",
  description:
    "Chi-square (χ²) critical values by degrees of freedom across common α levels. Free reference on Stats Calculator Online.",
  path: "/resources/statistical-tables/chi-square-table",
  keywords: ["chi square table", "chi-square critical value"],
});

export default function ChiTablePage() {
  const rows = chiCriticalTable();
  const alphas = [0.995, 0.99, 0.975, 0.95, 0.9, 0.1, 0.05, 0.025, 0.01];
  return (
    <TablePage title="Chi-Square Table" blurb="Critical values of the χ² distribution.">
      <Table className="min-w-[48rem]">
        <TableHeader>
          <TableRow>
            <TableHead>df</TableHead>
            {alphas.map((a) => (
              <TableHead key={a}>{a}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.df}>
              <TableCell className="font-mono">{r.df}</TableCell>
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

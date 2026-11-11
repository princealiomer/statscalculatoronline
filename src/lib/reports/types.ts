import type { CalcResult } from "@/lib/stats/format";

export type ReportStyle = "apa" | "ama" | "plain";

export type ReportFormula = {
  label: string;
  latex: string;
  note?: string;
};

export type ReportContext = {
  title: string;
  description: string;
  engine: string;
  category: string;
  categoryName?: string;
  slug: string;
  result: CalcResult;
  /** Raw form values keyed by field name */
  inputs?: Record<string, string>;
  /** Human labels for input field names */
  fieldLabels?: Record<string, string>;
  /** Formulas applied for this calculator */
  formulas?: ReportFormula[];
};

export type BuiltReport = {
  citation: string;
  writeUp: string;
  methods: string;
  results: string;
  latex: string;
  assumptions: string[];
  csv: string;
  generatedAt: string;
  /** Plain-text complete breakdown for copy/paste */
  breakdown: string;
};

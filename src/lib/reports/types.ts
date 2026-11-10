import type { CalcResult } from "@/lib/stats/format";

export type ReportStyle = "apa" | "ama" | "plain";

export type ReportContext = {
  title: string;
  description: string;
  engine: string;
  category: string;
  slug: string;
  result: CalcResult;
  inputs?: Record<string, string>;
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
};

export type FormulaBlock = {
  label: string;
  latex: string;
  note?: string;
};

export type RoleUseCase = {
  role: string;
  uses: string[];
};

export type FaqItem = {
  q: string;
  a: string;
};

export type BenchmarkSegment = {
  segment: string;
  guidance: string;
};

/** Full “Understanding & Using …” outline for every calculator page */
export type CalculatorOutline = {
  toolName: string;
  whatIs: {
    definition: string;
    problemSolved: string;
    keyComponents: string[];
  };
  why: {
    value: string;
    withoutIt: string;
    whenToRely: string;
  };
  howUsed: {
    roles: RoleUseCase[];
    scenario: string;
  };
  formula: {
    intro: string;
    formulas: FormulaBlock[];
    variableBreakdown: string[];
    sampleCalculation: string;
  };
  results: {
    decoding: string[];
    redFlags: string[];
    hiddenWins: string[];
    impact: string;
  };
  workflow: {
    audit: string;
    diagnose: string;
    execute: string;
    measure: string;
  };
  troubleshooting: FaqItem[];
  benchmarks: BenchmarkSegment[];
  integrations: string[];
  /** Optional annotated UI tips for the on-page calculator */
  uiTips: string[];
};

/** Legacy partial guides still used as enrichment sources */
export type CalculatorGuideContent = {
  overview: string;
  howTo: string[];
  formulas: FormulaBlock[];
  interpretation: string[];
  tips: string[];
  whenToUse?: string;
  example?: string;
};

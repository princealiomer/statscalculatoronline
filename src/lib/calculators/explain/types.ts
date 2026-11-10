export type FormulaBlock = {
  label: string;
  latex: string;
  note?: string;
};

export type CalculatorGuideContent = {
  overview: string;
  howTo: string[];
  formulas: FormulaBlock[];
  interpretation: string[];
  tips: string[];
  whenToUse?: string;
  example?: string;
};

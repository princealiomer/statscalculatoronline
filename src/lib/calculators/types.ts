export type CategoryDef = {
  id: string;
  name: string;
  description: string;
};

export type CalculatorDef = {
  category: string;
  slug: string;
  title: string;
  description: string;
  /** Engine key used by CalculatorRunner */
  engine: string;
  formula?: string;
  keywords?: string[];
};

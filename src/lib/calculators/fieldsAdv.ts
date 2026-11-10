import type { FieldDef } from "@/lib/calculators/fields";

export function fieldsAdv(engine: string): FieldDef[] | null {
  const n = (name: string, label: string, defaultValue?: string): FieldDef => ({
    name,
    label,
    type: "number",
    defaultValue,
  });
  const area = (name: string, label: string, placeholder: string, defaultValue?: string): FieldDef => ({
    name,
    label,
    type: "textarea",
    placeholder,
    defaultValue,
  });
  const sel = (
    name: string,
    label: string,
    options: { value: string; label: string }[],
    defaultValue: string,
  ): FieldDef => ({ name, label, type: "select", options, defaultValue });

  switch (engine) {
    case "spearman":
    case "kendall":
    case "point-biserial":
    case "slope-test":
      return [
        area(
          "data",
          engine === "point-biserial" ? "binary,continuous pairs" : "x,y pairs",
          engine === "point-biserial" ? "0,12.5\n1,18.2\n0,11.0" : "1,2\n2,4\n3,5\n4,4\n5,7",
        ),
      ];
    case "bartlett":
    case "hartley-fmax":
      return [
        area(
          "data",
          "Groups (blank-line separated)",
          "1,2,3,4\n\n5,6,7,9\n\n2,3,3,4",
        ),
      ];
    case "bonferroni":
      return [
        area("pvalues", "p-values", "0.01, 0.04, 0.20"),
        n("alpha", "Familywise α", "0.05"),
      ];
    case "chi-homogeneity":
      return [area("data", "Populations × categories counts", "20,30,25\n18,22,40")];
    case "bayes-rule":
      return [
        n("prior", "Prior P(A)", "0.01"),
        n("sensitivity", "Sensitivity P(+|A)", "0.95"),
        n("specificity", "Specificity P(−|¬A)", "0.90"),
      ];
    case "multinomial":
      return [
        n("n", "n", "10"),
        area("probs", "Probabilities", "0.2,0.3,0.5"),
        area("counts", "Counts", "2,3,5"),
      ];
    case "fleiss-kappa":
      return [area("data", "Subjects × category counts", "0,1,2\n1,1,1\n2,0,1\n0,2,1")];
    case "roc-auc":
      return [
        area("data", "score,label (0/1)", "0.1,0\n0.4,0\n0.35,1\n0.8,1\n0.6,1\n0.2,0"),
        n("threshold", "Classification threshold", "0.5"),
      ];
    case "hierarchical-cluster":
    case "kmeans":
      return [
        area("data", "Observation matrix", "1,2\n1.5,1.8\n5,8\n8,8\n1,0.6\n9,11"),
        n("k", "Number of clusters", "2"),
      ];
    case "mediator":
      return [area("data", "Rows: y,x,m", "10,2,3\n12,3,4\n9,1,2\n15,5,6\n11,2,3\n14,4,5")];
    case "moderator":
      return [area("data", "Rows: y,x,w", "10,2,1\n12,3,0\n9,1,1\n15,5,0\n11,2,1\n14,4,0")];
    case "gage-rr":
      return [area("data", "Parts × operators", "10,11,10\n12,12,13\n9,10,9\n15,14,15")];
    case "process-cap-nonnormal":
      return [
        area("data", "Process data", "10,11,12,13,12,11,14,15,10,9,12,13,11,12,14"),
        n("lsl", "LSL", "8"),
        n("usl", "USL", "16"),
      ];
    case "monte-carlo":
      return [
        sel("dist", "Distribution", [
          { value: "normal", label: "Normal" },
          { value: "uniform", label: "Uniform" },
          { value: "exponential", label: "Exponential" },
        ], "normal"),
        n("n", "Draws", "5000"),
        n("mean", "Mean (normal)", "0"),
        n("sd", "SD (normal)", "1"),
        n("a", "Min (uniform)", "0"),
        n("b", "Max (uniform)", "1"),
        n("lambda", "λ (exponential)", "1"),
        n("threshold", "Optional P(X>thr)", "1.96"),
      ];
    case "tost":
      return [
        area("data", "Differences / paired diffs", "0.1, -0.2, 0.05, 0.0, -0.1, 0.15, 0.02"),
        n("low", "Lower equivalence bound", "-0.5"),
        n("high", "Upper equivalence bound", "0.5"),
        n("alpha", "α", "0.05"),
      ];
    case "fractional-factorial":
      return [n("k", "Factors k", "4"), n("p", "Fraction parameter p", "1")];
    case "plackett-burman":
      return [n("k", "Factors", "7")];
    case "box-behnken":
      return [n("k", "Factors (≥3)", "3"), n("centers", "Center points", "3")];
    case "central-composite":
      return [n("k", "Factors", "3"), n("centers", "Center points", "6")];
    case "vif":
      return [area("data", "Predictor matrix", "1,2,3\n2,3,5\n3,3,6\n4,5,8\n5,5,9\n6,7,11")];
    case "matrix-ops":
      return [
        sel("op", "Operation", [
          { value: "det", label: "Determinant" },
          { value: "transpose", label: "Transpose" },
          { value: "add", label: "Add A+B" },
          { value: "mul", label: "Multiply A×B" },
        ], "det"),
        area("a", "Matrix A", "1,2\n3,4"),
        area("b", "Matrix B (add/mul)", "5,6\n7,8"),
      ];
    case "stratified-n":
      return [
        n("N", "Population size", "10000"),
        n("moe", "Margin of error", "0.05"),
        n("p", "Assumed proportion", "0.5"),
        n("level", "Confidence level", "0.95"),
      ];
    default:
      return null;
  }
}

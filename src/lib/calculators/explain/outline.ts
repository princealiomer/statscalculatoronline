import type { CalculatorDef } from "@/lib/calculators/types";
import { getCategory } from "@/lib/calculators/registry";
import { siteConfig } from "@/config/site";
import type {
  CalculatorGuideContent,
  CalculatorOutline,
  FormulaBlock,
} from "./types";

type Domain =
  | "stats"
  | "geometry"
  | "math"
  | "finance"
  | "physics"
  | "conversion"
  | "health"
  | "time"
  | "text"
  | "general";

function domainFor(category: string): Domain {
  if (
    [
      "descriptive-statistics",
      "hypothesis-testing",
      "probability",
      "confidence-interval",
      "regression-analysis",
      "correlation",
      "multivariate-analysis",
      "survival-analysis",
      "experimental-design",
      "causal-inference",
      "reliability-analysis",
      "cluster-analysis",
      "measurement-systems",
      "matrix-algebra",
      "chart",
    ].includes(category)
  ) {
    return "stats";
  }
  if (category === "geometry-plane" || category === "geometry-solids") return "geometry";
  if (
    ["algebra", "fractions", "general-math", "discrete-mathematics", "trigonometry"].includes(
      category,
    )
  ) {
    return "math";
  }
  if (["finance", "credit-analysis", "percentages", "academic-grades"].includes(category)) {
    return "finance";
  }
  if (category === "physics" || category === "chemistry") return "physics";
  if (category === "conversions") return "conversion";
  if (category === "health") return "health";
  if (category === "time") return "time";
  if (["text-tools", "random-tools", "games"].includes(category)) return "text";
  return "general";
}

function uniqueStrings(items: string[]) {
  return [...new Set(items.map((s) => s.trim()).filter(Boolean))];
}

function uniqueFormulas(blocks: FormulaBlock[]) {
  const seen = new Set<string>();
  const out: FormulaBlock[] = [];
  for (const f of blocks) {
    const key = `${f.label}|${f.latex}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(f);
  }
  return out;
}

function isGenericFormula(f: FormulaBlock) {
  return /\\text\{output\}|\\text\{result\}|f\(\\text\{inputs\}\)/i.test(f.latex);
}

export function buildOutline(
  calc: CalculatorDef,
  guide: CalculatorGuideContent,
): CalculatorOutline {
  const tool = calc.title;
  const cat = getCategory(calc.category);
  const catName = cat?.name ?? "this topic";
  const domain = domainFor(calc.category);
  const desc = calc.description.replace(/\.*$/, "");

  const definition =
    guide.overview ||
    `The ${tool} calculator on ${siteConfig.name} computes ${desc.toLowerCase()}. Enter the values shown on this page to get an instant result with the working formula.`;

  const problemSolved =
    guide.whenToUse ||
    (domain === "stats"
      ? `It helps you turn data into a clear statistical result—so you can tell whether a difference, association, or estimate is supported by the numbers.`
      : domain === "geometry"
        ? `It replaces hand calculations for ${tool.toLowerCase()} with a checked volume, area, or length from the dimensions you enter.`
        : domain === "math"
          ? `It solves the ${tool.toLowerCase()} problem quickly and shows the formula so you can verify the answer.`
          : domain === "finance"
            ? `It removes spreadsheet guesswork for ${tool.toLowerCase()} so you can compare options with transparent math.`
            : domain === "physics"
              ? `It evaluates the standard ${tool.toLowerCase()} relation from the quantities you enter, with matching units in mind.`
              : domain === "conversion"
                ? `It converts between units without looking up factors or risking an offset mistake.`
                : `It turns a multi-step ${tool.toLowerCase()} task into a clear, explainable answer.`);

  const keyComponents =
    domain === "geometry"
      ? [
          `The dimension fields on this page (matched to ${tool.toLowerCase()} inputs)`,
          "Consistent length units for every measurement you enter",
          "The geometry formula used for this shape",
          "Step-by-step show-work after you calculate",
        ]
      : domain === "math"
        ? [
            `The inputs shown for ${tool.toLowerCase()}`,
            "The algebraic or arithmetic formula for this tool",
            "Step-by-step working after you calculate",
          ]
        : domain === "stats"
          ? [
              "Data or parameter fields required by this method",
              "Options such as sample vs population, α, or sidedness when shown",
              "The test statistic, estimate, or interval returned in Results",
              "Formula cards and optional report exports",
            ]
          : domain === "finance"
            ? [
                "Money, rate, and time fields shown on this page",
                "The compounding or payment formula used",
                "Results with intermediate steps where available",
              ]
            : [
                `The inputs shown for ${tool}`,
                "The formula or conversion used by this tool",
                "Clear results after you calculate",
              ];

  const value =
    domain === "stats"
      ? `Tracking ${tool.toLowerCase()} matters because product, research, and experiment decisions depend on whether an effect is distinguishable from noise—and whether the estimate is precise enough to act on.`
      : domain === "geometry"
        ? `Getting ${tool.toLowerCase()} right matters whenever volume, surface, or length drives materials, weight, cost, or a homework grade. A wrong height or mixed units silently ruins the answer.`
        : domain === "math"
          ? `A correct ${tool.toLowerCase()} result saves time on homework, exams, and everyday number work—and the on-page formula helps you learn the method, not just the answer.`
          : domain === "finance"
            ? `Transparent ${tool.toLowerCase()} math helps you compare options without opaque spreadsheet shortcuts.`
            : `A clear ${tool.toLowerCase()} calculation helps you avoid silent arithmetic mistakes when the result drives a decision.`;

  const withoutIt =
    domain === "stats"
      ? `Without ${tool}, teams often ship changes on anecdote or miss a real shift because nobody quantified uncertainty.`
      : domain === "geometry"
        ? `Without a clear ${tool.toLowerCase()} check, people mix slant height with vertical height, mix units, or forget a constant like ⅓—and build or grade from the wrong number.`
        : `Without a clear ${tool.toLowerCase()} workflow you risk inconsistent hand calculations and answers that are hard to recheck.`;

  const whenToRely =
    guide.whenToUse ||
    (domain === "geometry"
      ? `Use ${tool} whenever you know the shape’s dimensions and need volume, area, or related measures in matching units.`
      : domain === "math"
        ? `Use ${tool} for homework checks, quick evaluations, and verifying a manual solution.`
        : `Use ${tool} when the inputs on this page are known and you need a transparent result.`);

  const roles =
    domain === "geometry"
      ? [
          {
            role: "Students & teachers",
            uses: [
              `Check ${tool.toLowerCase()} homework with the same formula taught in class.`,
              "See how changing base or height scales the result.",
              "Compare prism vs pyramid (or cylinder vs cone) intuition with related tools.",
            ],
          },
          {
            role: "Builders & DIY",
            uses: [
              "Estimate material volume for pyramidal or solid shapes.",
              "Keep all measurements in one unit before calculating.",
              "Cross-check a sketch dimension against the calculator output.",
            ],
          },
          {
            role: "Design & engineering",
            uses: [
              "Sanity-check 3D model volumes from base and height.",
              "Pair volume with density for a rough mass estimate elsewhere.",
              "Document the dimensions used for a quote or cut list.",
            ],
          },
        ]
      : domain === "math"
        ? [
            {
              role: "Students",
              uses: [
                `Verify ${tool.toLowerCase()} answers step by step.`,
                "Practice with sample values, then try your own.",
                "Learn the formula alongside the numeric result.",
              ],
            },
            {
              role: "Teachers",
              uses: [
                "Demo the method live with different inputs.",
                "Show common mistakes (domain errors, wrong operation).",
                "Point students to related algebra or fraction tools.",
              ],
            },
            {
              role: "Everyday users",
              uses: [
                `Get a fast ${tool.toLowerCase()} result without a full CAS.`,
                "Double-check a phone or spreadsheet answer.",
                "Keep units and signs consistent with the problem statement.",
              ],
            },
          ]
        : domain === "stats"
          ? [
              {
                role: "Analysts & researchers",
                uses: [
                  `Run ${tool} on cleaned data before drawing conclusions.`,
                  "Report the statistic, uncertainty, and assumptions together.",
                  "Export a draft write-up for notes or methods sections.",
                ],
              },
              {
                role: "Students",
                uses: [
                  `Check homework against the ${tool} formula cards.`,
                  "Compare sample vs population options when shown.",
                  "Practice reading p-values and intervals carefully.",
                ],
              },
              {
                role: "Experimenters",
                uses: [
                  "Pre-specify α and the primary metric before peeking.",
                  "Re-run after collecting enough observations.",
                  "Pair this test with effect size or a related calculator.",
                ],
              },
            ]
          : [
              {
                role: "Practitioners",
                uses: [
                  `Run ${tool} whenever inputs change.`,
                  "Keep a record of the values you used.",
                  "Compare scenarios with the same formula.",
                ],
              },
              {
                role: "Students & educators",
                uses: [
                  `Verify answers for ${tool}.`,
                  "Show the formula and a worked example.",
                  "Discuss units and assumptions out loud.",
                ],
              },
              {
                role: "Builders & analysts",
                uses: [
                  "Cross-check a spreadsheet against this page.",
                  "Change one input at a time to see sensitivity.",
                  "Open a related tool when you need a neighboring method.",
                ],
              },
            ];

  const scenario =
    guide.example ||
    (domain === "geometry"
      ? `You measure a square base of 6 m and a vertical height of 8 m for a pyramidal roof cap. Enter base = 6 and height = 8 in the ${tool} calculator; volume is (1/3)·6²·8 = 96 m³. If you had used slant height instead of vertical height, the volume would be wrong.`
      : domain === "math"
        ? `Enter the values from your problem into the ${tool} calculator, confirm the operation and units, then compare the result and steps to your handwritten work.`
        : domain === "stats"
          ? `Paste a clean numeric sample into the ${tool} calculator, choose the options that match your design, then read the primary result with any interval or p-value shown.`
          : `Enter the known inputs for ${tool}, review the formula and steps, then use the result in your plan or homework.`);

  const rawFormulas = uniqueFormulas(
    (guide.formulas?.length ? guide.formulas : []).filter((f) => !isGenericFormula(f)),
  );
  const formulas = rawFormulas;

  const variableBreakdown =
    domain === "geometry"
      ? uniqueStrings([
          ...formulas.slice(0, 3).map((f) => f.note || `${f.label} is shown in the formula card above.`),
          "Use the same length unit for every dimension (cm with cm, m with m).",
          "Volume outputs are in cubic units of that length; area outputs are in square units.",
        ])
      : domain === "math"
        ? uniqueStrings([
            ...formulas.slice(0, 3).map((f) => f.note || `${f.label}: see the rendered formula card.`),
            "Match variable names on the formula cards to the labeled fields above.",
            "Watch domain restrictions (division by zero, even roots of negatives, logs of non-positives).",
          ])
        : domain === "stats"
          ? uniqueStrings([
              ...formulas.slice(0, 3).map((f) => f.note || `${f.label}: see the formula card.`),
              "Inputs: the numbers or groups you enter in the calculator panel.",
              "Output: the primary statistic plus supporting fields (p-values, intervals, tables) in Results.",
            ])
          : uniqueStrings([
              ...formulas.slice(0, 3).map((f) => f.note || `${f.label}: see the formula card.`),
              "Inputs feed the method; Results show the primary quantity and any helpers.",
            ]);

  const sampleCalculation =
    guide.example ||
    (domain === "geometry"
      ? `Example: base side b = 6, height h = 8 → V = (1/3)·b²·h = (1/3)·36·8 = 96 (cubic units). Change h to 4 and the volume halves.`
      : `Example: enter a small known case, click Calculate, then match the on-screen ${tool} result to the formula cards. Change one input at a time to see how the output moves.`);

  const decoding = guide.interpretation?.length
    ? guide.interpretation
    : domain === "geometry"
      ? [
          "Volume should grow when you increase base or height (for a pyramid, base enters squared).",
          "If the number looks huge or tiny, check whether you mixed meters with centimeters.",
          "Surface-area tools distinguish lateral area from total area—read the label on each result.",
        ]
      : domain === "math"
        ? [
            "Confirm the operation matches the problem (add vs multiply, simplify vs convert).",
            "Simplified fractions and exact roots are preferred when the tool offers them.",
            "Impossible or blank results usually mean a domain error in the inputs.",
          ]
        : domain === "stats"
          ? [
              "Good: results that meet your pre-set decision rule with adequate sample size.",
              "Inconclusive: effects near the decision boundary—collect more data or refine the design.",
              "Critical: assumption failures, tiny n, or contradictory companion metrics.",
            ]
          : [
              "Good: outputs that pass a quick sanity check against a known case.",
              "Sensitive: results that swing hard when one input changes slightly—double-check that input.",
              "Critical: impossible units or negative quantities where none should exist.",
            ];

  const redFlags = uniqueStrings([
    ...(domain === "geometry"
      ? [
          "Using slant height instead of perpendicular (vertical) height for volume.",
          "Mixing length units (cm with m) before multiplying.",
          "Forgetting constants such as ⅓ for a pyramid or ½ for a triangular area.",
        ]
      : domain === "math"
        ? [
            "Wrong operation for the word problem.",
            "Leaving an unsimplified fraction when the tool already reduced it.",
            "Ignoring domain restrictions called out in the tips.",
          ]
        : domain === "stats"
          ? [
              "Tiny samples that look “significant” only by chance.",
              "Mixing percentages with counts, or treating dependent rows as independent.",
              "Seasonality or short windows mistaken for a lasting change.",
            ]
          : [
              "Unit mismatches (monthly vs annual, decimals vs percents).",
              "Copying the wrong field into a downstream spreadsheet.",
            ]),
    ...(guide.tips ?? []).slice(0, 2),
  ]);

  const hiddenWins =
    domain === "geometry"
      ? [
          "Catching a slant-vs-vertical height mix-up before you order materials.",
          "Confirming that doubling height doubles volume while doubling base side multiplies volume by four (square base).",
          "Using matching units once, then converting the final cubic result if needed.",
        ]
      : domain === "stats"
        ? [
            "Steady improvement across several samples even when a single test is not decisive.",
            "Narrower intervals after cleaning measurement error.",
            "Alignment between this metric and a companion KPI.",
          ]
        : [
            "Matching a textbook worked example before trusting a harder case.",
            "Finding the sensitive input by changing one value at a time.",
            "Linking a related calculator when you need the next step in the method.",
          ];

  const impact =
    domain === "geometry"
      ? `Tie ${tool} outputs to the decision they support—material volume, weight estimate, or a graded problem—and re-check dimensions if the number looks off.`
      : domain === "stats"
        ? `Correlate ${tool} outcomes with the real decision metric. A statistically clear win that does not move the outcome you care about still needs review.`
        : `Use the ${tool} result in the next step of your work, and keep the inputs you used so you can reproduce the answer.`;

  const workflow =
    domain === "geometry"
      ? {
          audit: `List the dimensions the shape needs (for ${tool}, the labeled fields above). Convert every length to one unit.`,
          diagnose: `If the result looks wrong, check vertical vs slant height, base vs radius, and unit consistency.`,
          execute: `Use the volume or area in your estimate, model, or homework write-up.`,
          measure: `If you cut or build from the number, re-measure the critical dimension and re-run ${tool}.`,
        }
      : domain === "math"
        ? {
            audit: `Copy the problem values into the labeled fields for ${tool}.`,
            diagnose: `If the answer disagrees with yours, compare operations and simplify steps.`,
            execute: `Record the result and the formula used.`,
            measure: `Try one alternate input set (or the Sample values) to confirm the tool behaves as expected.`,
          }
        : domain === "stats"
          ? {
              audit: `Filter to the segment that matters. Paste only clean numeric inputs into ${tool}.`,
              diagnose: `If the result looks wrong, check assumptions and options (sample vs population, sidedness, α).`,
              execute: `Document the pre/post inputs if you are comparing conditions.`,
              measure: `Wait for enough new observations before calling a lasting change.`,
            }
          : {
              audit: `Enter the required inputs for ${tool} exactly as labeled.`,
              diagnose: `If something looks off, re-check units and required fields.`,
              execute: `Apply the result to your task.`,
              measure: `Re-run when inputs change.`,
            };

  const troubleshooting =
    domain === "geometry"
      ? [
          {
            q: `Why does my ${tool} volume look wrong?`,
            a: `Confirm you entered perpendicular height (straight up from the base), not slant height along a face, and that every length uses the same unit.`,
          },
          {
            q: "Do I need matching units?",
            a: "Yes. If the base is in meters and the height is in centimeters, convert first. The calculator multiplies the numbers you type; it does not guess unit labels.",
          },
          {
            q: "Where is the formula?",
            a: `The formula cards on this page show the exact relation used for ${tool}. After Calculate, the steps repeat the same math with your numbers.`,
          },
          {
            q: "Can I use this for homework?",
            a: `Yes—show the formula, your inputs, and the result. For formal reports, state units clearly (for example m³).`,
          },
        ]
      : domain === "math"
        ? [
            {
              q: `Why isn’t ${tool} calculating?`,
              a: "Fill every required field with valid numbers. Watch for division by zero or inputs outside the allowed domain.",
            },
            {
              q: "My answer looks different from the textbook.",
              a: "Check whether the book wants a simplified fraction, decimal rounding, or a different form (mixed number, radical). Match formats before assuming an error.",
            },
            {
              q: "Can I trust the steps?",
              a: `The steps follow the same formula shown on this page. Use them to find which line diverges from your work.`,
            },
            {
              q: "What next if I need a related skill?",
              a: `Open a similar calculator from the widgets below (for example simplify, convert, or a neighboring algebra tool).`,
            },
          ]
        : [
            {
              q: `Why isn’t my ${tool} data calculating?`,
              a: `Confirm every required field is filled and numbers use dots for decimals. Empty rows or letters often block the engine. Try Sample data, then replace with yours.`,
            },
            {
              q: "What if two results disagree?",
              a:
                domain === "stats"
                  ? `Check sample size, window length, and whether you optimized a vanity metric. Read the interval—not only a single p-value.`
                  : `Lock units and definitions first, then re-run both calculations with identical inputs.`,
            },
            {
              q: `Why does ${tool} look alarming after a small change?`,
              a:
                domain === "stats"
                  ? `Low sample size or a shifted mix of users can exaggerate movement. Prefer longer windows and pre-set decision rules.`
                  : `Re-check the sensitive input and whether the formula is nonlinear in that input.`,
            },
            {
              q: "Can I use the export for class or drafts?",
              a: `Yes for homework, labs, and internal notes. For formal publication, restate assumptions and confirm the method matches your protocol.`,
            },
          ];

  const benchmarks: CalculatorOutline["benchmarks"] =
    domain === "geometry"
      ? [
          {
            segment: "Classroom geometry",
            guidance: `Always label units. For a square-base pyramid, volume is one-third of the prism with the same base and height.`,
          },
          {
            segment: "Construction / DIY",
            guidance: `Measure vertical height with a level or plumb reference when possible; slant measurements belong to face area, not volume.`,
          },
          {
            segment: "3D modeling",
            guidance: `Confirm whether your model’s “height” is apex altitude or a face edge before trusting ${tool}.`,
          },
          {
            segment: "Quick sanity check",
            guidance: `If you double every linear dimension, volumes scale by 8 and areas by 4—use that to spot unit mistakes.`,
          },
        ]
      : domain === "math"
        ? [
            {
              segment: "Homework",
              guidance: `Match the requested form (exact vs decimal) before comparing to an answer key.`,
            },
            {
              segment: "Exams",
              guidance: `Write the formula, substitute, then simplify—same order as the on-page steps.`,
            },
            {
              segment: "Everyday calc",
              guidance: `Prefer exact fractions when money or recipes need clean ratios.`,
            },
            {
              segment: "Teaching",
              guidance: `Change one input live so students see which variable drives the result.`,
            },
          ]
        : domain === "stats"
          ? [
              {
                segment: "Experiments",
                guidance: `Pre-register the metric and minimum detectable effect before relying on ${tool}.`,
              },
              {
                segment: "Product analytics",
                guidance: `Pair ${tool} with a north-star outcome, not only a click or open rate.`,
              },
              {
                segment: "Content / research",
                guidance: `Segment before testing; mixed traffic sources inflate noise.`,
              },
              {
                segment: "Academic",
                guidance: `Pre-specify α, sidedness, and exclusions. Report effect sizes with the primary result.`,
              },
            ]
          : [
              {
                segment: "Everyday use",
                guidance: `Re-run ${tool} when any driving input changes.`,
              },
              {
                segment: "Team handoff",
                guidance: `Share the inputs you used so others can reproduce the number.`,
              },
              {
                segment: "Quality check",
                guidance: `Compare against a known example before trusting a high-stakes case.`,
              },
              {
                segment: "Documentation",
                guidance: `Note units and assumptions next to the result.`,
              },
            ];

  const integrations =
    domain === "geometry"
      ? [
          `Compare related ${catName} shapes from the similar-tools list (prism vs pyramid, cone vs cylinder).`,
          "Convert final cubic or square units with a length/volume converter if your plans use a different system.",
          "Keep a sketch of base and height next to the numeric result.",
        ]
      : domain === "math"
        ? [
            `Open related ${catName} tools when you need the next algebraic step.`,
            "Use fraction and percent converters when a problem mixes forms.",
          ]
        : domain === "stats"
          ? [
              `Combine ${tool} with related ${catName} calculators from the similar-tools list.`,
              `Use ${siteConfig.name} critical-value tables when you need a companion reference.`,
            ]
          : [
              `Combine ${tool} with related ${catName} calculators when you need a neighboring method.`,
            ];

  const uiTips = uniqueStrings([
    ...(guide.howTo ?? []).slice(0, 3),
    domain === "geometry"
      ? `Enter the labeled dimensions for ${tool} (for a square-base pyramid: base side and vertical height).`
      : `Use the calculator fields at the top of this ${tool} page.`,
    "Try Sample values if shown, then replace them with your own.",
    "After results appear, read the steps to confirm the formula matched your intent.",
  ]).slice(0, 6);

  return {
    toolName: tool,
    whatIs: { definition, problemSolved, keyComponents },
    why: { value, withoutIt, whenToRely },
    howUsed: { roles, scenario },
    formula: {
      intro:
        formulas.length > 0
          ? `The formula below is the one used for ${tool} on ${siteConfig.name}. Symbols match the input labels on this page.`
          : `Enter your values above, then review the step-by-step working for ${tool}. Formula cards appear here when a closed-form expression is available.`,
      formulas,
      variableBreakdown,
      sampleCalculation,
    },
    results: { decoding, redFlags, hiddenWins, impact },
    workflow,
    troubleshooting,
    benchmarks,
    integrations,
    uiTips,
  };
}

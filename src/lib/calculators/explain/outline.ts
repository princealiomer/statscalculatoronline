import type { CalculatorDef } from "@/lib/calculators/types";
import { getCategory } from "@/lib/calculators/registry";
import { siteConfig } from "@/config/site";
import {
  domainFor,
  faqForDomain,
  sectionsForDomain,
  type DomainSections,
} from "./domains";
import { faqForEngine } from "./troubleshooting";
import type {
  CalculatorGuideContent,
  CalculatorOutline,
  FormulaBlock,
} from "./types";

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

/** Engine-specific section overrides so pregnancy pages don’t inherit BMI-style tips, etc. */
function sectionsForEngine(calc: CalculatorDef, tool: string): Partial<DomainSections> | null {
  switch (calc.engine) {
    case "pregnancy-due":
      return {
        scenario: `Enter LMP as YYYY-MM-DD in ${tool}, click Calculate, then read the estimated due date (LMP + 280 days) and gestational age—educational only.`,
        decoding: [
          "Estimated due date: calendar date from LMP + 280 days (Naegele’s rule).",
          "Gestational age: weeks and days from LMP to today.",
          "Clinics may date pregnancy with ultrasound—those dates can differ.",
        ],
        redFlags: [
          "Entering today’s date instead of LMP.",
          "Using DD/MM/YYYY when the field expects YYYY-MM-DD.",
          "Treating an educational estimate as a clinical due date.",
        ],
        roles: [
          {
            role: "Learners & planners",
            uses: [
              "Ballpark a due date from a known LMP for education.",
              "See how shifting LMP by a few days moves the estimate.",
              "Bring clinical questions to a clinician.",
            ],
          },
          {
            role: "Students & educators",
            uses: [
              "Show Naegele’s rule with a worked date example.",
              "Discuss why ultrasound dating can differ.",
              "Stress that calculators are not medical advice.",
            ],
          },
          {
            role: "Parents-to-be (educational use)",
            uses: [
              "Plan calendar milestones from an LMP estimate.",
              "Compare the on-page rule to another educational source.",
              "Confirm important dates with a clinician.",
            ],
          },
        ],
        benchmarks: [
          {
            segment: "Classroom / homework",
            guidance: "Show LMP + 280 days, the date entered, and the resulting estimate.",
          },
          {
            segment: "Personal planning",
            guidance: `Treat ${tool} as a ballpark calendar aid. Confirm important dates with a clinician.`,
          },
          {
            segment: "Comparing sources",
            guidance: "If an app or clinic differs, compare LMP vs ultrasound dating before assuming an error.",
          },
          {
            segment: "Documentation",
            guidance: "Note the LMP used and that the result is educational only.",
          },
        ],
      };
    case "period-estimate":
      return {
        scenario: `Enter last period start (YYYY-MM-DD) and cycle length into ${tool}, then read next-period and ovulation estimates—educational only, not contraception advice.`,
        redFlags: [
          "Relying on the estimate for birth control.",
          "Using an irregular cycle length as if it were fixed.",
          "Wrong date format (prefer YYYY-MM-DD).",
        ],
        roles: [
          {
            role: "Learners & planners",
            uses: [
              "Estimate next period and ovulation from a known cycle length for education.",
              "See how cycle length shifts the dates.",
              "Do not use this for contraception decisions.",
            ],
          },
          {
            role: "Students & educators",
            uses: [
              "Show a fixed-cycle day-count model with a worked example.",
              "Discuss why irregular cycles break simple rules of thumb.",
              "Stress that this is not medical or birth-control advice.",
            ],
          },
          {
            role: "Everyday tracking (educational)",
            uses: [
              "Ballpark calendar milestones from a regular cycle.",
              "Re-run when the last start date changes.",
              "Confirm health questions with a clinician.",
            ],
          },
        ],
        benchmarks: [
          {
            segment: "Classroom / homework",
            guidance: "Show last start + cycle length and the resulting estimates.",
          },
          {
            segment: "Personal planning",
            guidance: `Treat ${tool} as a rough calendar aid for regular cycles only.`,
          },
          {
            segment: "Irregular cycles",
            guidance: "A single average length is not enough—seek personalized medical guidance.",
          },
          {
            segment: "Documentation",
            guidance: "Note the inputs and that the result is educational only.",
          },
        ],
      };
    case "bmi":
      return {
        scenario: `Enter weight and height in the units ${tool} asks for, click Calculate, then read BMI and category labels as educational screening—not a diagnosis.`,
        redFlags: [
          "Mixing kg/m with lb/in without converting.",
          "Treating BMI category labels as a medical diagnosis.",
          "Ignoring muscle mass, age, or other clinical context.",
        ],
      };
    case "pace":
      return {
        scenario: `Enter distance and time into ${tool}, then read pace (and speed if shown) to plan splits—re-run when either input changes.`,
        redFlags: [
          "Zero distance or time.",
          "Mismatched distance units vs the pace label (per mile vs per km).",
          "Forgetting to update time when distance changes.",
        ],
      };
    case "heart-rate-zone":
      return {
        scenario: `Enter age (and resting HR if asked) into ${tool}, then read training zone estimates—educational only.`,
        redFlags: [
          "Using zones as medical advice for cardiac conditions.",
          "Comparing to a watch that uses a different max-HR formula without checking assumptions.",
          "Out-of-range age inputs.",
        ],
      };
    case "temp-convert":
      return {
        redFlags: [
          "Swapping from/to temperature units.",
          "Treating °C↔°F like a pure multiply without the offset.",
          "Converting twice by accident.",
        ],
      };
    case "mean-median-mode":
    case "average":
    case "mode-only":
    case "mean-only":
    case "sum":
    case "midhinge":
    case "five-number":
    case "descriptive":
    case "basic-stats":
      return {
        scenario: `Paste a clean numeric list into ${tool}, click Calculate, then read the summaries. Compare mean and median if a few values look extreme.`,
        redFlags: [
          "Letters or blank rows mixed into a numeric list.",
          "Trusting the mean alone when outliers are present—check the median too.",
          "Mixing units or scales in the same list without converting.",
        ],
        benchmarks: [
          { segment: "Homework", guidance: "Show the data list and which summary you report." },
          { segment: "EDA", guidance: "Pair mean with median and a five-number summary when skew is possible." },
          { segment: "Reporting", guidance: "State sample size with every summary." },
          { segment: "Teaching", guidance: "Change one outlier live to show mean vs median sensitivity." },
        ],
        roles: [
          {
            role: "Students",
            uses: [
              `Compute ${tool.toLowerCase()} on a clean numeric list.`,
              "Compare mean and median when the distribution may be skewed.",
              "Show the steps in a write-up.",
            ],
          },
          {
            role: "Analysts",
            uses: [
              "Summarize a sample before modeling.",
              "Spot outliers that pull the mean.",
              "Export notes for a draft report.",
            ],
          },
          {
            role: "Teachers",
            uses: [
              "Demo outlier effects live.",
              "Link related descriptive tools below.",
              "Emphasize clean data entry.",
            ],
          },
        ],
      };
    case "gpa":
      return {
        redFlags: [
          "Omitting credit hours or treating every course as equal weight.",
          "Using a letter→point scale that doesn’t match your school.",
          "Treating the estimate as an official transcript GPA.",
        ],
      };
    case "final-grade":
      return {
        redFlags: [
          "Wrong final-exam weight vs the syllabus.",
          "Updating “current” without including all graded categories.",
          "Treating a needed score above 100 as achievable without extra credit rules.",
        ],
      };
    case "grade-weighted":
      return {
        redFlags: [
          "Weights that don’t match the syllabus.",
          "Mixing percent scores with raw points without converting.",
          "Treating the estimate as an official portal grade.",
        ],
      };
    case "age-calc":
      return {
        scenario: `Enter birth date as YYYY-MM-DD (and optional “as of” date) into ${tool}, click Calculate, then read completed years, months, and days.`,
        redFlags: [
          "Ambiguous day/month order—prefer YYYY-MM-DD.",
          "Using total days ÷ 365 instead of the completed calendar breakdown.",
          "Leaving “as of” blank when you meant a historical date.",
        ],
      };
    case "geo-circle":
    case "area-circle":
    case "circle":
      return {
        scenario: `Enter the radius (or the value the field asks for) into ${tool}, confirm radius vs diameter, then read area and circumference in matching units.`,
      };
    default:
      return null;
  }
}

function mergeSections(base: DomainSections, extra: Partial<DomainSections> | null): DomainSections {
  if (!extra) return base;
  return {
    ...base,
    ...extra,
    keyComponents: extra.keyComponents ?? base.keyComponents,
    roles: extra.roles ?? base.roles,
    variableHints: extra.variableHints ?? base.variableHints,
    decoding: extra.decoding ?? base.decoding,
    redFlags: extra.redFlags ?? base.redFlags,
    hiddenWins: extra.hiddenWins ?? base.hiddenWins,
    benchmarks: extra.benchmarks ?? base.benchmarks,
    integrations: extra.integrations ?? base.integrations,
    uiHints: extra.uiHints ?? base.uiHints,
    workflow: extra.workflow ?? base.workflow,
  };
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
  const d = mergeSections(
    sectionsForDomain(domain, tool, catName, calc.category),
    sectionsForEngine(calc, tool),
  );

  const definition =
    guide.overview ||
    `The ${tool} calculator on ${siteConfig.name} computes ${desc.toLowerCase()}. Enter the values shown on this page to get an instant result with the working method.`;

  const problemSolved = guide.whenToUse || d.problemSolved;
  const whenToRely = guide.whenToUse || d.whenToRely;
  const scenario = guide.example || d.scenario;

  const rawFormulas = uniqueFormulas(
    (guide.formulas?.length ? guide.formulas : []).filter((f) => !isGenericFormula(f)),
  );

  const variableBreakdown = uniqueStrings([
    ...rawFormulas.slice(0, 3).map((f) => f.note || `${f.label}: see the formula card.`),
    ...d.variableHints,
  ]);

  const sampleCalculation = guide.example || d.sampleCalculation;

  const decoding = guide.interpretation?.length ? guide.interpretation : d.decoding;

  const redFlags = uniqueStrings([...d.redFlags, ...(guide.tips ?? []).slice(0, 2)]);

  const troubleshooting =
    guide.faq && guide.faq.length > 0
      ? guide.faq
      : (faqForEngine(calc) ?? faqForDomain(domain, tool));

  const uiTips = uniqueStrings([
    ...(guide.howTo ?? []).slice(0, 3),
    ...d.uiHints,
    "After results appear, read the steps to confirm the method matched your intent.",
  ]).slice(0, 6);

  return {
    toolName: tool,
    whatIs: {
      definition,
      problemSolved,
      keyComponents: d.keyComponents,
    },
    why: {
      value: d.value,
      withoutIt: d.withoutIt,
      whenToRely,
    },
    howUsed: {
      roles: d.roles,
      scenario,
    },
    formula: {
      intro:
        rawFormulas.length > 0
          ? `The formula below is the one used for ${tool} on ${siteConfig.name}. Symbols match the input labels on this page.`
          : `Enter your values above, then review the step-by-step working for ${tool}. Formula cards appear here when a closed-form expression is available.`,
      formulas: rawFormulas,
      variableBreakdown,
      sampleCalculation,
    },
    results: {
      decoding,
      redFlags,
      hiddenWins: d.hiddenWins,
      impact: d.impact,
    },
    workflow: d.workflow,
    troubleshooting,
    benchmarks: d.benchmarks,
    integrations: d.integrations,
    uiTips,
  };
}

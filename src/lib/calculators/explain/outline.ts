import type { CalculatorDef } from "@/lib/calculators/types";
import { getCategory } from "@/lib/calculators/registry";
import { siteConfig } from "@/config/site";
import type {
  CalculatorGuideContent,
  CalculatorOutline,
  FormulaBlock,
} from "./types";

function isStatsCategory(category: string) {
  return [
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
  ].includes(category);
}

function isFinanceLike(category: string) {
  return ["finance", "credit-analysis", "percentages", "academic-grades"].includes(category);
}

function defaultFormulas(title: string): FormulaBlock[] {
  return [
    {
      label: "General mapping",
      latex: "\\text{result}=f(\\text{inputs})",
      note: `Exact ${title} equations appear above the interactive calculator and in the formula cards below.`,
    },
  ];
}

export function buildOutline(
  calc: CalculatorDef,
  guide: CalculatorGuideContent,
): CalculatorOutline {
  const tool = calc.title;
  const cat = getCategory(calc.category);
  const catName = cat?.name ?? "this topic";
  const stats = isStatsCategory(calc.category);
  const finance = isFinanceLike(calc.category);

  const definition =
    guide.overview ||
    `The ${tool} calculator on ${siteConfig.name} is a free online tool that computes ${tool.toLowerCase()} results from your inputs, then shows formulas, steps, and exportable reports.`;

  const problemSolved =
    guide.whenToUse ||
    (stats
      ? `It closes the gap between raw numbers and a defensible statistical conclusion—so you are not guessing whether a difference, association, or estimate is real.`
      : finance
        ? `It removes spreadsheet guesswork for ${tool.toLowerCase()} so you can compare options with transparent math instead of opaque rules of thumb.`
        : `It turns a multi-step ${tool.toLowerCase()} problem into a checked, explainable answer with the underlying formula visible.`);

  const keyComponents = [
    `Primary inputs for ${tool} (typed values, pasted lists, or table-style fields on this page)`,
    `Optional settings such as sample vs population, confidence level, sidedness, or units when the method requires them`,
    `The computational engine for “${calc.engine}” that returns the statistic, interval, or derived quantity`,
    `On-page formula cards, step-by-step show-work, and free APA / PDF / Word / CSV exports on ${siteConfig.name}`,
  ];

  const value = stats
    ? `Tracking ${tool.toLowerCase()} matters because decisions about product, content, experiments, and research claims depend on whether an effect is distinguishable from noise—and whether the estimate is precise enough to act on.`
    : `Using a transparent ${tool.toLowerCase()} calculation protects rankings of options, budgets, and user-facing estimates from silent arithmetic errors that erode trust and waste effort.`;

  const withoutIt = stats
    ? `Without ${tool}, teams often ship changes on anecdote, misread seasonality as a breakthrough, or miss a real drop because nobody quantified uncertainty. That burns crawl budget–style effort: experiments you never power, pages you never prioritize, and journeys you never diagnose.`
    : `Without a clear ${tool.toLowerCase()} workflow you risk inconsistent hand calculations, conflicting spreadsheet versions, and decisions that cannot be audited later.`;

  const whenToRely =
    guide.whenToUse ||
    `Use ${tool} for day-to-day checks when inputs change (new sample, new rate, new sizes). Use it in macro reviews when you set benchmarks, re-baseline a model, or document methods for a report or thesis.`;

  const roles = stats
    ? [
        {
          role: "SEO & growth specialists",
          uses: [
            `Compare segment or page cohorts with ${tool} before declaring a “winner.”`,
            "Separate true decay or cannibalization signals from noisy short windows.",
            "Document test results for stakeholders with APA-style exports from this page.",
          ],
        },
        {
          role: "Developers & tech teams",
          uses: [
            `Quantify latency, error-rate, or conversion shifts with ${tool} instead of eyeballing charts.`,
            "Validate that a deploy changed a metric beyond sampling variation.",
            "Pair numeric results with logs to isolate broken scripts or slow routes.",
          ],
        },
        {
          role: "Content creators & analysts",
          uses: [
            `Check whether engagement or rating differences for ${tool.toLowerCase()} contexts are meaningful.`,
            "Align claims with search intent by backing them with transparent math.",
            "Export plain-language write-ups for briefs and post-mortems.",
          ],
        },
      ]
    : [
        {
          role: "Operators & planners",
          uses: [
            `Run ${tool} whenever inputs or assumptions change.`,
            "Keep a shareable record via CSV / Word export.",
            "Compare scenarios side by side with the same formula.",
          ],
        },
        {
          role: "Students & educators",
          uses: [
            `Verify homework and lab answers for ${tool}.`,
            "Show the formula and sample calculation in class.",
            "Export APA-style text for methods sections when applicable.",
          ],
        },
        {
          role: "Builders & analysts",
          uses: [
            "Cross-check spreadsheet models against this calculator.",
            "Trace disagreements to a specific input or assumption.",
            "Link related tools from the similar-calculators widget.",
          ],
        },
      ];

  const scenario =
    guide.example ||
    (stats
      ? `A growth team sees a 2.1% conversion lift after a landing-page change. They paste control and treatment data into the ${tool} calculator on ${siteConfig.name}, read the statistic and interval, then decide whether to ship widely or keep testing—avoiding a false win driven by a tiny sample.`
      : `A planner enters the known inputs for ${tool}, reviews the formula card and sample-style output, exports a CSV for the project folder, then links the same page in the ticket so every teammate uses one source of truth.`);

  const formulas = guide.formulas?.length ? guide.formulas : defaultFormulas(tool);

  const variableBreakdown =
    formulas.length > 0
      ? [
          ...formulas.slice(0, 4).map((f) => `${f.label}: expressed as ${f.latex}${f.note ? ` — ${f.note}` : ""}`),
          "Inputs: the numbers you type or paste in the calculator panel above.",
          "Output: the primary statistic or quantity plus supporting fields (p-values, intervals, totals) shown in Results.",
        ]
      : [
          "Inputs feed the method; the engine returns the primary result and supporting diagnostics.",
        ];

  const sampleCalculation =
    guide.example ||
    `Example workflow: enter a small, known data set (or use Sample data), click Calculate, then match the on-screen ${tool} result to the formula cards. Change one input at a time to see how the output moves—this is the fastest way to internalize the metric.`;

  const decoding = guide.interpretation?.length
    ? guide.interpretation
    : stats
      ? [
          `Good: results that meet your pre-set decision rule (for example p ≤ α, or an interval excluding the null) with adequate sample size.`,
          `Average / inconclusive: effects that point the “right” way but sit near the decision boundary—collect more data or use a better design.`,
          `Critical: strong evidence against your claim, assumption failures (tiny n, extreme imbalance), or contradictory companion metrics.`,
        ]
      : [
          `Good: outputs that match your planning constraints and pass a quick sanity check against known benchmarks.`,
          `Average: workable but sensitive to one input—stress-test that input.`,
          `Critical: impossible units, negative quantities where none should exist, or results that flip with tiny input noise.`,
        ];

  const redFlags = [
    "False alarms from tiny samples or short windows that look “significant” only by chance.",
    "Seasonality or campaign spikes mistaken for a lasting change.",
    stats
      ? "Mixing percentages with counts, or treating dependent observations as independent."
      : "Unit mismatches (monthly vs annual rates, decimals vs percents).",
  ];

  const hiddenWins = [
    "Steady improvement across several small samples even when a single test is not decisive.",
    "Narrower intervals after cleaning outliers or fixing measurement error—precision is a win.",
    "Alignment between this metric and a companion KPI (traffic quality, revenue, completion rate).",
  ];

  const impact = stats
    ? `Correlate ${tool} outcomes with leading indicators (qualified traffic, activation, revenue per visitor). A statistically clear win that does not move a business KPI still needs a product or intent review.`
    : `Tie ${tool} outputs to the decision they fund—budget, schedule, or UX change—and re-run after the change lands.`;

  const workflow = {
    audit: `Filter to the segment that matters (device, locale, cohort, time window). Paste only clean numeric inputs into the ${tool} calculator; remove labels and empty cells.`,
    diagnose: `If the result looks wrong, check assumptions (independence, normality, equal variance, units). Use related calculators on ${siteConfig.name} (similar-tools widget) to test an alternate method.`,
    execute: `Ship the content, code, or process fix suggested by the diagnosis—document the pre/post inputs in the free report export.`,
    measure: `Wait for enough new observations to re-run ${tool} with comparable power; avoid calling a winner on one noisy day.`,
  };

  const troubleshooting = [
    {
      q: `Why isn’t my ${tool} data calculating?`,
      a: `Confirm every required field is filled, numbers use dots for decimals, and lists are separated by commas/spaces/new lines. Empty rows, letters, or mismatched group sizes often block the engine. Try Sample data, then replace with yours.`,
    },
    {
      q: "What if two metrics contradict each other?",
      a: stats
        ? `High volume with a non-significant ${tool} result usually means you lack power or the effect is tiny. Significant ${tool} with flat revenue can mean you optimized a vanity metric. Check sample size, window length, and the companion KPI together.`
        : `When two derived numbers disagree, lock units and time bases first, then re-run both with identical inputs. Export CSV from each calculator for a side-by-side audit.`,
    },
    {
      q: `Why does ${tool} look alarming after a small change?`,
      a: `Low sample size, multiple comparisons, or a shifted mix of users can exaggerate movement. Re-run with a longer window, apply a correction when you tested many things, and read the confidence interval—not only a single p-value or point estimate.`,
    },
    {
      q: "Can I trust the free export for publication?",
      a: `Exports on ${siteConfig.name} are excellent for drafts, homework, and internal notes. For journal or regulatory work, restate assumptions and confirm the exact method (for example Welch vs pooled) matches your protocol.`,
    },
  ];

  const benchmarks: CalculatorOutline["benchmarks"] = [
    {
      segment: "E-commerce",
      guidance: stats
        ? `Expect noisier daily conversion tests; prefer weekly aggregates and pre-registered MDE before relying on ${tool}.`
        : `Stress-test rates and fees; small % errors compound across cart volume.`,
    },
    {
      segment: "SaaS / product analytics",
      guidance: `Pair ${tool} with retention or activation. A “significant” click lift that does not move activation is incomplete.`,
    },
    {
      segment: "Lead gen / content",
      guidance: `Organic and paid mixes differ; segment before running ${tool}. Content decay often shows first in engagement depth, then in rankings.`,
    },
    {
      segment: "Academic / research",
      guidance: `Pre-specify α, sidedness, and exclusions. Report effect sizes and intervals alongside the primary ${tool} output.`,
    },
  ];

  const integrations = [
    `Combine ${tool} results with related ${catName} calculators from the similar-tools widget on this page.`,
    stats
      ? "Cross-check with traffic or session analytics (for example Search Console impressions/clicks plus on-site conversion) so the full journey from query to outcome is visible."
      : "Cross-check spreadsheet models and accounting/CRM exports against this calculator’s CSV download.",
    `Use ${siteConfig.name} critical-value tables and the statistical test selector when you need a companion reference.`,
    "Link this page in tickets and docs so SEO, eng, and content share one method definition.",
  ];

  const uiTips = [
    `Use the calculator panel at the top of this ${tool} page—paste data, then Calculate.`,
    "Tap Sample data to learn the expected format, then Clear and enter your own values.",
    "After results appear, open Free report & exports for APA text, CSV, Word, and Print/PDF.",
    "Jump links under the title go to formulas, similar tools, and FAQ without leaving the page.",
  ];

  // Enrich with legacy howTo tips when present
  if (guide.howTo?.length) {
    uiTips.unshift(...guide.howTo.slice(0, 2));
  }
  if (guide.tips?.length) {
    redFlags.push(...guide.tips.slice(0, 2));
  }

  return {
    toolName: tool,
    whatIs: { definition, problemSolved, keyComponents },
    why: { value, withoutIt, whenToRely },
    howUsed: { roles, scenario },
    formula: {
      intro: `Below is the mechanics behind ${tool} as used on ${siteConfig.name}. Symbols follow common textbook notation.`,
      formulas,
      variableBreakdown,
      sampleCalculation,
    },
    results: { decoding, redFlags, hiddenWins, impact },
    workflow,
    troubleshooting,
    benchmarks,
    integrations,
    uiTips: [...new Set(uiTips)].slice(0, 6),
  };
}

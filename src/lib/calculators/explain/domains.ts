import type { FaqItem, RoleUseCase, BenchmarkSegment } from "./types";

export type Domain =
  | "stats"
  | "chart"
  | "geometry"
  | "math"
  | "finance"
  | "credit"
  | "percent"
  | "grades"
  | "physics"
  | "chemistry"
  | "conversion"
  | "health"
  | "time"
  | "construction"
  | "text"
  | "random"
  | "general";

export function domainFor(category: string): Domain {
  if (category === "chart") return "chart";
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
  if (category === "percentages") return "percent";
  if (category === "academic-grades") return "grades";
  if (category === "finance") return "finance";
  if (category === "credit-analysis") return "credit";
  if (category === "physics") return "physics";
  if (category === "chemistry") return "chemistry";
  if (category === "conversions") return "conversion";
  if (category === "health") return "health";
  if (category === "time") return "time";
  if (category === "construction") return "construction";
  if (category === "text-tools") return "text";
  if (category === "random-tools" || category === "games") return "random";
  return "general";
}

export function faqForDomain(domain: Domain, tool: string): FaqItem[] {
  switch (domain) {
    case "health":
      return [
        {
          q: `Why isn’t ${tool} calculating?`,
          a: "Fill every required field using the format on the labels (YYYY-MM-DD for dates; numbers for weight, height, age, etc.). Blank or invalid values are rejected.",
        },
        {
          q: `Is ${tool} medical advice?`,
          a: "No. Results are educational estimates only. They do not diagnose, treat, or replace care from a qualified clinician.",
        },
        {
          q: "Why doesn’t this match another app or my clinic?",
          a: "Other tools may use different formulas, unit systems, or clinical adjustments. Compare the method in the steps before assuming an error.",
        },
        {
          q: "What should I enter if I’m unsure?",
          a: "Use the best known value that matches the field label. Small input changes can move estimates—note uncertainty when it matters.",
        },
      ];
    case "time":
      return [
        {
          q: `Why isn’t ${tool} calculating?`,
          a: "Use the date or time format shown on the labels (often YYYY-MM-DD or HH:MM). Ambiguous or empty values are rejected.",
        },
        {
          q: "Do time zones matter?",
          a: "Most tools treat the calendar date or clock times you type as-is. Prefer one consistent local convention for start and end.",
        },
        {
          q: "Why is the day count off by one?",
          a: "Inclusive vs exclusive day counting differs by tool. Read the result labels and steps for how this page counts.",
        },
        {
          q: "What format should I use?",
          a: "Prefer YYYY-MM-DD for dates and 24-hour HH:MM for times unless the page offers AM/PM.",
        },
      ];
    case "conversion":
      return [
        {
          q: `Why isn’t ${tool} converting?`,
          a: "Enter a numeric value and choose the from/to units shown. Blank values or unknown unit codes block the result.",
        },
        {
          q: "Which unit should I pick first?",
          a: "Match the unit of the number you already have, then convert to the unit you need next.",
        },
        {
          q: "Why might another site differ slightly?",
          a: "Standard factors are used here. Tiny rounding differences at many decimal places are normal.",
        },
        {
          q: "Temperature vs length/mass?",
          a: "Celsius ↔ Fahrenheit needs an offset as well as a scale factor. Most length and mass conversions are pure multiply/divide.",
        },
      ];
    case "finance":
      return [
        {
          q: `Why isn’t ${tool} calculating?`,
          a: "Fill the labeled money fields (principal, rate, term, etc.) with numbers. Rates are usually annual percentages unless the label says otherwise.",
        },
        {
          q: "Is this financial advice?",
          a: "No. Outputs are educational estimates. Real loans and taxes may include fees, compounding rules, or local rules not modeled here.",
        },
        {
          q: "Monthly vs annual rate?",
          a: "Read the field label. Many tools take an annual percent and convert internally for monthly payments.",
        },
        {
          q: "Why doesn’t this match my bank?",
          a: "Banks may use different day-count methods, fees, or payment timing. Use the steps on this page to see the exact formula applied.",
        },
      ];
    case "credit":
      return [
        {
          q: `Why isn’t ${tool} calculating?`,
          a: "Enter the cohort or vintage fields as labeled (periods, balances, delinquency counts). Blank or non-numeric cells block the result.",
        },
        {
          q: "Is this lending advice?",
          a: "No. Outputs are educational portfolio summaries for study and analysis demos—not credit decisions.",
        },
        {
          q: "Why don’t two vintages match?",
          a: "Align cohort definitions, observation windows, and whether rates are of original balance or outstanding balance before comparing.",
        },
        {
          q: "Can I use this for a report draft?",
          a: "Yes for class or internal notes. For formal risk reporting, restate definitions and confirm the method matches your policy.",
        },
      ];
    case "percent":
      return [
        {
          q: `Why isn’t ${tool} calculating?`,
          a: "Enter the labeled numbers (parts, wholes, or before/after values). Blank fields or zero denominators block the result.",
        },
        {
          q: "Percent of vs percent change?",
          a: "“Percent of” compares a part to a whole. “Percent change” compares an old value to a new value. Use the tool that matches your question.",
        },
        {
          q: "Do I enter 5 or 0.05?",
          a: "Follow the field label. Most pages want a percent like 5 for 5%, not 0.05, unless the label says decimal.",
        },
        {
          q: "Can I use this for homework?",
          a: "Yes—show the inputs, the percent form you need, and the on-page steps.",
        },
      ];
    case "grades":
      return [
        {
          q: `Why isn’t ${tool} calculating?`,
          a: "Enter scores and weights (or credit hours) as numbers. Blank rows and weights that don’t match your syllabus will skew or block the result.",
        },
        {
          q: "How should weights be entered?",
          a: "Match your syllabus: often percents that add to 100, or credit hours per course. Don’t mix systems in one run.",
        },
        {
          q: "Why doesn’t this match my portal?",
          a: "Portals may drop lowest scores, round differently, or use letter cutoffs this page doesn’t apply. Compare the steps to your syllabus rules.",
        },
        {
          q: "Is this official?",
          a: "No. It’s an educational estimate for planning. Your instructor or registrar’s grade is authoritative.",
        },
      ];
    case "physics":
      return [
        {
          q: `Why isn’t ${tool} calculating?`,
          a: "Enter every required quantity with consistent SI (or labeled) units. Zero or negative values may be invalid for some formulas.",
        },
        {
          q: "Which units should I use?",
          a: "Keep all inputs in the unit system implied by the labels (often SI). Mixing cm with m without converting will skew the result.",
        },
        {
          q: "Why is the sign negative?",
          a: "Direction depends on your chosen coordinate system. Check whether the formula treats upward/forward as positive.",
        },
        {
          q: "Where is the formula?",
          a: `Formula cards and steps on this page show the relation used for ${tool}.`,
        },
      ];
    case "chemistry":
      return [
        {
          q: `Why isn’t ${tool} calculating?`,
          a: "Enter the formula or quantities exactly as labeled. Invalid symbols or blank fields block the result.",
        },
        {
          q: "Which units does this use?",
          a: "Read the result labels (for example g/mol). Convert separately if your problem uses another unit system.",
        },
        {
          q: "Why doesn’t this match my textbook table?",
          a: "Atomic weights can use slightly different published averages. Check significant figures and the formula you typed.",
        },
        {
          q: "Can I use this for lab homework?",
          a: "Yes for practice. For graded lab reports, follow your instructor’s required constants and sig-fig rules.",
        },
      ];
    case "geometry":
      return [
        {
          q: `Why does my ${tool} result look wrong?`,
          a: "Confirm you entered the dimensions the labels ask for (radius vs diameter, side vs diagonal, perpendicular height vs slant) and that every length uses the same unit.",
        },
        {
          q: "Do I need matching units?",
          a: "Yes. If one length is in meters and another in centimeters, convert first. The calculator multiplies the numbers you type.",
        },
        {
          q: "Where is the formula?",
          a: `The formula cards on this page show the relation used for ${tool}. After Calculate, the steps repeat the same math with your numbers.`,
        },
        {
          q: "Can I use this for homework?",
          a: "Yes—show the formula, your inputs, and the result with units (for example cm² or m³).",
        },
      ];
    case "math":
      return [
        {
          q: `Why isn’t ${tool} calculating?`,
          a: "Fill every required field with valid numbers. Watch for division by zero or inputs outside the allowed domain.",
        },
        {
          q: "My answer looks different from the textbook.",
          a: "Check whether the book wants a simplified fraction, decimal rounding, or another form (mixed number, radical). Match formats first.",
        },
        {
          q: "Can I trust the steps?",
          a: "The steps follow the same formula shown on this page. Use them to find where your handwritten work diverges.",
        },
        {
          q: "What if I need a related skill?",
          a: "Open a similar calculator below (simplify, convert, or a neighboring algebra tool).",
        },
      ];
    case "stats":
      return [
        {
          q: `Why isn’t my ${tool} data calculating?`,
          a: "Confirm required fields are filled. For lists, separate numbers with commas, spaces, or new lines—remove letters and blank rows.",
        },
        {
          q: "What if two results disagree?",
          a: "Use the same data and the same options (sample vs population, α, sidedness when shown). Read intervals and effect sizes—not only a single p-value when a test is involved.",
        },
        {
          q: `Why does ${tool} look extreme after a small change?`,
          a: "Outliers and tiny samples move summaries a lot. Check for typos, then compare the mean with the median or a five-number summary.",
        },
        {
          q: "Can I use the export for class or drafts?",
          a: "Yes for homework, labs, and notes. For formal publication, restate assumptions and confirm the exact method matches your protocol.",
        },
      ];
    case "chart":
      return [
        {
          q: `Why isn’t my ${tool} showing?`,
          a: "Enter numeric values (and labels if asked). Empty series or non-numeric cells leave nothing to plot.",
        },
        {
          q: "How should I format the data?",
          a: "Follow the field hints—often one value per line or comma-separated numbers. Keep categories aligned with values when both are required.",
        },
        {
          q: "Why do slices or bars look uneven?",
          a: "The chart reflects the numbers you entered. Check for typos, missing categories, or values on very different scales.",
        },
        {
          q: "Can I use this for homework or a report?",
          a: "Yes for drafts and class work. For publication, label axes/units and confirm the chart type matches your message.",
        },
      ];
    case "construction":
      return [
        {
          q: `Why isn’t ${tool} calculating?`,
          a: "Enter every length, area, or coverage field with matching units. Blank or zero dimensions block the estimate.",
        },
        {
          q: "Do units have to match?",
          a: "Yes—keep feet with feet (or meters with meters). Convert before entering mixed measurements.",
        },
        {
          q: "Why is my material estimate high or low?",
          a: "Waste factors, coats of paint, or bag yields differ by product. Read the steps and add your own contingency if the label doesn’t include waste.",
        },
        {
          q: "Is this a substitute for a contractor quote?",
          a: "No. It’s a planning estimate. Confirm coverage rates on the product label and local building requirements.",
        },
      ];
    case "text":
      return [
        {
          q: `Why isn’t ${tool} working?`,
          a: "Paste or type text into the input area. Empty input produces empty counts or an empty result.",
        },
        {
          q: "Are spaces and line breaks counted?",
          a: "Follow the result labels—character counts may include or exclude spaces depending on the tool.",
        },
        {
          q: "Is my text stored?",
          a: "Processing runs in your browser for this page’s calculation. Do not paste secrets you would not type into a public form.",
        },
        {
          q: "Need a related tool?",
          a: "Use the similar calculators list for counters, generators, or neighboring text utilities.",
        },
      ];
    case "random":
      return [
        {
          q: `Why isn’t ${tool} producing a result?`,
          a: "Set the labeled options (count, range, sides, etc.) to valid numbers, then generate again.",
        },
        {
          q: "Are results truly random?",
          a: "Outputs use a pseudo-random generator suitable for games and classroom demos—not cryptographic security (unless a password tool’s notes say otherwise).",
        },
        {
          q: "Can I get the same sequence again?",
          a: "Each run is independent unless the page exposes a seed. Re-click to draw a new sample.",
        },
        {
          q: "Is this fair for a game?",
          a: "For casual play and demos, yes. For contests, use a published fairness process your group agrees on.",
        },
      ];
    default:
      return [
        {
          q: `Why isn’t ${tool} calculating?`,
          a: "Fill every required field using the format shown on the labels. Blank or invalid values block the result.",
        },
        {
          q: "Why doesn’t this match another calculator?",
          a: "Compare definitions and units first, then re-run both tools with identical inputs and read the on-page steps.",
        },
        {
          q: "Where do I see the method?",
          a: `Formula cards and step-by-step working on this ${tool} page show what was applied.`,
        },
        {
          q: "What next?",
          a: "Use a related calculator from the list below if you need a neighboring method.",
        },
      ];
  }
}

export type DomainSections = {
  problemSolved: string;
  keyComponents: string[];
  value: string;
  withoutIt: string;
  whenToRely: string;
  roles: RoleUseCase[];
  scenario: string;
  variableHints: string[];
  sampleCalculation: string;
  decoding: string[];
  redFlags: string[];
  hiddenWins: string[];
  impact: string;
  workflow: { audit: string; diagnose: string; execute: string; measure: string };
  benchmarks: BenchmarkSegment[];
  integrations: string[];
  uiHints: string[];
};

export function sectionsForDomain(
  domain: Domain,
  tool: string,
  catName: string,
  category: string,
): DomainSections {
  const isSolid = category === "geometry-solids";

  switch (domain) {
    case "geometry":
      return {
        problemSolved: `It replaces hand calculations for ${tool.toLowerCase()} with a checked area, length, or volume from the dimensions you enter.`,
        keyComponents: [
          `The dimension fields on this page (matched to ${tool.toLowerCase()} inputs)`,
          "Consistent length units for every measurement you enter",
          "The geometry formula used for this shape",
          "Step-by-step show-work after you calculate",
        ],
        value: `Getting ${tool.toLowerCase()} right matters whenever area, length, or volume drives materials, weight, cost, or a homework grade. Mixed units silently ruin the answer.`,
        withoutIt: `Without a clear ${tool.toLowerCase()} check, people mix radius with diameter, mix units, or use the wrong height—and build or grade from the wrong number.`,
        whenToRely: `Use ${tool} whenever you know the shape’s dimensions and need the measure this page computes in matching units.`,
        roles: [
          {
            role: "Students & teachers",
            uses: [
              `Check ${tool.toLowerCase()} homework with the same formula taught in class.`,
              "See how changing one dimension scales the result.",
              "Compare related shapes with tools linked below.",
            ],
          },
          {
            role: "Builders & DIY",
            uses: [
              "Estimate area or volume for materials planning.",
              "Keep all measurements in one unit before calculating.",
              "Cross-check a sketch dimension against the calculator output.",
            ],
          },
          {
            role: "Design & engineering",
            uses: [
              "Sanity-check model dimensions before detailing.",
              "Document the inputs used for a quote or cut list.",
              "Pair geometry results with converters when unit systems differ.",
            ],
          },
        ],
        scenario: isSolid
          ? `Measure the labeled solid dimensions, enter them in one unit system, then read volume or surface area from ${tool}. If height is involved, use perpendicular height—not slant height along a face.`
          : `Enter the labeled plane dimensions for ${tool} (for example length and width, or radius). Confirm radius vs diameter, then read area or perimeter with matching units.`,
        variableHints: [
          "Use the same length unit for every dimension (cm with cm, m with m).",
          "Area outputs are in square units; volume outputs are in cubic units of that length.",
          isSolid
            ? "For solids, perpendicular (vertical) height is not the same as slant height."
            : "Radius is half the diameter—don’t enter both unless the page asks for them separately.",
        ],
        sampleCalculation: isSolid
          ? `Example: enter a known textbook solid (matching units), click Calculate, then match the on-screen ${tool} result to the formula cards.`
          : `Example: enter a small known shape (e.g. radius 5), click Calculate, then match area/perimeter to the formula cards.`,
        decoding: [
          "Results should move when you change a driving dimension.",
          "If the number looks huge or tiny, check whether you mixed meters with centimeters.",
          "Read each result label (area vs perimeter vs volume vs surface).",
        ],
        redFlags: isSolid
          ? [
              "Using slant height instead of perpendicular height for volume.",
              "Mixing length units (cm with m) before multiplying.",
              "Forgetting constants such as ⅓ for a pyramid or 4/3 for a sphere.",
            ]
          : [
              "Entering diameter when the field asks for radius (or the reverse).",
              "Mixing length units before multiplying.",
              "Confusing perimeter with area on the result row.",
            ],
        hiddenWins: [
          "Catching a unit mix-up before ordering materials.",
          "Matching a textbook worked example before a harder case.",
          "Using matching units once, then converting only the final result if needed.",
        ],
        impact: `Tie ${tool} outputs to the decision they support—material estimate or a graded problem—and re-check dimensions if the number looks off.`,
        workflow: {
          audit: `List the dimensions ${tool} needs. Convert every length to one unit.`,
          diagnose: `If the result looks wrong, check radius vs diameter, height type, and unit consistency.`,
          execute: `Use the area, length, or volume in your estimate, model, or homework write-up.`,
          measure: `If you cut or build from the number, re-measure the critical dimension and re-run ${tool}.`,
        },
        benchmarks: [
          {
            segment: "Classroom geometry",
            guidance: "Always label units and show the formula before the numeric answer.",
          },
          {
            segment: "Construction / DIY",
            guidance: "Measure twice, convert to one unit, then calculate; add waste separately if needed.",
          },
          {
            segment: "Design / modeling",
            guidance: `Confirm what your model calls “height” or “radius” before trusting ${tool}.`,
          },
          {
            segment: "Quick sanity check",
            guidance: "If you double every linear dimension, areas scale by 4 and volumes by 8.",
          },
        ],
        integrations: [
          `Compare related ${catName} shapes from the similar-tools list.`,
          "Convert final units with a length/area/volume converter if plans use another system.",
          "Keep a sketch of the dimensions next to the numeric result.",
        ],
        uiHints: [
          `Enter the labeled dimensions for ${tool}.`,
          "Match each input to its label, then click Calculate.",
        ],
      };

    case "math":
      return {
        problemSolved: `It solves the ${tool.toLowerCase()} problem quickly and shows the formula so you can verify the answer.`,
        keyComponents: [
          `The inputs shown for ${tool.toLowerCase()}`,
          "The algebraic or arithmetic formula for this tool",
          "Step-by-step working after you calculate",
        ],
        value: `A correct ${tool.toLowerCase()} result saves time on homework, exams, and everyday number work—and the on-page formula helps you learn the method.`,
        withoutIt: `Without a clear ${tool.toLowerCase()} workflow you risk inconsistent hand calculations and answers that are hard to recheck.`,
        whenToRely: `Use ${tool} for homework checks, quick evaluations, and verifying a manual solution.`,
        roles: [
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
              "Keep signs and domains consistent with the problem.",
            ],
          },
        ],
        scenario: `Enter the values from your problem into ${tool}, confirm the operation and domain, then compare the result and steps to your handwritten work.`,
        variableHints: [
          "Match variable names on the formula cards to the labeled fields above.",
          "Watch domain restrictions (division by zero, even roots of negatives, logs of non-positives).",
        ],
        sampleCalculation: `Example: enter a small known case, click Calculate, then match the on-screen ${tool} result to the formula cards.`,
        decoding: [
          "Confirm the operation matches the problem (add vs multiply, simplify vs convert).",
          "Simplified fractions and exact roots are preferred when the tool offers them.",
          "Impossible or blank results usually mean a domain error in the inputs.",
        ],
        redFlags: [
          "Wrong operation for the word problem.",
          "Leaving an unsimplified fraction when the tool already reduced it.",
          "Ignoring domain restrictions called out in the tips.",
        ],
        hiddenWins: [
          "Matching a textbook worked example before trusting a harder case.",
          "Finding the sensitive input by changing one value at a time.",
          "Linking a related calculator when you need the next algebraic step.",
        ],
        impact: `Use the ${tool} result in the next step of your work, and keep the inputs so you can reproduce the answer.`,
        workflow: {
          audit: `Copy the problem values into the labeled fields for ${tool}.`,
          diagnose: `If the answer disagrees with yours, compare operations and simplify steps.`,
          execute: "Record the result and the formula used.",
          measure: "Try one alternate input set to confirm the tool behaves as expected.",
        },
        benchmarks: [
          { segment: "Homework", guidance: "Match the requested form (exact vs decimal) before comparing to an answer key." },
          { segment: "Exams", guidance: "Write the formula, substitute, then simplify—same order as the on-page steps." },
          { segment: "Everyday calc", guidance: "Prefer exact fractions when ratios need to stay clean." },
          { segment: "Teaching", guidance: "Change one input live so students see which variable drives the result." },
        ],
        integrations: [
          `Open related ${catName} tools when you need the next algebraic step.`,
          "Use fraction and percent converters when a problem mixes forms.",
        ],
        uiHints: [`Use the calculator fields at the top of this ${tool} page.`, "Match each input to its label, then click Calculate."],
      };

    case "stats":
      return {
        problemSolved: `It helps you turn data into a clear statistical result—so you can tell whether a difference, association, or estimate is supported by the numbers.`,
        keyComponents: [
          "Data or parameter fields required by this method",
          "Options such as sample vs population, α, or sidedness when shown",
          "The test statistic, estimate, or interval returned in Results",
          "Formula cards and optional report exports",
        ],
        value: `Tracking ${tool.toLowerCase()} matters because product, research, and experiment decisions depend on whether an effect is distinguishable from noise—and whether the estimate is precise enough to act on.`,
        withoutIt: `Without ${tool}, teams often ship changes on anecdote or miss a real shift because nobody quantified uncertainty.`,
        whenToRely: `Use ${tool} when the inputs on this page match your design and you need a transparent statistical result.`,
        roles: [
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
        ],
        scenario: `Paste a clean numeric sample into ${tool}, choose the options that match your design, then read the primary result with any interval or p-value shown.`,
        variableHints: [
          "Inputs: the numbers or groups you enter in the calculator panel.",
          "Output: the primary statistic plus supporting fields (p-values, intervals, tables) in Results.",
        ],
        sampleCalculation: `Example: enter a small known data set, click Calculate, then match the on-screen ${tool} result to the formula cards.`,
        decoding: [
          "Good: results that meet your pre-set decision rule with adequate sample size.",
          "Inconclusive: effects near the decision boundary—collect more data or refine the design.",
          "Critical: assumption failures, tiny n, or contradictory companion metrics.",
        ],
        redFlags: [
          "Tiny samples that look “significant” only by chance.",
          "Mixing percentages with counts, or treating dependent rows as independent.",
          "Seasonality or short windows mistaken for a lasting change.",
        ],
        hiddenWins: [
          "Steady improvement across several samples even when a single test is not decisive.",
          "Narrower intervals after cleaning measurement error.",
          "Alignment between this metric and a companion KPI.",
        ],
        impact: `Correlate ${tool} outcomes with the real decision metric. A statistically clear win that does not move the outcome you care about still needs review.`,
        workflow: {
          audit: `Filter to the segment that matters. Paste only clean numeric inputs into ${tool}.`,
          diagnose: "If the result looks wrong, check assumptions and options (sample vs population, sidedness, α).",
          execute: "Document the pre/post inputs if you are comparing conditions.",
          measure: "Wait for enough new observations before calling a lasting change.",
        },
        benchmarks: [
          { segment: "Experiments", guidance: `Pre-register the metric and minimum detectable effect before relying on ${tool}.` },
          { segment: "Product analytics", guidance: `Pair ${tool} with a north-star outcome, not only a click or open rate.` },
          { segment: "Content / research", guidance: "Segment before testing; mixed traffic sources inflate noise." },
          { segment: "Academic", guidance: "Pre-specify α, sidedness, and exclusions. Report effect sizes with the primary result." },
        ],
        integrations: [
          `Combine ${tool} with related ${catName} calculators from the similar-tools list.`,
          "Use critical-value or companion distribution tools when you need a reference beside this page.",
        ],
        uiHints: [
          "Try Sample values if shown, then replace them with your own.",
          "After results appear, read the steps to confirm the method matched your intent.",
        ],
      };

    case "chart":
      return {
        problemSolved: `It turns your numbers into a clear ${tool.toLowerCase()} so patterns are easier to see than in a raw table.`,
        keyComponents: [
          "Numeric series (and labels/categories when required)",
          "The chart type this page is built for",
          "Readable scales and result labels",
        ],
        value: `A clear ${tool.toLowerCase()} helps you communicate comparisons, shares, or distributions without burying the story in a spreadsheet.`,
        withoutIt: `Without a chart, readers often miss the largest category, the skew, or the comparison you care about.`,
        whenToRely: `Use ${tool} when you already have the values and need a quick visual for study, a draft report, or a meeting.`,
        roles: [
          {
            role: "Students",
            uses: ["Plot homework data quickly.", "Check whether the chart type matches the question.", "Label axes and units in your write-up."],
          },
          {
            role: "Analysts",
            uses: ["Draft visuals before building a polished dashboard.", "Spot outliers or uneven categories.", "Share a screenshot with the input list."],
          },
          {
            role: "Teachers",
            uses: ["Demo how changing a value reshapes the chart.", "Compare chart types with related tools below.", "Discuss when a table is clearer than a chart."],
          },
        ],
        scenario: `Paste your values into ${tool}, add category labels if asked, then read the chart and adjust any mistyped numbers that dominate the scale.`,
        variableHints: [
          "Keep one numeric series clean—no currency symbols mixed into the numbers.",
          "Align labels with values when both fields exist.",
        ],
        sampleCalculation: `Example: enter 4–6 known values, generate the ${tool}, then confirm the largest bar/slice matches the largest number.`,
        decoding: [
          "Tallest bar or largest slice should match the largest input.",
          "Empty or flat charts usually mean missing or non-numeric data.",
          "Very uneven scales can hide smaller categories—check the raw numbers too.",
        ],
        redFlags: [
          "Non-numeric characters in the value list.",
          "Mismatched count of labels vs values.",
          "Using a pie chart for negative values or non-parts-of-a-whole data.",
        ],
        hiddenWins: [
          "Catching a typo because one bar is impossibly tall.",
          "Choosing a better chart type from the related-tools list.",
          "Exporting or screenshotting a draft before formatting elsewhere.",
        ],
        impact: `Use the ${tool} visual to support a claim, and keep the raw numbers beside it so others can check.`,
        workflow: {
          audit: "Clean the numeric list and labels.",
          diagnose: "If the chart looks wrong, sort or re-check the largest values first.",
          execute: "Add the chart to your draft with axis/unit notes.",
          measure: "Update the chart when the underlying data changes.",
        },
        benchmarks: [
          { segment: "Homework", guidance: "State what each axis or slice means." },
          { segment: "Meetings", guidance: "Lead with one comparison the chart makes obvious." },
          { segment: "Reports", guidance: "Prefer labeled categories over unexplained color alone." },
          { segment: "Teaching", guidance: "Change one value live to show sensitivity." },
        ],
        integrations: [
          `Open related ${catName} chart tools when a different visual fits better.`,
          "Pair with a descriptive-stats calculator if you need summaries beside the plot.",
        ],
        uiHints: ["Paste numbers in the format the fields describe.", "Click Calculate/plot, then fix any value that dominates unexpectedly."],
      };

    case "credit":
      return {
        problemSolved: `It summarizes ${tool.toLowerCase()} cohort performance so you can compare vintages with transparent definitions.`,
        keyComponents: [
          "Cohort / period inputs labeled on this page",
          "The delinquency or performance rule used in the steps",
          "Educational portfolio summaries—not credit decisions",
        ],
        value: `Clear vintage curves help analysts see how credit quality evolves by origination cohort—not just a single blended rate.`,
        withoutIt: `Without aligned cohort definitions, vintage comparisons mix different observation windows and look like real risk differences.`,
        whenToRely: `Use ${tool} when cohort inputs are defined the same way across vintages you want to compare.`,
        roles: [
          {
            role: "Credit / risk students",
            uses: [
              "Build a simple vintage curve from labeled inputs.",
              "Compare two cohorts with matching windows.",
              "Document definitions beside the chart or table.",
            ],
          },
          {
            role: "Portfolio analysts (educational)",
            uses: [
              "Draft a vintage comparison before a formal model.",
              "Check whether a spike is definition-driven.",
              "Export notes for an internal walkthrough.",
            ],
          },
          {
            role: "Teachers",
            uses: [
              "Demo origination-cohort thinking live.",
              "Show why blended portfolio rates hide vintage effects.",
              "Link related credit or percent tools below.",
            ],
          },
        ],
        scenario: `Enter matching cohort inputs for ${tool}, compute the curve or summary, then compare a second vintage only after definitions align.`,
        variableHints: [
          "Keep cohort start and observation length consistent across comparisons.",
          "State whether rates use original or outstanding balance.",
        ],
        sampleCalculation: `Example: enter one known cohort into ${tool}, read the summary, then change one period to see how the curve moves.`,
        decoding: [
          "Rising delinquency by months-on-book is common early; compare like-to-like seasons.",
          "A spike in one vintage may be a definition or data cut issue.",
          "Educational output only—not an underwriting decision.",
        ],
        redFlags: [
          "Comparing vintages with different observation windows.",
          "Mixing original-balance and outstanding-balance rates.",
          "Treating a demo curve as a credit decision engine.",
        ],
        hiddenWins: [
          "Catching a cohort mislabel before a meeting.",
          "Showing students why blended rates hide risk.",
          "Aligning definitions once, then reusing them.",
        ],
        impact: `Use ${tool} to explain cohort performance in study or drafts; formal decisions need policy-approved methods.`,
        workflow: {
          audit: "Write cohort and window definitions first.",
          diagnose: "If two curves disagree oddly, compare definitions before the math.",
          execute: "Document the summary with those definitions.",
          measure: "Refresh when a new month of performance arrives.",
        },
        benchmarks: [
          { segment: "Classroom", guidance: "Always state the cohort and window beside the result." },
          { segment: "Portfolio review", guidance: "Compare same months-on-book across vintages." },
          { segment: "Data QA", guidance: "Check for missing months before interpreting a dip." },
          { segment: "Reporting", guidance: "Label original vs outstanding balance denominators." },
        ],
        integrations: [
          `Combine ${tool} with related ${catName} or percent tools when you need rate-of-change beside the curve.`,
          "Keep a data dictionary for cohort fields.",
        ],
        uiHints: [
          "Enter cohort fields exactly as labeled.",
          "Compare a second vintage only with matching definitions.",
        ],
      };

    case "finance":
      return {
        problemSolved: `It removes spreadsheet guesswork for ${tool.toLowerCase()} so you can compare options with transparent math.`,
        keyComponents: [
          "Money, rate, and time fields shown on this page",
          "The compounding or payment formula used",
          "Results with intermediate steps where available",
        ],
        value: `Transparent ${tool.toLowerCase()} math helps you compare options without opaque spreadsheet shortcuts.`,
        withoutIt: `Without a clear ${tool.toLowerCase()} check, rate period mistakes (monthly vs annual) silently change payments and totals.`,
        whenToRely: `Use ${tool} for educational estimates when you know the labeled loan or money inputs.`,
        roles: [
          {
            role: "Borrowers & planners",
            uses: [`Estimate ${tool.toLowerCase()} before talking to a lender.`, "Compare scenarios by changing one input.", "Read total interest—not only the payment."],
          },
          {
            role: "Students",
            uses: ["Check homework amortization or interest problems.", "See how rate and term trade off.", "Show the formula in a write-up."],
          },
          {
            role: "Advisors (educational)",
            uses: ["Illustrate compounding with live numbers.", "Stress that fees may be missing.", "Point to related finance tools below."],
          },
        ],
        scenario: `Enter principal, rate, and term as labeled for ${tool}, then compare the payment or future value to a second scenario with one input changed.`,
        variableHints: [
          "Confirm whether rate is annual percent and how often interest compounds.",
          "Money results inherit the currency of your inputs—the page does not FX-convert.",
        ],
        sampleCalculation: `Example: try a round principal and rate, click Calculate, then match the ${tool} payment or interest to the formula cards.`,
        decoding: [
          "Payment tools: early payments are often interest-heavy.",
          "Growth tools: more frequent compounding increases the future amount for a fixed nominal rate.",
          "If the number looks impossible, check percent vs decimal and years vs months.",
        ],
        redFlags: [
          "Entering a monthly rate into a field that expects an annual percent.",
          "Mixing years and months for term without converting.",
          "Treating an educational estimate as a binding quote.",
        ],
        hiddenWins: [
          "Seeing how a small rate change moves total interest.",
          "Matching a lender’s amortization assumptions before comparing offers.",
          "Documenting the exact inputs you used for a second opinion.",
        ],
        impact: `Use ${tool} results to compare options, then confirm fees and terms with a lender or official statement.`,
        workflow: {
          audit: "Gather principal, rate, term, and fees you know.",
          diagnose: "If results disagree with a bank, compare day-count and fee assumptions.",
          execute: "Record the scenario you prefer with its inputs.",
          measure: "Re-run when the rate or term changes.",
        },
        benchmarks: [
          { segment: "Shopping a loan", guidance: "Compare total interest and payment together." },
          { segment: "Homework", guidance: "Show the formula and whether rate is monthly or annual." },
          { segment: "Planning", guidance: "Add a fee contingency the model may omit." },
          { segment: "Teaching", guidance: "Change compounding frequency to show APY vs APR intuition." },
        ],
        integrations: [
          `Combine ${tool} with related ${catName} calculators (amortization, interest, affordability).`,
          "Use a percent tool if you need a quick rate-of-change beside the money math.",
        ],
        uiHints: ["Fill money fields carefully—rate period matters.", "Match each input to its label, then click Calculate."],
      };

    case "percent":
      return {
        problemSolved: `It computes ${tool.toLowerCase()} without mixing up “percent of” and “percent change.”`,
        keyComponents: [
          "The labeled part/whole or before/after fields",
          "The percent identity used on this page",
          "Clear results after you calculate",
        ],
        value: `Correct percent math avoids costly misreads in discounts, grades, growth, and reports.`,
        withoutIt: `People often divide in the wrong order or forget to multiply by 100—${tool} keeps the identity explicit.`,
        whenToRely: `Use ${tool} when you know the inputs on this page and need a transparent percent result.`,
        roles: [
          {
            role: "Students",
            uses: ["Check homework percent problems.", "Compare percent-of vs percent-change tools.", "Show steps in a write-up."],
          },
          {
            role: "Shoppers & planners",
            uses: ["Estimate discounts and markups.", "Compare relative changes.", "Re-run when prices update."],
          },
          {
            role: "Teachers",
            uses: ["Demo common percent mistakes live.", "Link related percent tools below.", "Stress label reading (5 vs 0.05)."],
          },
        ],
        scenario: `Enter the labeled values for ${tool}, confirm whether you want a part-of-whole or a change, then read the percent and steps.`,
        variableHints: [
          "Follow whether the field wants 5 or 0.05.",
          "Zero denominators are invalid—check the base value.",
        ],
        sampleCalculation: `Example: enter a simple known case (e.g. 25 is what percent of 200), then match the ${tool} result to the formula.`,
        decoding: [
          "Percent of: part ÷ whole × 100.",
          "Percent change: (new − old) ÷ old × 100.",
          "Negative change means a decrease relative to the base.",
        ],
        redFlags: [
          "Using the wrong base (dividing by the new value for percent change).",
          "Entering 0.05 when the field expects 5%.",
          "Comparing percents that don’t share the same whole.",
        ],
        hiddenWins: [
          "Catching a discount that was applied twice.",
          "Explaining a grade weight with a clear percent-of calculation.",
          "Switching to a related percent tool when the question form changes.",
        ],
        impact: `Use the ${tool} result in pricing, grades, or reports, and keep the base value visible.`,
        workflow: {
          audit: "Identify part/whole or old/new values.",
          diagnose: "If the percent looks off, rewrite the sentence in words, then match the tool.",
          execute: "Apply the percent in your next step.",
          measure: "Re-run when either input changes.",
        },
        benchmarks: [
          { segment: "Homework", guidance: "Write the identity before the arithmetic." },
          { segment: "Shopping", guidance: "Confirm whether tax is included in the base." },
          { segment: "Reporting", guidance: "Always state the base of the percent." },
          { segment: "Teaching", guidance: "Show percent-of and percent-change side by side." },
        ],
        integrations: [
          `Open related ${catName} percent tools when the question form changes.`,
          "Use a finance calculator if you need payments rather than a raw percent.",
        ],
        uiHints: ["Match part/whole or before/after to the labels.", "Click Calculate, then check the percent form in the result."],
      };

    case "grades":
      return {
        problemSolved: `It estimates ${tool.toLowerCase()} from the scores and weights you enter so you can plan before grades finalize.`,
        keyComponents: [
          "Score and weight (or credit-hour) fields",
          "The averaging rule used on this page",
          "Educational results—not an official transcript",
        ],
        value: `Knowing where you stand helps you prioritize study time and what-if final exam targets.`,
        withoutIt: `Without a clear grade model, weights get mis-added and portal surprises show up too late.`,
        whenToRely: `Use ${tool} with your syllabus weights for planning. Your instructor’s grade remains official.`,
        roles: [
          {
            role: "Students",
            uses: ["Project a course grade from current scores.", "What-if a final exam score.", "Check GPA scenarios before registration."],
          },
          {
            role: "Teachers & tutors",
            uses: ["Demo weighted averages.", "Show how dropping a low score changes the mean.", "Align examples with syllabus language."],
          },
          {
            role: "Counselors (planning)",
            uses: ["Illustrate credit-hour GPA math.", "Compare term scenarios.", "Stress that portals may apply special rules."],
          },
        ],
        scenario: `Enter each score with its syllabus weight into ${tool}, confirm weights match your course, then read the estimate and adjust a what-if final.`,
        variableHints: [
          "Weights should follow the syllabus (often summing to 100%).",
          "Letter cutoffs vary by school—this page may report numeric averages only.",
        ],
        sampleCalculation: `Example: enter two known scores with weights, click Calculate, then verify the weighted mean by hand.`,
        decoding: [
          "Weighted average: sum(score × weight) / sum(weights).",
          "GPA tools: credit hours weight course grades.",
          "Portal differences often come from dropped scores or rounding.",
        ],
        redFlags: [
          "Weights that don’t match the syllabus.",
          "Mixing percent scores with raw points without converting.",
          "Treating the estimate as an official grade.",
        ],
        hiddenWins: [
          "Seeing how much a final must score to hit a target.",
          "Catching a weight that was entered twice.",
          "Planning credit loads with GPA what-ifs.",
        ],
        impact: `Use ${tool} to plan studying and registration choices; confirm official grades in your school portal.`,
        workflow: {
          audit: "Copy syllabus weights and current scores.",
          diagnose: "If the portal differs, look for dropped scores or different rounding.",
          execute: "Set a target and back-solve what you still need.",
          measure: "Update after each graded assignment.",
        },
        benchmarks: [
          { segment: "Mid-term planning", guidance: "Update weights only when the syllabus does." },
          { segment: "Finals week", guidance: "Run what-if scores before the exam." },
          { segment: "GPA planning", guidance: "Include credit hours, not only letter grades." },
          { segment: "Teaching", guidance: "Show weighted vs unweighted averages side by side." },
        ],
        integrations: [
          `Use related ${catName} tools for finals targets vs term GPA.`,
          "Pair with a percent calculator when converting points to percents.",
        ],
        uiHints: ["Enter scores and weights exactly as the syllabus lists them.", "Click Calculate, then run a what-if by changing one score."],
      };

    case "physics":
      return {
        problemSolved: `It evaluates the standard ${tool.toLowerCase()} relation from the quantities you enter, with matching units in mind.`,
        keyComponents: [
          "Quantity fields with implied units",
          "The textbook relation used here",
          "Results and steps after you calculate",
        ],
        value: `Correct ${tool.toLowerCase()} math keeps lab and homework answers consistent with SI (or labeled) units.`,
        withoutIt: `Unit slips and sign convention mistakes are the usual reason physics results “look random.”`,
        whenToRely: `Use ${tool} when your problem matches the labeled quantities and formula on this page.`,
        roles: [
          {
            role: "Students",
            uses: ["Check homework substitutions.", "Compare units before trusting the number.", "Read the formula card beside the result."],
          },
          {
            role: "Teachers",
            uses: ["Demo unit consistency live.", "Show sign conventions.", "Link related physics tools below."],
          },
          {
            role: "Lab practitioners",
            uses: ["Sanity-check measured inputs.", "Document the formula used.", "Re-run after recalibrating an instrument."],
          },
        ],
        scenario: `Enter the labeled quantities for ${tool} in one unit system, click Calculate, then compare the result to your free-body or lab expectation.`,
        variableHints: [
          "Keep SI (or labeled) units consistent across inputs.",
          "Signs follow your chosen coordinate system.",
        ],
        sampleCalculation: `Example: enter a textbook numeric example into ${tool} and match the result to the worked solution’s units.`,
        decoding: [
          "Magnitude should scale with the driving inputs as the formula predicts.",
          "Negative values often mean opposite direction—not “broken” math.",
          "Huge/tiny results usually mean a unit prefix mistake.",
        ],
        redFlags: [
          "Mixing cm with m (or g with kg) without converting.",
          "Ignoring the sign convention stated in the problem.",
          "Using a formula that doesn’t match the diagram.",
        ],
        hiddenWins: [
          "Catching a unit prefix error before lab write-up.",
          "Matching a known example before a harder variant.",
          "Changing one input to see sensitivity.",
        ],
        impact: `Use the ${tool} result in your solution write-up with units, and re-check the diagram if the sign surprises you.`,
        workflow: {
          audit: "List given quantities and convert to one unit system.",
          diagnose: "If wrong, check formula choice, units, and signs.",
          execute: "Record the result with units.",
          measure: "Re-run after any corrected measurement.",
        },
        benchmarks: [
          { segment: "Homework", guidance: "Show units in every line." },
          { segment: "Labs", guidance: "Propagate measurement uncertainty separately if required." },
          { segment: "Exams", guidance: "Confirm the formula matches the diagram before substituting." },
          { segment: "Teaching", guidance: "Vary one input to show proportionalities." },
        ],
        integrations: [
          `Open related ${catName} tools for neighboring relations.`,
          "Use converters when the problem mixes unit systems.",
        ],
        uiHints: ["Enter quantities with consistent units.", "Match each input to its label, then click Calculate."],
      };

    case "chemistry":
      return {
        problemSolved: `It computes ${tool.toLowerCase()} from the formula or quantities you enter for study and lab prep.`,
        keyComponents: [
          "Chemical formula or quantity fields",
          "The calculation rule used on this page",
          "Results with units on the labels",
        ],
        value: `Accurate ${tool.toLowerCase()} values keep stoichiometry and lab prep from drifting on bad molar masses or conversions.`,
        withoutIt: `Hand lookup typos and formula parsing mistakes cascade into every later stoichiometry step.`,
        whenToRely: `Use ${tool} for practice and planning. Follow your instructor’s required constants for graded work.`,
        roles: [
          {
            role: "Students",
            uses: ["Check molecular weight homework.", "Verify a formula string before stoichiometry.", "Compare sig figs with the textbook."],
          },
          {
            role: "Teachers",
            uses: ["Demo formula entry mistakes.", "Discuss published atomic-weight differences.", "Link related chem/physics tools."],
          },
          {
            role: "Lab prep",
            uses: ["Ballpark reagent amounts.", "Confirm units on the result label.", "Re-check the formula after a typo."],
          },
        ],
        scenario: `Type the labeled formula or quantities into ${tool}, click Calculate, then confirm units (for example g/mol) before using the number downstream.`,
        variableHints: [
          "Formula character case matters for element symbols.",
          "Read the unit on each result row.",
        ],
        sampleCalculation: `Example: enter a simple known formula (e.g. H2O) and confirm the molecular weight is near the textbook value.`,
        decoding: [
          "Primary result should carry a clear unit.",
          "Large deviations from a table often mean a mistyped formula.",
          "Sig-fig rules for reports may be stricter than the raw calculator output.",
        ],
        redFlags: [
          "Wrong element capitalization (co vs CO).",
          "Ignoring the unit on the result.",
          "Using a different atomic-weight table than your course requires without noting it.",
        ],
        hiddenWins: [
          "Catching a subscript typo early.",
          "Matching a textbook example before a multi-step problem.",
          "Keeping the formula string beside the numeric result.",
        ],
        impact: `Carry the ${tool} result into stoichiometry with its unit, and cite the method if your lab requires it.`,
        workflow: {
          audit: "Write the formula carefully, then enter it.",
          diagnose: "If the mass looks wrong, check subscripts and element symbols.",
          execute: "Use the value in the next stoichiometry step.",
          measure: "Re-run after any formula correction.",
        },
        benchmarks: [
          { segment: "Homework", guidance: "Show the formula string with the numeric result." },
          { segment: "Labs", guidance: "Follow required atomic weights and sig figs." },
          { segment: "Teaching", guidance: "Demo a capitalization mistake and the mass swing." },
          { segment: "Prep", guidance: "Confirm units before scaling a batch." },
        ],
        integrations: [
          `Use related ${catName} or conversion tools when units differ.`,
          "Pair with stoichiometry practice outside this page when needed.",
        ],
        uiHints: ["Enter the formula exactly as labeled.", "Click Calculate, then read the unit on the result."],
      };

    case "conversion":
      return {
        problemSolved: `It converts between units for ${tool.toLowerCase()} without looking up factors or risking an offset mistake.`,
        keyComponents: [
          "A numeric value",
          "From and to unit selections",
          "The conversion factor (or temperature offset) used",
        ],
        value: `Reliable unit conversion prevents silent errors when plans, labs, or recipes mix systems.`,
        withoutIt: `People grab the wrong factor—or forget temperature’s offset—and every downstream number is wrong.`,
        whenToRely: `Use ${tool} whenever you know the starting amount and need it in another listed unit.`,
        roles: [
          {
            role: "Students",
            uses: ["Convert homework quantities.", "Check temperature C↔F carefully.", "Confirm length/mass factors."],
          },
          {
            role: "Builders & makers",
            uses: ["Move between metric and imperial plan units.", "Convert before ordering materials.", "Keep one system per calculation sheet."],
          },
          {
            role: "Lab & kitchen",
            uses: ["Scale masses and volumes.", "Avoid double-converting.", "Note the exact units on labels."],
          },
        ],
        scenario: `Enter the amount you have, set from/to units on ${tool}, convert, then use the result in the next step of your problem or plan.`,
        variableHints: [
          "Pick the unit that matches the number you already measured.",
          "Temperature uses an offset; most length/mass conversions do not.",
        ],
        sampleCalculation: `Example: convert a known value (e.g. 1 inch → cm) and confirm it matches a reference table.`,
        decoding: [
          "Output should be larger or smaller exactly as the unit scale implies.",
          "Temperature: 0 °C is 32 °F—not a pure multiply.",
          "Tiny differences vs another site are usually rounding.",
        ],
        redFlags: [
          "Swapping from/to units.",
          "Converting twice by accident.",
          "Using the result without labeling its unit in the next step.",
        ],
        hiddenWins: [
          "Catching a plan that mixed mm and inches.",
          "Converting once, then staying in one system.",
          "Using related converters for area/volume after length.",
        ],
        impact: `Put the converted value into your next calculation and label the unit beside it.`,
        workflow: {
          audit: "Write down the source amount and unit.",
          diagnose: "If wrong, check from/to and whether temperature needs an offset.",
          execute: "Use the converted value downstream.",
          measure: "Re-convert if the source measurement changes.",
        },
        benchmarks: [
          { segment: "Homework", guidance: "Show the factor or formula used." },
          { segment: "Plans / DIY", guidance: "Convert all dimensions before multiplying for area/volume." },
          { segment: "Labs", guidance: "Prefer SI end-to-end when the protocol allows." },
          { segment: "Cooking", guidance: "Mass and volume are not interchangeable without density." },
        ],
        integrations: [
          `Open related ${catName} converters when you need another quantity class.`,
          "Return to a geometry or physics tool after units match.",
        ],
        uiHints: ["Enter the value, set from/to units, then convert.", "Read the output unit on the result row."],
      };

    case "health":
      return {
        problemSolved: `It gives an educational estimate for ${tool.toLowerCase()} from the dates or measurements you enter—not a clinical diagnosis.`,
        keyComponents: [
          "Date or measurement fields labeled on this page",
          "The estimation rule shown in the formula and steps",
          "Educational results only—not medical advice",
        ],
        value: `A transparent ${tool.toLowerCase()} estimate helps with planning and learning—always confirm clinical decisions with a qualified clinician.`,
        withoutIt: `Without a clear ${tool.toLowerCase()} estimate, people miscount days, mix unit systems, or treat a rough rule as clinical guidance.`,
        whenToRely: `Use ${tool} for educational planning when you know the labeled inputs. Do not use it as medical advice.`,
        roles: [
          {
            role: "Learners & planners",
            uses: [
              `Estimate ${tool.toLowerCase()} from the labeled inputs for education and planning.`,
              "Read the steps so you know which rule was applied.",
              "Treat the result as an estimate—confirm clinically when it matters.",
            ],
          },
          {
            role: "Students & educators",
            uses: [
              "Show the labeled method with a worked example.",
              "Discuss limits of screening indexes and calendar rules.",
              "Stress that calculators are not medical advice.",
            ],
          },
          {
            role: "Athletes & everyday users",
            uses: [
              "Ballpark training or body-metric figures from known inputs.",
              "Compare unit systems carefully (metric vs US).",
              "Re-run when measurements change—not for diagnosis.",
            ],
          },
        ],
        scenario: `Enter the labeled inputs for ${tool} (dates as YYYY-MM-DD when asked). Click Calculate, then read the estimate and steps—remember it is educational only.`,
        variableHints: [
          "Match units to the field labels (kg/m vs lb/in, dates as YYYY-MM-DD).",
          "Outputs are educational estimates, not clinical records.",
        ],
        sampleCalculation: `Example: enter the sample or a known case into ${tool}, click Calculate, then match the result to the method in the steps.`,
        decoding: [
          "Read the primary estimate first (index, pace, date, or zone).",
          "Category labels are educational cutoffs when shown.",
          "Clinical care can differ—use this page for learning and planning only.",
        ],
        redFlags: [
          "Mixing metric and US units without converting.",
          "Using the wrong date field or date order (prefer YYYY-MM-DD).",
          "Treating an educational estimate as a diagnosis or prescription.",
        ],
        hiddenWins: [
          "Catching a unit mix-up before trusting a category label.",
          "Seeing how a small input change moves the estimate.",
          "Knowing when to ask a clinician instead of re-running the calculator.",
        ],
        impact: `Use the ${tool} estimate for planning education only. Confirm important health decisions with a clinician.`,
        workflow: {
          audit: `Enter the labeled inputs for ${tool} in the format shown.`,
          diagnose: "If the estimate looks off, re-check units, dates, and the method in the steps.",
          execute: "Use the result for educational planning; bring clinical questions to a clinician.",
          measure: "Re-run when measurements change—not for medical monitoring alone.",
        },
        benchmarks: [
          { segment: "Classroom / homework", guidance: "Show the formula or rule, the inputs, and the estimate together." },
          { segment: "Personal planning", guidance: `Treat ${tool} as a ballpark aid, not clinical guidance.` },
          { segment: "Comparing sources", guidance: "Compare methods and units before assuming an app disagreement is an error." },
          { segment: "Documentation", guidance: "Note inputs and that the result is educational only." },
        ],
        integrations: [
          `Combine ${tool} with related ${catName} calculators when you need a neighboring estimate.`,
          "Use converters if your measurements are in another unit system.",
        ],
        uiHints: [
          `Fill the labeled fields for ${tool} (dates as YYYY-MM-DD when asked).`,
          "Match each input to its label, then click Calculate.",
        ],
      };

    case "time":
      return {
        problemSolved: `It computes ${tool.toLowerCase()} from the dates or clock times you enter, with a clear day or duration count.`,
        keyComponents: [
          "Date or time fields in the format shown on the labels",
          "The counting rule used by this tool",
          "Clear duration or calendar results after you calculate",
        ],
        value: `Accurate date and time math prevents off-by-one scheduling and age mistakes.`,
        withoutIt: `Hand counting across month lengths and leap years is a common source of errors.`,
        whenToRely: `Use ${tool} when you know the labeled start/end values and need a transparent span or age.`,
        roles: [
          {
            role: "Everyday planners",
            uses: ["Count days between dates.", "Compute age or duration.", "Convert clock spans with breaks."],
          },
          {
            role: "Students",
            uses: ["Check homework date problems.", "See inclusive vs exclusive counting.", "Prefer ISO dates to avoid ambiguity."],
          },
          {
            role: "Ops & scheduling",
            uses: ["Draft timelines.", "Document the inputs used.", "Re-run when either endpoint moves."],
          },
        ],
        scenario: `Enter the labeled dates or times for ${tool} as YYYY-MM-DD or HH:MM, click Calculate, then read how this page counts the span.`,
        variableHints: [
          "Prefer YYYY-MM-DD to avoid day/month swaps.",
          "Read whether counting is inclusive on the result labels.",
        ],
        sampleCalculation: `Example: enter two known dates a week apart and confirm ${tool} reports about 7 days (per its counting rule).`,
        decoding: [
          "Primary result is the span, age, or clock total labeled on the page.",
          "Off-by-one usually means inclusive vs exclusive counting.",
          "Invalid dates fail rather than guessing.",
        ],
        redFlags: [
          "Ambiguous day/month order in dates.",
          "Mixing 12-hour and 24-hour times without labels.",
          "Assuming every month has 30 days in hand math.",
        ],
        hiddenWins: [
          "Catching a leap-year edge case automatically.",
          "Documenting both endpoints with the result.",
          "Switching to a related time tool for a different count style.",
        ],
        impact: `Use the ${tool} result in your schedule or write-up, and note both endpoints.`,
        workflow: {
          audit: "Write start and end in ISO form.",
          diagnose: "If the count looks wrong, check inclusive rules and time zones you assumed.",
          execute: "Apply the duration to your plan.",
          measure: "Re-run when either date/time changes.",
        },
        benchmarks: [
          { segment: "Scheduling", guidance: "State time zone assumptions when people collaborate across regions." },
          { segment: "Homework", guidance: "Show both dates with the day count." },
          { segment: "HR / age", guidance: "Use completed years/months/days, not days÷365 alone." },
          { segment: "Shifts", guidance: "Subtract breaks explicitly when the page asks for them." },
        ],
        integrations: [
          `Open related ${catName} tools for ages, diffs, or work-hour math.`,
          "Prefer one date format across your notes.",
        ],
        uiHints: ["Enter dates as YYYY-MM-DD when asked.", "Match each input to its label, then click Calculate."],
      };

    case "construction":
      return {
        problemSolved: `It estimates ${tool.toLowerCase()} from the dimensions and coverage rates you enter for planning.`,
        keyComponents: [
          "Length, area, or count fields on this page",
          "Coverage or yield assumptions in the steps",
          "Planning estimates—not a contractor quote",
        ],
        value: `A transparent materials estimate helps you buy closer to what a job needs—before you’re short on site.`,
        withoutIt: `Mixed units and forgotten waste factors produce under-buys and emergency runs to the store.`,
        whenToRely: `Use ${tool} for DIY planning when you can measure the labeled dimensions. Confirm product coverage on the label.`,
        roles: [
          {
            role: "DIY & homeowners",
            uses: ["Estimate paint, concrete, or flooring needs.", "Convert to one unit system first.", "Add personal waste contingency."],
          },
          {
            role: "Students / trades learners",
            uses: ["Check takeoff homework.", "Show unit conversions in the work.", "Compare related construction tools below."],
          },
          {
            role: "Pros (rough planning)",
            uses: ["Ballpark quantities before a formal takeoff.", "Document dimensions used.", "Replace coverage rates with product-specific values when known."],
          },
        ],
        scenario: `Measure the space, convert to one unit system, enter the labeled fields for ${tool}, then add waste if the page doesn’t include it.`,
        variableHints: [
          "Keep feet with feet (or meters with meters).",
          "Coverage rates vary by product—check the label.",
        ],
        sampleCalculation: `Example: enter a simple rectangular area into ${tool} and verify the area math by hand before trusting material counts.`,
        decoding: [
          "Area/volume should match length × width (× height) intuition.",
          "Material counts depend on coverage or bag yield assumptions.",
          "If the buy quantity looks low, you may need a waste factor.",
        ],
        redFlags: [
          "Mixing inches and feet in the same run.",
          "Ignoring coats of paint or waste.",
          "Treating the estimate as a final contractor bid.",
        ],
        hiddenWins: [
          "Catching a unit mistake before ordering.",
          "Buying one extra unit of material intentionally.",
          "Saving the dimensions beside the estimate.",
        ],
        impact: `Use ${tool} to plan purchases, then confirm coverage rates and local code with product labels or a pro.`,
        workflow: {
          audit: "Measure and convert to one unit system.",
          diagnose: "If quantity looks wrong, re-check dimensions and coverage.",
          execute: "Order with a waste buffer you choose.",
          measure: "Adjust after the first section is installed.",
        },
        benchmarks: [
          { segment: "Paint / finish", guidance: "Multiply by coats; add waste for cut-ins." },
          { segment: "Concrete / bulk", guidance: "Confirm bag yield on the product you will buy." },
          { segment: "Flooring", guidance: "Include extra for pattern matching when required." },
          { segment: "Teaching", guidance: "Show unit conversion before the materials step." },
        ],
        integrations: [
          `Combine ${tool} with related ${catName} estimators.`,
          "Use length/area converters when plans mix unit systems.",
        ],
        uiHints: ["Enter dimensions in one unit system.", "Match each input to its label, then click Calculate."],
      };

    case "text":
      return {
        problemSolved: `It analyzes or transforms the text you paste for ${tool.toLowerCase()} without a separate desktop utility.`,
        keyComponents: ["The text input area", "The count or transform this page performs", "Results labeled for characters, words, or the tool output"],
        value: `Fast text stats and transforms help writing, coding snippets, and classroom demos.`,
        withoutIt: `Manual counting is slow and inconsistent about spaces and line breaks.`,
        whenToRely: `Use ${tool} when you can paste the text and the result labels match what you need to count or transform.`,
        roles: [
          {
            role: "Writers & students",
            uses: ["Check word/character limits.", "Trim or transform text quickly.", "Verify counts before submitting."],
          },
          {
            role: "Developers",
            uses: ["Count characters in snippets.", "Demo transforms.", "Avoid pasting secrets."],
          },
          {
            role: "Teachers",
            uses: ["Show counting rules live.", "Compare related text tools.", "Discuss spaces vs non-spaces."],
          },
        ],
        scenario: `Paste your text into ${tool}, read the labeled counts or output, then adjust the text and re-run if needed.`,
        variableHints: ["Empty input yields empty results.", "Read whether spaces are included in character counts."],
        sampleCalculation: `Example: paste a short sentence into ${tool} and confirm the word count matches a manual tally.`,
        decoding: [
          "Primary metrics follow the result labels.",
          "Spaces and newlines may or may not count—check the label.",
          "Transforms show output text separately from counts.",
        ],
        redFlags: [
          "Assuming spaces are excluded when the label includes them.",
          "Pasting passwords or private keys into a public page.",
          "Comparing counts across tools with different rules.",
        ],
        hiddenWins: [
          "Catching a limit overflow before submit.",
          "Using a related tool for the next text task.",
          "Keeping a local copy of sensitive drafts.",
        ],
        impact: `Use the ${tool} result in your draft, and don’t paste secrets you wouldn’t type into a form.`,
        workflow: {
          audit: "Paste the text you want measured or transformed.",
          diagnose: "If counts disagree with another tool, compare space/newline rules.",
          execute: "Apply the result to your limit or edit.",
          measure: "Re-run after edits.",
        },
        benchmarks: [
          { segment: "Essays / apps", guidance: "Match the counter rules your form uses when possible." },
          { segment: "Social posts", guidance: "Check the platform’s own counter as source of truth." },
          { segment: "Classroom", guidance: "State whether spaces count." },
          { segment: "Dev snippets", guidance: "Avoid secrets in browser tools." },
        ],
        integrations: [`Open related ${catName} text tools for the next transform or count.`, "Keep drafts in your editor of record."],
        uiHints: ["Paste text into the input area.", "Read the result labels for counting rules."],
      };

    case "random":
      return {
        problemSolved: `It generates ${tool.toLowerCase()} outcomes from the options you set for games, demos, and casual picks.`,
        keyComponents: [
          "Options like count, range, or sides",
          "A pseudo-random draw each run",
          "Results suitable for play—not cryptography (unless noted)",
        ],
        value: `Quick fair-enough draws beat arguing over who goes first or picking biased numbers by hand.`,
        withoutIt: `People accidentally bias picks or reuse the same “random” numbers.`,
        whenToRely: `Use ${tool} for games and classroom demos. Use a dedicated security tool for secrets when the page isn’t meant for that.`,
        roles: [
          {
            role: "Players & hosts",
            uses: ["Roll dice or flip coins.", "Draw lottery-style numbers for fun.", "Re-roll for a new outcome."],
          },
          {
            role: "Teachers",
            uses: ["Demo randomness live.", "Discuss sample variation.", "Link probability tools for theory."],
          },
          {
            role: "Builders of casual tools",
            uses: ["Generate PINs or samples for demos.", "Avoid using casual RNGs for security-critical secrets unless the page says so.", "Document the options used."],
          },
        ],
        scenario: `Set the labeled options for ${tool}, generate a result, then generate again if you need a new independent draw.`,
        variableHints: [
          "Each click is a new draw unless a seed is exposed.",
          "Password/PIN tools: longer and more varied is stronger when the page is used for secrets.",
        ],
        sampleCalculation: `Example: set a small range on ${tool}, generate several times, and note that outcomes vary.`,
        decoding: [
          "Results are draws—not statistical proof of fairness in a tiny sample.",
          "Repeats can happen naturally.",
          "Security-sensitive uses need tools designed for that purpose.",
        ],
        redFlags: [
          "Using a toy RNG for high-stakes cryptographic keys when the page isn’t intended for that.",
          "Invalid ranges (min ≥ max).",
          "Assuming no repeats are allowed when the tool samples with replacement.",
        ],
        hiddenWins: [
          "Settling a game dispute quickly.",
          "Showing students that short runs look “streaky.”",
          "Pairing with probability calculators for expected values.",
        ],
        impact: `Use ${tool} for play and demos; switch to purpose-built security practices for real secrets.`,
        workflow: {
          audit: "Set valid options (range, count, sides).",
          diagnose: "If nothing appears, check min/max and required fields.",
          execute: "Share or use the draw for your game/demo.",
          measure: "Generate again for an independent result.",
        },
        benchmarks: [
          { segment: "Games", guidance: "Agree on rules before the first roll." },
          { segment: "Classroom", guidance: "Record many draws before talking about long-run frequency." },
          { segment: "Giveaways", guidance: "Publish the drawing method for transparency." },
          { segment: "Security", guidance: "Only use password tools as directed; prefer OS password managers for real accounts." },
        ],
        integrations: [
          `Try related ${catName} generators for a different draw style.`,
          "Open probability calculators when you want expected rates—not just one roll.",
        ],
        uiHints: ["Set the options, then generate.", "Click again for a new independent result."],
      };

    default:
      return {
        problemSolved: `It turns a multi-step ${tool.toLowerCase()} task into a clear, explainable answer.`,
        keyComponents: [
          `The inputs shown for ${tool}`,
          "The formula or method used by this tool",
          "Clear results after you calculate",
        ],
        value: `A clear ${tool.toLowerCase()} calculation helps you avoid silent arithmetic mistakes when the result drives a decision.`,
        withoutIt: `Without a clear ${tool.toLowerCase()} workflow you risk inconsistent hand calculations and answers that are hard to recheck.`,
        whenToRely: `Use ${tool} when the inputs on this page are known and you need a transparent result.`,
        roles: [
          {
            role: "Practitioners",
            uses: [`Run ${tool} whenever inputs change.`, "Keep a record of the values you used.", "Compare scenarios with the same method."],
          },
          {
            role: "Students & educators",
            uses: [`Verify answers for ${tool}.`, "Show the method and a worked example.", "Discuss units and assumptions out loud."],
          },
          {
            role: "Builders & analysts",
            uses: ["Cross-check a spreadsheet against this page.", "Change one input at a time to see sensitivity.", "Open a related tool when you need a neighboring method."],
          },
        ],
        scenario: `Enter the known inputs for ${tool}, review the steps, then use the result in your plan or homework.`,
        variableHints: ["Inputs feed the method; Results show the primary quantity and any helpers."],
        sampleCalculation: `Example: enter a small known case, click Calculate, then match the on-screen ${tool} result to the steps.`,
        decoding: [
          "Good: outputs that pass a quick sanity check against a known case.",
          "Sensitive: results that swing hard when one input changes slightly—double-check that input.",
          "Critical: impossible units or negative quantities where none should exist.",
        ],
        redFlags: [
          "Mismatched units or formats vs the field labels.",
          "Copying the wrong field into a downstream spreadsheet.",
        ],
        hiddenWins: [
          "Matching a known example before trusting a harder case.",
          "Finding the sensitive input by changing one value at a time.",
          "Linking a related calculator when you need the next step.",
        ],
        impact: `Use the ${tool} result in the next step of your work, and keep the inputs you used so you can reproduce the answer.`,
        workflow: {
          audit: `Enter the required inputs for ${tool} exactly as labeled.`,
          diagnose: "If something looks off, re-check units and required fields.",
          execute: "Apply the result to your task.",
          measure: "Re-run when inputs change.",
        },
        benchmarks: [
          { segment: "Everyday use", guidance: `Re-run ${tool} when any driving input changes.` },
          { segment: "Team handoff", guidance: "Share the inputs you used so others can reproduce the number." },
          { segment: "Quality check", guidance: "Compare against a known example before trusting a high-stakes case." },
          { segment: "Documentation", guidance: "Note units and assumptions next to the result." },
        ],
        integrations: [`Combine ${tool} with related ${catName} calculators when you need a neighboring method.`],
        uiHints: [`Use the calculator fields at the top of this ${tool} page.`, "Match each input to its label, then click Calculate."],
      };
  }
}

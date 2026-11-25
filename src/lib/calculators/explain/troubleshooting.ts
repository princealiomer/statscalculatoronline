import type { CalculatorDef } from "@/lib/calculators/types";
import type { FaqItem } from "./types";

export { domainFor, faqForDomain, type Domain } from "./domains";

/** Engine-specific FAQs for tools where domain defaults are still too broad. */
export function faqForEngine(calc: CalculatorDef): FaqItem[] | null {
  switch (calc.engine) {
    case "pregnancy-due":
      return [
        {
          q: "Why isn’t my due date calculating?",
          a: "Enter the first day of your last menstrual period (LMP) as YYYY-MM-DD (for example 2026-01-15). Blank or invalid dates are rejected.",
        },
        {
          q: "How is the due date estimated?",
          a: "This page uses Naegele’s rule: LMP + 280 days (about 40 weeks). It is an educational estimate, not a clinical due date.",
        },
        {
          q: "Why does gestational age look wrong?",
          a: "Gestational age here is counted from LMP to today’s date. A future LMP shows 0 weeks; an earlier LMP increases weeks and days.",
        },
        {
          q: "Is this medical advice?",
          a: "No. Ultrasound dating and clinician guidance can differ. Use the result for planning education only.",
        },
      ];
    case "period-estimate":
      return [
        {
          q: "Why isn’t my period estimate calculating?",
          a: "Enter the last period start as YYYY-MM-DD and a cycle length in days (typically around 28). Invalid dates or extreme cycle lengths are rejected.",
        },
        {
          q: "How are next period and ovulation estimated?",
          a: "Next period ≈ last start + cycle length. Ovulation is estimated about 14 days before the next period. Cycles vary—this is educational only.",
        },
        {
          q: "Is this birth-control or medical advice?",
          a: "No. Do not rely on this estimate for contraception or diagnosis. Confirm with a clinician when it matters.",
        },
        {
          q: "What if my cycles are irregular?",
          a: "A single average cycle length is a rough model. Irregular cycles need personalized medical guidance, not a fixed-day calculator alone.",
        },
      ];
    case "bmi":
      return [
        {
          q: "Why isn’t BMI calculating?",
          a: "Enter weight and height in the units the fields ask for. Zero or blank values are invalid.",
        },
        {
          q: "Is BMI a diagnosis?",
          a: "No. BMI is a simple screening index. Muscle mass, age, and other factors matter—speak with a clinician for health decisions.",
        },
        {
          q: "Metric or US units?",
          a: "Use the unit system implied by the fields (kg/m or lb/in). Mixing systems without converting will skew BMI.",
        },
        {
          q: "Which category should I trust?",
          a: "Category labels follow common adult cutoffs for education. Individual assessment may differ.",
        },
      ];
    case "heart-rate-zone":
      return [
        {
          q: "Why aren’t heart-rate zones calculating?",
          a: "Enter a valid age (and resting heart rate if the page asks for it). Out-of-range ages are rejected.",
        },
        {
          q: "Is this medical advice?",
          a: "No. Training zones are educational estimates. People with cardiac conditions should follow clinician guidance.",
        },
        {
          q: "What formula is used?",
          a: "This page uses a Karvonen-style estimate from age (and resting HR when provided). Read the steps for the exact numbers applied.",
        },
        {
          q: "Why don’t zones match my watch?",
          a: "Devices may use different max-HR formulas or measured max HR. Compare assumptions before worrying about small gaps.",
        },
      ];
    case "pace":
      return [
        {
          q: "Why isn’t pace calculating?",
          a: "Enter distance and time in the labeled units. Zero distance or time cannot produce a pace.",
        },
        {
          q: "Per mile or per kilometer?",
          a: "Match the distance unit you entered. The result is time per that distance unit unless the page converts.",
        },
        {
          q: "How do I use the result?",
          a: "Use pace to plan splits or compare runs. Re-run when distance or finish time changes.",
        },
        {
          q: "Need speed instead?",
          a: "Pace and speed are inverses. Check the result labels for which form this page reports.",
        },
      ];
    case "age-calc":
      return [
        {
          q: "Why isn’t age calculating?",
          a: "Enter birth date (and optional “as of” date) as YYYY-MM-DD. Blank or invalid dates are rejected.",
        },
        {
          q: "How is age counted?",
          a: "Age is the completed years, months, and days from birth date to the end date (today if you leave “as of” blank). Read the result labels for the exact breakdown.",
        },
        {
          q: "Why is the day count off by one?",
          a: "Calendar age uses completed units, not a raw day total divided by 365. Leap years and month lengths are included in the breakdown.",
        },
        {
          q: "What date format should I use?",
          a: "Prefer YYYY-MM-DD to avoid day/month ambiguity (for example 2000-03-15).",
        },
      ];
    case "date-diff":
      return [
        {
          q: "Why isn’t the date difference calculating?",
          a: "Enter start and end as YYYY-MM-DD. Invalid or blank dates are rejected.",
        },
        {
          q: "Is the end date inclusive?",
          a: "This page reports the signed day span between the two calendar dates you enter. Check the result label and steps for how this page counts.",
        },
        {
          q: "Why don’t weeks look whole?",
          a: "Weeks are days ÷ 7 and may show a decimal. Use the Days result when you need a whole-number span.",
        },
        {
          q: "What format should I use?",
          a: "Prefer YYYY-MM-DD so day and month are never swapped.",
        },
      ];
    case "mean-median-mode":
    case "average":
    case "mode-only":
    case "mean-only":
      return [
        {
          q: "Why isn’t my data calculating?",
          a: "Paste numbers separated by commas, spaces, or new lines. Remove letters, blank rows, and currency symbols.",
        },
        {
          q: "Mean vs median—which should I use?",
          a: "The mean is sensitive to outliers; the median is the middle value. Use both when the distribution may be skewed.",
        },
        {
          q: "Why is there no unique mode?",
          a: "If every value appears once, or several values tie for most frequent, the mode may be empty or multimodal—check the result labels.",
        },
        {
          q: "Can I use this for homework?",
          a: "Yes. Show your data list, which summary you report, and the on-page steps.",
        },
      ];
    case "temp-convert":
      return [
        {
          q: "Why isn’t temperature converting?",
          a: "Enter a numeric temperature and choose from/to units (°C, °F, or K). Blank values block the result.",
        },
        {
          q: "Why isn’t this a simple multiply?",
          a: "Celsius ↔ Fahrenheit uses an offset as well as a scale factor. Kelvin shifts from Celsius by 273.15.",
        },
        {
          q: "Which unit should I pick first?",
          a: "Match the unit of the reading you already have, then convert to the unit you need.",
        },
        {
          q: "Why might another site differ slightly?",
          a: "Rounding at many decimal places can differ. The standard formulas are used here.",
        },
      ];
    case "percentage":
    case "percent-of":
    case "percent-change":
      return [
        {
          q: `Why isn’t ${calc.title} calculating?`,
          a: "Enter the labeled numbers. Blank fields or a zero base (denominator) block the result.",
        },
        {
          q: "Percent of vs percent change?",
          a: "Percent of compares a part to a whole. Percent change compares an old value to a new value.",
        },
        {
          q: "Do I enter 5 or 0.05?",
          a: "Follow the field label. Most pages want 5 for 5% unless the label says decimal.",
        },
        {
          q: "Can I use this for homework?",
          a: "Yes—show the inputs, the percent form you need, and the on-page steps.",
        },
      ];
    default:
      return null;
  }
}

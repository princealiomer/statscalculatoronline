import { fmt, type CalcResult } from "@/lib/stats/format";
import {
  mean,
  median,
  mode,
  quartiles,
  stdev,
  sum,
  variance,
} from "@/lib/stats/descriptive";
import { parseNumbers } from "@/lib/stats/parse";

type Input = Record<string, string>;

function ok(fields: CalcResult["fields"], steps: CalcResult["steps"], apa?: string): CalcResult {
  return { fields, steps, apa };
}

function isSample(input: Input) {
  return (input.sampleType ?? "sample").toLowerCase() !== "population";
}

const SUITS = ["♠", "♥", "♦", "♣"];
const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function letterGrade(score: number): string {
  if (score >= 97) return "A+";
  if (score >= 93) return "A";
  if (score >= 90) return "A-";
  if (score >= 87) return "B+";
  if (score >= 83) return "B";
  if (score >= 80) return "B-";
  if (score >= 77) return "C+";
  if (score >= 73) return "C";
  if (score >= 70) return "C-";
  if (score >= 67) return "D+";
  if (score >= 63) return "D";
  if (score >= 60) return "D-";
  return "F";
}

function gpaFromLetter(letter: string): number {
  const map: Record<string, number> = {
    "A+": 4.0,
    A: 4.0,
    "A-": 3.7,
    "B+": 3.3,
    B: 3.0,
    "B-": 2.7,
    "C+": 2.3,
    C: 2.0,
    "C-": 1.7,
    "D+": 1.3,
    D: 1.0,
    "D-": 0.7,
    F: 0,
  };
  const key = letter.trim().toUpperCase();
  if (!(key in map)) throw new Error(`Unknown letter grade: ${letter}`);
  return map[key];
}

export function runSoupStats(engine: string, input: Input): CalcResult | null {
  switch (engine) {
    case "variance-only": {
      const data = parseNumbers(input.data ?? "");
      if (data.length < 2) throw new Error("Enter at least 2 numbers.");
      const sample = isSample(input);
      const v = variance(data, sample);
      const s = stdev(data, sample);
      return ok(
        [
          { label: sample ? "Variance (sample)" : "Variance (population)", value: fmt(v) },
          { label: sample ? "SD (sample)" : "SD (population)", value: fmt(s) },
          { label: "n", value: data.length },
          { label: "Mean", value: fmt(mean(data)) },
        ],
        [
          {
            title: "Variance",
            detail: sample
              ? `s² = Σ(x−x̄)²/(n−1) = ${fmt(v)}`
              : `σ² = Σ(x−μ)²/n = ${fmt(v)}`,
          },
        ],
      );
    }

    case "stddev-only": {
      const data = parseNumbers(input.data ?? "");
      if (data.length < 2) throw new Error("Enter at least 2 numbers.");
      const sample = isSample(input);
      const s = stdev(data, sample);
      const v = variance(data, sample);
      return ok(
        [
          { label: sample ? "SD (sample)" : "SD (population)", value: fmt(s) },
          { label: sample ? "Variance (sample)" : "Variance (population)", value: fmt(v) },
          { label: "n", value: data.length },
          { label: "Mean", value: fmt(mean(data)) },
        ],
        [
          {
            title: "Standard deviation",
            detail: sample ? `s = √(Σ(x−x̄)²/(n−1)) = ${fmt(s)}` : `σ = √(Σ(x−μ)²/n) = ${fmt(s)}`,
          },
        ],
      );
    }

    case "quartile": {
      const data = parseNumbers(input.data ?? "");
      if (data.length < 2) throw new Error("Enter at least 2 numbers.");
      const q = quartiles(data);
      return ok(
        [
          { label: "Q1", value: fmt(q.q1) },
          { label: "Q2 (median)", value: fmt(q.q2) },
          { label: "Q3", value: fmt(q.q3) },
          { label: "IQR", value: fmt(q.iqr) },
          { label: "Min", value: fmt(Math.min(...data)) },
          { label: "Max", value: fmt(Math.max(...data)) },
        ],
        [{ title: "Quartiles", detail: "Q1=P25, Q2=P50, Q3=P75; IQR = Q3 − Q1" }],
      );
    }

    case "iqr-only": {
      const data = parseNumbers(input.data ?? "");
      if (data.length < 2) throw new Error("Enter at least 2 numbers.");
      const q = quartiles(data);
      return ok(
        [
          { label: "IQR", value: fmt(q.iqr) },
          { label: "Q1", value: fmt(q.q1) },
          { label: "Q3", value: fmt(q.q3) },
        ],
        [{ title: "IQR", detail: `Q3 − Q1 = ${fmt(q.iqr)}` }],
      );
    }

    case "coin-flip": {
      const n = Math.min(100000, Math.max(1, Math.floor(Number(input.n ?? 1))));
      let heads = 0;
      const sequence: string[] = [];
      for (let i = 0; i < n; i++) {
        const h = Math.random() < 0.5;
        if (h) heads++;
        if (n <= 200) sequence.push(h ? "H" : "T");
      }
      const tails = n - heads;
      return ok(
        [
          { label: "Flips", value: n },
          { label: "Heads", value: heads },
          { label: "Tails", value: tails },
          { label: "Heads %", value: `${fmt((heads / n) * 100)}%` },
          { label: "Tails %", value: `${fmt((tails / n) * 100)}%` },
          ...(sequence.length ? [{ label: "Sequence", value: sequence.join(" ") }] : []),
        ],
        [{ title: "Fair coin simulation", detail: `${n} independent flips` }],
      );
    }

    case "pin-gen": {
      const digits = Math.min(100, Math.max(1, Math.floor(Number(input.digits ?? 4))));
      const repeats = (input.repeats ?? "yes") !== "no";
      const count = Math.min(50, Math.max(1, Math.floor(Number(input.count ?? 1))));
      const pins: string[] = [];
      for (let p = 0; p < count; p++) {
        if (repeats || digits > 10) {
          let pin = "";
          for (let i = 0; i < digits; i++) pin += Math.floor(Math.random() * 10);
          pins.push(pin);
        } else {
          const pool = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, digits);
          pins.push(pool.join(""));
        }
      }
      return ok(
        [
          { label: "Digits", value: digits },
          { label: "Repeats allowed", value: repeats ? "Yes" : "No" },
          { label: "PINs", value: pins.join(", ") },
        ],
        [{ title: "PIN generation", detail: `${count} PIN(s) of length ${digits}` }],
      );
    }

    case "rng-1-10":
      return runSoupStats("rng-range", { ...input, min: "1", max: "10", n: input.n ?? "1" })!;

    case "rng-1-100":
      return runSoupStats("rng-range", { ...input, min: "1", max: "100", n: input.n ?? "1" })!;

    case "rng-range": {
      const min = Number(input.min ?? 1);
      const max = Number(input.max ?? 100);
      const n = Math.min(10000, Math.max(1, Math.floor(Number(input.n ?? 1))));
      const unique = (input.unique ?? "no") === "yes";
      if (![min, max].every(Number.isFinite) || max < min) throw new Error("Invalid min/max range.");
      const span = Math.floor(max) - Math.ceil(min) + 1;
      if (unique && n > span) throw new Error("Not enough unique values in range.");
      const out: number[] = [];
      if (unique) {
        const pool = Array.from({ length: span }, (_, i) => Math.ceil(min) + i);
        out.push(...shuffle(pool).slice(0, n));
      } else {
        for (let i = 0; i < n; i++) {
          out.push(Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min));
        }
      }
      const sorted = (input.sort ?? "no") === "yes" ? [...out].sort((a, b) => a - b) : out;
      return ok(
        [
          { label: "Count", value: n },
          { label: "Range", value: `${min}–${max}` },
          { label: "Numbers", value: sorted.join(", ") },
        ],
        [{ title: "Random integers", detail: unique ? "Without replacement" : "With replacement" }],
      );
    }

    case "random-names": {
      const names = (input.names ?? "")
        .split(/\r?\n|,/)
        .map((s) => s.trim())
        .filter(Boolean);
      if (names.length < 1) throw new Error("Enter at least one name.");
      const picks = Math.min(names.length, Math.max(1, Math.floor(Number(input.picks ?? 1))));
      const withRepeats = (input.repeats ?? "no") === "yes";
      const chosen: string[] = [];
      if (withRepeats) {
        for (let i = 0; i < picks; i++) chosen.push(names[Math.floor(Math.random() * names.length)]);
      } else {
        chosen.push(...shuffle(names).slice(0, picks));
      }
      return ok(
        [
          { label: "Pool size", value: names.length },
          { label: "Picked", value: chosen.join(", ") },
        ],
        [{ title: "Random name pick", detail: `${picks} selection(s)` }],
      );
    }

    case "random-cards": {
      const n = Math.min(52, Math.max(1, Math.floor(Number(input.n ?? 1))));
      const deck = shuffle(SUITS.flatMap((s) => RANKS.map((r) => `${r}${s}`)));
      const hand = deck.slice(0, n);
      return ok(
        [
          { label: "Cards drawn", value: n },
          { label: "Hand", value: hand.join(" ") },
        ],
        [{ title: "Shuffled deck", detail: `Drew ${n} card(s) without replacement` }],
      );
    }

    case "random-letters": {
      const n = Math.min(1000, Math.max(1, Math.floor(Number(input.n ?? 10))));
      const len = Math.min(32, Math.max(1, Math.floor(Number(input.length ?? 1))));
      const upper = (input.case ?? "upper") !== "lower";
      const alphabet = upper ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "abcdefghijklmnopqrstuvwxyz";
      const sets: string[] = [];
      for (let i = 0; i < n; i++) {
        let s = "";
        for (let j = 0; j < len; j++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
        sets.push(s);
      }
      return ok(
        [
          { label: "Sets", value: n },
          { label: "Length", value: len },
          { label: "Output", value: sets.join(", ") },
        ],
        [{ title: "Random letters", detail: `${n} string(s) of length ${len}` }],
      );
    }

    case "char-count": {
      const text = input.text ?? "";
      const chars = [...text];
      const noSpaces = text.replace(/\s/g, "");
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      const lines = text.length ? text.split(/\r?\n/).length : 0;
      const freq = new Map<string, number>();
      for (const ch of chars) {
        if (ch === " " || ch === "\n" || ch === "\t") continue;
        freq.set(ch, (freq.get(ch) ?? 0) + 1);
      }
      const top = [...freq.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15)
        .map(([c, n]) => `${JSON.stringify(c)}:${n}`)
        .join(", ");
      return ok(
        [
          { label: "Characters (with spaces)", value: chars.length },
          { label: "Characters (no spaces)", value: noSpaces.length },
          { label: "Words", value: words },
          { label: "Lines", value: lines },
          { label: "Unique characters", value: freq.size },
          { label: "Top frequencies", value: top || "—" },
        ],
        [{ title: "Character count", detail: "Whitespace-aware counts and unique character frequency" }],
      );
    }

    case "word-count": {
      const text = input.text ?? "";
      const words = text.trim() ? text.trim().split(/\s+/) : [];
      const freq = new Map<string, number>();
      for (const w of words) {
        const key = w.toLowerCase().replace(/[^\p{L}\p{N}'-]/gu, "");
        if (!key) continue;
        freq.set(key, (freq.get(key) ?? 0) + 1);
      }
      const top = [...freq.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15)
        .map(([w, n]) => `${w}:${n}`)
        .join(", ");
      return ok(
        [
          { label: "Words", value: words.length },
          { label: "Characters", value: text.length },
          { label: "Unique words", value: freq.size },
          { label: "Top words", value: top || "—" },
        ],
        [{ title: "Word count", detail: "Tokenize on whitespace; density from normalized words" }],
      );
    }

    case "grade-weighted": {
      const rows = (input.data ?? "")
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);
      if (!rows.length) throw new Error("Enter grades as: score, weight% (one per line).");
      let weighted = 0;
      let weightSum = 0;
      for (const row of rows) {
        const parts = row.split(/[,\s]+/).map(Number);
        if (parts.length < 2 || !parts.every(Number.isFinite)) {
          throw new Error(`Bad row "${row}". Use: score, weight%`);
        }
        const [score, weight] = parts;
        weighted += score * weight;
        weightSum += weight;
      }
      if (weightSum <= 0) throw new Error("Weights must sum to a positive value.");
      const course = weighted / weightSum;
      return ok(
        [
          { label: "Weighted grade", value: fmt(course) },
          { label: "Letter", value: letterGrade(course) },
          { label: "Weight total", value: `${fmt(weightSum)}%` },
        ],
        [{ title: "Weighted average", detail: `Σ(score × weight) / Σ(weight) = ${fmt(course)}` }],
      );
    }

    case "final-grade": {
      const current = Number(input.current);
      const desired = Number(input.desired);
      const finalWeight = Number(input.finalWeight ?? 20);
      if (![current, desired, finalWeight].every(Number.isFinite)) {
        throw new Error("Enter current grade, desired grade, and final weight %.");
      }
      if (finalWeight <= 0 || finalWeight >= 100) throw new Error("Final weight must be between 0 and 100.");
      const remaining = 100 - finalWeight;
      const need = (desired * 100 - current * remaining) / finalWeight;
      return ok(
        [
          { label: "Current grade", value: fmt(current) },
          { label: "Desired course grade", value: fmt(desired) },
          { label: "Final exam weight", value: `${fmt(finalWeight)}%` },
          { label: "Needed on final", value: fmt(need) },
          { label: "Needed letter", value: letterGrade(need) },
        ],
        [
          {
            title: "Solve for final",
            detail: `needed = (desired×100 − current×(100−w)) / w = ${fmt(need)}`,
          },
        ],
      );
    }

    case "gpa": {
      const rows = (input.data ?? "")
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);
      if (!rows.length) throw new Error("Enter rows as: letter, credits (e.g. A, 3).");
      let points = 0;
      let credits = 0;
      for (const row of rows) {
        const [letter, crRaw] = row.split(/[,\s]+/);
        const cr = Number(crRaw);
        if (!letter || !Number.isFinite(cr) || cr <= 0) throw new Error(`Bad GPA row: ${row}`);
        points += gpaFromLetter(letter) * cr;
        credits += cr;
      }
      const gpa = points / credits;
      return ok(
        [
          { label: "Credits", value: fmt(credits) },
          { label: "Quality points", value: fmt(points) },
          { label: "GPA", value: fmt(gpa, 3) },
        ],
        [{ title: "GPA", detail: `Σ(grade points × credits) / Σ(credits) = ${fmt(gpa, 3)}` }],
      );
    }

    case "mean-only": {
      const data = parseNumbers(input.data ?? "");
      if (data.length < 1) throw new Error("Enter at least 1 number.");
      const m = mean(data);
      return ok(
        [
          { label: "n", value: data.length },
          { label: "Sum", value: fmt(sum(data)) },
          { label: "Mean", value: fmt(m) },
          { label: "Median", value: fmt(median(data)) },
          { label: "Mode", value: mode(data).length ? mode(data).map(fmt).join(", ") : "No unique mode" },
        ],
        [{ title: "Mean", detail: `Σx / n = ${fmt(m)}` }],
      );
    }

    default:
      return null;
  }
}

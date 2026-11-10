/** Parse numbers from comma / space / newline separated text. */
export function parseNumbers(text: string): number[] {
  return text
    .split(/[\s,;|\t\n\r]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map(Number)
    .filter((n) => Number.isFinite(n));
}

/** Parse two columns of paired data (x y per line, or two comma-separated lists). */
export function parsePaired(text: string): { x: number[]; y: number[] } {
  const lines = text
    .trim()
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length >= 2 && lines.every((l) => /[,;\t ]/.test(l))) {
    const x: number[] = [];
    const y: number[] = [];
    for (const line of lines) {
      const parts = line.split(/[,;\t ]+/).map(Number);
      if (parts.length >= 2 && parts.every(Number.isFinite)) {
        x.push(parts[0]);
        y.push(parts[1]);
      }
    }
    if (x.length) return { x, y };
  }

  const all = parseNumbers(text);
  const mid = Math.floor(all.length / 2);
  return { x: all.slice(0, mid), y: all.slice(mid, mid * 2) };
}

/** Parse groups: blank-line separated, or labeled GroupA: 1,2,3 */
export function parseGroups(text: string): { labels: string[]; groups: number[][] } {
  const labeled = [...text.matchAll(/(?:^|\n)\s*([^:\n]+)\s*:\s*([^\n]+)/g)];
  if (labeled.length >= 2) {
    return {
      labels: labeled.map((m) => m[1].trim()),
      groups: labeled.map((m) => parseNumbers(m[2])),
    };
  }

  const blocks = text
    .trim()
    .split(/\n\s*\n/)
    .map((b) => parseNumbers(b))
    .filter((g) => g.length > 0);

  if (blocks.length >= 2) {
    return {
      labels: blocks.map((_, i) => `Group ${i + 1}`),
      groups: blocks,
    };
  }

  // Single column with group id: value,group
  const lines = text
    .trim()
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const map = new Map<string, number[]>();
  for (const line of lines) {
    const parts = line.split(/[,;\t]/);
    if (parts.length >= 2) {
      const v = Number(parts[0]);
      const g = parts[1].trim() || "Group";
      if (Number.isFinite(v)) {
        if (!map.has(g)) map.set(g, []);
        map.get(g)!.push(v);
      }
    }
  }
  if (map.size >= 2) {
    return {
      labels: [...map.keys()],
      groups: [...map.values()],
    };
  }

  return { labels: [], groups: [] };
}

/** Parse a contingency table: rows of comma-separated counts. */
export function parseMatrix(text: string): number[][] {
  return text
    .trim()
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) =>
      l
        .split(/[,;\t\s]+/)
        .map(Number)
        .filter((n) => Number.isFinite(n)),
    )
    .filter((r) => r.length > 0);
}

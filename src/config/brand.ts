/**
 * Stats Calculator Online brand tokens (source of truth for designers/devs).
 *
 * Personality: precise, calm, credible — a working tool, not a marketing gimmick.
 * Canvas is cool grey; white panels create hierarchy; teal is the only loud action color.
 */
export const brand = {
  name: "Stats Calculator Online",
  shortName: "SCO",
  colors: {
    grey: "#E5E7EB",
    greyDeep: "#D8DCE3",
    paper: "#F3F4F6",
    panel: "#FFFFFF",
    ink: "#1A1F2C",
    inkSoft: "#4B5568",
    accent: "#0D7377",
    accentDark: "#0A5C5F",
    signal: "#B8870F",
  },
  voice: {
    clarity: "Say the full brand name. Never break keywords into slang.",
    tone: "Direct, helpful, exam-and-work ready.",
  },
} as const;

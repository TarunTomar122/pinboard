const TAG_PALETTE = [
  { bg: "#e8f0fe", text: "#1a56db" }, // blue
  { bg: "#fce7f3", text: "#be185d" }, // pink
  { bg: "#d1fae5", text: "#065f46" }, // green
  { bg: "#fef3c7", text: "#92400e" }, // amber
  { bg: "#ede9fe", text: "#6d28d9" }, // violet
  { bg: "#ffe4e6", text: "#be123c" }, // rose
  { bg: "#ccfbf1", text: "#0f766e" }, // teal
  { bg: "#f3e8ff", text: "#7c3aed" }, // purple
  { bg: "#e0f2fe", text: "#0369a1" }, // sky
  { bg: "#fef9c3", text: "#a16207" }, // yellow
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getTagColor(tag: string): { bg: string; text: string } {
  if (tag.toLowerCase() === "explore") {
    return { bg: "#ede9fe", text: "#6d28d9" };
  }
  const idx = hashString(tag) % TAG_PALETTE.length;
  return TAG_PALETTE[idx];
}

export const SUGGESTED_TAGS = [
  "explore",
  "read",
  "watch",
  "build",
  "research",
  "idea",
  "reference",
];

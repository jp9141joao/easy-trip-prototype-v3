export type Theme = {
  bg: string;
  card: string;
  cardAlt: string;
  text: string;
  textMuted: string;
  border: string;
  scrim: string;
  scrimStrong: string;
};

export const DARK: Theme = {
  bg: "#0A0A0B",
  card: "#121315",
  cardAlt: "#15171A",
  text: "#FFFFFF",
  textMuted: "#A1A1AA",
  border: "#23262B",
  scrim: "rgba(0,0,0,0.28)",
  scrimStrong: "rgba(0,0,0,0.38)",
};

export const LIGHT: Theme = {
  bg: "#FFFFFF",
  card: "#F8FAFC",
  cardAlt: "#FFFFFF",
  text: "#0F1720",
  textMuted: "#6B7280",
  border: "#E5E7EB",
  scrim: "rgba(0,0,0,0.45)",
  scrimStrong: "rgba(0,0,0,0.55)",
};

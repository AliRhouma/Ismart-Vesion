/* iSmart Coach design tokens (skill §2) */
export const C = {
  dark: "#131313", dark2: "#151515", dark3: "#0e0e0e",
  card: "#181818", panel: "#161616",
  green: "#00FF87", greenDim: "#00cc6a", blue: "#3B82F6", softBlue: "#60A5FA",
  amber: "#E6A817", teal: "#2DD4BF", muted: "#969696", muted2: "#5a5a5a",
  white: "#FFFFFF", slate: "#1e1e1e", border: "rgba(255,255,255,0.07)",
};
/* Home leads in green, away is the natural second series in blue (skill §2 reserves red for errors). */
export const HOME = C.green, AWAY = C.blue;
export const CHART_COLORS = ["#00FF87", "#3B82F6", "#E6A817", "#2DD4BF", "#60A5FA", "#00cc6a"];
export const GRID = "rgba(255,255,255,0.07)";
export const TICK = { fill: "#969696", fontFamily: "DM Sans, sans-serif", fontSize: 11 };
export const LEGEND = { fontFamily: "Syne, sans-serif", fontSize: 11, fontWeight: 600 };

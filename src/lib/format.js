/**
 * Shared formatting utilities
 */

export const formatCurrency = (n) =>
  new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 0,
  }).format(n || 0);

export const CHART_COLORS = ["#00E5FF", "#B388FF", "#FFAB00", "#4ade80", "#ff6b6b", "#60a5fa"];

export const CHART_TOOLTIP_STYLE = {
  background: "#111114",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "12px",
  color: "#fff",
  fontSize: "12px",
};

export const AXIS_TICK_STYLE = { fontSize: 10, fill: "rgba(255,255,255,0.35)" };
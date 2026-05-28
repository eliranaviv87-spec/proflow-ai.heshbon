/**
 * Reusable neon-styled button
 */
export default function NeonButton({ children, color = "#00E5FF", onClick, disabled, className = "", size = "md" }) {
  const padding = size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 rounded-xl font-medium transition-all ${padding} ${className}`}
      style={{
        background: `${color}12`,
        color: disabled ? "rgba(255,255,255,0.25)" : color,
        border: `1px solid ${color}${disabled ? "20" : "30"}`,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {children}
    </button>
  );
}
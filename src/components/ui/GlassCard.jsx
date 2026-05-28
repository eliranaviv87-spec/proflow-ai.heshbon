/**
 * Reusable glass-morphism card
 */
export default function GlassCard({ children, className = "", style = {}, glow, hover = false }) {
  const glowMap = {
    cyan: "neon-glow-cyan",
    amber: "neon-glow-amber",
    purple: "neon-glow-purple",
  };
  return (
    <div
      className={`glass-card ${glow ? glowMap[glow] || "" : ""} ${hover ? "glass-card-hover" : ""} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
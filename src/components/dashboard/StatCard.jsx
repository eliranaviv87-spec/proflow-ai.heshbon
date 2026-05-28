import GlassCard from "@/components/ui/GlassCard";

export default function StatCard({ title, value, sub, color, glow, icon: Icon }) {
  return (
    <GlassCard glow={glow} className="p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.45)" }}>{title}</p>
        {Icon && <Icon size={16} style={{ color }} />}
      </div>
      <p className="text-2xl font-bold mb-1" style={{ color }}>{value}</p>
      {sub && <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{sub}</p>}
    </GlassCard>
  );
}
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { formatCurrency, CHART_TOOLTIP_STYLE, AXIS_TICK_STYLE } from "@/lib/format";
import GlassCard from "@/components/ui/GlassCard";

export default function CashflowChart({ data }) {
  return (
    <GlassCard className="p-6 lg:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold" style={{ color: "#00E5FF" }}>תחזית תזרים 90 יום</p>
        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(0,229,255,0.1)", color: "#00E5FF", border: "1px solid rgba(0,229,255,0.2)" }}>
          AI Predictive
        </span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="day" tick={AXIS_TICK_STYLE} axisLine={false} tickLine={false} />
          <YAxis tick={AXIS_TICK_STYLE} axisLine={false} tickLine={false} tickFormatter={(v) => `₪${(v / 1000).toFixed(0)}K`} />
          <Tooltip contentStyle={CHART_TOOLTIP_STYLE} formatter={(v) => [formatCurrency(v), "יתרה"]} />
          <Line type="monotone" dataKey="balance" stroke="#00E5FF" strokeWidth={2} dot={false} style={{ filter: "drop-shadow(0 0 6px #00E5FF)" }} />
        </LineChart>
      </ResponsiveContainer>
    </GlassCard>
  );
}
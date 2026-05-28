import { TrendingUp, TrendingDown, FileText } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import GlassCard from "@/components/ui/GlassCard";

export default function KpiRow({ totalIncome, totalExpense, netProfit, totalVAT }) {
  const items = [
    { label: 'סה"כ הכנסות', value: formatCurrency(totalIncome), color: "#4ade80", icon: TrendingUp },
    { label: 'סה"כ הוצאות', value: formatCurrency(totalExpense), color: "#ff6b6b", icon: TrendingDown },
    { label: "רווח נקי", value: formatCurrency(netProfit), color: netProfit >= 0 ? "#00E5FF" : "#ff6b6b", icon: TrendingUp },
    { label: 'מע"מ שנאסף', value: formatCurrency(totalVAT), color: "#FFAB00", icon: FileText },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map(({ label, value, color, icon: Icon }) => (
        <GlassCard key={label} className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon size={14} style={{ color }} />
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</p>
          </div>
          <p className="text-xl font-bold" style={{ color }}>{value}</p>
        </GlassCard>
      ))}
    </div>
  );
}
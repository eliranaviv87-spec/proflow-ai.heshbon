import { formatCurrency } from "@/lib/format";
import GlassCard from "@/components/ui/GlassCard";

export default function TaxClockWidget({ vatOwed, incomeTax, onOptimize }) {
  return (
    <GlassCard glow="amber" className="p-6 lg:col-span-1">
      <p className="text-xs font-semibold mb-4" style={{ color: "#FFAB00" }}>חבות מס בזמן אמת (אל תנחש, תדע)</p>
      <div className="space-y-4 mb-5">
        <div>
          <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>מע"מ לתשלום</p>
          <p className="text-3xl font-black" style={{ color: "#FFAB00" }}>{formatCurrency(vatOwed)}</p>
        </div>
        <div>
          <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>מקדמת מס הכנסה</p>
          <p className="text-2xl font-bold" style={{ color: "#ff6b6b" }}>{formatCurrency(incomeTax)}</p>
        </div>
      </div>
      <button onClick={onOptimize} className="w-full btn-amber rounded-xl py-2.5 text-sm font-semibold">
        ⚡ אופטימיזציית מס עכשיו
      </button>
    </GlassCard>
  );
}
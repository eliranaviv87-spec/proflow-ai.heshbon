import { useState, useEffect } from "react";
import { X, Sparkles } from "lucide-react";
import { base44 } from "@/api/base44Client";

const formatCurrency = (n) =>
  new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS", maximumFractionDigits: 0 }).format(n || 0);

export default function AIAdviceModal({ vatOwed, incomeTax, totalIncome, onClose }) {
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.integrations.Core.InvokeLLM({
      prompt: `אתה CFO AI מומחה לחשבונות בישראל. ספק 3-4 המלצות אופטימיזציית מס קצרות ופרקטיות בעברית בלבד.
      נתונים: הכנסות = ${formatCurrency(totalIncome)}, מע"מ לתשלום = ${formatCurrency(vatOwed)}, מקדמת מס הכנסה = ${formatCurrency(incomeTax)}.
      פורמט: כל המלצה בשורה חדשה עם אמוג'י.`,
    }).then((res) => {
      setAdvice(res);
      setLoading(false);
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
      <div className="glass-card neon-glow-purple p-6 w-full max-w-lg" role="dialog" aria-modal="true" aria-label="ייעוץ מס AI">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={18} style={{ color: "#B388FF" }} />
            <h2 className="font-bold text-white">אופטימיזציית מס — CFO AI</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg transition-colors" style={{ color: "rgba(255,255,255,0.4)" }} aria-label="סגור">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 rounded-xl mb-4" style={{ background: "rgba(179,136,255,0.05)", border: "1px solid rgba(179,136,255,0.15)" }}>
          {loading ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 rounded-full animate-spin flex-shrink-0" style={{ borderColor: "rgba(179,136,255,0.2)", borderTopColor: "#B388FF" }} />
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>ה-AI מנתח את הנתונים שלך...</p>
            </div>
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "rgba(255,255,255,0.8)" }}>{advice}</p>
          )}
        </div>

        <button onClick={onClose} className="w-full py-2.5 rounded-xl text-sm font-medium transition-colors" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)" }}>
          סגור
        </button>
      </div>
    </div>
  );
}
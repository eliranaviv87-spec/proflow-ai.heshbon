import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Sparkles, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";

const fmt = (n) => new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS", maximumFractionDigits: 0 }).format(n || 0);

export default function AiSmartSummary({ totalIncome, totalExpenses, vatOwed, docsCount }) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const generate = async () => {
    setLoading(true);
    setExpanded(true);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `אתה CFO AI. תן סיכום ניהולי קצר (3 משפטים בעברית) על המצב הפיננסי:
הכנסות: ${fmt(totalIncome)}, הוצאות: ${fmt(totalExpenses)}, מע"מ לתשלום: ${fmt(vatOwed)}, מסמכים: ${docsCount}.
כלול המלצה אחת מיידית.`,
    });
    setSummary(res);
    setLoading(false);
  };

  return (
    <div className="glass-card p-4" style={{ border: "1px solid rgba(179,136,255,0.2)", background: "rgba(179,136,255,0.04)" }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={15} style={{ color: "#B388FF" }} />
          <span className="text-sm font-semibold" style={{ color: "#B388FF" }}>Smart Summary — CFO AI</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={generate}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
            style={{ background: "rgba(179,136,255,0.12)", color: "#B388FF", border: "1px solid rgba(179,136,255,0.25)" }}
          >
            {loading ? <RefreshCw size={12} className="animate-spin" /> : <Sparkles size={12} />}
            {loading ? "מנתח..." : "נתח עכשיו"}
          </button>
          {summary && (
            <button onClick={() => setExpanded(!expanded)} style={{ color: "rgba(255,255,255,0.4)" }}>
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          )}
        </div>
      </div>
      {expanded && (
        <div className="mt-3">
          {loading ? (
            <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
              <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: "rgba(179,136,255,0.2)", borderTopColor: "#B388FF" }} />
              ה-AI מנתח את הנתונים...
            </div>
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "rgba(255,255,255,0.75)" }}>{summary}</p>
          )}
        </div>
      )}
      {!summary && !loading && (
        <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.3)" }}>לחץ "נתח עכשיו" לקבלת תובנות AI מיידיות על המצב הפיננסי</p>
      )}
    </div>
  );
}
import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { ExternalLink, FileText, Building2, Shield, RefreshCw, CheckCircle, Sparkles } from "lucide-react";

const fmt = (n) => new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS", maximumFractionDigits: 0 }).format(n || 0);

const GOV_LINKS = [
  {
    title: "רשות המיסים — אזור אישי",
    desc: "הגשת דוחות, תשלומי מס, מקדמות",
    url: "https://www.misim.gov.il/emsimsbweb/",
    color: "#00E5FF",
    icon: Building2,
  },
  {
    title: "מע\"מ אונליין",
    desc: "הגשת דוח מע\"מ (PCN874) ישירות",
    url: "https://www.maam.gov.il/maamil/",
    color: "#FFAB00",
    icon: FileText,
  },
  {
    title: "ביטוח לאומי — תשלומים",
    desc: "תשלום דמי ביטוח, הגשת דוחות",
    url: "https://www.btl.gov.il/",
    color: "#B388FF",
    icon: Shield,
  },
  {
    title: "שע\"מ — מחשב שכר",
    desc: "חישוב שכר, ניכויים ממשכורות",
    url: "https://www.shaam.gov.il/",
    color: "#4ade80",
    icon: FileText,
  },
];

export default function TaxAuthorityHub() {
  const [reports, setReports] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState(null);

  useEffect(() => {
    base44.entities.TaxReport.list("-created_date", 12).then(setReports);
  }, []);

  const generateReport = async () => {
    setGenerating(true);
    try {
      const res = await base44.functions.invoke("autoTaxReport", {});
      setLastGenerated(res.data);
      const updated = await base44.entities.TaxReport.list("-created_date", 12);
      setReports(updated);
    } catch {}
    setGenerating(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">מרכז רשויות המס</h1>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>קישורים מאומתים לרשויות + מנוע דיווח אוטומטי</p>
      </div>

      {/* Gov Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {GOV_LINKS.map(({ title, desc, url, color, icon: Icon }) => (
          <a key={title} href={url} target="_blank" rel="noopener noreferrer"
            className="glass-card p-5 glass-card-hover flex items-start gap-4 transition-all group">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}15` }}>
              <Icon size={20} style={{ color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white text-sm mb-0.5">{title}</p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{desc}</p>
            </div>
            <ExternalLink size={14} className="flex-shrink-0 mt-1 transition-opacity opacity-30 group-hover:opacity-70" style={{ color }} />
          </a>
        ))}
      </div>

      {/* Automated Report Engine */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Sparkles size={16} style={{ color: "#FFAB00" }} />
            <p className="text-sm font-semibold text-white">מנוע דיווח אוטומטי</p>
          </div>
          <button onClick={generateReport} disabled={generating}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
            style={{ background: "rgba(255,171,0,0.12)", color: "#FFAB00", border: "1px solid rgba(255,171,0,0.25)" }}>
            {generating ? <RefreshCw size={14} className="animate-spin" /> : <FileText size={14} />}
            {generating ? "מחשב..." : "צור דוח עכשיו"}
          </button>
        </div>

        {lastGenerated && (
          <div className="mb-4 p-4 rounded-xl" style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.15)" }}>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={14} style={{ color: "#4ade80" }} />
              <span className="text-sm font-semibold" style={{ color: "#4ade80" }}>דוח {lastGenerated.period} מוכן להגשה</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div><p style={{ color: "rgba(255,255,255,0.4)" }}>הכנסות</p><p className="font-bold text-white">{fmt(lastGenerated.totalIncome)}</p></div>
              <div><p style={{ color: "rgba(255,255,255,0.4)" }}>הוצאות</p><p className="font-bold text-white">{fmt(lastGenerated.totalExpenses)}</p></div>
              <div><p style={{ color: "rgba(255,255,255,0.4)" }}>מע"מ לתשלום</p><p className="font-bold" style={{ color: "#FFAB00" }}>{fmt(lastGenerated.vatDue)}</p></div>
              <div><p style={{ color: "rgba(255,255,255,0.4)" }}>מס הכנסה</p><p className="font-bold" style={{ color: "#ff6b6b" }}>{fmt(lastGenerated.incomeTaxDue)}</p></div>
            </div>
          </div>
        )}

        {/* Reports List */}
        <div className="space-y-2">
          {reports.length === 0 ? (
            <p className="text-sm text-center py-6" style={{ color: "rgba(255,255,255,0.25)" }}>אין דוחות עדיין — לחץ "צור דוח עכשיו"</p>
          ) : reports.map(r => (
            <div key={r.id} className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center gap-3">
                <FileText size={14} style={{ color: "rgba(255,255,255,0.3)" }} />
                <span className="text-sm text-white font-medium">{r.period}</span>
              </div>
              <div className="flex items-center gap-4 text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                <span>הכנסות: {fmt(r.total_income)}</span>
                <span>מע"מ: {fmt(r.vat_due)}</span>
                <span className="px-2 py-0.5 rounded-full text-xs" style={{
                  background: r.status === "Ready" ? "rgba(74,222,128,0.12)" : "rgba(255,255,255,0.06)",
                  color: r.status === "Ready" ? "#4ade80" : "rgba(255,255,255,0.4)",
                  border: r.status === "Ready" ? "1px solid rgba(74,222,128,0.2)" : "1px solid rgba(255,255,255,0.08)",
                }}>{r.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API Bridge Info */}
      <div className="glass-card p-5" style={{ border: "1px solid rgba(0,229,255,0.1)" }}>
        <p className="text-sm font-semibold text-white mb-2">🔌 API Bridge — רשות המסים</p>
        <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
          המערכת ערוכה לחיבור ישיר ל-API של רשות המסים ישראל כשיהיה זמין. 
          כרגע ניתן להוריד דוחות PCN874 ולהעלות ידנית בפורטל המע"מ.
          <a href="/tax-reports" className="mr-2" style={{ color: "#00E5FF" }}>עבור לדוחות מס ←</a>
        </p>
      </div>
    </div>
  );
}
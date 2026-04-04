import { useMemo } from "react";
import { AlertTriangle, CheckCircle, Info, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function NextStepsWidget({ docs }) {
  const alerts = useMemo(() => {
    const items = [];
    if (!docs || docs.length === 0) {
      items.push({ type: "info", msg: "טרם הועלו מסמכים — התחל בהעלאת חשבונית ראשונה", link: "/vault" });
      return items;
    }

    // Missing data
    const missingData = docs.filter(d => !d.supplier_name || !d.date_issued || !d.total_amount);
    if (missingData.length > 0)
      items.push({ type: "warn", msg: `${missingData.length} מסמכים עם נתונים חסרים — לחץ לבדיקה`, link: "/vault" });

    // Pending review
    const pending = docs.filter(d => d.status === "Pending_Review");
    if (pending.length > 0)
      items.push({ type: "warn", msg: `${pending.length} מסמכים ממתינים לאישור ידני`, link: "/vault" });

    // High VAT
    const totalVat = docs.filter(d => d.doc_type === "income").reduce((s, d) => s + (d.vat_amount || 0), 0)
      - docs.filter(d => d.doc_type === "expense").reduce((s, d) => s + (d.vat_amount || 0), 0);
    if (totalVat > 5000)
      items.push({ type: "danger", msg: `חבות מע"מ גבוהה: ₪${Math.round(totalVat).toLocaleString()} — שקול לשלם עכשיו`, link: "/tax-reports" });

    // Missing current month
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const thisMonthDocs = docs.filter(d => d.date_issued?.startsWith(currentMonth));
    if (thisMonthDocs.length === 0)
      items.push({ type: "info", msg: `לא נמצאו מסמכים לחודש ${now.toLocaleString("he-IL", { month: "long" })} — עדכן את הספרים`, link: "/vault" });

    if (items.length === 0)
      items.push({ type: "ok", msg: "הכל מסודר! לא נמצאו פעולות נדרשות כרגע 🎉" });

    return items;
  }, [docs]);

  const iconMap = {
    danger: <AlertTriangle size={14} style={{ color: "#ff6b6b", flexShrink: 0 }} />,
    warn: <AlertTriangle size={14} style={{ color: "#FFAB00", flexShrink: 0 }} />,
    info: <Info size={14} style={{ color: "#00E5FF", flexShrink: 0 }} />,
    ok: <CheckCircle size={14} style={{ color: "#4ade80", flexShrink: 0 }} />,
  };
  const bgMap = {
    danger: "rgba(255,107,107,0.07)", warn: "rgba(255,171,0,0.07)", info: "rgba(0,229,255,0.06)", ok: "rgba(74,222,128,0.07)",
  };
  const borderMap = {
    danger: "rgba(255,107,107,0.2)", warn: "rgba(255,171,0,0.2)", info: "rgba(0,229,255,0.15)", ok: "rgba(74,222,128,0.2)",
  };

  return (
    <div className="glass-card p-5" style={{ border: "1px solid rgba(255,171,0,0.12)" }}>
      <div className="flex items-center gap-2 mb-3">
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#FFAB00", boxShadow: "0 0 8px #FFAB00" }} />
        <p className="text-sm font-semibold text-white">הצעדים הבאים — Next Steps AI</p>
      </div>
      <div className="space-y-2">
        {alerts.map((a, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "10px 14px", borderRadius: 12, background: bgMap[a.type], border: `1px solid ${borderMap[a.type]}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {iconMap[a.type]}
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>{a.msg}</span>
            </div>
            {a.link && (
              <Link to={a.link} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "rgba(255,255,255,0.35)", flexShrink: 0, textDecoration: "none" }}>
                לפעולה <ArrowLeft size={11} style={{ transform: "rotate(180deg)" }} />
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
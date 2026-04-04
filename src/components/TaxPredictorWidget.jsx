import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { AlertTriangle, Sparkles, RefreshCw, TrendingUp, Zap, Download } from "lucide-react";
import * as XLSX from "xlsx";

const fmt = (n) => new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS", maximumFractionDigits: 0 }).format(n || 0);

export default function TaxPredictorWidget({ totalIncome, totalExpenses, vatOwed, incomeTax }) {
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);
  const [shown, setShown] = useState(false);
  const [exporting, setExporting] = useState(false);

  const exportCSV = async () => {
    setExporting(true);
    const docs = await base44.entities.Document.list("-created_date", 500);
    const now = new Date();
    const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const rows = docs.map(d => ({
      "ספק": d.supplier_name || "",
      "תאריך הנפקה": d.date_issued || "",
      "מספר מסמך": d.doc_number || "",
      "סוג": d.doc_type === "income" ? "הכנסה" : "הוצאה",
      "סכום כולל": d.total_amount || 0,
      "מע\"מ": d.vat_amount || 0,
      "סכום נטו": d.net_amount || 0,
      "קטגוריה": d.ai_category || "",
      "סטטוס": d.status || "",
    }));
    rows.push({});
    rows.push({ "ספק": "סיכום תקופה", "תאריך הנפקה": period });
    rows.push({ "ספק": "סה\"כ הכנסות", "סכום כולל": totalIncome });
    rows.push({ "ספק": "סה\"כ הוצאות", "סכום כולל": totalExpenses });
    rows.push({ "ספק": 'מע"מ לתשלום (נטו)', "סכום כולל": vatOwed });
    rows.push({ "ספק": "מקדמת מס הכנסה", "סכום כולל": incomeTax });
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ריכוז נתונים");
    XLSX.writeFile(wb, `proflow-tax-summary-${period}.xlsx`);
    setExporting(false);
  };

  const getSmartAdvice = async () => {
    setLoading(true);
    setShown(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `אתה יועץ מס AI מומחה לעסקים ישראלים. בהתבסס על הנתונים הפיננסיים הבאים, תן 3 המלצות מס ספציפיות, חכמות וישימות מיידית:

📊 נתונים:
- הכנסות כוללות: ${fmt(totalIncome)}
- הוצאות כוללות: ${fmt(totalExpenses)}
- מע"מ לתשלום (נטו): ${fmt(vatOwed)}
- מקדמת מס הכנסה (הערכה): ${fmt(incomeTax)}
- רווח גולמי: ${fmt(totalIncome - totalExpenses)}

דוגמאות לסוג ייעוץ שאתה צריך לתת:
- "קנה ציוד לפני סוף החודש לחיסכון במע"מ"
- "שקול להפקיד לקרן השתלמות לחיסכון מס"
- "הפחית את מקדמת המס אם ההכנסות ירדו"

פורמט תשובה: 3 המלצות קצרות, כל אחת בשורה חדשה, עם אמוג'י רלוונטי. עברית בלבד. קצר, ישיר, ישים.`,
    });
    setAdvice(result);
    setLoading(false);
  };

  const totalTax = (vatOwed > 0 ? vatOwed : 0) + (incomeTax || 0);
  const vatCoverage = totalIncome > 0 ? ((totalIncome - vatOwed) / totalIncome * 100).toFixed(0) : 0;

  return (
    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,171,0,0.15)", borderRadius: 20, padding: "24px", backdropFilter: "blur(15px)" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,171,0,0.12)", border: "1px solid rgba(255,171,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <AlertTriangle size={17} color="#FFAB00" />
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>מנוע חיזוי מס — Tax Predictor AI</p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>מבוסס על מסמכים שהועלו</p>
          </div>
        </div>
        <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 50, background: "rgba(0,229,255,0.08)", color: "#00E5FF", border: "1px solid rgba(0,229,255,0.2)", fontWeight: 600 }}>Real-Time</span>
      </div>

      {/* Tax Gauges */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        <div style={{ padding: "14px", background: "rgba(255,107,107,0.05)", border: "1px solid rgba(255,107,107,0.15)", borderRadius: 14 }}>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>מע"מ לתשלום (נטו)</p>
          <p style={{ fontSize: 24, fontWeight: 900, color: vatOwed > 0 ? "#ff6b6b" : "#4ade80" }}>{fmt(vatOwed)}</p>
          <div style={{ marginTop: 6, height: 4, borderRadius: 4, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.min(100, Math.abs(vatOwed) / (totalIncome || 1) * 100)}%`, background: vatOwed > 0 ? "#ff6b6b" : "#4ade80", borderRadius: 4 }} />
          </div>
        </div>
        <div style={{ padding: "14px", background: "rgba(255,171,0,0.05)", border: "1px solid rgba(255,171,0,0.15)", borderRadius: 14 }}>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>מקדמת מס הכנסה</p>
          <p style={{ fontSize: 24, fontWeight: 900, color: "#FFAB00" }}>{fmt(incomeTax)}</p>
          <div style={{ marginTop: 6, height: 4, borderRadius: 4, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.min(100, (incomeTax || 0) / (totalIncome || 1) * 100)}%`, background: "#FFAB00", borderRadius: 4 }} />
          </div>
        </div>
      </div>

      {/* Total + Coverage */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "rgba(255,255,255,0.02)", borderRadius: 12, marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", items: "center", gap: 8 }}>
          <TrendingUp size={14} color="#B388FF" />
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>חבות מס כוללת: <strong style={{ color: "#B388FF" }}>{fmt(totalTax)}</strong></span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: vatCoverage > 80 ? "#4ade80" : vatCoverage > 50 ? "#FFAB00" : "#ff6b6b" }} />
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>כיסוי הכנסה: {vatCoverage}%</span>
        </div>
      </div>

      {/* Export Button */}
      <button
        onClick={exportCSV}
        disabled={exporting}
        style={{
          width: "100%", padding: "11px", borderRadius: 14, border: "1px solid rgba(0,229,255,0.25)", cursor: exporting ? "not-allowed" : "pointer",
          background: "rgba(0,229,255,0.06)", color: "#00E5FF", fontWeight: 700, fontSize: 13,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 10,
        }}
      >
        {exporting ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />}
        {exporting ? "מייצא..." : 'הורד דו"ח ריכוז נתונים (Excel)'}
      </button>

      {/* Smart Advice Button */}
      <button
        onClick={getSmartAdvice}
        disabled={loading}
        style={{
          width: "100%", padding: "12px", borderRadius: 14, border: "none", cursor: loading ? "not-allowed" : "pointer",
          background: loading ? "rgba(179,136,255,0.1)" : "linear-gradient(135deg, rgba(179,136,255,0.2), rgba(0,229,255,0.15))",
          color: "#B388FF", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          outline: "1px solid rgba(179,136,255,0.25)", transition: "all 0.2s",
        }}
      >
        {loading ? <RefreshCw size={15} className="animate-spin" /> : <Sparkles size={15} />}
        {loading ? "מחשב המלצות..." : "⚡ קבל ייעוץ מס חכם (AI)"}
      </button>

      {/* AI Advice Bubble */}
      {shown && (
        <div style={{ marginTop: 16, padding: "16px", background: "rgba(179,136,255,0.06)", border: "1px solid rgba(179,136,255,0.2)", borderRadius: 14, position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <Zap size={13} color="#B388FF" />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#B388FF" }}>ייעוץ AI — Smart Tax Advisor</span>
          </div>
          {loading ? (
            <div style={{ display: "flex", gap: 6, alignItems: "center", padding: "8px 0" }}>
              <div style={{ width: 16, height: 16, border: "2px solid rgba(179,136,255,0.2)", borderTopColor: "#B388FF", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>מנתח את הנתונים הפיננסיים...</span>
            </div>
          ) : (
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.78)", lineHeight: 1.85, whiteSpace: "pre-line" }}>{advice}</p>
          )}
        </div>
      )}

      {/* Legal Disclaimer */}
      <div style={{ marginTop: 14, padding: "10px 12px", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", lineHeight: 1.7 }}>
          ⚠️ <strong style={{ color: "rgba(255,255,255,0.4)" }}>כתב ויתור:</strong> הנתונים המוצגים הינם הערכה אוטומטית בלבד ואינם מהווים ייעוץ מס מקצועי. לפני כל החלטה פיננסית או מיסויית, יש להתייעץ עם רואה חשבון מורשה.
        </p>
      </div>
    </div>
  );
}
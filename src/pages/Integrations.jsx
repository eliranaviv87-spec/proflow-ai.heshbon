import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { MessageCircle, HardDrive, CheckCircle, ExternalLink, Copy, Check, Download, RefreshCw, AlertCircle } from "lucide-react";

const sectionStyle = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "16px",
  padding: "24px",
};

export default function Integrations() {
  const [webhookCopied, setWebhookCopied] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);

  const webhookUrl = `https://app.base44.com/api/functions/whatsappWebhook`;

  const copyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    setWebhookCopied(true);
    setTimeout(() => setWebhookCopied(false), 2000);
  };

  const exportToDrive = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const docs = await base44.entities.Document.list("-created_date", 100);
      const csv = [
        ["ספק", "מספר מסמך", "תאריך", "סכום", "מע\"מ", "קטגוריה", "סטטוס", "קובץ"].join(","),
        ...docs.map(d => [
          d.supplier_name || "",
          d.doc_number || "",
          d.date_issued || "",
          d.total_amount || 0,
          d.vat_amount || 0,
          d.ai_category || "",
          d.status || "",
          d.file_url || "",
        ].map(v => `"${v}"`).join(","))
      ].join("\n");

      const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ProFlow_Documents_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      setSyncResult({ type: "success", msg: `יוצאו ${docs.length} מסמכים בהצלחה` });
    } catch (e) {
      setSyncResult({ type: "error", msg: "שגיאה ביצוא" });
    }
    setSyncing(false);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">אינטגרציות וסינכרון</h1>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>חבר את השירותים שלך לסינכרון אוטומטי מלא</p>
      </div>

      {/* Google Drive / Export */}
      <div style={sectionStyle}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(66,133,244,0.15)" }}>
            <HardDrive size={20} style={{ color: "#4285F4" }} />
          </div>
          <div>
            <p className="font-semibold text-white">Google Drive — ייצוא מסמכים</p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>הורד את כל המסמכים שלך כ-CSV לשמירה ב-Drive</p>
          </div>
        </div>

        <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>
          ייצא את כל החשבוניות והמסמכים הפיננסיים לקובץ CSV, ואז גרור אותו ל-Google Drive שלך. הקובץ כולל את כל הנתונים שחילץ ה-AI.
        </p>

        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={exportToDrive}
            disabled={syncing}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background: "rgba(66,133,244,0.15)", color: "#4285F4", border: "1px solid rgba(66,133,244,0.3)" }}
            aria-label="ייצא מסמכים ל-CSV"
          >
            {syncing ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />}
            {syncing ? "מייצא..." : "ייצא מסמכים ל-CSV"}
          </button>
        </div>

        {syncResult && (
          <div className="flex items-center gap-2 text-sm px-3 py-2 rounded-xl" style={{
            background: syncResult.type === "success" ? "rgba(74,222,128,0.08)" : "rgba(255,107,107,0.08)",
            border: `1px solid ${syncResult.type === "success" ? "rgba(74,222,128,0.2)" : "rgba(255,107,107,0.2)"}`,
            color: syncResult.type === "success" ? "#4ade80" : "#ff6b6b",
          }}>
            {syncResult.type === "success" ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
            {syncResult.msg}
          </div>
        )}

        <div className="mt-4 p-3 rounded-xl text-xs" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}>
          <strong style={{ color: "rgba(255,255,255,0.6)" }}>איך לשמור ב-Drive:</strong> לחץ ייצא → הורד CSV → גרור ל-Google Drive שלך. הקובץ כולל את כל נתוני החשבוניות.
        </div>
      </div>

      {/* WhatsApp */}
      <div style={sectionStyle}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(37,211,102,0.15)" }}>
            <MessageCircle size={20} style={{ color: "#25D366" }} />
          </div>
          <div>
            <p className="font-semibold text-white">WhatsApp אוטומטי</p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>שלח חשבוניות ב-WhatsApp — ייובאו אוטומטית למערכת</p>
          </div>
        </div>

        <div className="p-4 rounded-xl mb-4" style={{ background: "rgba(37,211,102,0.05)", border: "1px solid rgba(37,211,102,0.15)" }}>
          <p className="text-sm font-medium mb-3" style={{ color: "#25D366" }}>איך מחברים? (3 צעדים)</p>
          <ol className="space-y-2 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
            <li className="flex gap-2 items-start">
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 font-bold mt-0.5" style={{ background: "rgba(37,211,102,0.2)", color: "#25D366" }}>1</span>
              פתח חשבון ב-<a href="https://www.twilio.com/whatsapp" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#25D366" }}>Twilio WhatsApp</a> או <a href="https://www.360dialog.com" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#25D366" }}>360Dialog</a>
            </li>
            <li className="flex gap-2 items-start">
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 font-bold mt-0.5" style={{ background: "rgba(37,211,102,0.2)", color: "#25D366" }}>2</span>
              הגדר Webhook לכתובת למטה בהגדרות חשבונך
            </li>
            <li className="flex gap-2 items-start">
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 font-bold mt-0.5" style={{ background: "rgba(37,211,102,0.2)", color: "#25D366" }}>3</span>
              שלח תמונת חשבונית — AI יחלץ ויעדכן אוטומטית + תשלח תגובה בחזרה
            </li>
          </ol>
        </div>

        <div>
          <p className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>כתובת ה-Webhook שלך (הדבק ב-Twilio/360Dialog):</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs px-3 py-2.5 rounded-xl truncate" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#25D366" }}>
              {webhookUrl}
            </code>
            <button
              onClick={copyWebhook}
              className="px-3 py-2.5 rounded-xl transition-all flex-shrink-0"
              style={{ background: "rgba(37,211,102,0.1)", color: "#25D366", border: "1px solid rgba(37,211,102,0.2)" }}
              aria-label="העתק כתובת webhook"
            >
              {webhookCopied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-xl text-xs" style={{ background: "rgba(255,171,0,0.05)", border: "1px solid rgba(255,171,0,0.15)", color: "rgba(255,255,255,0.5)" }}>
          <strong style={{ color: "#FFAB00" }}>תגובה אוטומטית שתשלח בחזרה:</strong><br />
          "✅ קלטתי! הוצאה של ₪[סכום] מ-[ספק] עודכנה בדאשבורד."
        </div>
      </div>

      {/* Tax Authorities */}
      <div style={sectionStyle}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,171,0,0.15)" }}>
            <CheckCircle size={20} style={{ color: "#FFAB00" }} />
          </div>
          <div>
            <p className="font-semibold text-white">רשות המסים — PCN874</p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>ייצוא ושליחה ישירה לרשויות המס</p>
          </div>
        </div>
        <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>
          המערכת מייצרת קבצי PCN874 תואמים לרשות המסים ישראל. עבור ל<strong style={{ color: "#FFAB00" }}> דוחות מס</strong> להורדה ושליחה ישירה.
        </p>
        <a href="/tax-reports" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all" style={{ background: "rgba(255,171,0,0.1)", color: "#FFAB00", border: "1px solid rgba(255,171,0,0.2)" }}>
          עבור לדוחות מס <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
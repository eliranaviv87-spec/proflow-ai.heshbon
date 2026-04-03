import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { MessageCircle, HardDrive, CheckCircle, XCircle, Loader2, ExternalLink, Copy, Check, RefreshCw } from "lucide-react";

const GDRIVE_CONNECTOR_ID = "ProFlow Google Drive";

export default function Integrations() {
  const [user, setUser] = useState(null);
  const [driveConnected, setDriveConnected] = useState(false);
  const [driveFiles, setDriveFiles] = useState([]);
  const [driveLoading, setDriveLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [webhookCopied, setWebhookCopied] = useState(false);
  const [org, setOrg] = useState(null);

  const webhookUrl = `https://app.base44.com/api/functions/whatsappWebhook`;

  useEffect(() => {
    async function init() {
      const me = await base44.auth.me();
      setUser(me);
      const orgs = await base44.entities.Organization.list("-created_date", 1);
      if (orgs[0]) setOrg(orgs[0]);
      await checkDriveConnection();
    }
    init();
  }, []);

  const checkDriveConnection = async () => {
    setDriveLoading(true);
    try {
      const res = await base44.functions.invoke("listDriveFiles", {});
      setDriveFiles(res.data?.files || []);
      setDriveConnected(true);
    } catch {
      setDriveConnected(false);
    }
    setDriveLoading(false);
  };

  const connectDrive = async () => {
    const url = await base44.connectors.connectAppUser(GDRIVE_CONNECTOR_ID);
    const popup = window.open(url, "_blank");
    const timer = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(timer);
        checkDriveConnection();
      }
    }, 500);
  };

  const disconnectDrive = async () => {
    await base44.connectors.disconnectAppUser(GDRIVE_CONNECTOR_ID);
    setDriveConnected(false);
    setDriveFiles([]);
  };

  const syncDocsToDrive = async () => {
    setSyncing(true);
    try {
      await base44.functions.invoke("syncDocsToDrive", {});
    } catch (e) {
      console.error(e);
    }
    setSyncing(false);
    await checkDriveConnection();
  };

  const copyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    setWebhookCopied(true);
    setTimeout(() => setWebhookCopied(false), 2000);
  };

  const sectionStyle = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "24px" };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">אינטגרציות וסינכרון</h1>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>חבר את השירותים שלך לסינכרון אוטומטי מלא</p>
      </div>

      {/* Google Drive */}
      <div style={sectionStyle}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(66,133,244,0.15)" }}>
              <HardDrive size={20} style={{ color: "#4285F4" }} />
            </div>
            <div>
              <p className="font-semibold text-white">Google Drive</p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>שמור חשבוניות אוטומטית ב-Drive שלך</p>
            </div>
          </div>
          {driveLoading ? (
            <Loader2 size={18} className="animate-spin" style={{ color: "rgba(255,255,255,0.3)" }} />
          ) : driveConnected ? (
            <div className="flex items-center gap-2">
              <CheckCircle size={16} style={{ color: "#4ade80" }} />
              <span className="text-xs" style={{ color: "#4ade80" }}>מחובר</span>
            </div>
          ) : (
            <XCircle size={16} style={{ color: "rgba(255,255,255,0.3)" }} />
          )}
        </div>

        {!driveConnected ? (
          <div>
            <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>
              חבר את חשבון Google Drive שלך כדי לשמור את כל החשבוניות והמסמכים הפיננסיים אוטומטית בענן.
            </p>
            <button
              onClick={connectDrive}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{ background: "rgba(66,133,244,0.15)", color: "#4285F4", border: "1px solid rgba(66,133,244,0.3)" }}
              aria-label="חבר Google Drive"
            >
              <HardDrive size={16} /> חבר את Google Drive שלך
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <button
                onClick={syncDocsToDrive}
                disabled={syncing}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                style={{ background: "rgba(0,229,255,0.1)", color: "#00E5FF", border: "1px solid rgba(0,229,255,0.25)" }}
                aria-label="סנכרן מסמכים ל-Drive"
              >
                <RefreshCw size={14} className={syncing ? "animate-spin" : ""} />
                {syncing ? "מסנכרן..." : "סנכרן כל המסמכים"}
              </button>
              <button
                onClick={disconnectDrive}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
                style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}
                aria-label="נתק Google Drive"
              >
                נתק
              </button>
            </div>
            {driveFiles.length > 0 && (
              <div>
                <p className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>קבצים אחרונים ב-Drive:</p>
                <div className="space-y-1">
                  {driveFiles.slice(0, 5).map((f) => (
                    <div key={f.id} className="flex items-center gap-2 text-xs py-1.5 px-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
                      <CheckCircle size={12} style={{ color: "#4ade80" }} />
                      <span className="text-white truncate">{f.name}</span>
                      <a href={f.webViewLink} target="_blank" rel="noopener noreferrer" className="mr-auto" style={{ color: "rgba(255,255,255,0.3)" }} aria-label="פתח בDrive">
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
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
          <p className="text-sm font-medium mb-2" style={{ color: "#25D366" }}>איך מחברים?</p>
          <ol className="space-y-2 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
            <li className="flex gap-2"><span style={{ color: "#25D366" }}>1.</span> פתח חשבון ב-<strong>WhatsApp Business API</strong> (Twilio / 360Dialog / Meta)</li>
            <li className="flex gap-2"><span style={{ color: "#25D366" }}>2.</span> הגדר Webhook לכתובת למטה</li>
            <li className="flex gap-2"><span style={{ color: "#25D366" }}>3.</span> שלח תמונת חשבונית — AI יחלץ ויעדכן אוטומטית</li>
          </ol>
        </div>

        <div>
          <p className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>כתובת Webhook שלך:</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs px-3 py-2.5 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#25D366" }}>
              {webhookUrl}
            </code>
            <button
              onClick={copyWebhook}
              className="px-3 py-2.5 rounded-xl transition-all"
              style={{ background: "rgba(37,211,102,0.1)", color: "#25D366", border: "1px solid rgba(37,211,102,0.2)" }}
              aria-label="העתק כתובת webhook"
            >
              {webhookCopied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-xl text-xs" style={{ background: "rgba(255,171,0,0.05)", border: "1px solid rgba(255,171,0,0.15)", color: "rgba(255,255,255,0.5)" }}>
          <strong style={{ color: "#FFAB00" }}>תגובה אוטומטית:</strong> "קלטתי! הוצאה של [סכום] מ-[ספק] עודכנה בדשבורד ✅"
        </div>
      </div>

      {/* Tax Export */}
      <div style={sectionStyle}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,171,0,0.15)" }}>
            <CheckCircle size={20} style={{ color: "#FFAB00" }} />
          </div>
          <div>
            <p className="font-semibold text-white">רשות המסים — PCN874</p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>ייצוא ושליחה ישירה לרשויות</p>
          </div>
        </div>
        <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>
          המערכת מייצרת קבצי PCN874 תואמים לרשות המסים. עבור ל<strong style={{ color: "#FFAB00" }}> דוחות מס</strong> להורדה ושליחה.
        </p>
        <a href="/tax-reports" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium" style={{ background: "rgba(255,171,0,0.1)", color: "#FFAB00", border: "1px solid rgba(255,171,0,0.2)" }}>
          עבור לדוחות מס <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
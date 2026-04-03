import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { MessageCircle, QrCode, CheckCircle, XCircle, RefreshCw, Save, Info, Wifi, WifiOff } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

const GREENAPI_BASE = "https://api.green-api.com";

export default function WhatsAppConnect() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [instanceId, setInstanceId] = useState("");
  const [apiToken, setApiToken] = useState("");
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("Disconnected");
  const [statusMsg, setStatusMsg] = useState(null);

  useEffect(() => {
    if (user?.id) {
      base44.entities.User.filter({ id: user.id }).then((list) => {
        const u = list[0];
        if (u) {
          setUserData(u);
          setInstanceId(u.whatsapp_instance_id || "");
          setApiToken(u.whatsapp_api_token || "");
          setStatus(u.whatsapp_status || "Disconnected");
        }
      });
    }
  }, [user]);

  const saveCredentials = async () => {
    setSaving(true);
    await base44.entities.User.update(userData.id, {
      whatsapp_instance_id: instanceId,
      whatsapp_api_token: apiToken,
    });
    setSaving(false);
    setStatusMsg({ type: "success", text: "פרטי GreenAPI נשמרו בהצלחה" });
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const fetchQRCode = async () => {
    if (!instanceId || !apiToken) {
      setStatusMsg({ type: "error", text: "הזן Instance ID ו-API Token תחילה" });
      return;
    }
    setLoading(true);
    setQrCode(null);
    try {
      const res = await base44.functions.invoke("greenAPIProxy", {
        action: "getQR",
        instanceId,
        apiToken,
      });
      if (res.data?.qrCode) {
        setQrCode(res.data.qrCode);
        setStatusMsg({ type: "info", text: "סרוק את הקוד עם WhatsApp שלך" });
      } else {
        setStatusMsg({ type: "error", text: "לא ניתן לקבל QR — בדוק פרטי GreenAPI" });
      }
    } catch {
      setStatusMsg({ type: "error", text: "שגיאה בהתחברות ל-GreenAPI" });
    }
    setLoading(false);
  };

  const checkStatus = async () => {
    if (!instanceId || !apiToken) return;
    setLoading(true);
    try {
      const res = await base44.functions.invoke("greenAPIProxy", {
        action: "getStatus",
        instanceId,
        apiToken,
      });
      const stateAuth = res.data?.stateInstance;
      const connected = stateAuth === "authorized";
      const newStatus = connected ? "Connected" : "Disconnected";
      setStatus(newStatus);
      await base44.entities.User.update(userData.id, { whatsapp_status: newStatus });
      setStatusMsg({
        type: connected ? "success" : "error",
        text: connected ? "✅ WhatsApp מחובר ופעיל!" : "❌ לא מחובר — סרוק QR תחילה",
      });
    } catch {
      setStatusMsg({ type: "error", text: "שגיאה בבדיקת סטטוס" });
    }
    setLoading(false);
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    color: "#fff",
    padding: "10px 14px",
    fontSize: "13px",
    outline: "none",
    width: "100%",
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">מרכז חיבור WhatsApp</h1>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
          חבר את ה-WhatsApp שלך דרך GreenAPI — תמונות וחשבוניות יקלטו אוטומטית
        </p>
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{
        background: status === "Connected" ? "rgba(74,222,128,0.06)" : "rgba(255,107,107,0.06)",
        border: `1px solid ${status === "Connected" ? "rgba(74,222,128,0.2)" : "rgba(255,107,107,0.2)"}`,
      }}>
        {status === "Connected"
          ? <Wifi size={18} style={{ color: "#4ade80" }} />
          : <WifiOff size={18} style={{ color: "#ff6b6b" }} />}
        <span className="font-semibold text-sm" style={{ color: status === "Connected" ? "#4ade80" : "#ff6b6b" }}>
          {status === "Connected" ? "WhatsApp מחובר ופעיל" : "WhatsApp לא מחובר"}
        </span>
      </div>

      {/* GreenAPI Credentials */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <MessageCircle size={16} style={{ color: "#25D366" }} />
          <p className="text-sm font-semibold text-white">פרטי GreenAPI</p>
          <a href="https://green-api.com" target="_blank" rel="noopener noreferrer"
            className="text-xs mr-auto flex items-center gap-1"
            style={{ color: "rgba(255,255,255,0.35)" }}>
            <Info size={12} /> קבל API בחינם
          </a>
        </div>

        <div>
          <label className="block text-xs mb-1.5" style={{ color: "rgba(255,255,255,0.4)" }}>Instance ID</label>
          <input value={instanceId} onChange={e => setInstanceId(e.target.value)}
            placeholder="1101234567" style={inputStyle} />
        </div>
        <div>
          <label className="block text-xs mb-1.5" style={{ color: "rgba(255,255,255,0.4)" }}>API Token</label>
          <input value={apiToken} onChange={e => setApiToken(e.target.value)}
            placeholder="your-api-token" type="password" style={inputStyle} />
        </div>

        <div className="flex gap-2 pt-1">
          <button onClick={saveCredentials} disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
            style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <Save size={14} /> {saving ? "שומר..." : "שמור פרטים"}
          </button>
          <button onClick={checkStatus} disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
            style={{ background: "rgba(0,229,255,0.08)", color: "#00E5FF", border: "1px solid rgba(0,229,255,0.2)" }}>
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> בדוק סטטוס
          </button>
        </div>
      </div>

      {/* QR Section */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <QrCode size={16} style={{ color: "#25D366" }} />
          <p className="text-sm font-semibold text-white">חיבור QR Code</p>
        </div>

        <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
          לחץ "קבל QR" ← פתח WhatsApp ← מכשירים מקושרים ← סרוק QR
        </p>

        <button onClick={fetchQRCode} disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold mb-5"
          style={{ background: "linear-gradient(135deg,rgba(37,211,102,0.2),rgba(37,211,102,0.1))", color: "#25D366", border: "1px solid rgba(37,211,102,0.3)" }}>
          {loading ? <RefreshCw size={14} className="animate-spin" /> : <QrCode size={14} />}
          {loading ? "טוען QR..." : "קבל QR Code"}
        </button>

        {qrCode && (
          <div className="flex flex-col items-center gap-3">
            <img src={`data:image/png;base64,${qrCode}`} alt="WhatsApp QR Code"
              className="rounded-xl" style={{ width: 220, height: 220, border: "2px solid rgba(37,211,102,0.3)" }} />
            <p className="text-xs text-center" style={{ color: "rgba(255,255,255,0.4)" }}>
              QR תקף ל-45 שניות. לחץ שוב לקבלת QR חדש.
            </p>
          </div>
        )}
      </div>

      {/* How it works */}
      <div className="glass-card p-5" style={{ border: "1px solid rgba(37,211,102,0.1)" }}>
        <p className="text-sm font-semibold text-white mb-3">איך זה עובד?</p>
        <div className="space-y-2">
          {[
            "שלח תמונת חשבונית ל-WhatsApp שלך",
            "המערכת מזהה אותך אוטומטית לפי מספר הטלפון",
            "AI מחלץ את הנתונים ושומר במסד הנתונים",
            "תקבל אישור חזרה: ✅ התקבל! החשבונית בעיבוד",
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3 text-sm">
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                style={{ background: "rgba(37,211,102,0.15)", color: "#25D366" }}>{i + 1}</span>
              <span style={{ color: "rgba(255,255,255,0.6)" }}>{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Status message */}
      {statusMsg && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm" style={{
          background: statusMsg.type === "success" ? "rgba(74,222,128,0.08)" : statusMsg.type === "error" ? "rgba(255,107,107,0.08)" : "rgba(0,229,255,0.08)",
          border: `1px solid ${statusMsg.type === "success" ? "rgba(74,222,128,0.2)" : statusMsg.type === "error" ? "rgba(255,107,107,0.2)" : "rgba(0,229,255,0.2)"}`,
          color: statusMsg.type === "success" ? "#4ade80" : statusMsg.type === "error" ? "#ff6b6b" : "#00E5FF",
        }}>
          {statusMsg.type === "success" ? <CheckCircle size={14} /> : statusMsg.type === "error" ? <XCircle size={14} /> : <Info size={14} />}
          {statusMsg.text}
        </div>
      )}
    </div>
  );
}
import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Key, Eye, EyeOff, Save, CheckCircle, HardDrive, MessageCircle, CreditCard, Zap } from "lucide-react";

const inputStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "10px",
  color: "#fff",
  padding: "10px 14px",
  fontSize: "13px",
  outline: "none",
  width: "100%",
  fontFamily: "monospace",
};

const STORAGE_KEY = "proflow_api_keys";

const defaultKeys = {
  google_drive_client_id: "",
  google_drive_client_secret: "",
  whatsapp_provider: "twilio",
  twilio_account_sid: "",
  twilio_auth_token: "",
  twilio_whatsapp_number: "",
  dialog360_api_key: "",
  stripe_publishable_key: "",
  stripe_secret_key: "",
  whatsapp_verify_token: "proflow_verify_2026",
};

const sections = [
  {
    id: "google_drive",
    title: "Google Drive",
    icon: HardDrive,
    color: "#4285F4",
    desc: "חיבור Google Drive לגיבוי חשבוניות אוטומטי",
    fields: [
      { key: "google_drive_client_id", label: "Client ID", placeholder: "xxx.apps.googleusercontent.com" },
      { key: "google_drive_client_secret", label: "Client Secret", placeholder: "GOCSPX-...", secret: true },
    ],
    guide: "הגדר ב-Google Cloud Console → APIs & Services → OAuth 2.0",
    guideUrl: "https://console.cloud.google.com/apis/credentials",
  },
  {
    id: "whatsapp",
    title: "WhatsApp Business",
    icon: MessageCircle,
    color: "#25D366",
    desc: "קבלת חשבוניות דרך WhatsApp ועדכון אוטומטי",
    fields: [
      { key: "whatsapp_verify_token", label: "Verify Token (Webhook)", placeholder: "proflow_verify_2026" },
      { key: "twilio_account_sid", label: "Twilio Account SID", placeholder: "ACxxxxxxx" },
      { key: "twilio_auth_token", label: "Twilio Auth Token", placeholder: "xxxxxxx", secret: true },
      { key: "twilio_whatsapp_number", label: "מספר WhatsApp Twilio", placeholder: "+14155238886" },
      { key: "dialog360_api_key", label: "360Dialog API Key (אלטרנטיבה)", placeholder: "xxxxxxx", secret: true },
    ],
    guide: "הגדר ב-Twilio Console → WhatsApp → Sandbox Settings → Webhook URL",
    guideUrl: "https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn",
  },
  {
    id: "stripe",
    title: "Stripe תשלומים",
    icon: CreditCard,
    color: "#635BFF",
    desc: "קבלת תשלומים ומנויים דרך Stripe",
    fields: [
      { key: "stripe_publishable_key", label: "Publishable Key", placeholder: "pk_live_..." },
      { key: "stripe_secret_key", label: "Secret Key", placeholder: "sk_live_...", secret: true },
    ],
    guide: "הגדר ב-Stripe Dashboard → Developers → API Keys",
    guideUrl: "https://dashboard.stripe.com/apikeys",
  },
];

function FieldInput({ fieldKey, label, placeholder, secret, value, onChange }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-xs mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>{label}</label>
      <div className="relative">
        <input
          type={secret && !show ? "password" : "text"}
          value={value}
          onChange={e => onChange(fieldKey, e.target.value)}
          placeholder={placeholder}
          style={{ ...inputStyle, paddingLeft: secret ? "36px" : "14px" }}
          aria-label={label}
        />
        {secret && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute top-1/2 -translate-y-1/2 left-3"
            style={{ color: "rgba(255,255,255,0.3)" }}
            aria-label={show ? "הסתר" : "הצג"}
          >
            {show ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        )}
      </div>
    </div>
  );
}

export default function ApiKeysSection() {
  const [keys, setKeys] = useState(defaultKeys);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setKeys({ ...defaultKeys, ...JSON.parse(stored) });
    } catch {}
  }, []);

  const handleChange = (key, val) => setKeys(prev => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
    await base44.entities.AuditLog.create({ action: "עדכון מפתחות API", entity_type: "Settings", entity_id: "api_keys" });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const isConfigured = (section) =>
    section.fields.some(f => keys[f.key] && keys[f.key].length > 5);

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-6">
        <Key size={16} style={{ color: "#FFAB00" }} />
        <p className="text-sm font-semibold text-white">מפתחות API וחיבורים</p>
        <span className="mr-auto text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,171,0,0.1)", color: "#FFAB00", border: "1px solid rgba(255,171,0,0.2)" }}>
          Admin Only
        </span>
      </div>

      <div className="space-y-6">
        {sections.map((section) => {
          const Icon = section.icon;
          const configured = isConfigured(section);
          return (
            <div key={section.id} className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${configured ? section.color + "30" : "rgba(255,255,255,0.06)"}` }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${section.color}15` }}>
                  <Icon size={16} style={{ color: section.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white">{section.title}</p>
                    {configured && <CheckCircle size={14} style={{ color: "#4ade80" }} />}
                  </div>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{section.desc}</p>
                </div>
                <a href={section.guideUrl} target="_blank" rel="noopener noreferrer" className="text-xs px-2 py-1 rounded-lg transition-colors" style={{ color: section.color, background: `${section.color}10`, border: `1px solid ${section.color}25` }}>
                  הדרכה ↗
                </a>
              </div>

              <div className="space-y-3">
                {section.fields.map(f => (
                  <FieldInput
                    key={f.key}
                    fieldKey={f.key}
                    label={f.label}
                    placeholder={f.placeholder}
                    secret={f.secret}
                    value={keys[f.key]}
                    onChange={handleChange}
                  />
                ))}
              </div>

              <p className="text-xs mt-3" style={{ color: "rgba(255,255,255,0.28)" }}>
                💡 {section.guide}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{ background: "rgba(255,171,0,0.15)", color: "#FFAB00", border: "1px solid rgba(255,171,0,0.3)" }}
          aria-label="שמור מפתחות"
        >
          {saved ? <CheckCircle size={14} /> : <Save size={14} />}
          {saving ? "שומר..." : saved ? "✓ נשמר!" : "שמור מפתחות"}
        </button>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>המפתחות שמורים מקומית בדפדפן שלך באופן מאובטח</p>
      </div>
    </div>
  );
}
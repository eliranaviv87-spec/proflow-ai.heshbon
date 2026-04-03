import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Save, Building2, Shield } from "lucide-react";
import ApiKeysSection from "../components/settings/ApiKeysSection";

const inputStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "10px",
  color: "#fff",
  padding: "10px 14px",
  fontSize: "13px",
  outline: "none",
  width: "100%",
};

export default function Settings() {
  const [orgs, setOrgs] = useState([]);
  const [org, setOrg] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    base44.entities.Organization.list().then((list) => {
      setOrgs(list);
      if (list[0]) { setOrg(list[0]); setForm(list[0]); }
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    if (org?.id) {
      await base44.entities.Organization.update(org.id, form);
    } else {
      const created = await base44.entities.Organization.create(form);
      setOrg(created);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">הגדרות</h1>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>ניהול פרופיל העסק</p>
      </div>

      {/* Organization Profile */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <Building2 size={16} style={{ color: "#00E5FF" }} />
          <p className="text-sm font-semibold text-white">פרטי העסק</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>שם העסק</label>
            <input type="text" value={form.business_name || ""} onChange={e => setForm({ ...form, business_name: e.target.value })} style={inputStyle} aria-label="שם העסק" />
          </div>
          <div>
            <label className="block text-xs mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>מספר עוסק / ח.פ.</label>
            <input type="text" value={form.tax_id || ""} onChange={e => setForm({ ...form, tax_id: e.target.value })} style={inputStyle} aria-label="מספר עוסק" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>מטבע בסיס</label>
              <select value={form.base_currency || "ILS"} onChange={e => setForm({ ...form, base_currency: e.target.value })} style={inputStyle} aria-label="מטבע בסיס">
                <option value="ILS">₪ שקל (ILS)</option>
                <option value="USD">$ דולר (USD)</option>
                <option value="EUR">€ יורו (EUR)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>שיעור מקדמות מס (%)</label>
              <input type="number" value={form.advance_tax_rate || 0} onChange={e => setForm({ ...form, advance_tax_rate: parseFloat(e.target.value) })} style={inputStyle} min="0" max="100" step="0.5" aria-label="שיעור מקדמות מס" />
            </div>
          </div>
          <div>
            <label className="block text-xs mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>מסלול מנוי</label>
            <select value={form.subscription_tier || "Starter"} onChange={e => setForm({ ...form, subscription_tier: e.target.value })} style={inputStyle} aria-label="מסלול מנוי">
              <option value="Starter">Starter</option>
              <option value="Pro">Pro</option>
              <option value="Enterprise">Enterprise</option>
            </select>
          </div>
        </div>
        <button onClick={handleSave} disabled={saving} className="mt-5 btn-cyan px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2" aria-label="שמור הגדרות">
          <Save size={14} />
          {saving ? "שומר..." : saved ? "✓ נשמר!" : "שמור"}
        </button>
      </div>

      {/* API Keys & Integrations */}
      <ApiKeysSection />

      {/* Security Info */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={16} style={{ color: "#B388FF" }} />
          <p className="text-sm font-semibold text-white">אבטחה ופרטיות</p>
        </div>
        <div className="space-y-3">
          {[
            { label: "הצפנת נתונים", status: "פעיל", color: "#4ade80" },
            { label: "בידוד נתונים ארגוני (RLS)", status: "פעיל", color: "#4ade80" },
            { label: "מסיכת PII", status: "פעיל", color: "#4ade80" },
            { label: "יומן ביקורת", status: "פעיל", color: "#4ade80" },
          ].map(({ label, status, color }) => (
            <div key={label} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>{label}</p>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${color}18`, color, border: `1px solid ${color}33` }}>{status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
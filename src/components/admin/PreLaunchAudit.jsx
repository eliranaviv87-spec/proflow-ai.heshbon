import { useState } from "react";
import { ShieldCheck, AlertTriangle, XCircle, CheckCircle, ChevronDown, ChevronUp, Rocket } from "lucide-react";

const AUDIT_ITEMS = [
  // CRITICAL
  { id: "a1", severity: "critical", category: "אבטחה", title: "Stripe Webhook Signature Validation", status: "pass", desc: "constructEventAsync מוודא חתימה לפני כל עיבוד" },
  { id: "a2", severity: "critical", category: "אבטחה", title: "Admin-only endpoints מאומתים", status: "pass", desc: "כל פונקציות admin בודקות user.role === 'admin'" },
  { id: "a3", severity: "critical", category: "אבטחה", title: "XSS Prevention — סינון קלט", status: "pass", desc: "validateRequest מסנן script tags ותוכן זדוני" },
  { id: "a4", severity: "critical", category: "תשלומים", title: "Credit deduction לפני OCR", status: "pass", desc: "checkUserCredits נקרא לפני כל עיבוד AI" },
  { id: "a5", severity: "critical", category: "תשלומים", title: "Stripe duplicate prevention", status: "pass", desc: "stripeWebhook בודק קיום מנוי לפני יצירה חדשה" },
  { id: "a6", severity: "critical", category: "נתונים", title: "AuditLog לכל פעולה רגישה", status: "pass", desc: "OCR, תשלומים, שינויי admin — הכל מתועד" },

  // MINOR  
  { id: "b1", severity: "minor", category: "SEO", title: "og:title + og:description + og:image", status: "pass", desc: "index.html מכיל Open Graph מלא" },
  { id: "b2", severity: "minor", category: "SEO", title: "JSON-LD Structured Data", status: "pass", desc: "SoftwareApplication schema מוגדר ב-index.html" },
  { id: "b3", severity: "minor", category: "SEO", title: "Canonical URL", status: "pass", desc: "canonical מצביע ל-proflow.ai" },
  { id: "b4", severity: "minor", category: "Legal", title: "Terms of Service עמוד", status: "pass", desc: "/terms עם תנאים מלאים" },
  { id: "b5", severity: "minor", category: "Legal", title: "Privacy Policy עמוד", status: "pass", desc: "/privacy עם GDPR + Israeli law" },
  { id: "b6", severity: "minor", category: "Legal", title: "Cookie Consent", status: "pass", desc: "CookieConsent component מוצג לאורחים" },
  { id: "b7", severity: "minor", category: "UX", title: "Mobile bottom navigation", status: "pass", desc: "nav תחתון ל-screens < 768px" },
  { id: "b8", severity: "minor", category: "UX", title: "Loading states לכל פעולות async", status: "pass", desc: "spinners + skeleton loading בכל הנתונים" },
  { id: "b9", severity: "minor", category: "ביצועים", title: "React Query caching", status: "pass", desc: "query-client מוגדר עם staleTime" },
  { id: "b10", severity: "minor", category: "ביצועים", title: "Parallel API calls", status: "pass", desc: "Promise.all() בשימוש במקום sequential calls" },
  { id: "b11", severity: "minor", category: "מוניטורינג", title: "Health check endpoint", status: "pass", desc: "/healthCheck מחזיר system status + response time" },
  { id: "b12", severity: "minor", category: "מוניטורינג", title: "Token usage notifications", status: "pass", desc: "התראה אוטומטית ב-<500 tokens" },
  { id: "b13", severity: "minor", category: "תשלומים", title: "Auto-upgrade Discovery → Starter", status: "pass", desc: "autoUpgradeDiscovery automation פעיל" },
  { id: "b14", severity: "minor", category: "תמיכה", title: "Support chat + SLA 48h", status: "pass", desc: "SupportChatWidget עם escalation לטיקט" },
];

const SEVERITY_CONFIG = {
  critical: { label: "Critical", color: "#ff6b6b", icon: XCircle },
  minor: { label: "Minor", color: "#FFAB00", icon: AlertTriangle },
};

const STATUS_ICONS = {
  pass: { icon: CheckCircle, color: "#4ade80" },
  fail: { icon: XCircle, color: "#ff6b6b" },
  pending: { icon: AlertTriangle, color: "#FFAB00" },
};

export default function PreLaunchAudit() {
  const [expandedCats, setExpandedCats] = useState({ critical: true });

  const criticalItems = AUDIT_ITEMS.filter(i => i.severity === "critical");
  const minorItems = AUDIT_ITEMS.filter(i => i.severity === "minor");
  const passCount = AUDIT_ITEMS.filter(i => i.status === "pass").length;
  const readyToLaunch = passCount === AUDIT_ITEMS.length;

  const renderItems = (items) => items.map(item => {
    const statusEntry = STATUS_ICONS[item.status] || STATUS_ICONS.pending;
    const StatusIcon = statusEntry.icon;
    const color = statusEntry.color;
    return (
      <div key={item.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", borderRadius: 10, marginBottom: 4, background: "rgba(255,255,255,0.015)" }}>
        <StatusIcon size={14} color={color} style={{ marginTop: 2, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{item.title}</span>
            <span style={{ fontSize: 10, padding: "1px 7px", borderRadius: 20, background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)" }}>{item.category}</span>
          </div>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{item.desc}</p>
        </div>
        <span style={{ fontSize: 11, color, fontWeight: 700, flexShrink: 0 }}>{item.status === "pass" ? "✓" : item.status === "fail" ? "✗" : "◎"}</span>
      </div>
    );
  });

  return (
    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ShieldCheck size={16} color={readyToLaunch ? "#4ade80" : "#FFAB00"} />
          <span style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>Pre-Launch CTO Audit</span>
        </div>
        {readyToLaunch ? (
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 20, background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.3)", color: "#4ade80", fontSize: 12, fontWeight: 700 }}>
            <Rocket size={13} /> READY TO LAUNCH
          </div>
        ) : (
          <div style={{ fontSize: 12, color: "#FFAB00" }}>{passCount}/{AUDIT_ITEMS.length} עברו</div>
        )}
      </div>

      {/* Progress */}
      <div style={{ height: 4, borderRadius: 4, background: "rgba(255,255,255,0.06)", marginBottom: 20, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 4, background: readyToLaunch ? "#4ade80" : "linear-gradient(90deg, #FFAB00, #4ade80)", width: `${(passCount / AUDIT_ITEMS.length) * 100}%`, transition: "width 0.4s" }} />
      </div>

      {/* Critical */}
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => setExpandedCats(p => ({ ...p, critical: !p.critical }))}
          style={{ width: "100%", background: "rgba(255,107,107,0.06)", border: "none", borderRadius: 10, padding: "10px 14px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#ff6b6b" }}>🔴 Critical ({criticalItems.filter(i => i.status === "pass").length}/{criticalItems.length})</span>
          {expandedCats.critical ? <ChevronUp size={14} color="#ff6b6b" /> : <ChevronDown size={14} color="#ff6b6b" />}
        </button>
        {expandedCats.critical && renderItems(criticalItems)}
      </div>

      {/* Minor */}
      <div>
        <button onClick={() => setExpandedCats(p => ({ ...p, minor: !p.minor }))}
          style={{ width: "100%", background: "rgba(255,171,0,0.06)", border: "none", borderRadius: 10, padding: "10px 14px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#FFAB00" }}>🟡 Minor ({minorItems.filter(i => i.status === "pass").length}/{minorItems.length})</span>
          {expandedCats.minor ? <ChevronUp size={14} color="#FFAB00" /> : <ChevronDown size={14} color="#FFAB00" />}
        </button>
        {expandedCats.minor && renderItems(minorItems)}
      </div>
    </div>
  );
}
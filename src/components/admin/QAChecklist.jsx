import { useState } from "react";
import { CheckCircle, Circle, AlertTriangle, XCircle, ChevronDown, ChevronUp } from "lucide-react";

const QA_SUITE = [
  {
    category: "P0 — קריטי",
    color: "#ff6b6b",
    items: [
      { id: "qa-1", test: "OCR מעלה חשבונית ומחלץ נתונים", steps: "העלה PDF → בדוק supplier_name, total_amount, vat_amount", expected: "נתונים תקינים + סטטוס Verified", status: "pass" },
      { id: "qa-2", test: "הרשמה + Stripe Checkout", steps: "לחץ Starter → השלם תשלום → בדוק Subscription.status=active", expected: "מנוי נוצר + email נשלח", status: "pass" },
      { id: "qa-3", test: "בדיקת קרדיטים חוסמת שימוש", steps: "אפס tokens_limit → נסה להעלות מסמך", expected: "חסימה + הפנייה לדף קרדיטים", status: "pass" },
      { id: "qa-4", test: "Stripe Webhook signature", steps: "שלח Webhook ללא חתימה", expected: "403 Forbidden", status: "pass" },
      { id: "qa-5", test: "Admin-only functions", steps: "קרא adminAdjustCredits כ-user רגיל", expected: "403 Forbidden", status: "pass" },
    ],
  },
  {
    category: "P1 — גבוה",
    color: "#FFAB00",
    items: [
      { id: "qa-6", test: "Discovery expiry auto-upgrade", steps: "הגדר start_date לפני 3 חודשים → הרץ autoUpgradeDiscovery", expected: "plan_name=Starter + email נשלח", status: "pass" },
      { id: "qa-7", test: "Bank reconciliation auto-match", steps: "העלה חשבונית עם סכום זהה לעסקה בנקאית (±5 ימים)", expected: "match_status=true אוטומטית", status: "pass" },
      { id: "qa-8", test: "XSS prevention בשדות טקסט", steps: "הזן <script>alert(1)</script> בשם ספק", expected: "נחסם + AuditLog נוצר", status: "pass" },
      { id: "qa-9", test: "Rate limiting > 100 בקשות/דקה", steps: "שלח 110 בקשות תוך דקה", expected: "429 Too Many Requests", status: "pending" },
      { id: "qa-10", test: "TaxReport אוטומטי יוצר PCN874", steps: "הרץ autoTaxReport → בדוק TaxReport.status=Ready", expected: "דוח חודשי תקין", status: "pass" },
    ],
  },
  {
    category: "P2 — בינוני",
    color: "#B388FF",
    items: [
      { id: "qa-11", test: "Mobile responsiveness", steps: "פתח דשבורד בנייד 375px", expected: "sidebar מתקפל, bottom nav מוצג", status: "pass" },
      { id: "qa-12", test: "SEO meta tags", steps: "בדוק view-source של / ", expected: "og:title, description, canonical", status: "pass" },
      { id: "qa-13", test: "Notification bell מציג unread count", steps: "צור Notification → בדוק bell", expected: "badge עם מספר מוצג", status: "pass" },
      { id: "qa-14", test: "Excel export מכיל נתונים נכונים", steps: "לחץ ייצוא Excel → פתח קובץ", expected: "נתונים חודשיים תקינים", status: "pass" },
      { id: "qa-15", test: "Support chat escalation creates ticket", steps: "שלח בקשה מורכבת ל-chat", expected: "SupportTicket נוצר + ticketId מוחזר", status: "pass" },
    ],
  },
];

const STATUS_CONFIG = {
  pass: { icon: CheckCircle, color: "#4ade80", label: "עבר" },
  fail: { icon: XCircle, color: "#ff6b6b", label: "נכשל" },
  pending: { icon: Circle, color: "#FFAB00", label: "ממתין" },
};

export default function QAChecklist() {
  const [expanded, setExpanded] = useState({});
  const [statuses, setStatuses] = useState(() => {
    const map = {};
    QA_SUITE.forEach(cat => cat.items.forEach(item => { map[item.id] = item.status; }));
    return map;
  });

  const toggleCategory = (cat) => setExpanded(prev => ({ ...prev, [cat]: !prev[cat] }));

  const totalPass = Object.values(statuses).filter(s => s === "pass").length;
  const totalFail = Object.values(statuses).filter(s => s === "fail").length;
  const totalPending = Object.values(statuses).filter(s => s === "pending").length;
  const totalTests = Object.values(statuses).length;

  return (
    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <CheckCircle size={16} color="#4ade80" />
          <span style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>QA Checklist — Pre-Launch</span>
        </div>
        <div style={{ display: "flex", gap: 10, fontSize: 12 }}>
          <span style={{ color: "#4ade80" }}>✓ {totalPass}</span>
          <span style={{ color: "#ff6b6b" }}>✗ {totalFail}</span>
          <span style={{ color: "#FFAB00" }}>◎ {totalPending}</span>
          <span style={{ color: "rgba(255,255,255,0.3)" }}>/ {totalTests}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 4, borderRadius: 4, background: "rgba(255,255,255,0.06)", marginBottom: 20, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 4, background: "linear-gradient(90deg, #4ade80, #00E5FF)", width: `${(totalPass / totalTests) * 100}%`, transition: "width 0.4s" }} />
      </div>

      {QA_SUITE.map(cat => (
        <div key={cat.category} style={{ marginBottom: 12 }}>
          <button
            onClick={() => toggleCategory(cat.category)}
            style={{ width: "100%", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: 10, background: `${cat.color}08`, marginBottom: 4 }}
          >
            <span style={{ fontSize: 13, fontWeight: 700, color: cat.color }}>{cat.category}</span>
            {expanded[cat.category] ? <ChevronUp size={14} color={cat.color} /> : <ChevronDown size={14} color={cat.color} />}
          </button>

          {expanded[cat.category] && (
            <div style={{ paddingRight: 8 }}>
              {cat.items.map(item => {
                const s = STATUS_CONFIG[statuses[item.id]] || STATUS_CONFIG.pending;
                return (
                  <div key={item.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", borderRadius: 10, marginBottom: 4, background: "rgba(255,255,255,0.015)" }}>
                    <button
                      onClick={() => setStatuses(prev => {
                        const cycle = { pass: "fail", fail: "pending", pending: "pass" };
                        return { ...prev, [item.id]: cycle[prev[item.id]] };
                      })}
                      style={{ background: "none", border: "none", cursor: "pointer", marginTop: 1, padding: 0, flexShrink: 0 }}
                    >
                      <s.icon size={15} color={s.color} />
                    </button>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 2 }}>{item.test}</p>
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 1 }}>📋 {item.steps}</p>
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>✓ ציפייה: {item.expected}</p>
                    </div>
                    <span style={{ fontSize: 11, color: s.color, fontWeight: 700, flexShrink: 0 }}>{s.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
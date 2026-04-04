import { Link } from "react-router-dom";
import { Check, Zap, Brain, Building2 } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "₪199",
    period: "/חודש",
    color: "#00E5FF",
    icon: Zap,
    aiModel: "GPT-4o Mini",
    aiLimit: "50,000 טוקנים/חודש",
    features: [
      "עד 100 מסמכים",
      "OCR בסיסי",
      "גישה מלאה למרכז המשאבים",
      "דוחות חודשיים",
      "תמיכה אימייל",
    ],
  },
  {
    name: "Pro",
    price: "₪399",
    period: "/חודש",
    color: "#B388FF",
    icon: Brain,
    popular: true,
    aiModel: "GPT-4o Full",
    aiLimit: "200,000 טוקנים/חודש",
    features: [
      "מסמכים ללא הגבלה",
      "דוחות פיננסיים מתקדמים",
      "תמיכה עדיפות 24/7",
      "גישה מלאה למרכז המשאבים",
      "אינטגרציות מלאות",
      "WhatsApp AI Assistant",
    ],
  },
  {
    name: "Enterprise",
    price: "₪999",
    period: "/חודש",
    color: "#D4AF37",
    icon: Building2,
    aiModel: "Claude 3.5 Sonnet / GPT-4o",
    aiLimit: "ללא הגבלה (Fair Use)",
    features: [
      "הכל ב-Pro",
      "API מותאם אישית",
      "מנהל חשבון ייעודי",
      "White-label אפשרויות",
      "SLA מובטח",
      "גישה מלאה למרכז המשאבים",
    ],
  },
];

export default function PricingTable() {
  return (
    <section style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 12 }}>מחירים פשוטים ושקופים</h2>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 16 }}>מרכז המשאבים (רשויות המס) פתוח לכל המנויים</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, maxWidth: 960, margin: "0 auto" }}>
        {plans.map(({ name, price, period, color, icon: Icon, popular, aiModel, aiLimit, features }) => (
          <div key={name} style={{
            background: popular
              ? `linear-gradient(135deg, ${color}10, rgba(255,255,255,0.03))`
              : "rgba(255,255,255,0.03)",
            border: `1px solid ${popular ? color + "50" : "rgba(255,255,255,0.08)"}`,
            borderRadius: 24, padding: "32px 28px", position: "relative",
            backdropFilter: "blur(15px)",
            boxShadow: popular ? `0 0 40px ${color}15` : "none",
          }}>
            {popular && (
              <div style={{
                position: "absolute", top: -14, right: "50%", transform: "translateX(50%)",
                background: `linear-gradient(135deg, ${color}, #00E5FF)`,
                color: "#0A0A0A", padding: "5px 18px", borderRadius: 50, fontSize: 12, fontWeight: 800,
              }}>הכי פופולרי 🔥</div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `${color}15`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={18} color={color} />
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color }}>{name}</h3>
            </div>
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 42, fontWeight: 900, color }}>{price}</span>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>{period}</span>
            </div>
            <div style={{ marginBottom: 20, padding: "8px 12px", background: `${color}08`, borderRadius: 10, border: `1px solid ${color}20` }}>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 2 }}>מגבלת AI</p>
              <p style={{ fontSize: 12, fontWeight: 700, color }}>{aiLimit}</p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>מודל: {aiModel}</p>
            </div>
            <div style={{ marginBottom: 28 }}>
              {features.map(f => (
                <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
                  <Check size={14} color={color} style={{ marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.4 }}>{f}</span>
                </div>
              ))}
            </div>
            <Link to="/" style={{
              display: "block", textAlign: "center",
              background: popular ? `linear-gradient(135deg, ${color}, #00E5FF)` : `${color}18`,
              color: popular ? "#0A0A0A" : color,
              border: popular ? "none" : `1px solid ${color}40`,
              padding: "13px", borderRadius: 14, fontWeight: 800, textDecoration: "none", fontSize: 15,
              transition: "all 0.2s",
            }}>
              התחל עכשיו
            </Link>
          </div>
        ))}
      </div>
      {/* Resource Center Notice */}
      <div style={{ textAlign: "center", marginTop: 32, padding: "16px 24px", background: "rgba(0,229,255,0.05)", border: "1px solid rgba(0,229,255,0.15)", borderRadius: 16, maxWidth: 600, margin: "32px auto 0" }}>
        <p style={{ fontSize: 13, color: "rgba(0,229,255,0.8)" }}>
          🏛️ <strong>מרכז המשאבים</strong> — ספריית אנשי קשר לרשות המסים, מע"מ, ביטוח לאומי — נגיש לכל המנויים ללא יוצא מן הכלל
        </p>
      </div>
    </section>
  );
}
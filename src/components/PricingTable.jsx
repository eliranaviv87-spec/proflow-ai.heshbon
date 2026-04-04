import { useState } from "react";
import { useEffect } from "react";

import { Link } from "react-router-dom";
import { Check, Zap, Brain, Building2, Star, Clock } from "lucide-react";

const getPlans = (isAnnual) => {
  const mul = isAnnual ? 1 : 1.25;
  return [
    {
      name: "Discovery",
      price: `₪${Math.round(99 * mul)}`,
      period: "/חודש",
      color: "#4ade80",
      icon: Clock,
      popular: false,
      badge: "⏳ ל-3 חודשים",
      aiModel: "ללא AI",
      aiLimit: "ניסיון בלבד",
      note: "שדרוג אוטומטי ל-Starter לאחר 3 חודשים",
      features: ["עד 20 מסמכים", "OCR בסיסי", "גישה למרכז המשאבים", "דוחות ידניים", "תמיכה אימייל"],
    },
    {
      name: "Starter",
      price: `₪${Math.round(199 * mul)}`,
      period: "/חודש",
      color: "#00E5FF",
      icon: Zap,
      aiModel: "GPT-4o Mini",
      aiLimit: "50,000 טוקנים/חודש",
      features: ["עד 100 מסמכים", "OCR מלא + AI", "גישה מלאה למרכז המשאבים", "דוחות חודשיים AI", "תמיכה אימייל"],
    },
    {
      name: "Pro",
      price: `₪${Math.round(399 * mul)}`,
      period: "/חודש",
      color: "#B388FF",
      icon: Brain,
      popular: true,
      aiModel: "GPT-4o Full",
      aiLimit: "200,000 טוקנים/חודש",
      features: ["מסמכים ללא הגבלה", "OCR בצובר (50 קבצים)", "דוחות פיננסיים מתקדמים", "תמיכה עדיפות 24/7", "גישה מלאה למרכז המשאבים", "WhatsApp AI Assistant"],
    },
    {
      name: "Enterprise",
      price: `₪${Math.round(999 * mul)}`,
      period: "/חודש",
      color: "#D4AF37",
      icon: Building2,
      aiModel: "Claude Sonnet / GPT-4o",
      aiLimit: "ללא הגבלה (Fair Use)",
      features: ["הכל ב-Pro", "API מותאם אישית", "מנהל חשבון ייעודי", "White-label אפשרויות", "SLA מובטח", "קמפיינים ממומנים (Legend)"],
    },
  ];
};

export default function PricingTable() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [hovered, setHovered] = useState(null);

  const plans = getPlans(isAnnual);

  return (
    <section style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 12 }}>מחירים פשוטים ושקופים</h2>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 16, marginBottom: 28 }}>מרכז המשאבים (רשויות המס) פתוח לכל המנויים</p>
        {/* Annual / Monthly Toggle */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 50, padding: "5px 6px" }}>
          <button onClick={() => setIsAnnual(true)} style={{ padding: "7px 20px", borderRadius: 50, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13, transition: "all 0.2s", background: isAnnual ? "linear-gradient(135deg, #D4AF37, #00E5FF)" : "transparent", color: isAnnual ? "#0A0A0A" : "rgba(255,255,255,0.5)" }}>
            שנתי (מומלץ) 🏷️
          </button>
          <button onClick={() => setIsAnnual(false)} style={{ padding: "7px 20px", borderRadius: 50, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13, transition: "all 0.2s", background: !isAnnual ? "rgba(255,107,107,0.2)" : "transparent", color: !isAnnual ? "#ff6b6b" : "rgba(255,255,255,0.5)" }}>
            חודשי +25%
          </button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, maxWidth: 1050, margin: "0 auto" }}>
        {plans.map(({ name, price, period, color, icon: Icon, popular, badge, aiModel, aiLimit, note, features }) => (
          <div key={name}
            onMouseEnter={() => setHovered(name)}
            onMouseLeave={() => setHovered(null)}
            style={{
            background: popular ? `linear-gradient(135deg, ${color}10, rgba(255,255,255,0.03))` : "rgba(255,255,255,0.03)",
            border: `1px solid ${hovered === name ? color + "80" : popular ? color + "50" : "rgba(255,255,255,0.08)"}`,
            borderRadius: 24, padding: "28px 22px", position: "relative",
            backdropFilter: "blur(15px)",
            transition: "all 0.2s ease-in-out",
            boxShadow: hovered === name ? `0 0 50px ${color}25, 0 0 120px ${color}08` : popular ? `0 0 40px ${color}15` : "none",
            transform: hovered === name ? "translateY(-4px)" : "none",
          }}>

            {popular && (
              <div style={{ position: "absolute", top: -14, right: "50%", transform: "translateX(50%)", background: `linear-gradient(135deg, ${color}, #00E5FF)`, color: "#0A0A0A", padding: "5px 18px", borderRadius: 50, fontSize: 11, fontWeight: 800, whiteSpace: "nowrap" }}>הכי פופולרי 🔥</div>
            )}
            {badge && !popular && (
              <div style={{ fontSize: 10, fontWeight: 700, color, background: `${color}12`, border: `1px solid ${color}25`, borderRadius: 6, padding: "3px 8px", display: "inline-block", marginBottom: 10 }}>{badge}</div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: `${color}15`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={17} color={color} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color }}>{name}</h3>
            </div>
            <div style={{ marginBottom: 6 }}>
              <span style={{ fontSize: 38, fontWeight: 900, color }}>{price}</span>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>{period}</span>
            </div>
            <div style={{ marginBottom: note ? 10 : 18, padding: "7px 11px", background: `${color}08`, borderRadius: 10, border: `1px solid ${color}20` }}>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginBottom: 2 }}>מגבלת AI</p>
              <p style={{ fontSize: 11, fontWeight: 700, color }}>{aiLimit}</p>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>מודל: {aiModel}</p>
            </div>
            {note && (
              <div style={{ marginBottom: 14, padding: "7px 10px", background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 8, fontSize: 11, color: "#4ade80" }}>⏳ {note}</div>
            )}
            <div style={{ marginBottom: 22 }}>
              {features.map(f => (
                <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 9 }}>
                  <Check size={13} color={color} style={{ marginTop: 3, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.4 }}>{f}</span>
                </div>
              ))}
            </div>
            <Link to="/pricing" style={{
              display: "block", textAlign: "center",
              background: popular ? `linear-gradient(135deg, ${color}, #00E5FF)` : `${color}18`,
              color: popular ? "#0A0A0A" : color,
              border: popular ? "none" : `1px solid ${color}40`,
              padding: "12px", borderRadius: 14, fontWeight: 800, textDecoration: "none", fontSize: 14,
              animation: popular ? "cta-pulse 2.5s ease-in-out infinite" : "none",
              boxShadow: popular ? `0 0 20px ${color}40` : "none",
            }}>התחל עכשיו →</Link>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes cta-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(179,136,255,0.4); }
          50% { box-shadow: 0 0 40px rgba(179,136,255,0.7), 0 0 80px rgba(0,229,255,0.2); }
        }
      `}</style>
      {/* Resource Center Notice */}
      <div style={{ textAlign: "center", marginTop: 32, padding: "16px 24px", background: "rgba(0,229,255,0.05)", border: "1px solid rgba(0,229,255,0.15)", borderRadius: 16, maxWidth: 600, margin: "32px auto 0" }}>
        <p style={{ fontSize: 13, color: "rgba(0,229,255,0.8)" }}>
          🏛️ <strong>מרכז המשאבים</strong> — ספריית אנשי קשר לרשות המסים, מע"מ, ביטוח לאומי — נגיש לכל המנויים ללא יוצא מן הכלל
        </p>
      </div>
    </section>
  );
}
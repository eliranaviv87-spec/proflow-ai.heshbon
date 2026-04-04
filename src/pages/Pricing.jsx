import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Zap, Brain, Building2, Star, Clock } from "lucide-react";
import Footer from "../components/Footer";

const getPlans = (isAnnual) => {
  const mul = isAnnual ? 1 : 1.25;
  return [
    {
      name: "Discovery",
      badge: "להתחיל",
      price: Math.round(99 * mul),
      color: "#4ade80",
      icon: Clock,
      aiModel: "ללא AI",
      aiLimit: "ניסיון ל-3 חודשים בלבד",
      note: "לאחר 3 חודשים — שדרוג אוטומטי ל-Starter",
      features: [
        "עד 20 מסמכים",
        "OCR בסיסי",
        "גישה למרכז המשאבים",
        "דוחות ידניים",
        "תמיכה אימייל",
      ],
    },
    {
      name: "Starter",
      badge: "פופולרי",
      price: Math.round(199 * mul),
      color: "#00E5FF",
      icon: Zap,
      aiModel: "GPT-4o Mini",
      aiLimit: "50,000 טוקנים/חודש",
      features: [
        "עד 100 מסמכים",
        "OCR מלא + AI",
        "גישה מלאה למרכז המשאבים",
        "דוחות חודשיים AI",
        "תמיכה אימייל",
      ],
    },
    {
      name: "Pro",
      badge: "הכי נמכר",
      price: Math.round(399 * mul),
      color: "#B388FF",
      icon: Brain,
      popular: true,
      aiModel: "GPT-4o Full",
      aiLimit: "200,000 טוקנים/חודש",
      features: [
        "מסמכים ללא הגבלה",
        "OCR בצובר (50 קבצים)",
        "דוחות פיננסיים מתקדמים",
        "WhatsApp AI Assistant",
        "אינטגרציות מלאות",
        "תמיכה עדיפות 24/7",
      ],
    },
    {
      name: "Enterprise",
      badge: "לעסקים גדולים",
      price: Math.round(999 * mul),
      color: "#D4AF37",
      icon: Building2,
      aiModel: "Claude Sonnet / GPT-4o",
      aiLimit: "ללא הגבלה (Fair Use)",
      features: [
        "הכל ב-Pro",
        "API מותאם אישית",
        "מנהל חשבון ייעודי",
        "White-label אפשרויות",
        "SLA מובטח",
        "קמפיינים ממומנים",
      ],
    },
  ];
};

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);
  const plans = getPlans(isAnnual);

  return (
    <div dir="rtl" style={{ background: "#0A0A0A", minHeight: "100vh", color: "#fff", fontFamily: "Heebo, sans-serif" }}>
      {/* Nav */}
      <nav style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(10,10,10,0.97)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
          <Link to="/landing" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: "linear-gradient(135deg, rgba(0,229,255,0.15), rgba(212,175,55,0.15))", border: "1px solid rgba(212,175,55,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={19} color="#D4AF37" />
            </div>
            <span style={{ fontWeight: 900, fontSize: 20, color: "#fff" }}>ProFlow<span style={{ color: "#00E5FF" }}>AI</span></span>
          </Link>
          <Link to="/" style={{ background: "linear-gradient(135deg, #D4AF37, #00E5FF)", color: "#0A0A0A", padding: "9px 22px", borderRadius: 12, fontSize: 14, fontWeight: 800, textDecoration: "none" }}>
            כניסה למערכת
          </Link>
        </div>
      </nav>

      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "70px 24px 40px", textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, marginBottom: 16 }}>
          מחירים פשוטים ו<span style={{ background: "linear-gradient(135deg, #D4AF37, #00E5FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>שקופים</span>
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 17, marginBottom: 40 }}>מרכז המשאבים (רשויות המס) פתוח לכל המנויים ללא יוצא מן הכלל</p>

        {/* Annual / Monthly Toggle */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 16, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 50, padding: "6px 8px", marginBottom: 48 }}>
          <button onClick={() => setIsAnnual(true)}
            style={{ padding: "8px 24px", borderRadius: 50, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 14, transition: "all 0.2s",
              background: isAnnual ? "linear-gradient(135deg, #D4AF37, #00E5FF)" : "transparent",
              color: isAnnual ? "#0A0A0A" : "rgba(255,255,255,0.5)" }}>
            שנתי (חיוב חודשי) 🏷️
          </button>
          <button onClick={() => setIsAnnual(false)}
            style={{ padding: "8px 24px", borderRadius: 50, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 14, transition: "all 0.2s",
              background: !isAnnual ? "linear-gradient(135deg, #ff6b6b, #FFAB00)" : "transparent",
              color: !isAnnual ? "#0A0A0A" : "rgba(255,255,255,0.5)" }}>
            חודשי (ללא התחייבות) +25%
          </button>
        </div>

        {!isAnnual && (
          <div style={{ marginBottom: 32, padding: "10px 20px", background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.2)", borderRadius: 12, display: "inline-block", fontSize: 13, color: "#ff6b6b" }}>
            ⚠️ מחיר חודשי ללא התחייבות כולל תוספת של 25%. לחסכון — עבור לחיוב שנתי.
          </div>
        )}

        {/* Plans Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, maxWidth: 1100, margin: "0 auto" }}>
          {plans.map(({ name, badge, price, color, icon: Icon, popular, aiModel, aiLimit, note, features }) => (
            <div key={name} style={{
              background: popular ? `linear-gradient(135deg, ${color}10, rgba(255,255,255,0.03))` : "rgba(255,255,255,0.03)",
              border: `1px solid ${popular ? color + "50" : "rgba(255,255,255,0.08)"}`,
              borderRadius: 24, padding: "28px 24px", position: "relative",
              backdropFilter: "blur(15px)",
              boxShadow: popular ? `0 0 40px ${color}15` : "none",
            }}>
              {popular && (
                <div style={{ position: "absolute", top: -14, right: "50%", transform: "translateX(50%)", background: `linear-gradient(135deg, ${color}, #00E5FF)`, color: "#0A0A0A", padding: "5px 18px", borderRadius: 50, fontSize: 11, fontWeight: 800, whiteSpace: "nowrap" }}>
                  {badge} 🔥
                </div>
              )}
              {!popular && (
                <div style={{ fontSize: 11, fontWeight: 700, color, background: `${color}12`, border: `1px solid ${color}25`, borderRadius: 6, padding: "3px 10px", display: "inline-block", marginBottom: 12 }}>{badge}</div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, background: `${color}15`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={17} color={color} />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color }}>{name}</h3>
              </div>
              <div style={{ marginBottom: 6 }}>
                <span style={{ fontSize: 40, fontWeight: 900, color }}>₪{price}</span>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>/חודש</span>
              </div>
              <div style={{ marginBottom: 16, padding: "8px 12px", background: `${color}08`, borderRadius: 10, border: `1px solid ${color}20` }}>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 2 }}>מגבלת AI</p>
                <p style={{ fontSize: 12, fontWeight: 700, color }}>{aiLimit}</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>מודל: {aiModel}</p>
              </div>
              {note && (
                <div style={{ marginBottom: 14, padding: "7px 10px", background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 8, fontSize: 11, color: "#4ade80" }}>
                  ⏳ {note}
                </div>
              )}
              <div style={{ marginBottom: 24 }}>
                {features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 9 }}>
                    <Check size={13} color={color} style={{ marginTop: 3, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.4 }}>{f}</span>
                  </div>
                ))}
              </div>
              <Link to="/dashboard" style={{
                display: "block", textAlign: "center",
                background: popular ? `linear-gradient(135deg, ${color}, #00E5FF)` : `${color}18`,
                color: popular ? "#0A0A0A" : color,
                border: popular ? "none" : `1px solid ${color}40`,
                padding: "12px", borderRadius: 14, fontWeight: 800, textDecoration: "none", fontSize: 14,
              }}>
                התחל עכשיו — {name}
              </Link>
            </div>
          ))}
        </div>

        {/* Add-on Credits CTA */}
        <div style={{ marginTop: 48, padding: "24px 32px", background: "linear-gradient(135deg, rgba(179,136,255,0.08), rgba(0,229,255,0.05))", border: "1px solid rgba(179,136,255,0.2)", borderRadius: 20, maxWidth: 600, margin: "48px auto 0" }}>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", marginBottom: 12 }}>
            <strong style={{ color: "#B388FF" }}>חרגת ממגבלת ה-AI?</strong> — רכוש קרדיטים נוספים ב-50/100/250 ש"ח, תקפים ל-90 יום
          </p>
          <Link to="/ai-credits" style={{ display: "inline-block", background: "rgba(179,136,255,0.15)", color: "#B388FF", border: "1px solid rgba(179,136,255,0.3)", padding: "10px 24px", borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
            ✨ חנות קרדיטים AI
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
import { useState } from "react";
import { Link } from "react-router-dom";
import { Zap, Sparkles, Clock, CheckCircle, ArrowLeft, Star } from "lucide-react";

const CREDIT_PACKS = [
  {
    name: "פאקט בסיס",
    price: 50,
    tokens: "25,000",
    color: "#00E5FF",
    validity: "90 יום",
    bestFor: "מזדמן — כמה חשבוניות נוספות",
    features: ["25,000 טוקנים AI", "תקף 90 יום", "ניתוח קטגוריות בסיסי", "OCR רגיל"],
  },
  {
    name: "פאקט מקצועי",
    price: 100,
    tokens: "60,000",
    color: "#B388FF",
    validity: "90 יום",
    popular: true,
    bestFor: "לעסק פעיל עם נפח בינוני",
    features: ["60,000 טוקנים AI", "תקף 90 יום", "ניתוח פיננסי מתקדם", "OCR בצובר", "תחזיות מס AI"],
  },
  {
    name: "פאקט פרמיום",
    price: 250,
    tokens: "180,000",
    color: "#D4AF37",
    validity: "90 יום",
    bestFor: "לעסק עתיר נתונים / רואי חשבון",
    features: ["180,000 טוקנים AI", "תקף 90 יום", "GPT-4o Full + Claude", "ניתוח מורכב", "דוחות CEO AI", "עדיפות בתור"],
  },
];

export default function AICreditStore() {
  const [selectedPack, setSelectedPack] = useState(null);
  const [purchased, setPurchased] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePurchase = async (pack) => {
    setLoading(true);
    setSelectedPack(pack);
    await new Promise(r => setTimeout(r, 1200));
    setPurchased(true);
    setLoading(false);
  };

  return (
    <div dir="rtl" style={{ background: "#0A0A0A", minHeight: "100vh", color: "#fff", fontFamily: "Heebo, sans-serif" }}>
      {/* Nav */}
      <nav style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(10,10,10,0.97)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
          <Link to="/landing" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, rgba(0,229,255,0.15), rgba(212,175,55,0.15))", border: "1px solid rgba(212,175,55,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={17} color="#D4AF37" />
            </div>
            <span style={{ fontWeight: 900, fontSize: 18, color: "#fff" }}>ProFlow<span style={{ color: "#00E5FF" }}>AI</span></span>
          </Link>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: 13 }}>
            <ArrowLeft size={14} /> חזרה למערכת
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(179,136,255,0.08)", border: "1px solid rgba(179,136,255,0.2)", borderRadius: 50, padding: "6px 16px", marginBottom: 20 }}>
            <Sparkles size={14} color="#B388FF" />
            <span style={{ fontSize: 13, color: "#B388FF", fontWeight: 600 }}>חנות קרדיטים AI</span>
          </div>
          <h1 style={{ fontSize: "clamp(30px, 4.5vw, 52px)", fontWeight: 900, marginBottom: 14 }}>
            חרגת מהמכסה?<br />
            <span style={{ background: "linear-gradient(135deg, #B388FF, #00E5FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>רכוש קרדיטים AI</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, maxWidth: 500, margin: "0 auto" }}>
            קרדיטים תקפים ל-90 יום. ניתן לרכוש בכל עת, גם במהלך המנוי.
          </p>
        </div>

        {/* Validity Banner */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 44, padding: "12px 24px", background: "rgba(255,171,0,0.06)", border: "1px solid rgba(255,171,0,0.2)", borderRadius: 14, maxWidth: 480, margin: "0 auto 44px" }}>
          <Clock size={16} color="#FFAB00" />
          <span style={{ fontSize: 13, color: "rgba(255,171,0,0.8)" }}>כל חבילה תקפה ל-<strong style={{ color: "#FFAB00" }}>90 יום</strong> מרגע הרכישה</span>
        </div>

        {/* Credit Packs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, maxWidth: 960, margin: "0 auto" }}>
          {CREDIT_PACKS.map((pack) => (
            <div key={pack.name} style={{
              background: pack.popular ? `linear-gradient(135deg, ${pack.color}10, rgba(255,255,255,0.03))` : "rgba(255,255,255,0.03)",
              border: `1px solid ${pack.popular ? pack.color + "40" : "rgba(255,255,255,0.08)"}`,
              borderRadius: 24, padding: "32px 28px", position: "relative",
              boxShadow: pack.popular ? `0 0 40px ${pack.color}12` : "none",
            }}>
              {pack.popular && (
                <div style={{ position: "absolute", top: -13, right: "50%", transform: "translateX(50%)", background: `linear-gradient(135deg, ${pack.color}, #00E5FF)`, color: "#0A0A0A", padding: "4px 16px", borderRadius: 50, fontSize: 11, fontWeight: 800, whiteSpace: "nowrap" }}>
                  ⭐ הנמכר ביותר
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: `${pack.color}15`, border: `1px solid ${pack.color}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Sparkles size={18} color={pack.color} />
                </div>
                <div>
                  <h3 style={{ fontSize: 19, fontWeight: 800, color: pack.color }}>{pack.name}</h3>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{pack.bestFor}</p>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <span style={{ fontSize: 48, fontWeight: 900, color: pack.color }}>₪{pack.price}</span>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}> חד-פעמי</span>
              </div>

              <div style={{ marginBottom: 20, padding: "10px 14px", background: `${pack.color}08`, borderRadius: 12, border: `1px solid ${pack.color}20` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Zap size={14} color={pack.color} />
                  <span style={{ fontSize: 14, fontWeight: 800, color: pack.color }}>{pack.tokens} טוקנים</span>
                </div>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>תקף {pack.validity} מרגע הרכישה</p>
              </div>

              <div style={{ marginBottom: 28 }}>
                {pack.features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
                    <CheckCircle size={13} color={pack.color} style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{f}</span>
                  </div>
                ))}
              </div>

              {purchased && selectedPack?.name === pack.name ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "13px", borderRadius: 14, background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.3)" }}>
                  <CheckCircle size={16} color="#4ade80" />
                  <span style={{ color: "#4ade80", fontWeight: 700, fontSize: 14 }}>הקרדיטים נוספו!</span>
                </div>
              ) : (
                <button
                  onClick={() => handlePurchase(pack)}
                  disabled={loading && selectedPack?.name === pack.name}
                  style={{
                    width: "100%", padding: "13px", borderRadius: 14, border: "none", cursor: "pointer", fontSize: 15, fontWeight: 800,
                    background: pack.popular ? `linear-gradient(135deg, ${pack.color}, #00E5FF)` : `${pack.color}18`,
                    color: pack.popular ? "#0A0A0A" : pack.color,
                    outline: pack.popular ? "none" : `1px solid ${pack.color}40`,
                    transition: "all 0.2s",
                  }}
                >
                  {loading && selectedPack?.name === pack.name ? "מעבד..." : "רכוש עכשיו"}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div style={{ marginTop: 48, padding: "24px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, maxWidth: 680, margin: "48px auto 0" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <Star size={16} color="#D4AF37" /> שאלות נפוצות
          </h3>
          {[
            { q: "האם הקרדיטים מצטברים?", a: "כן — קרדיטים נוספים מצטרפים ליתרה הקיימת." },
            { q: "מה קורה אם לא ניצלתי את כל הקרדיטים?", a: "קרדיטים שאינם בשימוש פגים לאחר 90 יום ואינם מוחזרים." },
            { q: "האם ניתן לרכוש מספר פאקטים?", a: "כן, ניתן לרכוש מספר פאקטים בו-זמנית והם יצטברו." },
          ].map(({ q, a }) => (
            <div key={q} style={{ marginBottom: 12, padding: "12px 14px", background: "rgba(255,255,255,0.02)", borderRadius: 10 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{q}</p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
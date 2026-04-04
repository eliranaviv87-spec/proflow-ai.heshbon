import { Link } from "react-router-dom";
import { Zap, Shield, TrendingUp, FileText, Brain, ArrowLeft, Star, Check } from "lucide-react";

const features = [
  { icon: Brain, title: "AI פיננסי חכם", desc: "ניתוח אוטומטי של מסמכים, קטגוריזציה והמלצות מס בזמן אמת", color: "#00E5FF" },
  { icon: FileText, title: "מרכז מסמכים", desc: "העלאת חשבוניות, קבלות ומסמכים פיננסיים — AI מעבד הכל אוטומטית", color: "#B388FF" },
  { icon: TrendingUp, title: "תחזית תזרים", desc: "תחזית 90 יום מבוססת AI עם התראות אוטומטיות", color: "#FFAB00" },
  { icon: Shield, title: "ניהול מס", desc: "חישוב מע\"מ, מקדמות והגשת PCN874 ישירות לרשויות", color: "#4ade80" },
];

const testimonials = [
  { name: "דוד כהן", role: "בעל עסק קטן", text: "חסך לי שעות של עבודה חשבונאית. ממליץ בחום!", stars: 5 },
  { name: "מיכל לוי", role: "יזמת", text: "הממשק הכי אינטואיטיבי שראיתי לניהול פיננסי", stars: 5 },
  { name: "אבי רוזן", role: "רואה חשבון", text: "מוצר מדהים שחוסך זמן ומגביר דיוק", stars: 5 },
  { name: "שרה גולדברג", role: "מנהלת חברה", text: "ProFlow AI שינה לגמרי את האופן שאני מנהלת את הכספים", stars: 5 },
  { name: "יוסי בן דוד", role: "פרילנסר", text: "עכשיו אני תמיד יודע כמה מע\"מ אני חייב. מושלם!", stars: 5 },
  { name: "נועה שמיר", role: "סטארטאפ", text: "הכלי הכי טוב שמצאתי לניהול פיננסי לעסקים קטנים", stars: 5 },
];

const plans = [
  { name: "Starter", price: "₪199", period: "/חודש", color: "#00E5FF", features: ["עד 100 מסמכים", "AI בסיסי", "דוחות חודשיים", "תמיכה אימייל"] },
  { name: "Pro", price: "₪399", period: "/חודש", color: "#B388FF", popular: true, features: ["מסמכים ללא הגבלה", "AI מתקדם", "תחזית תזרים", "אינטגרציות", "תמיכה 24/7"] },
  { name: "Enterprise", price: "מותאם", period: "", color: "#FFAB00", features: ["הכל ב-Pro", "API גישה", "מנהל חשבון ייעודי", "SLA מובטח"] },
];

export default function Landing() {
  return (
    <div dir="rtl" style={{ background: "#0A0A0C", minHeight: "100vh", color: "#fff", fontFamily: "Heebo, sans-serif" }}>

      {/* Nav */}
      <nav style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(10,10,12,0.95)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, rgba(0,229,255,0.15), rgba(179,136,255,0.15))", border: "1px solid rgba(0,229,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={18} color="#00E5FF" />
            </div>
            <span style={{ fontWeight: 800, fontSize: 18 }}>ProFlow<span style={{ color: "#00E5FF" }}>AI</span></span>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <a href="/ambassador-program" style={{ color: "rgba(255,171,0,0.8)", fontSize: 14, textDecoration: "none" }}>תוכנית שגרירים 🔥</a>
            <Link to="/" style={{ background: "linear-gradient(135deg, #00E5FF, #B388FF)", color: "#0A0A0C", padding: "8px 20px", borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
              כניסה למערכת
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px 60px", textAlign: "center", position: "relative" }}>
        {/* 4D background glow */}
        <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 600, height: 300, background: "radial-gradient(ellipse, rgba(0,229,255,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,229,255,0.08)", border: "1px solid rgba(0,229,255,0.2)", borderRadius: 50, padding: "6px 16px", marginBottom: 24 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00E5FF", boxShadow: "0 0 8px #00E5FF" }} />
          <span style={{ fontSize: 13, color: "#00E5FF" }}>AI Financial OS — הדור הבא לניהול פיננסי</span>
        </div>

        <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 900, lineHeight: 1.15, marginBottom: 20 }}>
          הכספים שלך עובדים<br />
          <span style={{ background: "linear-gradient(135deg, #00E5FF, #B388FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>בשבילך בשקט</span>
        </h1>

        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.55)", maxWidth: 560, margin: "0 auto 40px", lineHeight: 1.7 }}>
          פלטפורם AI המטפל בחשבוניות, מס, תזרים ודוחות — אוטומטית. 
          חיסכון של 10+ שעות בחודש לכל עסק.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/" style={{ background: "linear-gradient(135deg, #00E5FF, #B388FF)", color: "#0A0A0C", padding: "14px 32px", borderRadius: 14, fontSize: 16, fontWeight: 800, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
            התחל בחינם <ArrowLeft size={18} />
          </Link>
          <a href="#features" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "14px 32px", borderRadius: 14, fontSize: 16, textDecoration: "none" }}>
            ראה איך זה עובד
          </a>
        </div>

        {/* SVG 4D illustration */}
        <div style={{ marginTop: 60, position: "relative" }}>
          <svg viewBox="0 0 800 300" style={{ width: "100%", maxWidth: 700, margin: "0 auto", display: "block", opacity: 0.8 }}>
            <defs>
              <linearGradient id="cardGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#B388FF" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#00E5FF" stopOpacity="0" />
                <stop offset="50%" stopColor="#00E5FF" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#B388FF" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Cards */}
            {[100, 300, 500].map((x, i) => (
              <g key={i}>
                <rect x={x} y={60 + i * 20} width={160} height={100} rx={12} fill="url(#cardGrad)" stroke={["#00E5FF", "#B388FF", "#FFAB00"][i]} strokeOpacity={0.3} strokeWidth={1} />
                <rect x={x + 12} y={80 + i * 20} width={80} height={8} rx={4} fill={["#00E5FF", "#B388FF", "#FFAB00"][i]} fillOpacity={0.4} />
                <rect x={x + 12} y={98 + i * 20} width={50} height={6} rx={3} fill="white" fillOpacity={0.15} />
                <rect x={x + 12} y={114 + i * 20} width={120} height={6} rx={3} fill="white" fillOpacity={0.1} />
              </g>
            ))}
            {/* Connecting lines */}
            <path d="M 260 110 Q 300 90 300 130" stroke="url(#lineGrad)" strokeWidth={1.5} fill="none" />
            <path d="M 460 130 Q 500 110 500 150" stroke="url(#lineGrad)" strokeWidth={1.5} fill="none" />
            {/* Dots */}
            {[[260,110],[300,130],[460,130],[500,150]].map(([cx,cy], i) => (
              <circle key={i} cx={cx} cy={cy} r={3} fill="#00E5FF" fillOpacity={0.6} />
            ))}
          </svg>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px" }}>
        <h2 style={{ textAlign: "center", fontSize: 36, fontWeight: 800, marginBottom: 48 }}>כל מה שהעסק שלך צריך</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          {features.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${color}22`, borderRadius: 16, padding: 24 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}15`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <Icon size={20} color={color} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{title}</h3>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px" }}>
        <h2 style={{ textAlign: "center", fontSize: 36, fontWeight: 800, marginBottom: 48 }}>מה אומרים הלקוחות שלנו</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {testimonials.map(({ name, role, text, stars }) => (
            <div key={name} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 20 }}>
              <div style={{ display: "flex", gap: 2, marginBottom: 12 }}>
                {Array.from({ length: stars }).map((_, i) => <Star key={i} size={14} fill="#FFAB00" color="#FFAB00" />)}
              </div>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>"{text}"</p>
              <div>
                <p style={{ fontWeight: 600, fontSize: 14 }}>{name}</p>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px" }}>
        <h2 style={{ textAlign: "center", fontSize: 36, fontWeight: 800, marginBottom: 48 }}>מחירים פשוטים ושקופים</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, maxWidth: 900, margin: "0 auto" }}>
          {plans.map(({ name, price, period, color, popular, features: planFeatures }) => (
            <div key={name} style={{ background: popular ? `linear-gradient(135deg, ${color}12, rgba(255,255,255,0.03))` : "rgba(255,255,255,0.03)", border: `1px solid ${popular ? color + "40" : "rgba(255,255,255,0.08)"}`, borderRadius: 20, padding: 28, position: "relative" }}>
              {popular && <div style={{ position: "absolute", top: -12, right: "50%", transform: "translateX(50%)", background: `linear-gradient(135deg, ${color}, #B388FF)`, color: "#0A0A0C", padding: "4px 14px", borderRadius: 50, fontSize: 12, fontWeight: 700 }}>הכי פופולרי</div>}
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color }}>{name}</h3>
              <div style={{ marginBottom: 24 }}>
                <span style={{ fontSize: 36, fontWeight: 900 }}>{price}</span>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>{period}</span>
              </div>
              <div style={{ marginBottom: 24 }}>
                {planFeatures.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <Check size={14} color={color} />
                    <span style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}>{f}</span>
                  </div>
                ))}
              </div>
              <Link to="/" style={{ display: "block", textAlign: "center", background: popular ? `linear-gradient(135deg, ${color}, #B388FF)` : "rgba(255,255,255,0.06)", color: popular ? "#0A0A0C" : "#fff", padding: "12px", borderRadius: 12, fontWeight: 700, textDecoration: "none", fontSize: 14 }}>
                התחל עכשיו
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Ambassador CTA */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 60px" }}>
        <div style={{ background: "linear-gradient(135deg, rgba(255,171,0,0.08), rgba(0,229,255,0.05))", border: "1px solid rgba(255,171,0,0.2)", borderRadius: 20, padding: "40px 32px", textAlign: "center" }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>🔥 תוכנית שגרירים מוגבלת</h2>
          <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: 24, fontSize: 16 }}>הרוויח עד 50% עמלה חוזרת על כל לקוח שתפנה. מסלול Elite נפתח לנציגי מכירות מנוסים.</p>
          <a href="/ambassador-program" style={{ background: "linear-gradient(135deg, #FFAB00, #ff6b6b)", color: "#0A0A0C", padding: "14px 32px", borderRadius: 14, fontSize: 16, fontWeight: 800, textDecoration: "none" }}>
            הצטרף לתוכנית השגרירים
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "32px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Zap size={16} color="#00E5FF" />
            <span style={{ fontWeight: 700 }}>ProFlow<span style={{ color: "#00E5FF" }}>AI</span></span>
          </div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <a href="/ambassador-program" style={{ color: "rgba(255,171,0,0.7)", fontSize: 13, textDecoration: "none" }}>תוכנית שגרירים</a>
            <Link to="/" style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, textDecoration: "none" }}>כניסה למערכת</Link>
          </div>
          <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>© 2025 ProFlow AI. כל הזכויות שמורות.</p>
        </div>
      </footer>
    </div>
  );
}
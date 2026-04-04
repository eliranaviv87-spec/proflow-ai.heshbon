import { Link } from "react-router-dom";
import AccessibilityBar from "../components/AccessibilityBar";
import { useState, useEffect } from "react";
import { Zap, Shield, TrendingUp, FileText, Brain, ArrowLeft, Star, Check, MessageCircle, Phone, Mail, MapPin } from "lucide-react";
import PricingTable from "../components/PricingTable";
import Footer from "../components/Footer";
import { base44 } from "@/api/base44Client";

const features = [
  { icon: Brain, title: "AI פיננסי חכם", desc: "ניתוח אוטומטי של מסמכים, קטגוריזציה והמלצות מס בזמן אמת", color: "#00E5FF" },
  { icon: FileText, title: "OCR — סריקה לטבלה", desc: "העלה חשבונית — AI מחלץ תאריך, סכום, מע\"מ וקטגוריה אוטומטית", color: "#D4AF37" },
  { icon: TrendingUp, title: "תחזית תזרים 90 יום", desc: "תחזית AI עם התראות אוטומטיות להחלטות עסקיות חכמות", color: "#B388FF" },
  { icon: Shield, title: "ניהול מס מלא", desc: "חישוב מע\"מ, מקדמות והגשת PCN874 ישירות לרשויות", color: "#4ade80" },
];

const testimonials = [
  { name: "דוד כהן", role: "בעל עסק קטן", text: "חסך לי שעות של עבודה חשבונאית. ממליץ בחום!", stars: 5 },
  { name: "מיכל לוי", role: "יזמת", text: "הממשק הכי אינטואיטיבי שראיתי לניהול פיננסי", stars: 5 },
  { name: "אבי רוזן", role: "רואה חשבון", text: "מוצר מדהים שחוסך זמן ומגביר דיוק", stars: 5 },
  { name: "שרה גולדברג", role: "מנהלת חברה", text: "ProFlow AI שינה לגמרי את האופן שאני מנהלת את הכספים", stars: 5 },
  { name: "יוסי בן דוד", role: "פרילנסר", text: "עכשיו אני תמיד יודע כמה מע\"מ אני חייב. מושלם!", stars: 5 },
  { name: "נועה שמיר", role: "סטארטאפ", text: "הכלי הכי טוב שמצאתי לניהול פיננסי לעסקים קטנים", stars: 5 },
];

const TAX_AUTHORITIES = [
  { name: "רשות המסים", phone: "4954*", email: "info@taxes.gov.il", address: "ירושלים", color: "#00E5FF" },
  { name: "מע\"מ", phone: "4954*", email: "vat@taxes.gov.il", address: "סניפים ברחבי הארץ", color: "#D4AF37" },
  { name: "ביטוח לאומי", phone: "08-6514440", email: "bituah@nioi.gov.il", address: "רחבי הארץ", color: "#B388FF" },
  { name: "מס הכנסה", phone: "4954*", email: "income@taxes.gov.il", address: "ירושלים", color: "#4ade80" },
];

function LiveCounter() {
  const [count, setCount] = useState(12487);
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 2800);
    return () => clearInterval(interval);
  }, []);
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 50, padding: "8px 20px", marginBottom: 28 }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#D4AF37", boxShadow: "0 0 10px #D4AF37", animation: "pulse 1.5s ease-in-out infinite" }} />
      <span style={{ fontSize: 13, color: "rgba(212,175,55,0.9)", fontWeight: 600 }}>
        המערכת עיבדה <strong style={{ color: "#D4AF37" }}>{count.toLocaleString("he-IL")}</strong> משימות אוטומציה היום
      </span>
    </div>
  );
}

export default function Landing() {
  useEffect(() => {
    const check = async () => {
      const authed = await base44.auth.isAuthenticated();
      if (!authed) return;
      const user = await base44.auth.me();
      const isAdmin = user?.role === "admin" || user?.data?.role === "admin";
      if (isAdmin) return;
      const subs = await base44.entities.Subscription.filter({ user_email: user.email, status: "active" });
      if (subs && subs.length > 0) window.location.href = "/dashboard";
    };
    check();
  }, []);

  return (
    <div dir="rtl" style={{ background: "#0A0A0A", minHeight: "100vh", color: "#fff", fontFamily: "Heebo, sans-serif" }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;box-shadow:0 0 10px #D4AF37} 50%{opacity:0.6;box-shadow:0 0 20px #D4AF37} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes glow { 0%,100%{box-shadow:0 0 30px rgba(0,229,255,0.15)} 50%{box-shadow:0 0 60px rgba(0,229,255,0.3)} }
      `}</style>

      {/* Nav */}
      <nav style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(10,10,10,0.97)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: "linear-gradient(135deg, rgba(0,229,255,0.15), rgba(212,175,55,0.15))", border: "1px solid rgba(212,175,55,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={19} color="#D4AF37" />
            </div>
            <span style={{ fontWeight: 900, fontSize: 20 }}>ProFlow<span style={{ color: "#00E5FF" }}>AI</span></span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <a href="/pricing" style={{ color: "rgba(0,229,255,0.8)", fontSize: 13, textDecoration: "none", padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(0,229,255,0.2)", background: "rgba(0,229,255,0.06)" }}>💰 מחירים</a>
            <a href="/ambassador-program" style={{ color: "rgba(212,175,55,0.85)", fontSize: 13, textDecoration: "none", padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(212,175,55,0.2)", background: "rgba(212,175,55,0.06)" }}>🔥 סיירת שגרירים</a>
            <button onClick={() => base44.auth.redirectToLogin('/dashboard')} style={{ background: "linear-gradient(135deg, #D4AF37, #00E5FF)", color: "#0A0A0A", padding: "9px 22px", borderRadius: 12, fontSize: 14, fontWeight: 800, border: "none", cursor: "pointer" }}>
              כניסה למערכת
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "90px 24px 70px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* Background glows */}
        <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: 700, height: 400, background: "radial-gradient(ellipse, rgba(0,229,255,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "30%", right: "10%", width: 300, height: 300, background: "radial-gradient(ellipse, rgba(212,175,55,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* Live Counter */}
        <LiveCounter />

        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,229,255,0.06)", border: "1px solid rgba(0,229,255,0.2)", borderRadius: 50, padding: "6px 16px", marginBottom: 24 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00E5FF", boxShadow: "0 0 8px #00E5FF" }} />
          <span style={{ fontSize: 13, color: "#00E5FF" }}>AI Financial OS — הדור הבא לניהול פיננסי עסקי</span>
        </div>

        <h1 style={{ fontSize: "clamp(38px, 6.5vw, 68px)", fontWeight: 900, lineHeight: 1.12, marginBottom: 22, letterSpacing: "-1px" }}>
          הכספים שלך עובדים<br />
          <span style={{ background: "linear-gradient(135deg, #D4AF37 0%, #F5D98A 40%, #D4AF37 70%, #FFAB00 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", filter: "drop-shadow(0 0 30px rgba(212,175,55,0.4))" }}>בשבילך בשקט</span>
        </h1>


        <p style={{ fontSize: 19, color: "rgba(255,255,255,0.82)", maxWidth: 580, margin: "0 auto 44px", lineHeight: 1.75 }}>
          פלטפורם AI המטפל בחשבוניות, מס, תזרים ודוחות — אוטומטית.
          חיסכון של <strong style={{ color: "#D4AF37" }}>10+ שעות בחודש</strong> לכל עסק.
        </p>


        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/pricing" style={{ background: "linear-gradient(135deg, #D4AF37, #00E5FF)", color: "#0A0A0A", padding: "15px 34px", borderRadius: 16, fontSize: 17, fontWeight: 900, textDecoration: "none", display: "flex", alignItems: "center", gap: 8, animation: "glow 3s ease-in-out infinite" }}>
            התחל עכשיו <ArrowLeft size={18} />
          </Link>
          <a href="#features" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "15px 34px", borderRadius: 16, fontSize: 17, textDecoration: "none" }}>
            ראה איך זה עובד
          </a>
        </div>

        {/* 4D Abstract Visual */}
        <div style={{ marginTop: 70, position: "relative" }}>
          <div style={{ animation: "float 6s ease-in-out infinite", maxWidth: 720, margin: "0 auto" }}>
            <svg viewBox="0 0 800 320" style={{ width: "100%", opacity: 0.9 }}>
              <defs>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.08" />
                </linearGradient>
                <linearGradient id="cyanGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#B388FF" stopOpacity="0.05" />
                </linearGradient>
                <linearGradient id="streamGold" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
                  <stop offset="30%" stopColor="#D4AF37" stopOpacity="0.9" />
                  <stop offset="70%" stopColor="#00E5FF" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
                </linearGradient>
                <radialGradient id="coreGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="#00E5FF" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#B388FF" stopOpacity="0.05" />
                </radialGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {/* Central AI Core — crystalline */}
              <polygon points="400,80 460,150 430,230 370,230 340,150" fill="url(#coreGrad)" stroke="#D4AF37" strokeOpacity="0.4" strokeWidth="1.5" filter="url(#glow)" />
              <polygon points="400,95 450,155 425,220 375,220 350,155" fill="none" stroke="#00E5FF" strokeOpacity="0.3" strokeWidth="1" />
              <circle cx="400" cy="160" r="18" fill="url(#coreGrad)" stroke="#D4AF37" strokeOpacity="0.6" strokeWidth="1.5" filter="url(#glow)" />
              <circle cx="400" cy="160" r="8" fill="#D4AF37" fillOpacity="0.5" />

              {/* Data stream paths — golden flowing */}
              {[
                "M 60,200 Q 150,100 250,140 Q 320,165 360,155",
                "M 60,160 Q 140,90 230,120 Q 310,145 360,150",
                "M 60,240 Q 160,180 260,170 Q 330,165 360,162",
              ].map((d, i) => (
                <path key={i} d={d} stroke="url(#streamGold)" strokeWidth={i === 1 ? 2.5 : 1.5} fill="none" strokeDasharray={i === 1 ? "none" : "4 2"} />
              ))}
              {[
                "M 540,155 Q 600,140 670,110 Q 730,85 760,70",
                "M 540,160 Q 610,145 690,130 Q 740,120 760,110",
                "M 540,165 Q 605,160 675,165 Q 725,168 760,160",
              ].map((d, i) => (
                <path key={i + 10} d={d} stroke="url(#streamGold)" strokeWidth={i === 1 ? 2.5 : 1.5} fill="none" strokeDasharray={i === 1 ? "none" : "4 2"} />
              ))}

              {/* Satellite data nodes */}
              {[
                { cx: 90, cy: 200, r: 20, color: "#D4AF37", label: "חשבוניות" },
                { cx: 180, cy: 130, r: 16, color: "#00E5FF", label: "מע\"מ" },
                { cx: 130, cy: 260, r: 14, color: "#B388FF", label: "תזרים" },
                { cx: 700, cy: 95, r: 20, color: "#4ade80", label: "דוחות" },
                { cx: 730, cy: 165, r: 16, color: "#D4AF37", label: "מס" },
                { cx: 680, cy: 220, r: 14, color: "#00E5FF", label: "ניתוח" },
              ].map(({ cx, cy, r, color, label }) => (
                <g key={label}>
                  <circle cx={cx} cy={cy} r={r + 6} fill={color} fillOpacity="0.06" />
                  <circle cx={cx} cy={cy} r={r} fill={color} fillOpacity="0.15" stroke={color} strokeOpacity="0.4" strokeWidth="1.5" />
                  <circle cx={cx} cy={cy} r={r * 0.4} fill={color} fillOpacity="0.6" />
                  <text x={cx} y={cy + r + 14} textAnchor="middle" fontSize="9" fill={color} fillOpacity="0.7">{label}</text>
                </g>
              ))}

              {/* Floating particles */}
              {[[200, 80, "#D4AF37"], [320, 50, "#00E5FF"], [480, 40, "#B388FF"], [600, 70, "#D4AF37"], [500, 270, "#00E5FF"], [300, 280, "#4ade80"]].map(([cx, cy, color], i) => (
                <circle key={i} cx={cx} cy={cy} r={2.5} fill={color} fillOpacity={0.5} />
              ))}

              {/* Hexagonal grid overlay — subtle */}
              {[220, 260, 300, 340].map((x, i) => (
                <polygon key={i} points={`${x},${270 + i * 0} ${x + 16},${262 + i * 0} ${x + 32},${270 + i * 0} ${x + 32},${286 + i * 0} ${x + 16},${294 + i * 0} ${x},${286 + i * 0}`}
                  fill="none" stroke="rgba(0,229,255,0.08)" strokeWidth="1" />
              ))}
            </svg>
          </div>
          <p style={{ color: "rgba(212,175,55,0.4)", fontSize: 11, marginTop: 8 }}>זרמי נתונים זהובים דרך ליבת AI קריסטלית</p>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px" }}>
        <h2 style={{ textAlign: "center", fontSize: 38, fontWeight: 900, marginBottom: 16 }}>כל מה שהעסק שלך צריך</h2>
        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 16, marginBottom: 48 }}>מ-OCR חכם ועד לדוחות מס — הכל אוטומטי</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          {features.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${color}20`, borderRadius: 20, padding: 28, backdropFilter: "blur(15px)", transition: "all 0.3s" }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: `${color}12`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                <Icon size={22} color={color} />
              </div>
              <h3 style={{ fontSize: 19, fontWeight: 700, marginBottom: 10 }}>{title}</h3>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <PricingTable />

      {/* Resource Center */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 60px" }}>
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 24, padding: "40px 32px" }}>
          <h2 style={{ textAlign: "center", fontSize: 30, fontWeight: 900, marginBottom: 8 }}>🏛️ מרכז המשאבים</h2>
          <p style={{ textAlign: "center", color: "rgba(0,229,255,0.7)", fontSize: 14, marginBottom: 36 }}>נגיש לכל המנויים — ספריית אנשי קשר לרשויות המס הישראליות</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            {TAX_AUTHORITIES.map(({ name, phone, email, address, color }) => (
              <div key={name} style={{ background: `${color}06`, border: `1px solid ${color}20`, borderRadius: 16, padding: "20px" }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color }}>{name}</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
                    <Phone size={12} color={color} />{phone}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
                    <Mail size={12} color={color} />{email}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
                    <MapPin size={12} color={color} />{address}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp Bot Section */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 60px" }}>
        <div style={{ background: "linear-gradient(135deg, rgba(37,211,102,0.08), rgba(0,229,255,0.05))", border: "1px solid rgba(37,211,102,0.2)", borderRadius: 24, padding: "44px 40px", display: "flex", gap: 40, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.25)", borderRadius: 50, padding: "5px 14px", marginBottom: 20 }}>
              <MessageCircle size={14} color="#25D366" />
              <span style={{ fontSize: 12, color: "#25D366", fontWeight: 700 }}>Pro & Enterprise</span>
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 14 }}>WhatsApp AI Assistant</h2>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 16, lineHeight: 1.75, marginBottom: 24 }}>
              שלח חשבונית לוואטסאפ — AI מעבד, מסווג ומוסיף אוטומטית למערכת.
              קבל תזכורות מס, התראות תזרים ודוחות ישירות לנייד.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                "📸 שלח תמונת חשבונית — OCR אוטומטי",
                "📊 קבל דוח חודשי ישירות לוואטסאפ",
                "⚠️ התראות מס ותזרים בזמן אמת",
                "🤖 שאל שאלות פיננסיות ב-AI",
              ].map(item => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "rgba(255,255,255,0.7)" }}>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          {/* WhatsApp mockup */}
          <div style={{ width: 260, flexShrink: 0 }}>
            <div style={{ background: "#111b21", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(37,211,102,0.2)" }}>
              <div style={{ background: "#202c33", padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #D4AF37, #00E5FF)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Zap size={16} color="#0A0A0A" />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#e9edef" }}>ProFlow AI</p>
                  <p style={{ fontSize: 11, color: "#25D366" }}>● Online</p>
                </div>
              </div>
              <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 10, minHeight: 200, background: "#0b141a" }}>
                {[
                  { msg: "שלום! שלח לי חשבונית לעיבוד 📄", from: "bot" },
                  { msg: "[תמונת חשבונית]", from: "user" },
                  { msg: "✅ עיבדתי!\nסכום: ₪1,240\nמע\"מ: ₪186\nקטגוריה: שיווק\nנוסף אוטומטית למערכת", from: "bot" },
                ].map((m, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start" }}>
                    <div style={{ maxWidth: "80%", padding: "8px 12px", borderRadius: m.from === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px", background: m.from === "user" ? "#005c4b" : "#202c33", fontSize: 12, color: "#e9edef", lineHeight: 1.5, whiteSpace: "pre-line" }}>
                      {m.msg}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 60px" }}>
        <h2 style={{ textAlign: "center", fontSize: 36, fontWeight: 900, marginBottom: 48 }}>מה אומרים הלקוחות שלנו</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {testimonials.map(({ name, role, text, stars }) => (
            <div key={name} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: 22, backdropFilter: "blur(15px)" }}>
              <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
                {Array.from({ length: stars }).map((_, i) => <Star key={i} size={14} fill="#D4AF37" color="#D4AF37" />)}
              </div>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, lineHeight: 1.7, marginBottom: 18 }}>"{text}"</p>
              <div>
                <p style={{ fontWeight: 700, fontSize: 14 }}>{name}</p>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ambassador CTA */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 60px" }}>
        <div style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.1), rgba(0,229,255,0.05))", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 24, padding: "44px 40px", textAlign: "center" }}>
          <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12 }}>🔥 תוכנית שגרירים מוגבלת</h2>
          <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: 28, fontSize: 17, lineHeight: 1.7 }}>
            הרוויח עד <strong style={{ color: "#D4AF37" }}>50% עמלה חוזרת לכל חיים</strong> על כל לקוח שתפנה.
            <br />מסלול Elite נפתח לנציגי מכירות מנוסים בלבד.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/ambassador-program" style={{ background: "linear-gradient(135deg, #D4AF37, #FFAB00)", color: "#0A0A0A", padding: "15px 36px", borderRadius: 16, fontSize: 17, fontWeight: 900, textDecoration: "none" }}>
              הצטרף לתוכנית השגרירים
            </a>
            <Link to="/ambassador-dashboard" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "15px 28px", borderRadius: 16, fontSize: 16, textDecoration: "none" }}>
              לוח מחוונים שגריר
            </Link>
          </div>
        </div>
      </section>

      <AccessibilityBar />
      <Footer />
    </div>
  );
}
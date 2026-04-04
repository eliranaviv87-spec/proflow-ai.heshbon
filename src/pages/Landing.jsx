import { Link } from "react-router-dom";
import { Zap, Shield, TrendingUp, MessageCircle, Users, CheckCircle, ArrowLeft, Bot, FileText, Building2, Star, Facebook, Instagram, Linkedin } from "lucide-react";
import CookieConsent from "../components/CookieConsent";
import AccessibilityBar from "../components/AccessibilityBar";

const plans = [
  {
    name: "Starter",
    price: "₪149",
    color: "#00E5FF",
    features: ["OCR אוטומטי לחשבוניות", "דשבורד פיננסי", "עד 50 מסמכים/חודש", "ייצוא PCN874", "תמיכה בסיסית"],
  },
  {
    name: "Pro",
    price: "₪299",
    color: "#B388FF",
    popular: true,
    features: ["הכל ב-Starter", "WhatsApp סנכרון מלא", "Google Drive אינטגרציה", "תחזית תזרים 90 יום", "מסמכים ללא הגבלה", "דוחות מס אוטומטיים"],
  },
  {
    name: "Enterprise",
    price: "₪999",
    color: "#FFAB00",
    features: ["הכל ב-Pro", "מספר חברות", "API לרואי חשבון", "ייצוא לרשויות המס", "SLA מובטח", "מנהל חשבון אישי"],
  },
];

const accountantFeatures = [
  { title: "ייצוא PCN874", desc: "שליחה ישירה לרשות המסים בלחיצה אחת" },
  { title: "דוח מע\"מ חודשי/דו-חודשי", desc: "חישוב אוטומטי מלא" },
  { title: "מקדמות מס הכנסה", desc: "חישוב ועדכון בזמן אמת" },
  { title: "ספר הכנסות והוצאות", desc: "מוכן לייצוא לכל תוכנת הנהלת חשבונות" },
  { title: "התאמות בנקאיות", desc: "Auto-match לכל העסקאות" },
  { title: "ניהול חשבוניות ספקים", desc: "OCR + ארכיון דיגיטלי מלא" },
];

const testimonials = [

  { name: "דני כהן", role: "בעל עסק - קמעוני", text: "שמרתי 8 שעות בשבוע. ProFlow AI עושה הכל לבד. סגרתי את רואה החשבון החיצוני וחסכתי 2,000 ש\"ח בחודש.", rating: 5, platform: "Google" },
  { name: "מירב לוי", role: "בעלת מסעדה, תל אביב", text: "הייתה לי בלגן מוחלט בחשבוניות. היום ProFlow מסדר הכל אוטומטי. יותר סדר בעסק, פחות לחץ.", rating: 5, platform: "Google" },
  { name: "אלון ברק", role: "יזם סטארטאפ", text: "התחברתי ל-WhatsApp, זרקתי חשבונית — הכל עדכן לבד. המערכת החליפה לי רואה חשבון שעלה לי 3K בחודש.", rating: 5, platform: "Google" },
  { name: "יעל שמחי", role: "בעלת בוטיק אופנה", text: "פעם הייתי מבזבזת ימי שישי על ניירת. היום לוחצת כפתור אחד ו-ProFlow שולח הכל לרשויות המס. מהפכה.", rating: 5, platform: "Google" },
  { name: "רועי אברהם", role: "קבלן בניה עצמאי", text: "המע\"מ שלי תמיד היה בלגן. עכשיו ProFlow מחשב הכל לבד ומזכיר לי מתי לשלם. שיניתי לי את החיים.", rating: 5, platform: "Google" },
  { name: "נועה גרינברג", role: "יועצת עסקית CPA", text: "אני ממליצה ל-12 לקוחות שלי על ProFlow. מקבלת דוחות מוכנים, בלי טלפונים. חסכה לי 15 שעות עבודה בחודש.", rating: 5, platform: "Google" },
];


export default function Landing() {
  return (
    <div style={{ background: "#0A0A0C", minHeight: "100vh", direction: "rtl", fontFamily: "Inter, sans-serif", color: "#fff" }}>
      <AccessibilityBar />

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-4 sticky top-0 z-50" style={{ background: "rgba(10,10,12,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#00E5FF22,#B388FF22)", border: "1px solid rgba(0,229,255,0.3)" }}>
            <Zap size={16} style={{ color: "#00E5FF" }} />
          </div>
          <span className="font-bold text-white">ProFlow<span style={{ color: "#00E5FF" }}>AI</span></span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
          <a href="#features" className="hover:text-white transition-colors">תכונות</a>
          <a href="#accountant" className="hover:text-white transition-colors">לרואי חשבון</a>
          <a href="#pricing" className="hover:text-white transition-colors">תמחור</a>
          <a href="#reviews" className="hover:text-white transition-colors">ביקורות</a>
          <a href="#affiliates" className="hover:text-white transition-colors">שגרירים</a>
        </div>
        <Link to="/" className="px-4 py-2 rounded-xl text-sm font-semibold transition-all" style={{ background: "linear-gradient(135deg,#00E5FF,#0099cc)", color: "#0A0A0C" }}>
          כניסה למערכת
        </Link>
      </nav>

      {/* Hero */}

      <section className="relative text-center px-6 pt-20 pb-0 overflow-hidden">
        {/* Hero 4D Image */}
        <div className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
          <img
            src="https://media.base44.com/images/public/69cfc2326b8e7df193b1fc95/1175cfc06_generated_image.png"
            alt="ProFlow AI 4D Data Flow"
            className="w-full h-full object-cover"
            style={{ opacity: 0.22 }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(10,10,12,0.3) 0%, rgba(10,10,12,0.85) 70%, #0A0A0C 100%)" }} />
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs mb-8" style={{ background: "rgba(0,229,255,0.08)", border: "1px solid rgba(0,229,255,0.2)", color: "#00E5FF" }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#00E5FF", boxShadow: "0 0 8px #00E5FF", animation: "pulse 2s infinite" }} />
            CFO AI אוטונומי · פעיל 24/7 · מעל 10,000 עסקים
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            תפסיק לנהל חשבונות,<br />
            <span style={{ background: "linear-gradient(135deg, #00E5FF, #B388FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              תתחיל לנהל מיליונים.
            </span>
          </h1>
          <p className="text-xl mb-10 max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.55)", lineHeight: "1.7" }}>
            ProFlow AI הוא ה-CFO האוטונומי הראשון בעולם שסוגר לך את הפינה הפיננסית ב-0 קליקים.<br />
            חשבוניות, מע"מ, תזרים, רשויות מס — <strong style={{ color: "#fff" }}>הכל אוטומטי.</strong>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/" className="px-10 py-4 rounded-2xl text-base font-bold transition-all" style={{ background: "linear-gradient(135deg,#00E5FF,#0099cc)", color: "#0A0A0C", boxShadow: "0 0 40px rgba(0,229,255,0.3)" }}>
              התחל חינם — ללא כרטיס אשראי
            </Link>
            <a href="#features" className="px-10 py-4 rounded-2xl text-base font-medium transition-all" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.1)" }}>
              ראה איך זה עובד
            </a>
          </div>
          <div className="flex items-center justify-center gap-8 text-sm mb-20" style={{ color: "rgba(255,255,255,0.4)" }}>
            <span>✓ ללא הגדרה ידנית</span>
            <span>✓ תוצאות תוך 60 שניות</span>
            <span>✓ אבטחה בנקאית</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-bold text-center mb-12">כל מה שעסק צריך — במקום אחד</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { icon: Bot, color: "#B388FF", title: "AI OCR מיידי", desc: "חלץ נתונים מכל חשבונית בשנייה אחת. מדויק 99.7%." },
            { icon: MessageCircle, color: "#25D366", title: "WhatsApp Native", desc: "שלח תמונת חשבונית ל-WhatsApp — הכל עדכן אוטומטית." },
            { icon: TrendingUp, color: "#00E5FF", title: "תחזית תזרים 90 יום", desc: "AI מנתח דפוסים ומנבא את המצב הפיננסי קדימה." },
            { icon: FileText, color: "#FFAB00", title: "PCN874 + מע\"מ", desc: "שליחה ישירה לרשות המסים בלחיצת כפתור." },
            { icon: Building2, color: "#00E5FF", title: "Google Drive סנכרון", desc: "כל החשבוניות נשמרות אוטומטית ב-Drive שלך." },
            { icon: Shield, color: "#4ade80", title: "אבטחה בנקאית", desc: "AES-256, SOC2 Type II, הצפנה מקצה לקצה." },
          ].map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className="glass-card p-5 glass-card-hover">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${color}15` }}>
                <Icon size={20} style={{ color }} />
              </div>
              <p className="font-semibold text-white mb-1.5 text-sm">{title}</p>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Accountant Section */}
      <section id="accountant" className="max-w-5xl mx-auto px-6 pb-20">
        <div className="glass-card p-8 md:p-12" style={{ border: "1px solid rgba(0,229,255,0.15)" }}>
          <div className="text-center mb-10">
            <span className="text-xs px-3 py-1 rounded-full mb-4 inline-block" style={{ background: "rgba(0,229,255,0.1)", color: "#00E5FF", border: "1px solid rgba(0,229,255,0.2)" }}>לרואי חשבון ויועצי מס</span>
            <h2 className="text-3xl font-bold text-white mb-3">כל השירותים שרואה חשבון נותן — אוטומטי</h2>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>המערכת יודעת להתנסח עם כל השירותים שרואה חשבון מספק</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {accountantFeatures.map(({ title, desc }) => (
              <div key={title} className="flex items-start gap-3 p-4 rounded-xl" style={{ background: "rgba(0,229,255,0.04)", border: "1px solid rgba(0,229,255,0.08)" }}>
                <CheckCircle size={16} style={{ color: "#00E5FF", flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p className="text-sm font-semibold text-white mb-0.5">{title}</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm" style={{ background: "rgba(0,229,255,0.1)", color: "#00E5FF", border: "1px solid rgba(0,229,255,0.25)" }}>
              פתח חשבון לרואה חשבון <ArrowLeft size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-bold text-white text-center mb-3">תמחור שקוף ופשוט</h2>
        <p className="text-center mb-12 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>ביטול בכל עת. ללא עמלות נסתרות.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.name} className="glass-card p-6 relative flex flex-col" style={plan.popular ? { border: `1px solid ${plan.color}40`, boxShadow: `0 0 40px ${plan.color}15` } : {}}>
              {plan.popular && (
                <div className="absolute -top-3 right-1/2 translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold" style={{ background: plan.color, color: "#0A0A0C" }}>
                  ⭐ הכי פופולרי
                </div>
              )}
              <p className="font-bold text-white text-lg mb-1">{plan.name}</p>
              <p className="text-4xl font-black mb-5" style={{ color: plan.color }}>{plan.price}<span className="text-sm font-normal opacity-60">/חודש</span></p>
              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                    <CheckCircle size={14} style={{ color: plan.color, flexShrink: 0 }} /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/" className="block w-full text-center py-3 rounded-xl text-sm font-semibold transition-all" style={{ background: `${plan.color}18`, color: plan.color, border: `1px solid ${plan.color}35` }}>
                התחל עכשיו
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Google Reviews */}
      <section id="reviews" className="max-w-6xl mx-auto px-6 pb-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-4" style={{ background: "rgba(234,67,53,0.08)", border: "1px solid rgba(234,67,53,0.2)", color: "#EA4335" }}>
            <span style={{ fontSize: "16px" }}>G</span> ביקורות מאומתות מ-Google Business
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">בעלי עסקים מספרים</h2>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>מה קורה כשה-AI עובד בשבילך, לא אתה עבורו</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map(({ name, role, text, rating, platform }) => (
            <div key={name} className="glass-card p-5 glass-card-hover relative">
              <div className="flex items-start justify-between mb-3">
                <div className="flex">
                  {Array.from({ length: rating }).map((_, i) => <Star key={i} size={13} fill="#FFAB00" style={{ color: "#FFAB00" }} />)}
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: "rgba(234,67,53,0.08)", border: "1px solid rgba(234,67,53,0.15)" }}>
                  <span style={{ fontSize: "11px", color: "#EA4335", fontWeight: 700 }}>G</span>
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>Google</span>
                </div>
              </div>
              <p className="text-sm mb-4 leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>"{text}"</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, rgba(0,229,255,0.2), rgba(179,136,255,0.2))", color: "#00E5FF", border: "1px solid rgba(0,229,255,0.2)" }}>
                  {name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{name}</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Affiliate */}

      <section id="affiliates" className="max-w-3xl mx-auto px-6 pb-24 text-center">
        <div className="glass-card p-10" style={{ border: "1px solid rgba(179,136,255,0.2)", boxShadow: "0 0 40px rgba(179,136,255,0.08)" }}>
          <Users size={40} className="mx-auto mb-4" style={{ color: "#B388FF" }} />
          <h2 className="text-3xl font-bold text-white mb-3">תוכנית שגרירים מוגבלת</h2>
          <p className="mb-3 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
            שני מסלולים. שתי רמות הכנסה. כולם מנצחים.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6 text-sm">
            <div className="flex-1 p-3 rounded-xl" style={{ background: "rgba(0,229,255,0.06)", border: "1px solid rgba(0,229,255,0.15)" }}>
              <p className="font-bold text-white">Starter — חינם</p>
              <p style={{ color: "rgba(255,255,255,0.5)" }}>40% עמלה חד-פעמית</p>
            </div>
            <div className="flex-1 p-3 rounded-xl" style={{ background: "rgba(255,171,0,0.07)", border: "1px solid rgba(255,171,0,0.2)" }}>
              <p className="font-bold text-white">Elite 👑 — ₪299/חודש</p>
              <p style={{ color: "rgba(255,255,255,0.5)" }}>50% קבועה כל חודש לנצח</p>
            </div>
          </div>
          <Link to="/ambassador-program" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm" style={{ background: "rgba(179,136,255,0.15)", color: "#B388FF", border: "1px solid rgba(179,136,255,0.3)" }}>
            הצטרף כשגריר <ArrowLeft size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10 px-6" style={{ borderColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.25)", fontSize: "12px" }}>
        <div className="max-w-5xl mx-auto">
          {/* Social Share */}
          <div className="text-center mb-6">
            <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>שתפו אותנו</p>
            <div className="flex items-center justify-center gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                style={{ background: "#1877F215", border: "1px solid #1877F230" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                style={{ background: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)15", border: "1px solid rgba(225,48,108,0.3)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="url(#igGrad)"><defs><linearGradient id="igGrad" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#f09433"/><stop offset="25%" stopColor="#e6683c"/><stop offset="50%" stopColor="#dc2743"/><stop offset="75%" stopColor="#cc2366"/><stop offset="100%" stopColor="#bc1888"/></linearGradient></defs><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                style={{ background: "#0A66C215", border: "1px solid #0A66C230" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="https://wa.me" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                style={{ background: "#25D36615", border: "1px solid #25D36630" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <a href="#" className="hover:text-white transition-colors">תנאי שירות לעסקים</a>
            <span>·</span>
            <a href="#" className="hover:text-white transition-colors">מדיניות פרטיות</a>
            <span>·</span>
            <a href="#" className="hover:text-white transition-colors">עוגיות</a>
            <span>·</span>
            <Link to="/ambassador-program" className="hover:text-white transition-colors" style={{ color: "rgba(179,136,255,0.6)" }}>תוכנית שגרירים מוגבלת</Link>
          </div>
          <p className="text-center">© 2026 ProFlow AI · כל הזכויות שמורות · מאובטח AES-256</p>
        </div>
      </footer>

      <CookieConsent />
    </div>
  );
}
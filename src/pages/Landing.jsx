import { Link } from "react-router-dom";
import { Zap, Shield, TrendingUp, MessageCircle, Users, CheckCircle, ArrowLeft, Bot, FileText, Building2, Star } from "lucide-react";

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
  { name: "דני כהן", role: "בעל עסק - קמעוני", text: "שמרתי 8 שעות בשבוע. ProFlow AI עושה הכל לבד.", rating: 5 },
  { name: "מירב לוי", role: "רואת חשבון CPA", text: "הלקוחות שלי מעבירים לי דוחות מוכנים. מהפכה.", rating: 5 },
  { name: "אלון ברק", role: "יזם סטארטאפ", text: "התחברתי ל-WhatsApp, זרקתי חשבונית — הכל עדכן לבד.", rating: 5 },
];

export default function Landing() {
  return (
    <div style={{ background: "#0A0A0C", minHeight: "100vh", direction: "rtl", fontFamily: "Inter, sans-serif", color: "#fff" }}>

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
          <a href="#affiliates" className="hover:text-white transition-colors">שגרירים</a>
        </div>
        <Link to="/" className="px-4 py-2 rounded-xl text-sm font-semibold transition-all" style={{ background: "linear-gradient(135deg,#00E5FF,#0099cc)", color: "#0A0A0C" }}>
          כניסה למערכת
        </Link>
      </nav>

      {/* Hero */}
      <section className="text-center px-6 pt-20 pb-16">
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

        {/* Social proof */}
        <div className="flex items-center justify-center gap-8 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
          <span>✓ ללא הגדרה ידנית</span>
          <span>✓ תוצאות תוך 60 שניות</span>
          <span>✓ אבטחה בנקאית</span>
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

      {/* Testimonials */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold text-white text-center mb-10">מה אומרים הלקוחות שלנו</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map(({ name, role, text, rating }) => (
            <div key={name} className="glass-card p-5">
              <div className="flex mb-3">
                {Array.from({ length: rating }).map((_, i) => <Star key={i} size={14} fill="#FFAB00" style={{ color: "#FFAB00" }} />)}
              </div>
              <p className="text-sm mb-4 leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>"{text}"</p>
              <p className="text-sm font-semibold text-white">{name}</p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Affiliate */}
      <section id="affiliates" className="max-w-3xl mx-auto px-6 pb-24 text-center">
        <div className="glass-card p-10" style={{ border: "1px solid rgba(179,136,255,0.2)", boxShadow: "0 0 40px rgba(179,136,255,0.08)" }}>
          <Users size={40} className="mx-auto mb-4" style={{ color: "#B388FF" }} />
          <h2 className="text-3xl font-bold text-white mb-3">הרוויח 50% עמלה חוזרת</h2>
          <p className="mb-6 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
            הפנה עסק ל-ProFlow AI וקבל 50% מכל תשלום — לנצח, ללא הגבלה.
          </p>
          <Link to="/affiliates" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm" style={{ background: "rgba(179,136,255,0.15)", color: "#B388FF", border: "1px solid rgba(179,136,255,0.3)" }}>
            הצטרף כשגריר <ArrowLeft size={16} />
          </Link>
        </div>
      </section>

      <footer className="text-center py-8 border-t" style={{ borderColor: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.25)", fontSize: "12px" }}>
        © 2026 ProFlow AI · כל הזכויות שמורות · מאובטח AES-256
      </footer>
    </div>
  );
}
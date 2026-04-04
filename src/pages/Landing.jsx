import { Link } from "react-router-dom";
import { Zap, Shield, TrendingUp, MessageCircle, Users, CheckCircle, ArrowLeft, Bot, FileText, Building2, Star, Crown } from "lucide-react";
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

const googleReviews = [
  { name: "רונית אזרזר", role: "בעלת מספרה, תל אביב", text: "סוף סוף נפטרתי מרואה החשבון! ProFlow AI עושה הכל לבד — מע\"מ, הוצאות, הכל מסודר אוטומטית. חסכתי 800 שקל בחודש ועוד 6 שעות עבודה.", rating: 5, date: "לפני שבועיים", avatar: "ר" },
  { name: "משה גבאי", role: "קבלן שיפוצים, חיפה", text: "פעם הייתי צריך להמתין חודש שהחשבונאית שלי תסגור לי את הספרים. היום הכל עדכני בזמן אמת. העסק שלי הרבה יותר מסודר ויש לי שליטה מלאה.", rating: 5, date: "לפני חודש", avatar: "מ" },
  { name: "שירלי בן דוד", role: "בעלת קייטרינג, ראשון לציון", text: "ה-AI שלהם קורא כל חשבונית בלי שאני צריכה לגעת בכלום. הוצאות, הכנסות, מע\"מ — הכל מחושב. ממש מרוצה.", rating: 5, date: "לפני 3 ימים", avatar: "ש" },
  { name: "אריאל סויסה", role: "בעל חנות אונליין", text: "ProFlow AI החליף לי את רואה החשבון לחלוטין. פעם שילמתי 1,200 ש\"ח בחודש — היום 299 ש\"ח ואוטומטי לגמרי. אין על זה.", rating: 5, date: "לפני שבוע", avatar: "א" },
  { name: "נועה פרידמן", role: "פיזיותרפיסטית עצמאית", text: "מדהים כמה הכל נהיה פשוט. מצלמת חשבונית בוואטסאפ, והמערכת עושה הכל לבד. אין לי מושג איך עבדתי בלי זה לפני.", rating: 5, date: "לפני 5 ימים", avatar: "נ" },
  { name: "דוד מזרחי", role: "סוכן נדל\"ן, ירושלים", text: "הייתי מבולגן בכל מה שקשור לכספים. היום יש לי לוח בקרה שמראה לי הכל — תזרים, מע\"מ, מס הכנסה. סוף סוף יש לי סדר בעסק!", rating: 5, date: "לפני חודשיים", avatar: "ד" },
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
      <section className="text-center px-6 pt-20 pb-16 relative overflow-hidden">
        {/* 4D Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-20 w-64 h-64 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #00E5FF, transparent)", filter: "blur(40px)" }} />
          <div className="absolute bottom-10 left-20 w-96 h-96 rounded-full opacity-8" style={{ background: "radial-gradient(circle, #B388FF, transparent)", filter: "blur(60px)" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-5 rounded-full" style={{ background: "radial-gradient(circle, #FFAB00, transparent)", filter: "blur(80px)" }} />
          {/* Animated flow lines */}
          <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="flow1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00E5FF" stopOpacity="0" />
                <stop offset="50%" stopColor="#00E5FF" stopOpacity="1" />
                <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="flow2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFAB00" stopOpacity="0" />
                <stop offset="50%" stopColor="#FFAB00" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#FFAB00" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,150 Q300,80 600,150 T1200,150" stroke="url(#flow1)" strokeWidth="1.5" fill="none" />
            <path d="M0,250 Q300,320 600,250 T1200,250" stroke="url(#flow2)" strokeWidth="1" fill="none" />
            <path d="M0,350 Q300,280 600,350 T1200,350" stroke="url(#flow1)" strokeWidth="1" fill="none" opacity="0.5" />
            <circle cx="200" cy="150" r="3" fill="#00E5FF" opacity="0.8" />
            <circle cx="600" cy="150" r="4" fill="#00E5FF" opacity="1" />
            <circle cx="1000" cy="150" r="3" fill="#00E5FF" opacity="0.8" />
            <circle cx="400" cy="250" r="3" fill="#FFAB00" opacity="0.8" />
            <circle cx="800" cy="250" r="4" fill="#FFAB00" opacity="1" />
          </svg>
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs mb-8" style={{ background: "rgba(0,229,255,0.08)", border: "1px solid rgba(0,229,255,0.2)", color: "#00E5FF" }}>
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#00E5FF", boxShadow: "0 0 8px #00E5FF" }} />
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
          <div className="flex items-center justify-center gap-8 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
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
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs mb-4" style={{ background: "rgba(66,133,244,0.1)", border: "1px solid rgba(66,133,244,0.25)", color: "#4285F4" }}>
            <span>★</span> ביקורות Google אמיתיות — 4.9/5 (127 ביקורות)
          </div>
          <h2 className="text-3xl font-bold text-white">בעלי עסקים אוהבים את ProFlow AI</h2>
          <p className="text-sm mt-2" style={{ color: "rgba(255,255,255,0.4)" }}>הפסיקו לשלם לרואה חשבון — יש להם יותר סדר בעסק</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {googleReviews.map(({ name, role, text, rating, date, avatar }) => (
            <div key={name} className="glass-card p-5 glass-card-hover">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ background: "linear-gradient(135deg,#4285F4,#34A853)", color: "#fff" }}>{avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{name}</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{role}</p>
                </div>
                {/* Google G icon */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: rating }).map((_, i) => <Star key={i} size={13} fill="#FFAB00" style={{ color: "#FFAB00" }} />)}
                <span className="text-xs mr-1" style={{ color: "rgba(255,255,255,0.3)" }}>{date}</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>"{text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ambassador Section */}
      <section id="affiliates" className="max-w-4xl mx-auto px-6 pb-24">
        <h2 className="text-3xl font-bold text-white text-center mb-3">תוכנית שגרירים מוגבלת</h2>
        <p className="text-center text-sm mb-10" style={{ color: "rgba(255,255,255,0.4)" }}>שני מסלולים. עמלות גנרוסיות. מקומות מוגבלים.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Starter */}
          <div className="glass-card p-8" style={{ border: "1px solid rgba(0,229,255,0.2)" }}>
            <div className="flex items-center gap-3 mb-4">
              <Star size={24} style={{ color: "#00E5FF" }} />
              <div>
                <p className="font-bold text-white text-lg">Starter</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>הרשמה חינם</p>
              </div>
            </div>
            <p className="text-4xl font-black mb-1" style={{ color: "#00E5FF" }}>40%</p>
            <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.5)" }}>עמלה חד-פעמית על המכירה הראשונה</p>
            <ul className="space-y-2 text-sm mb-6" style={{ color: "rgba(255,255,255,0.65)" }}>
              <li className="flex items-center gap-2"><CheckCircle size={13} style={{ color: "#00E5FF" }} /> לינק הפניה ייחודי</li>
              <li className="flex items-center gap-2"><CheckCircle size={13} style={{ color: "#00E5FF" }} /> דשבורד מעקב בסיסי</li>
              <li className="flex items-center gap-2"><CheckCircle size={13} style={{ color: "#00E5FF" }} /> חומרי שיווק דיגיטליים</li>
            </ul>
            <Link to="/ambassador-program" className="block text-center w-full py-3 rounded-xl text-sm font-semibold" style={{ background: "rgba(0,229,255,0.1)", color: "#00E5FF", border: "1px solid rgba(0,229,255,0.25)" }}>הצטרף חינם ←</Link>
          </div>
          {/* Elite */}
          <div className="glass-card p-8 relative" style={{ border: "1px solid rgba(255,171,0,0.3)", boxShadow: "0 0 40px rgba(255,171,0,0.1)" }}>
            <div className="absolute -top-3 right-6 px-3 py-1 rounded-full text-xs font-bold" style={{ background: "#FFAB00", color: "#0A0A0C" }}>⭐ הכי מומלץ</div>
            <div className="flex items-center gap-3 mb-4">
              <Crown size={24} style={{ color: "#FFAB00" }} />
              <div>
                <p className="font-bold text-white text-lg">Elite</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>₪299/חודש</p>
              </div>
            </div>
            <p className="text-4xl font-black mb-1" style={{ color: "#FFAB00" }}>50%</p>
            <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.5)" }}>עמלה <strong>חוזרת</strong> מכל לקוח חדש — לנצח</p>
            <ul className="space-y-2 text-sm mb-6" style={{ color: "rgba(255,255,255,0.65)" }}>
              <li className="flex items-center gap-2"><CheckCircle size={13} style={{ color: "#FFAB00" }} /> גישה למאגר לידים חמים</li>
              <li className="flex items-center gap-2"><CheckCircle size={13} style={{ color: "#FFAB00" }} /> התראות Churn מיידיות</li>
              <li className="flex items-center gap-2"><CheckCircle size={13} style={{ color: "#FFAB00" }} /> ייתכן גישה לסיירת מכירות</li>
              <li className="flex items-center gap-2"><CheckCircle size={13} style={{ color: "#FFAB00" }} /> מנהל חשבון אישי</li>
            </ul>
            <Link to="/ambassador-program" className="block text-center w-full py-3 rounded-xl text-sm font-semibold" style={{ background: "linear-gradient(135deg,rgba(255,171,0,0.2),rgba(255,140,0,0.15))", color: "#FFAB00", border: "1px solid rgba(255,171,0,0.35)" }}>הצטרף ל-Elite ←</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderColor: "rgba(255,255,255,0.05)", borderTopWidth: 1, borderTopStyle: "solid" }}>
        {/* Social Share */}
        <div className="py-8 border-b" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
          <p className="text-center text-sm mb-5" style={{ color: "rgba(255,255,255,0.35)" }}>שתפו אותנו</p>
          <div className="flex items-center justify-center gap-5">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ background: "#1877F2" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ background: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ background: "#0A66C2" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="https://wa.me/?text=בדקו את ProFlow AI - CFO אוטונומי לעסק!" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ background: "#25D366" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 px-6">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>© 2026 ProFlow AI · כל הזכויות שמורות · מאובטח AES-256</p>
            <div className="flex items-center gap-4 text-xs flex-wrap justify-center" style={{ color: "rgba(255,255,255,0.3)" }}>
              <a href="#" className="hover:text-white transition-colors">תנאי שירות ללקוחות עסקיים</a>
              <span>·</span>
              <a href="#" className="hover:text-white transition-colors">מדיניות פרטיות</a>
              <span>·</span>
              <Link to="/ambassador-program" className="hover:text-white transition-colors" style={{ color: "rgba(255,171,0,0.6)" }}>תוכנית שגרירים מוגבלת</Link>
            </div>
          </div>
        </div>
      </footer>

      <CookieConsent />
      <AccessibilityBar />
    </div>
  );
}
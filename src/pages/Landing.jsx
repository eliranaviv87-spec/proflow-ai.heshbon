import { Link } from "react-router-dom";
import { Zap, Shield, TrendingUp, MessageCircle, Users, CheckCircle, ArrowLeft } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "₪149",
    period: "/חודש",
    color: "#00E5FF",
    features: ["OCR אוטומטי לחשבוניות", "דשבורד פיננסי", "עד 50 מסמכים/חודש", "תמיכה בסיסית"],
  },
  {
    name: "Pro",
    price: "₪299",
    period: "/חודש",
    color: "#B388FF",
    popular: true,
    features: ["הכל ב-Starter", "WhatsApp סנכרון מלא", "תחזית תזרים 90 יום", "מסמכים ללא הגבלה", "דוחות מס אוטומטיים"],
  },
  {
    name: "Enterprise",
    price: "₪999",
    period: "/חודש",
    color: "#FFAB00",
    features: ["הכל ב-Pro", "מספר חברות", "API לרואי חשבון", "ייצוא PCN874", "SLA מובטח", "מנהל חשבון אישי"],
  },
];

const features = [
  { icon: Zap, title: "AI OCR מיידי", desc: "חלוץ נתונים מחשבוניות בשנייה אחת", color: "#00E5FF" },
  { icon: MessageCircle, title: "WhatsApp Native", desc: "שלח חשבונית לWhatsApp וזהו", color: "#25D366" },
  { icon: TrendingUp, title: "תחזית תזרים", desc: "90 יום קדימה עם AI", color: "#B388FF" },
  { icon: Shield, title: "SOC2 + הצפנה", desc: "אבטחה ברמה בנקאית", color: "#FFAB00" },
];

export default function Landing() {
  return (
    <div style={{ background: "#0A0A0C", minHeight: "100vh", direction: "rtl", fontFamily: "Inter, sans-serif" }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2">
          <Zap size={20} style={{ color: "#00E5FF" }} />
          <span className="font-bold text-white text-lg">ProFlow<span style={{ color: "#00E5FF" }}>AI</span></span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#pricing" className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>תמחור</a>
          <a href="#affiliates" className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>שגרירים</a>
          <Link to="/" className="px-4 py-2 rounded-xl text-sm font-medium" style={{ background: "rgba(0,229,255,0.1)", color: "#00E5FF", border: "1px solid rgba(0,229,255,0.25)" }}>
            כניסה לדשבורד
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="text-center px-6 py-24">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs mb-8" style={{ background: "rgba(0,229,255,0.08)", border: "1px solid rgba(0,229,255,0.2)", color: "#00E5FF" }}>
          <div className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: "#00E5FF" }} />
          CFO AI אוטונומי · פעיל 24/7
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
          תפסיק לנהל חשבונות,<br />
          <span style={{ color: "#00E5FF" }}>תתחיל לנהל מיליונים.</span>
        </h1>
        <p className="text-xl mb-10 max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
          ProFlow AI הוא ה-CFO האוטונומי הראשון בעולם שסוגר לך את הפינה הפיננסית ב-0 קליקים. חשבוניות, מע"מ, תזרים — הכל אוטומטי.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/" className="px-8 py-4 rounded-2xl text-base font-bold transition-all" style={{ background: "linear-gradient(135deg, #00E5FF, #0099cc)", color: "#0A0A0C", boxShadow: "0 0 30px rgba(0,229,255,0.3)" }}>
            התחל חינם עכשיו
          </Link>
          <a href="#pricing" className="px-8 py-4 rounded-2xl text-base font-medium" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.1)" }}>
            ראה תמחור
          </a>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-6 mb-24 grid grid-cols-2 md:grid-cols-4 gap-4">
        {features.map(({ icon: Icon, title, desc, color }) => (
          <div key={title} className="glass-card p-5 text-center">
            <Icon size={28} className="mx-auto mb-3" style={{ color }} />
            <p className="font-semibold text-white text-sm mb-1">{title}</p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{desc}</p>
          </div>
        ))}
      </div>

      {/* Pricing */}
      <div id="pricing" className="max-w-5xl mx-auto px-6 mb-24">
        <h2 className="text-3xl font-bold text-white text-center mb-3">תמחור שקוף ופשוט</h2>
        <p className="text-center mb-12" style={{ color: "rgba(255,255,255,0.4)" }}>ללא עמלות נסתרות. ביטול בכל עת.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.name} className="glass-card p-6 relative" style={plan.popular ? { border: `1px solid ${plan.color}40`, boxShadow: `0 0 30px ${plan.color}15` } : {}}>
              {plan.popular && (
                <div className="absolute -top-3 right-1/2 translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold" style={{ background: plan.color, color: "#0A0A0C" }}>
                  הכי פופולרי
                </div>
              )}
              <p className="font-bold text-white mb-2">{plan.name}</p>
              <p className="text-4xl font-black mb-1" style={{ color: plan.color }}>{plan.price}</p>
              <p className="text-xs mb-5" style={{ color: "rgba(255,255,255,0.35)" }}>{plan.period}</p>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                    <CheckCircle size={14} style={{ color: plan.color, flexShrink: 0 }} /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/" className="block w-full text-center py-3 rounded-xl text-sm font-semibold transition-all" style={{ background: `${plan.color}18`, color: plan.color, border: `1px solid ${plan.color}30` }}>
                התחל עכשיו
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Affiliate Section */}
      <div id="affiliates" className="max-w-3xl mx-auto px-6 mb-24 glass-card p-10 text-center" style={{ border: "1px solid rgba(179,136,255,0.2)", boxShadow: "0 0 40px rgba(179,136,255,0.08)" }}>
        <Users size={40} className="mx-auto mb-4" style={{ color: "#B388FF" }} />
        <h2 className="text-3xl font-bold text-white mb-3">הרוויח 50% עמלה חוזרת</h2>
        <p className="mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>
          הפנה חבר ל-ProFlow AI וקבל 50% מכל תשלום שהוא משלם — לנצח. אין הגבלה, אין תפוגה.
        </p>
        <Link to="/affiliates" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm" style={{ background: "rgba(179,136,255,0.15)", color: "#B388FF", border: "1px solid rgba(179,136,255,0.3)" }}>
          הצטרף כשגריר <ArrowLeft size={16} />
        </Link>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 border-t" style={{ borderColor: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.25)", fontSize: "13px" }}>
        © 2026 ProFlow AI · כל הזכויות שמורות
      </footer>
    </div>
  );
}
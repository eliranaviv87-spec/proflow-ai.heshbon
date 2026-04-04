import { useState } from "react";
import { Link } from "react-router-dom";
import { Zap, Star, Crown, CheckCircle, ArrowLeft, Users, TrendingUp, Gift, AlertCircle, Loader2, Copy, ExternalLink } from "lucide-react";
import { base44 } from "@/api/base44Client";

const starterPerks = [
  "הרשמה חינם — ללא התחייבות",
  "לינק הפניה ייעודי",
  "עמלה חד-פעמית 40% על כל מכירה ראשונה",
  "פאנל מעקב בזמן אמת",
  "ערכת שיווק דיגיטלית",
];

const elitePerks = [
  "עמלה קבועה 50% מכל לקוח חדש — כל חודש לנצח",
  "גישה למאגר לידים חמים",
  "לינק הפניה ייעודי Premium",
  "קופון הנחה אישי ללקוחות",
  "תעדוף תמיכה + מנהל אישי",
  "ערכת שיווק מורחבת",
  "הסמכת 'שגריר Elite' רשמית",
];

function generateRefCode(name) {
  const clean = name.replace(/\s+/g, "").toLowerCase().slice(0, 6);
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `PRO-${clean}-${rand}`;
}

export default function AmbassadorProgram() {
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", sales_experience: false, sales_description: "", tos_agreed: false, elite_tos_agreed: false });
  const [step, setStep] = useState("select"); // select | form | success
  const [submitting, setSubmitting] = useState(false);
  const [refCode, setRefCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const selectTrack = (track) => {
    setSelectedTrack(track);
    setStep("form");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.phone) { setError("יש למלא את כל השדות החובה"); return; }
    if (!form.tos_agreed) { setError("יש לאשר את תנאי השירות"); return; }
    if (selectedTrack === "elite" && !form.elite_tos_agreed) { setError("יש לאשר את תנאי תוכנית השגרירים"); return; }

    setSubmitting(true);
    setError("");
    const code = generateRefCode(form.full_name);
    await base44.entities.AmbassadorApplication.create({
      ...form,
      track: selectedTrack,
      status: selectedTrack === "elite" ? "pending" : "approved",
      ref_code: code,
    });
    setRefCode(code);
    setStep("success");
    setSubmitting(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`https://proflow.ai/ref/${refCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ background: "#0A0A0C", minHeight: "100vh", direction: "rtl", color: "#fff" }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 sticky top-0 z-50"
        style={{ background: "rgba(10,10,12,0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Link to="/landing" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#00E5FF22,#B388FF22)", border: "1px solid rgba(0,229,255,0.3)" }}>
            <Zap size={16} style={{ color: "#00E5FF" }} />
          </div>
          <span className="font-bold text-white">ProFlow<span style={{ color: "#00E5FF" }}>AI</span></span>
        </Link>
        <Link to="/" className="px-4 py-2 rounded-xl text-sm font-semibold" style={{ background: "linear-gradient(135deg,#00E5FF,#0099cc)", color: "#0A0A0C" }}>
          כניסה למערכת
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs mb-6"
            style={{ background: "rgba(179,136,255,0.08)", border: "1px solid rgba(179,136,255,0.25)", color: "#B388FF" }}>
            <Crown size={12} /> תוכנית שגרירים מוגבלת — מקומות מוגבלים בלבד
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4">
            <span style={{ background: "linear-gradient(135deg, #FFAB00, #B388FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              הפוך לשגריר ProFlow AI
            </span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.55)" }}>
            הפנה עסקים ל-ProFlow AI וקבל עמלות גבוהות. בחר את המסלול המתאים לך.
          </p>
        </div>

        {/* Track Selection */}
        {step === "select" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Starter */}
            <div className="glass-card p-8 flex flex-col" style={{ border: "1px solid rgba(0,229,255,0.2)" }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(0,229,255,0.12)" }}>
                  <Users size={24} style={{ color: "#00E5FF" }} />
                </div>
                <div>
                  <p className="text-xl font-bold text-white">מסלול Starter</p>
                  <p className="text-sm font-bold" style={{ color: "#00E5FF" }}>חינם לגמרי</p>
                </div>
              </div>

              <div className="mb-6 p-4 rounded-xl text-center" style={{ background: "rgba(0,229,255,0.06)", border: "1px solid rgba(0,229,255,0.12)" }}>
                <p className="text-4xl font-black" style={{ color: "#00E5FF" }}>40%</p>
                <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.55)" }}>עמלה חד-פעמית על המכירה הראשונה</p>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {starterPerks.map(p => (
                  <li key={p} className="flex items-start gap-2.5 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                    <CheckCircle size={15} style={{ color: "#00E5FF", flexShrink: 0, marginTop: 2 }} />{p}
                  </li>
                ))}
              </ul>
              <button onClick={() => selectTrack("starter")}
                className="w-full py-3.5 rounded-xl font-bold text-sm transition-all"
                style={{ background: "linear-gradient(135deg, rgba(0,229,255,0.2), rgba(0,229,255,0.1))", color: "#00E5FF", border: "1px solid rgba(0,229,255,0.35)" }}>
                הצטרף חינם עכשיו ←
              </button>
            </div>

            {/* Elite */}
            <div className="glass-card p-8 flex flex-col relative" style={{ border: "1px solid rgba(255,171,0,0.35)", boxShadow: "0 0 50px rgba(255,171,0,0.1)" }}>
              <div className="absolute -top-3.5 right-1/2 translate-x-1/2 px-5 py-1 rounded-full text-xs font-bold"
                style={{ background: "linear-gradient(135deg,#FFAB00,#ff8c00)", color: "#0A0A0C" }}>
                👑 מסלול המועדפים — מוגבל ל-10 מקומות
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,171,0,0.12)" }}>
                  <Crown size={24} style={{ color: "#FFAB00" }} />
                </div>
                <div>
                  <p className="text-xl font-bold text-white">מסלול Elite</p>
                  <p className="text-sm font-bold" style={{ color: "#FFAB00" }}>₪299/חודש</p>
                </div>
              </div>

              <div className="mb-6 p-4 rounded-xl text-center" style={{ background: "rgba(255,171,0,0.07)", border: "1px solid rgba(255,171,0,0.18)" }}>
                <p className="text-4xl font-black" style={{ color: "#FFAB00" }}>50%</p>
                <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.55)" }}>עמלה קבועה מכל לקוח חדש — כל חודש לנצח</p>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {elitePerks.map(p => (
                  <li key={p} className="flex items-start gap-2.5 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                    <Star size={14} fill="#FFAB00" style={{ color: "#FFAB00", flexShrink: 0, marginTop: 2 }} />{p}
                  </li>
                ))}
              </ul>

              <div className="mb-4 p-3 rounded-xl flex items-start gap-2 text-xs" style={{ background: "rgba(255,171,0,0.07)", border: "1px solid rgba(255,171,0,0.15)", color: "rgba(255,255,255,0.5)" }}>
                <AlertCircle size={13} style={{ color: "#FFAB00", flexShrink: 0, marginTop: 1 }} />
                הכרטיס יתפס (Pre-Auth) ויחויב אך ורק לאחר אישור אישי של המנהל.
              </div>

              <button onClick={() => selectTrack("elite")}
                className="w-full py-3.5 rounded-xl font-bold text-sm transition-all"
                style={{ background: "linear-gradient(135deg, #FFAB00, #ff8c00)", color: "#0A0A0C" }}>
                הצטרף ל-Elite עכשיו ←
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        {step === "form" && (
          <div className="max-w-xl mx-auto">
            <button onClick={() => setStep("select")} className="flex items-center gap-2 mb-6 text-sm transition-all" style={{ color: "rgba(255,255,255,0.4)" }}>
              <ArrowLeft size={14} style={{ transform: "rotate(180deg)" }} /> חזור לבחירת מסלול
            </button>

            <div className="glass-card p-8" style={{ border: `1px solid ${selectedTrack === "elite" ? "rgba(255,171,0,0.25)" : "rgba(0,229,255,0.2)"}` }}>
              <h2 className="text-xl font-bold text-white mb-1">
                הרשמה למסלול {selectedTrack === "elite" ? "Elite 👑" : "Starter"}
              </h2>
              <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>
                {selectedTrack === "elite" ? "עמלה קבועה 50% — כל חודש לנצח" : "עמלה חד-פעמית 40% על המכירה הראשונה"}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs mb-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>שם מלא *</label>
                  <input type="text" value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})}
                    placeholder="ישראל ישראלי" className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
                </div>
                <div>
                  <label className="block text-xs mb-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>כתובת מייל *</label>
                  <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                    placeholder="israel@gmail.com" className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
                </div>
                <div>
                  <label className="block text-xs mb-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>טלפון *</label>
                  <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                    placeholder="050-0000000" className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
                </div>

                {/* Sales Experience */}
                <div className="p-4 rounded-xl" style={{ background: "rgba(179,136,255,0.06)", border: "1px solid rgba(179,136,255,0.15)" }}>
                  <p className="text-sm font-medium text-white mb-3">האם יש לך ניסיון במכירות / טלמרקטינג?</p>
                  <div className="flex gap-4 mb-3">
                    <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                      <input type="radio" name="sales_exp" checked={form.sales_experience === true} onChange={() => setForm({...form, sales_experience: true})}
                        className="accent-purple-500" />
                      כן
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                      <input type="radio" name="sales_exp" checked={form.sales_experience === false} onChange={() => setForm({...form, sales_experience: false})}
                        className="accent-purple-500" />
                      לא
                    </label>
                  </div>
                  {form.sales_experience && (
                    <input type="text" value={form.sales_description} onChange={e => setForm({...form, sales_description: e.target.value})}
                      placeholder="פרט בקצרה (2 מילים): למשל 'טלמרקטינג B2B'" className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(179,136,255,0.2)", color: "#fff" }} />
                  )}
                </div>

                {/* TOS */}
                <div className="space-y-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.tos_agreed} onChange={e => setForm({...form, tos_agreed: e.target.checked})}
                      className="mt-1 accent-cyan-400" />
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                      אני מאשר/ת את <a href="#" className="underline" style={{ color: "#00E5FF" }}>תנאי השירות ללקוחות עסקיים</a> של ProFlow AI
                    </span>
                  </label>
                  {selectedTrack === "elite" && (
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" checked={form.elite_tos_agreed} onChange={e => setForm({...form, elite_tos_agreed: e.target.checked})}
                        className="mt-1 accent-yellow-400" />
                      <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                        אני מאשר/ת את <a href="#" className="underline" style={{ color: "#FFAB00" }}>תנאי תוכנית שגרירים Elite</a> כולל מדיניות הטלמרקטינג
                      </span>
                    </label>
                  )}
                </div>

                {selectedTrack === "elite" && (
                  <div className="p-3 rounded-xl text-xs" style={{ background: "rgba(255,171,0,0.06)", border: "1px solid rgba(255,171,0,0.15)", color: "rgba(255,255,255,0.5)" }}>
                    💳 הכרטיס יתפס כ-Pre-Authorization ויחויב ב-₪299 רק לאחר אישור אישי של הנהלת ProFlow AI
                  </div>
                )}

                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-xl text-xs" style={{ background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.2)", color: "#ff6b6b" }}>
                    <AlertCircle size={13} /> {error}
                  </div>
                )}

                <button type="submit" disabled={submitting}
                  className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                  style={{ background: selectedTrack === "elite" ? "linear-gradient(135deg,#FFAB00,#ff8c00)" : "linear-gradient(135deg,#00E5FF,#0099cc)", color: "#0A0A0C" }}>
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
                  {submitting ? "שולח..." : selectedTrack === "elite" ? "שלח בקשת הצטרפות Elite" : "הצטרף כשגריר Starter"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Success */}
        {step === "success" && (
          <div className="max-w-xl mx-auto text-center">
            <div className="glass-card p-10" style={{ border: `1px solid ${selectedTrack === "elite" ? "rgba(255,171,0,0.35)" : "rgba(0,229,255,0.3)"}` }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{ background: selectedTrack === "elite" ? "rgba(255,171,0,0.15)" : "rgba(0,229,255,0.12)" }}>
                {selectedTrack === "elite" ? <Crown size={32} style={{ color: "#FFAB00" }} /> : <CheckCircle size={32} style={{ color: "#00E5FF" }} />}
              </div>

              {selectedTrack === "elite" ? (
                <>
                  <h2 className="text-2xl font-bold text-white mb-3">בקשתך התקבלה! 🎉</h2>
                  <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>
                    הבקשה שלך למסלול Elite נשלחה לאישור המנהל. תוך 24-48 שעות תקבל מייל עם אישור וכרטיסך יחויב ב-₪299.
                  </p>
                  <div className="p-4 rounded-xl text-sm" style={{ background: "rgba(255,171,0,0.07)", border: "1px solid rgba(255,171,0,0.2)", color: "rgba(255,255,255,0.6)" }}>
                    🔔 תישלח אליך הודעת וואטסאפ/מייל ברגע האישור
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-white mb-3">ברוך הבא לתוכנית! 🚀</h2>
                  <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>
                    הצטרפת בהצלחה! קוד ההפניה הייעודי שלך מוכן. שתף אותו עם עסקים וקבל 40% עמלה על כל מכירה.
                  </p>
                  <div className="p-4 rounded-xl mb-4" style={{ background: "rgba(0,229,255,0.06)", border: "1px solid rgba(0,229,255,0.2)" }}>
                    <p className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>הלינק הייעודי שלך:</p>
                    <p className="text-sm font-mono font-bold" style={{ color: "#00E5FF" }}>https://proflow.ai/ref/{refCode}</p>
                  </div>
                  <button onClick={copyLink}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold mx-auto transition-all"
                    style={{ background: "rgba(0,229,255,0.12)", color: "#00E5FF", border: "1px solid rgba(0,229,255,0.25)" }}>
                    <Copy size={14} /> {copied ? "הועתק! ✓" : "העתק לינק"}
                  </button>
                </>
              )}

              <Link to="/" className="block mt-6 text-sm underline" style={{ color: "rgba(255,255,255,0.35)" }}>כניסה לדשבורד</Link>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center py-8 border-t mt-10" style={{ borderColor: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.25)", fontSize: "12px" }}>
        <div className="flex flex-wrap justify-center gap-4 mb-3">
          <a href="#" className="hover:text-white transition-colors">תנאי שירות לעסקים</a>
          <span>·</span>
          <a href="#" className="hover:text-white transition-colors">תנאי תוכנית שגרירים</a>
          <span>·</span>
          <a href="#" className="hover:text-white transition-colors">מדיניות פרטיות</a>
        </div>
        © 2026 ProFlow AI · כל הזכויות שמורות
      </footer>
    </div>
  );
}
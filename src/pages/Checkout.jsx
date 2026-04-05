import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Zap, Check, Shield, ArrowLeft } from "lucide-react";

const planDetails = {
  Discovery: { price: 99, color: "#4ade80", features: ["עד 20 מסמכים", "OCR בסיסי", "גישה למרכז המשאבים", "דוחות ידניים"] },
  Starter: { price: 199, color: "#00E5FF", features: ["עד 100 מסמכים", "OCR מלא + AI", "דוחות חודשיים AI", "תמיכה אימייל"] },
  Pro: { price: 399, color: "#B388FF", features: ["מסמכים ללא הגבלה", "OCR בצובר (50 קבצים)", "WhatsApp AI Assistant", "תמיכה עדיפות 24/7"] },
  Enterprise: { price: 999, color: "#D4AF37", features: ["הכל ב-Pro", "API מותאם אישית", "מנהל חשבון ייעודי", "SLA מובטח"] },
};

export default function Checkout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const planName = urlParams.get("plan") || "Starter";
  const plan = planDetails[planName] || planDetails.Starter;

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Simulated payment — Tranzila integration coming soon
      await new Promise(r => setTimeout(r, 2000));

      // Post-purchase: update organization subscription_tier
      const orgs = await base44.entities.Organization.list();
      if (orgs && orgs.length > 0) {
        await base44.entities.Organization.update(orgs[0].id, { subscription_tier: planName });
      }

      // Create active subscription record
      const user = await base44.auth.me();
      const today = new Date().toISOString().split("T")[0];
      const endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 1);
      await base44.entities.Subscription.create({
        user_email: user.email,
        plan_name: planName,
        status: "active",
        billing_cycle: "annual",
        start_date: today,
        end_date: endDate.toISOString().split("T")[0],
      });

      setPaid(true);
      setTimeout(() => navigate("/dashboard"), 2500);
    } catch (err) {
      console.error("Payment error:", err);
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" style={{ background: "#0A0A0A", minHeight: "100vh", color: "#fff", fontFamily: "Heebo, sans-serif" }}>
      {/* Nav */}
      <nav style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(10,10,10,0.97)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: "linear-gradient(135deg, rgba(0,229,255,0.15), rgba(212,175,55,0.15))", border: "1px solid rgba(212,175,55,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={19} color="#D4AF37" />
            </div>
            <span style={{ fontWeight: 900, fontSize: 20, color: "#fff" }}>ProFlow<span style={{ color: "#00E5FF" }}>AI</span></span>
          </Link>
          <Link to="/pricing" style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
            <ArrowLeft size={14} /> חזרה למחירים
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: "60px auto", padding: "0 24px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8, textAlign: "center" }}>
          השלם את <span style={{ background: "linear-gradient(135deg, #D4AF37, #00E5FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>ההרשמה</span>
        </h1>
        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 40 }}>צעד אחרון — ובדשבורד שלך תוך שניות</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
          {/* Order Summary */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${plan.color}30`, borderRadius: 24, padding: 28 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: plan.color, marginBottom: 16, textTransform: "uppercase", letterSpacing: 1 }}>סיכום הזמנה</p>
            <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <p style={{ fontSize: 26, fontWeight: 900, color: "#fff" }}>{planName}</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>מנוי שנתי — חיוב חודשי</p>
            </div>
            <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              {plan.features.map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <Check size={13} color={plan.color} />
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{f}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>סה"כ לחודש</span>
              <span style={{ fontSize: 32, fontWeight: 900, color: plan.color }}>₪{plan.price}</span>
            </div>
          </div>

          {/* Payment Form */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: 28 }}>
            {paid ? (
              <div style={{ textAlign: "center", padding: "48px 0" }}>
                <div style={{ fontSize: 64, marginBottom: 20 }}>✅</div>
                <h2 style={{ fontSize: 24, fontWeight: 900, color: "#4ade80", marginBottom: 10 }}>התשלום הצליח!</h2>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>מעבירים אותך לדשבורד...</p>
                <div style={{ marginTop: 20, width: 40, height: 40, border: "2px solid rgba(74,222,128,0.2)", borderTopColor: "#4ade80", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "20px auto 0" }} />
              </div>
            ) : (
              <>
                <p style={{ fontSize: 16, fontWeight: 800, marginBottom: 24 }}>פרטי תשלום</p>

                <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
                  {[
                    { label: "מספר כרטיס אשראי", placeholder: "•••• •••• •••• ••••" },
                    { label: "שם בעל הכרטיס", placeholder: "ישראל ישראלי" },
                  ].map(({ label, placeholder }) => (
                    <div key={label}>
                      <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>{label}</label>
                      <input
                        placeholder={placeholder}
                        style={{ width: "100%", padding: "12px 14px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)", fontSize: 14, boxSizing: "border-box", outline: "none" }}
                      />
                    </div>
                  ))}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {[{ label: "תוקף", placeholder: "MM/YY" }, { label: "CVV", placeholder: "•••" }].map(({ label, placeholder }) => (
                      <div key={label}>
                        <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>{label}</label>
                        <input placeholder={placeholder} style={{ width: "100%", padding: "12px 14px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)", fontSize: 14, boxSizing: "border-box", outline: "none" }} />
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ padding: "10px 14px", borderRadius: 12, background: "rgba(255,171,0,0.06)", border: "1px solid rgba(255,171,0,0.2)", marginBottom: 20, fontSize: 12, color: "rgba(255,171,0,0.8)", textAlign: "center" }}>
                  🔄 חיבור לטרנזילה בתהליך — כרגע בסימולציה בלבד
                </div>

                <button
                  onClick={handlePayment}
                  disabled={loading}
                  style={{ width: "100%", padding: "15px", borderRadius: 16, border: "none", cursor: loading ? "not-allowed" : "pointer", background: loading ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #D4AF37, #00E5FF)", color: loading ? "rgba(255,255,255,0.4)" : "#0A0A0A", fontWeight: 900, fontSize: 16, transition: "all 0.2s" }}
                >
                  {loading ? "🔄 מעבד תשלום..." : `שלם ₪${plan.price} — התחל עכשיו`}
                </button>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 14, fontSize: 12, color: "rgba(255,255,255,0.25)" }}>
                  <Shield size={12} />
                  <span>תשלום מאובטח SSL — 256bit הצפנה</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
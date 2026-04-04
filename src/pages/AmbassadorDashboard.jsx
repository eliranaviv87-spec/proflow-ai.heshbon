import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { TrendingUp, Users, DollarSign, Star, RefreshCw, Copy, CheckCircle, AlertTriangle, Clock, ArrowUpRight } from "lucide-react";

const fmt = (n) => new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS", maximumFractionDigits: 0 }).format(n || 0);

export default function AmbassadorDashboard() {
  const [user, setUser] = useState(null);
  const [ambassador, setAmbassador] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [requestingPayout, setRequestingPayout] = useState(false);
  const [payoutSuccess, setPayoutSuccess] = useState(false);

  useEffect(() => {
    const init = async () => {
      const me = await base44.auth.me();
      setUser(me);
      const apps = await base44.entities.AmbassadorApplication.filter({ email: me.email });
      if (apps.length > 0) {
        const amb = apps[0];
        setAmbassador(amb);
        const subs = await base44.entities.Subscription.filter({ referred_by_ambassador_id: amb.id });
        setReferrals(subs);
        const prs = await base44.entities.PayoutRequest.filter({ ambassador_id: amb.id });
        setPayouts(prs);
      }
      setLoading(false);
    };
    init();
  }, []);

  const refLink = ambassador
    ? `${window.location.origin}/?ref=${ambassador.ref_code}`
    : "";

  const copyLink = () => {
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const requestPayout = async () => {
    if (!ambassador || (ambassador.total_earnings || 0) < 500) return;
    setRequestingPayout(true);
    const res = await base44.functions.invoke("requestPayout", {
      ambassador_id: ambassador.id,
      amount: ambassador.pending_payout || 0,
    });
    if (res.data?.success) {
      setPayoutSuccess(true);
      setAmbassador(prev => ({ ...prev, pending_payout: 0 }));
    }
    setRequestingPayout(false);
  };

  const isElite = ambassador?.track === "elite";
  const canRequestPayout = (ambassador?.total_earnings || 0) >= 500 && (ambassador?.pending_payout || 0) > 0;

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <RefreshCw size={24} className="animate-spin" style={{ color: "#D4AF37" }} />
    </div>
  );

  if (!ambassador) return (
    <div style={{ maxWidth: 600, margin: "80px auto", textAlign: "center", padding: "0 24px" }}>
      <Star size={48} style={{ color: "#D4AF37", margin: "0 auto 16px" }} />
      <h2 className="text-2xl font-bold text-white mb-4">אינך רשום לתוכנית השגרירים</h2>
      <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 24 }}>הצטרף לתוכנית השגרירים של ProFlow AI והתחל להרוויח עמלות</p>
      <a href="/ambassador-program" style={{ display: "inline-block", background: "linear-gradient(135deg, #D4AF37, #FFAB00)", color: "#0A0A0A", padding: "14px 32px", borderRadius: 14, fontWeight: 800, textDecoration: "none" }}>
        הצטרף עכשיו
      </a>
    </div>
  );

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div style={{ width: 38, height: 38, borderRadius: 12, background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Star size={18} style={{ color: "#D4AF37" }} />
            </div>
            <h1 className="text-2xl font-bold text-white">לוח מחוונים — שגריר</h1>
            <span style={{ fontSize: 12, padding: "3px 10px", borderRadius: 50, background: isElite ? "rgba(212,175,55,0.15)" : "rgba(0,229,255,0.1)", color: isElite ? "#D4AF37" : "#00E5FF", border: `1px solid ${isElite ? "rgba(212,175,55,0.3)" : "rgba(0,229,255,0.2)"}`, fontWeight: 700 }}>
              {isElite ? "⭐ Elite" : "Casual Partner"}
            </span>
          </div>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
            עמלה: <strong style={{ color: isElite ? "#D4AF37" : "#00E5FF" }}>{isElite ? "50% חוזרת לכל חיים" : "40% חד-פעמית"}</strong>
          </p>
        </div>
        {/* Status */}
        <div style={{ padding: "8px 16px", borderRadius: 12, background: ambassador.status === "active" ? "rgba(74,222,128,0.1)" : "rgba(255,107,107,0.1)", border: `1px solid ${ambassador.status === "active" ? "rgba(74,222,128,0.25)" : "rgba(255,107,107,0.25)"}` }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: ambassador.status === "active" ? "#4ade80" : "#ff6b6b" }}>
            {ambassador.status === "active" ? "✓ פעיל" : ambassador.status === "pending" ? "⏳ ממתין לאישור" : "✗ לא פעיל"}
          </span>
        </div>
      </div>

      {/* Referral Link */}
      <div className="glass-card p-5">
        <p className="text-sm font-semibold text-white mb-3">קישור ההפניה הייחודי שלך</p>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ flex: 1, padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", fontSize: 13, color: "rgba(255,255,255,0.6)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", direction: "ltr" }}>
            {refLink}
          </div>
          <button onClick={copyLink} style={{ padding: "10px 16px", borderRadius: 10, background: copied ? "rgba(74,222,128,0.15)" : "rgba(0,229,255,0.12)", color: copied ? "#4ade80" : "#00E5FF", border: `1px solid ${copied ? "rgba(74,222,128,0.3)" : "rgba(0,229,255,0.25)"}`, display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
            {copied ? "הועתק!" : "העתק"}
          </button>
        </div>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 8 }}>קוד הפנייה: <code style={{ color: "#D4AF37" }}>{ambassador.ref_code}</code></p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "סה״כ הפניות", value: ambassador.total_referrals || 0, color: "#00E5FF", icon: Users },
          { label: "הפניות פעילות", value: referrals.filter(r => r.status === "active").length, color: "#4ade80", icon: TrendingUp },
          { label: "רווחים כוללים", value: fmt(ambassador.total_earnings), color: "#D4AF37", icon: Star },
          { label: "ממתין לתשלום", value: fmt(ambassador.pending_payout), color: "#FFAB00", icon: DollarSign },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon size={14} style={{ color }} />
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{label}</p>
            </div>
            <p style={{ fontSize: 22, fontWeight: 800, color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Payout Request */}
      {(ambassador.pending_payout || 0) > 0 && (
        <div className="glass-card p-5" style={{ border: "1px solid rgba(212,175,55,0.2)" }}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm font-semibold text-white mb-1">בקשת תשלום</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                {canRequestPayout ? `יתרה לתשלום: ${fmt(ambassador.pending_payout)}` : `נדרש מינימום ₪500 לבקשת תשלום (נוכחי: ${fmt(ambassador.pending_payout)})`}
              </p>
            </div>
            {payoutSuccess ? (
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#4ade80" }}>
                <CheckCircle size={16} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>הבקשה נשלחה!</span>
              </div>
            ) : (
              <button onClick={requestPayout} disabled={!canRequestPayout || requestingPayout}
                style={{ padding: "10px 24px", borderRadius: 12, background: canRequestPayout ? "linear-gradient(135deg, #D4AF37, #FFAB00)" : "rgba(255,255,255,0.05)", color: canRequestPayout ? "#0A0A0A" : "rgba(255,255,255,0.3)", border: canRequestPayout ? "none" : "1px solid rgba(255,255,255,0.1)", fontWeight: 800, fontSize: 14, cursor: canRequestPayout ? "pointer" : "not-allowed", display: "flex", alignItems: "center", gap: 6 }}>
                {requestingPayout ? <RefreshCw size={14} className="animate-spin" /> : <ArrowUpRight size={14} />}
                בקש תשלום
              </button>
            )}
          </div>
        </div>
      )}

      {/* Referrals Table */}
      <div className="glass-card p-5">
        <p className="text-sm font-semibold text-white mb-4">לקוחות שהפניתי ({referrals.length})</p>
        {referrals.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <Users size={32} style={{ color: "rgba(255,255,255,0.1)", margin: "0 auto 12px" }} />
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>עדיין אין לקוחות שהפנית</p>
            <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 12, marginTop: 6 }}>שתף את קישור ההפניה שלך כדי להתחיל להרוויח</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["שם לקוח", "תאריך הצטרפות", "חבילה", "סטטוס", "רווח מצטבר"].map(h => (
                    <th key={h} style={{ textAlign: "right", padding: "0 12px 12px", fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {referrals.map(ref => {
                  const commission = isElite
                    ? (ref.monthly_price_ils || 0) * 0.5
                    : (ref.monthly_price_ils || 0) * 0.4;
                  return (
                    <tr key={ref.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                      <td style={{ padding: "12px", color: "rgba(255,255,255,0.8)", fontSize: 13 }}>{ref.user_email || "—"}</td>
                      <td style={{ padding: "12px", color: "rgba(255,255,255,0.45)", fontSize: 12 }}>{ref.start_date ? new Date(ref.start_date).toLocaleDateString("he-IL") : "—"}</td>
                      <td style={{ padding: "12px" }}>
                        <span style={{ fontSize: 12, padding: "3px 8px", borderRadius: 6, background: "rgba(179,136,255,0.1)", color: "#B388FF" }}>{ref.plan_name}</span>
                      </td>
                      <td style={{ padding: "12px" }}>
                        <span style={{ fontSize: 12, padding: "3px 8px", borderRadius: 6, background: ref.status === "active" ? "rgba(74,222,128,0.1)" : "rgba(255,107,107,0.1)", color: ref.status === "active" ? "#4ade80" : "#ff6b6b" }}>
                          {ref.status === "active" ? "פעיל" : ref.status === "canceled" ? "מבוטל" : ref.status}
                        </span>
                      </td>
                      <td style={{ padding: "12px", fontWeight: 700, color: "#D4AF37", fontSize: 13 }}>{fmt(commission)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payout History */}
      {payouts.length > 0 && (
        <div className="glass-card p-5">
          <p className="text-sm font-semibold text-white mb-4">היסטוריית תשלומים</p>
          <div className="space-y-2">
            {payouts.map(p => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {p.status === "paid" ? <CheckCircle size={14} style={{ color: "#4ade80" }} /> : p.status === "pending" ? <Clock size={14} style={{ color: "#FFAB00" }} /> : <AlertTriangle size={14} style={{ color: "#ff6b6b" }} />}
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{p.request_date ? new Date(p.request_date).toLocaleDateString("he-IL") : "—"}</span>
                </div>
                <div style={{ display: "flex", items: "center", gap: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#D4AF37" }}>{fmt(p.amount)}</span>
                  <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 6, background: p.status === "paid" ? "rgba(74,222,128,0.1)" : "rgba(255,171,0,0.1)", color: p.status === "paid" ? "#4ade80" : "#FFAB00" }}>
                    {p.status === "paid" ? "שולם" : p.status === "pending" ? "ממתין" : p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Elite Warning */}
      {isElite && ambassador.status === "active" && (
        <div style={{ padding: "12px 16px", borderRadius: 12, background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.2)", fontSize: 12, color: "rgba(212,175,55,0.7)" }}>
          ⚠️ כשגריר Elite — עמלות יוקפאו אם מנוי ה-299 ₪ שלך נכשל. ודא שפרטי התשלום שלך מעודכנים.
        </div>
      )}
    </div>
  );
}
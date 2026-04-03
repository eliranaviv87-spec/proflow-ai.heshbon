import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Users, Copy, Check, TrendingUp, DollarSign } from "lucide-react";

const formatCurrency = (n) =>
  new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS", maximumFractionDigits: 0 }).format(n || 0);

function generateRefCode(email) {
  return btoa(email).replace(/[^a-zA-Z0-9]/g, "").slice(0, 8).toUpperCase();
}

export default function Affiliates() {
  const [affiliate, setAffiliate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [copied, setCopied] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function load() {
      const me = await base44.auth.me();
      setUser(me);
      const list = await base44.entities.Affiliate.filter({ created_by: me.email });
      if (list[0]) setAffiliate(list[0]);
      setLoading(false);
    }
    load();
  }, []);

  const handleJoin = async () => {
    setJoining(true);
    const refCode = generateRefCode(user.email);
    const created = await base44.entities.Affiliate.create({
      ref_code: refCode,
      total_commission: 0,
      pending_payout: 0,
      referral_count: 0,
      is_active: true,
    });
    await base44.entities.AuditLog.create({ action: `שגריר חדש: ${user.email} — קוד: ${refCode}`, entity_type: "Affiliate", entity_id: created.id });
    setAffiliate(created);
    setJoining(false);
  };

  const refLink = affiliate ? `https://proflow.ai?ref=${affiliate.ref_code}` : "";

  const copyLink = () => {
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: "rgba(0,229,255,0.2)", borderTopColor: "#00E5FF" }} />
    </div>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">מערכת שגרירים</h1>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>הרוויח 50% עמלה חוזרת על כל הפניה</p>
      </div>

      {!affiliate ? (
        <div className="glass-card p-10 text-center" style={{ border: "1px solid rgba(179,136,255,0.2)" }}>
          <Users size={48} className="mx-auto mb-4" style={{ color: "#B388FF" }} />
          <h2 className="text-xl font-bold text-white mb-2">הצטרף לתוכנית השגרירים</h2>
          <p className="mb-6 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            קבל 50% מכל תשלום של הלקוחות שתפנה — לנצח, ללא הגבלה.
          </p>
          <button
            onClick={handleJoin}
            disabled={joining}
            className="px-8 py-3 rounded-xl font-semibold text-sm transition-all"
            style={{ background: "rgba(179,136,255,0.15)", color: "#B388FF", border: "1px solid rgba(179,136,255,0.3)" }}
          >
            {joining ? "יוצר חשבון..." : "הצטרף עכשיו — חינם"}
          </button>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="glass-card p-5" style={{ border: "1px solid rgba(179,136,255,0.15)" }}>
              <DollarSign size={18} className="mb-2" style={{ color: "#B388FF" }} />
              <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>עמלה כוללת</p>
              <p className="text-2xl font-bold" style={{ color: "#B388FF" }}>{formatCurrency(affiliate.total_commission)}</p>
            </div>
            <div className="glass-card p-5">
              <DollarSign size={18} className="mb-2" style={{ color: "#FFAB00" }} />
              <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>ממתין לתשלום</p>
              <p className="text-2xl font-bold" style={{ color: "#FFAB00" }}>{formatCurrency(affiliate.pending_payout)}</p>
            </div>
            <div className="glass-card p-5 neon-glow-cyan">
              <Users size={18} className="mb-2" style={{ color: "#00E5FF" }} />
              <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>הפניות פעילות</p>
              <p className="text-2xl font-bold" style={{ color: "#00E5FF" }}>{affiliate.referral_count}</p>
            </div>
          </div>

          {/* Ref Link */}
          <div className="glass-card p-6" style={{ border: "1px solid rgba(0,229,255,0.15)" }}>
            <p className="text-sm font-semibold text-white mb-4">הלינק האישי שלך</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 px-4 py-3 rounded-xl text-sm font-mono" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#00E5FF" }}>
                {refLink}
              </div>
              <button
                onClick={copyLink}
                className="px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 transition-all"
                style={{ background: "rgba(0,229,255,0.1)", color: "#00E5FF", border: "1px solid rgba(0,229,255,0.25)" }}
                aria-label="העתק לינק"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "הועתק!" : "העתק"}
              </button>
            </div>
            <p className="text-xs mt-3" style={{ color: "rgba(255,255,255,0.3)" }}>
              קוד שגריר: <span style={{ color: "#B388FF", fontFamily: "monospace" }}>{affiliate.ref_code}</span> · עמלה: 50% חוזר
            </p>
          </div>

          {/* How it works */}
          <div className="glass-card p-6">
            <p className="text-sm font-semibold text-white mb-4">איך זה עובד?</p>
            <div className="space-y-3">
              {[
                { n: "1", text: "שתף את הלינק עם בעלי עסקים" },
                { n: "2", text: "הם נרשמים ומשלמים מנוי" },
                { n: "3", text: "אתה מקבל 50% מכל חיוב — אוטומטית" },
                { n: "4", text: "אין הגבלה על מספר ההפניות" },
              ].map(({ n, text }) => (
                <div key={n} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: "rgba(179,136,255,0.15)", color: "#B388FF" }}>{n}</div>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
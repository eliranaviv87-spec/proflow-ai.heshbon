import { Link } from "react-router-dom";
import { Lock, Zap, ShoppingCart } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";

// Wrap AI-only features with this component
export default function SubscriptionGate({ children, feature = "תכונה זו" }) {
  const { canUseAI, loading, plan, limits: currentLimits, hasCredits } = useSubscription();

  if (loading) return (
    <div className="flex items-center justify-center h-32">
      <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: "rgba(0,229,255,0.2)", borderTopColor: "#00E5FF" }} />
    </div>
  );

  // Credits depleted (paid plan but no credits left)
  if (currentLimits?.ai && !hasCredits) {
    return (
      <div style={{ padding: "32px 24px", borderRadius: 18, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(179,136,255,0.2)", textAlign: "center" }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(179,136,255,0.1)", border: "1px solid rgba(179,136,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <Lock size={22} style={{ color: "#B388FF" }} />
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 8 }}>קרדיטי AI אזלו</h3>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 20, lineHeight: 1.6 }}>
          השתמשת בכל קרדיטי ה-AI שלך לחודש זה.<br />
          רכוש קרדיטים נוספים להמשך שימוש.
        </p>
        <Link to="/ai-credits" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #B388FF, #7c3aed)", color: "#fff", padding: "12px 28px", borderRadius: 12, fontWeight: 800, textDecoration: "none", fontSize: 14 }}>
          <ShoppingCart size={16} /> רכוש קרדיטים להמשך שימוש
        </Link>
      </div>
    );
  }

  if (!canUseAI) {
    return (
      <div style={{ padding: "32px 24px", borderRadius: 18, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,171,0,0.2)", textAlign: "center" }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(255,171,0,0.1)", border: "1px solid rgba(255,171,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <Lock size={22} style={{ color: "#FFAB00" }} />
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 8 }}>{feature} אינו זמין בחבילת Discovery</h3>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 20, lineHeight: 1.6 }}>
          חבילת Discovery מיועדת לניסיון בלבד (3 חודשים).<br />
          שדרג לחבילת Starter ומעלה כדי לגשת ל-AI המלא.
        </p>
        <Link to="/pricing" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #D4AF37, #00E5FF)", color: "#0A0A0A", padding: "12px 28px", borderRadius: 12, fontWeight: 800, textDecoration: "none", fontSize: 14 }}>
          <Zap size={16} /> שדרג עכשיו
        </Link>
      </div>
    );
  }

  return children;
}
import { Link } from "react-router-dom";
import { ShieldOff } from "lucide-react";

export default function Forbidden() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6" style={{ background: "#0A0A0C" }}>
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.25)" }}>
        <ShieldOff size={32} style={{ color: "#ff6b6b" }} />
      </div>
      <h1 className="text-4xl font-black text-white mb-2">403</h1>
      <p className="text-lg font-semibold mb-2" style={{ color: "rgba(255,255,255,0.7)" }}>גישה נדחתה</p>
      <p className="text-sm mb-8 max-w-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
        אין לך הרשאות לגשת לדף זה. נדרשת גישת מנהל מערכת.
      </p>
      <Link to="/" className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all" style={{ background: "rgba(0,229,255,0.1)", color: "#00E5FF", border: "1px solid rgba(0,229,255,0.25)" }}>
        חזור לדשבורד
      </Link>
    </div>
  );
}
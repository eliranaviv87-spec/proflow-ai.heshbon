import { useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Zap } from 'lucide-react';

export default function Signup() {
  useEffect(() => {
    // Base44 handles signup via its native auth flow
    base44.auth.redirectToLogin(window.location.origin + '/dashboard');
  }, []);

  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center" style={{ background: "#0A0A0C" }}>
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: "linear-gradient(135deg, rgba(0,229,255,0.15), rgba(212,175,55,0.15))", border: "1px solid rgba(212,175,55,0.3)" }}>
          <Zap size={24} style={{ color: "#D4AF37" }} />
        </div>
        <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>מעביר לדף ההרשמה...</p>
        <div className="w-6 h-6 border-2 rounded-full animate-spin mx-auto"
          style={{ borderColor: "rgba(0,229,255,0.2)", borderTopColor: "#00E5FF" }} />
      </div>
    </div>
  );
}
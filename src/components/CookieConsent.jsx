import { useState, useEffect } from "react";
import { X, Cookie } from "lucide-react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("proflow_cookies_accepted");
    if (!accepted) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("proflow_cookies_accepted", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 md:bottom-0 left-0 right-0 z-[9999] p-4 pb-20 md:pb-4" style={{ direction: "rtl" }}>
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl"
        style={{ background: "rgba(15,15,20,0.97)", border: "1px solid rgba(0,229,255,0.2)", backdropFilter: "blur(20px)", boxShadow: "0 -4px 40px rgba(0,229,255,0.08)" }}>
        <Cookie size={22} style={{ color: "#00E5FF", flexShrink: 0 }} />
        <p className="text-sm flex-1" style={{ color: "rgba(255,255,255,0.65)" }}>
          אנו משתמשים בעוגיות לשיפור חווית הגלישה, ניתוח תנועה ופרסונליזציה. 
          המשך גלישה מהווה הסכמה למדיניות הפרטיות שלנו.
          <a href="#" className="mr-1 underline" style={{ color: "#00E5FF" }}>קרא עוד</a>
        </p>
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={accept} className="px-5 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{ background: "linear-gradient(135deg,#00E5FF,#0099cc)", color: "#0A0A0C" }}>
            אני מסכים
          </button>
          <button onClick={() => setVisible(false)} className="p-2 rounded-xl transition-all" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}>
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
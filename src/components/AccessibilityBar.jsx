import { useState } from "react";
import { Eye, Type, ZoomIn, ZoomOut, Contrast, RotateCcw } from "lucide-react";

export default function AccessibilityBar() {
  const [open, setOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);

  const increaseFontSize = () => {
    const next = Math.min(fontSize + 10, 140);
    setFontSize(next);
    document.documentElement.style.fontSize = `${next}%`;
  };

  const decreaseFontSize = () => {
    const next = Math.max(fontSize - 10, 80);
    setFontSize(next);
    document.documentElement.style.fontSize = `${next}%`;
  };

  const toggleContrast = () => {
    setHighContrast(!highContrast);
    document.body.style.filter = highContrast ? "" : "contrast(1.4)";
  };

  const reset = () => {
    setFontSize(100);
    setHighContrast(false);
    document.documentElement.style.fontSize = "100%";
    document.body.style.filter = "";
  };

  return (
    <div className="fixed top-1/2 left-0 -translate-y-1/2 z-[9998] hidden md:block" style={{ direction: "ltr" }}>
      <button onClick={() => setOpen(!open)}
        className="flex items-center justify-center w-10 h-10 rounded-r-xl transition-all"
        style={{ background: "rgba(0,229,255,0.15)", border: "1px solid rgba(0,229,255,0.3)", borderRight: "none", color: "#00E5FF" }}
        aria-label="סרגל נגישות">
        <Eye size={18} />
      </button>

      {open && (
        <div className="absolute top-0 left-10 flex flex-col gap-1 p-2 rounded-l-xl rounded-br-xl"
          style={{ background: "rgba(10,10,18,0.97)", border: "1px solid rgba(0,229,255,0.2)", backdropFilter: "blur(20px)" }}>
          <button onClick={increaseFontSize} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs whitespace-nowrap transition-all hover:bg-white/5"
            style={{ color: "rgba(255,255,255,0.7)" }}>
            <ZoomIn size={14} style={{ color: "#00E5FF" }} /> הגדל טקסט
          </button>
          <button onClick={decreaseFontSize} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs whitespace-nowrap transition-all hover:bg-white/5"
            style={{ color: "rgba(255,255,255,0.7)" }}>
            <ZoomOut size={14} style={{ color: "#00E5FF" }} /> הקטן טקסט
          </button>
          <button onClick={toggleContrast} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs whitespace-nowrap transition-all hover:bg-white/5"
            style={{ color: highContrast ? "#00E5FF" : "rgba(255,255,255,0.7)" }}>
            <Contrast size={14} style={{ color: "#B388FF" }} /> ניגודיות גבוהה
          </button>
          <button onClick={reset} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs whitespace-nowrap transition-all hover:bg-white/5"
            style={{ color: "rgba(255,255,255,0.5)" }}>
            <RotateCcw size={14} /> איפוס
          </button>
          <div className="text-center text-xs mt-1 pb-1" style={{ color: "rgba(255,255,255,0.3)" }}>גודל: {fontSize}%</div>
        </div>
      )}
    </div>
  );
}
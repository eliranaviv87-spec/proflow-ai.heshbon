import { Sparkles } from "lucide-react";
import Spinner from "@/components/ui/Spinner";
import GlassCard from "@/components/ui/GlassCard";

export default function AISummaryPanel({ summary, loading }) {
  return (
    <GlassCard className="p-5" style={{ border: "1px solid rgba(179,136,255,0.15)" }}>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={16} style={{ color: "#B388FF" }} />
        <p className="text-sm font-semibold text-white">ניתוח CFO AI</p>
      </div>
      {loading ? (
        <div className="flex items-center gap-3 py-4">
          <Spinner color="#B388FF" size="sm" />
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>ה-AI מנתח את הנתונים הפיננסיים...</p>
        </div>
      ) : summary ? (
        <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "rgba(255,255,255,0.75)" }}>{summary}</p>
      ) : (
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>לחץ על "ייצר דוח AI" לקבלת ניתוח מעמיק עם המלצות לשיפור</p>
      )}
    </GlassCard>
  );
}
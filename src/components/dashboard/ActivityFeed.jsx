import { TrendingUp, CheckCircle, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import StatusBadge from "@/components/ui/StatusBadge";
import Spinner from "@/components/ui/Spinner";
import GlassCard from "@/components/ui/GlassCard";

export default function ActivityFeed({ docs, loading }) {
  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-white">פיד פעילות — מסמכים אחרונים</p>
        <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{docs.length} מסמכים סה"כ</span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Spinner />
        </div>
      ) : docs.length === 0 ? (
        <div style={{ border: "2px dashed rgba(0,229,255,0.35)", borderRadius: 20, padding: "48px 24px", textAlign: "center", background: "rgba(0,229,255,0.03)", boxShadow: "0 0 40px rgba(0,229,255,0.07)" }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: "rgba(0,229,255,0.1)", border: "1px solid rgba(0,229,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: "0 0 30px rgba(0,229,255,0.15)" }}>
            <TrendingUp size={32} style={{ color: "#00E5FF" }} />
          </div>
          <p className="text-lg font-bold text-white mb-2">גרור את החשבונית הראשונה שלך לכאן כדי להתחיל</p>
          <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>AI יחלץ את כל הנתונים אוטומטית תוך שניות</p>
          <a href="/vault" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #D4AF37, #00E5FF)", color: "#0A0A0A", padding: "14px 32px", borderRadius: 14, fontWeight: 900, fontSize: 15, textDecoration: "none" }}>
            ⬆️ העלה חשבונית ראשונה
          </a>
        </div>
      ) : (
        <div className="space-y-2">
          {docs.slice(0, 8).map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.02)" }}>
              <div className="flex items-center gap-3">
                {doc.status === "Archived"
                  ? <CheckCircle size={14} style={{ color: "#4ade80" }} />
                  : <Clock size={14} style={{ color: "#FFAB00" }} />}
                <div>
                  <p className="text-sm font-medium text-white">{doc.supplier_name || "ספק לא ידוע"}</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{doc.date_issued || doc.created_date?.split("T")[0]}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-sm font-semibold" style={{ color: doc.doc_type === "income" ? "#00E5FF" : "#ff6b6b" }}>
                  {doc.doc_type === "income" ? "+" : "-"}{formatCurrency(doc.total_amount)}
                </p>
                <StatusBadge status={doc.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}
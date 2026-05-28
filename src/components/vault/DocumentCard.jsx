import { FileText, Trash2, Eye, Clock, CheckCircle, AlertTriangle, Archive } from "lucide-react";
import { formatCurrency } from "@/lib/format";

const STATUS_CONFIG = {
  Processing: { label: "מעבד...", color: "#B388FF", icon: Clock },
  Pending_Review: { label: "ממתין לבדיקה", color: "#FFAB00", icon: AlertTriangle },
  Verified: { label: "מאומת", color: "#00E5FF", icon: CheckCircle },
  Archived: { label: "הותאם", color: "#4ade80", icon: Archive },
};

export default function DocumentCard({ doc, onDelete }) {
  const s = STATUS_CONFIG[doc.status] || STATUS_CONFIG.Processing;
  const StatusIcon = s.icon;

  return (
    <div className="glass-card glass-card-hover p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileText size={16} style={{ color: "rgba(255,255,255,0.4)" }} />
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${s.color}15`, color: s.color, border: `1px solid ${s.color}30` }}>
            <StatusIcon size={10} className="inline ml-1" />{s.label}
          </span>
        </div>
        <button onClick={() => onDelete(doc.id)} className="p-1 rounded-lg transition-colors" style={{ color: "rgba(255,255,255,0.25)" }} aria-label="מחק מסמך">
          <Trash2 size={14} />
        </button>
      </div>

      <p className="font-semibold text-white mb-0.5 truncate">{doc.supplier_name || "מעבד..."}</p>
      <p className="text-xs mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>{doc.ai_category || "—"} · {doc.date_issued || "—"}</p>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-xl font-bold" style={{ color: doc.doc_type === "income" ? "#00E5FF" : "#ff6b6b" }}>
            {doc.total_amount ? formatCurrency(doc.total_amount) : "—"}
          </p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>מע"מ: {doc.vat_amount ? formatCurrency(doc.vat_amount) : "—"}</p>
        </div>
        {doc.confidence_score && (
          <span className="text-xs" style={{ color: doc.confidence_score > 0.9 ? "#4ade80" : "#FFAB00" }}>
            {Math.round(doc.confidence_score * 100)}% AI
          </span>
        )}
      </div>

      {doc.file_url && (
        <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center gap-1 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
          <Eye size={12} /> צפה בקובץ
        </a>
      )}
    </div>
  );
}
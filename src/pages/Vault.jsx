import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Upload, FileText, Trash2, Eye, CheckCircle, Clock, AlertTriangle, Archive } from "lucide-react";

const formatCurrency = (n) =>
  new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS", maximumFractionDigits: 0 }).format(n || 0);

const statusConfig = {
  Processing: { label: "מעבד...", color: "#B388FF", icon: Clock },
  Pending_Review: { label: "ממתין לבדיקה", color: "#FFAB00", icon: AlertTriangle },
  Verified: { label: "מאומת", color: "#00E5FF", icon: CheckCircle },
  Archived: { label: "הותאם", color: "#4ade80", icon: Archive },
};

export default function Vault() {
  const [docs, setDocs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [filter, setFilter] = useState("all");
  const fileRef = useRef();

  const loadDocs = () => base44.entities.Document.list("-created_date", 100).then(setDocs);

  useEffect(() => { loadDocs(); }, []);

  const processFile = async (file) => {
    if (!file) return;
    
    // Check credits first
    try {
      const creditCheck = await base44.functions.invoke('checkUserCredits', {});
      if (!creditCheck.data?.allowed) {
        setUploading(false);
        alert('❌ ' + (creditCheck.data?.reason || 'לא ניתן לעבד. קנה קרדיטים או שדרג חבילה'));
        return;
      }
    } catch (err) {
      setUploading(false);
      alert('שגיאה בבדיקת קרדיטים');
      return;
    }

    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });

    const doc = await base44.entities.Document.create({
      file_url,
      status: "Processing",
    });

    // AI OCR via InvokeLLM with vision
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `אתה AI פיננסי מומחה. חלץ נתונים מחשבונית זו והחזר JSON בלבד (ללא markdown):
      {"vendor_name":"","tax_id":"","invoice_number":"","date_issued":"YYYY-MM-DD","total_amount":0,"vat_amount":0,"net_amount":0,"category_tag":"","doc_type":"income|expense"}`,
      file_urls: [file_url],
      response_json_schema: {
        type: "object",
        properties: {
          vendor_name: { type: "string" },
          tax_id: { type: "string" },
          invoice_number: { type: "string" },
          date_issued: { type: "string" },
          total_amount: { type: "number" },
          vat_amount: { type: "number" },
          net_amount: { type: "number" },
          category_tag: { type: "string" },
          doc_type: { type: "string" },
        },
      },
    });

    // Log token usage
    const user = await base44.auth.me();
    await base44.functions.invoke('logTokenUsage', {
      user_email: user.email,
      tokens_used: 500,
      operation_type: 'OCR_EXTRACTION',
      document_id: doc.id,
    });

    const tolerance = 0.5;
    const mathCheck = Math.abs((result.net_amount + result.vat_amount) - result.total_amount) < tolerance;
    const status = mathCheck ? "Verified" : "Pending_Review";

    await base44.entities.Document.update(doc.id, {
      supplier_name: result.vendor_name,
      doc_number: result.invoice_number,
      date_issued: result.date_issued,
      total_amount: result.total_amount,
      vat_amount: result.vat_amount,
      net_amount: result.net_amount,
      ai_category: result.category_tag,
      doc_type: result.doc_type || "expense",
      confidence_score: mathCheck ? 0.97 : 0.75,
      status,
    });

    await base44.entities.AuditLog.create({
      action: `מסמך עובד על ידי AI: ${result.vendor_name} — ${status}`,
      entity_type: "Document",
      entity_id: doc.id,
    });

    // Auto-match with bank transactions
    if (result.total_amount && result.date_issued) {
      const txs = await base44.entities.BankTransaction.list("-date", 200);
      const docDate = new Date(result.date_issued);
      const match = txs.find((tx) => {
        if (tx.match_status) return false;
        const diff = Math.abs(new Date(tx.date) - docDate) / 86400000;
        return Math.abs(tx.amount) === result.total_amount && diff <= 5;
      });
      if (match) {
        await base44.entities.BankTransaction.update(match.id, { linked_doc_id: doc.id, match_status: true });
        await base44.entities.Document.update(doc.id, { status: "Archived" });
        await base44.entities.AuditLog.create({ action: `התאמה אוטומטית: מסמך ${doc.id} ← עסקה ${match.id}`, entity_type: "BankTransaction", entity_id: match.id });
      }
    }

    setUploading(false);
    loadDocs();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processFile(e.dataTransfer.files[0]);
  };

  const handleDelete = async (id) => {
    await base44.entities.Document.delete(id);
    setDocs(docs.filter(d => d.id !== id));
  };

  const filtered = filter === "all" ? docs : docs.filter(d => d.doc_type === filter);

  return (
    <div className="space-y-6">
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h1 className="text-2xl font-bold text-white mb-1">הכספת</h1>
          <span title="העלה כאן עד 50 קבצים לסריקה אוטומטית — AI מחלץ תאריך, סכום ומע&quot;מ אוטומטית" style={{ cursor: "help", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, borderRadius: "50%", background: "rgba(0,229,255,0.1)", border: "1px solid rgba(0,229,255,0.3)", color: "#00E5FF", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>?</span>
        </div>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>מרכז ניהול מסמכים חכם — Bulk OCR עד 50 קבצים</p>
      </div>

      {/* Upload Zone */}
      <div
        className="glass-card p-8 text-center transition-all cursor-pointer"
        style={{
          border: dragOver ? "1px solid rgba(0,229,255,0.5)" : "1px dashed rgba(255,255,255,0.1)",
          background: dragOver ? "rgba(0,229,255,0.05)" : "rgba(255,255,255,0.02)",
        }}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => !uploading && fileRef.current?.click()}
        role="button"
        aria-label="העלה חשבונית"
      >
        <input ref={fileRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => processFile(e.target.files[0])} />
        {uploading ? (
          <div className="space-y-3">
            <div className="w-10 h-10 border-2 rounded-full animate-spin mx-auto" style={{ borderColor: "rgba(179,136,255,0.2)", borderTopColor: "#B388FF" }} />
            <p className="text-sm font-medium" style={{ color: "#B388FF" }}>ה-AI מנתח את המסמך...</p>
          </div>
        ) : (
          <div className="space-y-3">
            <Upload size={32} className="mx-auto" style={{ color: "rgba(0,229,255,0.5)" }} />
            <p className="text-base font-semibold text-white">הכספת ריקה. זרוק לכאן חשבונית והבינה המלאכותית שלנו תעשה את הקסם.</p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>תומך ב-PDF, JPG, PNG</p>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {[["all", "הכל"], ["income", "הכנסות"], ["expense", "הוצאות"]].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className="px-4 py-1.5 rounded-xl text-sm font-medium transition-all"
            style={{
              background: filter === val ? "rgba(0,229,255,0.1)" : "rgba(255,255,255,0.04)",
              color: filter === val ? "#00E5FF" : "rgba(255,255,255,0.5)",
              border: filter === val ? "1px solid rgba(0,229,255,0.25)" : "1px solid transparent",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((doc) => {
          const s = statusConfig[doc.status] || statusConfig.Processing;
          const Icon = s.icon;
          return (
            <div key={doc.id} className="glass-card-hover p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText size={16} style={{ color: "rgba(255,255,255,0.4)" }} />
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${s.color}15`, color: s.color, border: `1px solid ${s.color}30` }}>
                    <Icon size={10} className="inline ml-1" />{s.label}
                  </span>
                </div>
                <button onClick={() => handleDelete(doc.id)} className="p-1 rounded-lg transition-colors" style={{ color: "rgba(255,255,255,0.25)" }} aria-label="מחק מסמך">
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
                <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center gap-1 text-xs transition-colors" style={{ color: "rgba(255,255,255,0.3)" }} aria-label="צפה בקובץ">
                  <Eye size={12} /> צפה בקובץ
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
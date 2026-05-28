import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Upload } from "lucide-react";
import Spinner from "@/components/ui/Spinner";
import DocumentCard from "@/components/vault/DocumentCard";

async function processDocumentWithAI(file) {
  const creditCheck = await base44.functions.invoke("checkUserCredits", {});
  if (!creditCheck.data?.allowed) {
    throw new Error(creditCheck.data?.reason || "לא ניתן לעבד. קנה קרדיטים או שדרג חבילה");
  }

  const { file_url } = await base44.integrations.Core.UploadFile({ file });

  const doc = await base44.entities.Document.create({ file_url, status: "Processing" });

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

  const user = await base44.auth.me();
  await base44.functions.invoke("logTokenUsage", {
    user_email: user.email,
    tokens_used: 500,
    operation_type: "OCR_EXTRACTION",
    document_id: doc.id,
  });

  const mathCheck = Math.abs((result.net_amount + result.vat_amount) - result.total_amount) < 0.5;
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

  // Auto-match bank transactions
  if (result.total_amount && result.date_issued) {
    const txs = await base44.entities.BankTransaction.list("-date", 200);
    const docDate = new Date(result.date_issued);
    const match = txs.find((tx) => {
      if (tx.match_status) return false;
      const daysDiff = Math.abs(new Date(tx.date) - docDate) / 86400000;
      return Math.abs(tx.amount) === result.total_amount && daysDiff <= 5;
    });
    if (match) {
      await Promise.all([
        base44.entities.BankTransaction.update(match.id, { linked_doc_id: doc.id, match_status: true }),
        base44.entities.Document.update(doc.id, { status: "Archived" }),
        base44.entities.AuditLog.create({ action: `התאמה אוטומטית: מסמך ${doc.id} ← עסקה ${match.id}`, entity_type: "BankTransaction", entity_id: match.id }),
      ]);
    }
  }
}

const FILTER_TABS = [["all", "הכל"], ["income", "הכנסות"], ["expense", "הוצאות"]];

export default function Vault() {
  const [docs, setDocs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [filter, setFilter] = useState("all");
  const fileRef = useRef();

  const loadDocs = () => base44.entities.Document.list("-created_date", 100).then(setDocs);

  useEffect(() => { loadDocs(); }, []);

  const handleFile = async (file) => {
    if (!file) return;
    setUploadError("");
    setUploading(true);
    try {
      await processDocumentWithAI(file);
      await loadDocs();
    } catch (err) {
      setUploadError(err.message || "שגיאה בעיבוד המסמך");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    await base44.entities.Document.delete(id);
    setDocs(prev => prev.filter(d => d.id !== id));
  };

  const filtered = filter === "all" ? docs : docs.filter(d => d.doc_type === filter);

  return (
    <div className="space-y-6">
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h1 className="text-2xl font-bold text-white mb-1">הכספת</h1>
          <span title='העלה כאן עד 50 קבצים לסריקה אוטומטית — AI מחלץ תאריך, סכום ומע"מ אוטומטית'
            style={{ cursor: "help", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, borderRadius: "50%", background: "rgba(0,229,255,0.1)", border: "1px solid rgba(0,229,255,0.3)", color: "#00E5FF", fontSize: 11, fontWeight: 700 }}>?</span>
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
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => !uploading && fileRef.current?.click()}
        role="button"
        aria-label="העלה חשבונית"
      >
        <input ref={fileRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
        {uploading ? (
          <div className="space-y-3 flex flex-col items-center">
            <Spinner color="#B388FF" size="lg" />
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

      {uploadError && (
        <p className="text-sm text-center" style={{ color: "#ff6b6b" }}>❌ {uploadError}</p>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {FILTER_TABS.map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            className="px-4 py-1.5 rounded-xl text-sm font-medium transition-all"
            style={{
              background: filter === val ? "rgba(0,229,255,0.1)" : "rgba(255,255,255,0.04)",
              color: filter === val ? "#00E5FF" : "rgba(255,255,255,0.5)",
              border: filter === val ? "1px solid rgba(0,229,255,0.25)" : "1px solid transparent",
            }}>
            {label}
          </button>
        ))}
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((doc) => (
          <DocumentCard key={doc.id} doc={doc} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
import { useCallback, useState } from "react";
import { Upload, Loader2, Camera } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import CameraCapture from "./CameraCapture";

export default function UploadZone({ onDocumentCreated }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [creditsBlocked, setCreditsBlocked] = useState(false);
  const [showCreditsPopup, setShowCreditsPopup] = useState(false);
  const [currentFile, setCurrentFile] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [bulkProgress, setBulkProgress] = useState(null);
  const [cameraOpen, setCameraOpen] = useState(false);

  const checkCredits = async () => {
    try {
      const response = await base44.functions.invoke('checkUserCredits', {});
      if (!response.data?.allowed) {
        setCreditsBlocked(true);
        return false;
      }
    } catch (err) {
      console.error('Credit check failed:', err);
      setCreditsBlocked(true);
      return false;
    }
    return true;
  };

  const processFile = useCallback(async (file) => {
    const hasCredits = await checkCredits();
    if (!hasCredits) { setShowCreditsPopup(true); return; }
    setUploading(true);
    setCurrentFile(file.name);
    setStatusMsg("מעלה קובץ...");
    try {
      // Upload file
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setStatusMsg("מנתח מסמך עם AI (OCR)...");

      // Create document record
      const doc = await base44.entities.Document.create({
        file_url,
        status: "Processing",
      });

      // AI OCR extraction
      const extracted = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an Elite Financial AI. Extract data from this invoice/receipt image with maximum accuracy. Output a JSON object with these keys: vendor_name (string), tax_id (string or null), document_type (string: "invoice", "receipt", "credit_note"), invoice_number (string), date_issued (YYYY-MM-DD), currency (ISO code, default ILS), total_amount (float), net_amount (float), vat_amount (float), category_tag (string: one of "services", "goods", "rent", "utilities", "travel", "marketing", "software", "other"). If the document is in Hebrew, still output field names in English. Be precise.`,
        file_urls: [file_url],
        response_json_schema: {
          type: "object",
          properties: {
            vendor_name: { type: "string" },
            tax_id: { type: "string" },
            document_type: { type: "string" },
            invoice_number: { type: "string" },
            date_issued: { type: "string" },
            currency: { type: "string" },
            total_amount: { type: "number" },
            net_amount: { type: "number" },
            vat_amount: { type: "number" },
            category_tag: { type: "string" },
          },
        },
      });

      // Log token usage (estimate: 500 tokens per OCR)
      const user = await base44.auth.me();
      await base44.functions.invoke('logTokenUsage', {
        user_email: user.email,
        tokens_used: 500,
        operation_type: 'OCR_EXTRACTION',
        document_id: doc.id,
      });

      // Validate amounts
      const isValid =
        extracted.total_amount &&
        extracted.net_amount &&
        extracted.vat_amount &&
        Math.abs(extracted.total_amount - (extracted.net_amount + extracted.vat_amount)) < 1;

      const confidence = isValid ? 0.95 : 0.6;
      const status = isValid ? "Verified" : "Pending_Review";

      setStatusMsg("שומר נתונים...");
      await base44.entities.Document.update(doc.id, {
        supplier_name: extracted.vendor_name || "",
        doc_number: extracted.invoice_number || "",
        date_issued: extracted.date_issued || "",
        total_amount: extracted.total_amount || 0,
        net_amount: extracted.net_amount || 0,
        vat_amount: extracted.vat_amount || 0,
        ai_category: extracted.category_tag || "other",
        confidence_score: confidence,
        doc_type: "expense",
        status,
      });

      setStatusMsg("✓ הושלם בהצלחה!");
      toast.success("מסמך עובד בהצלחה ע״י AI");
      onDocumentCreated?.();
    } catch (err) {
      console.error(err);
      setStatusMsg("");
      toast.error("שגיאה בעיבוד המסמך");
    } finally {
      setUploading(false);
      setTimeout(() => { setCurrentFile(""); setStatusMsg(""); }, 2000);
    }
  }, [onDocumentCreated]);

  const processBulk = useCallback(async (files) => {
    const fileArr = Array.from(files);
    if (fileArr.length === 1) { processFile(fileArr[0]); return; }
    setBulkProgress({ done: 0, total: fileArr.length, errors: 0 });
    setUploading(true);
    let done = 0, errors = 0;
    for (const file of fileArr) {
      setCurrentFile(file.name);
      setStatusMsg(`מעבד ${done + 1}/${fileArr.length}...`);
      try { await processFile(file); done++; }
      catch { errors++; }
      setBulkProgress({ done: done + errors, total: fileArr.length, errors });
    }
    setUploading(false);
    toast.success(`עיבוד בצובר הושלם: ${done} מסמכים${errors > 0 ? `, ${errors} שגיאות` : ""}`);
    setBulkProgress(null);
    setCurrentFile(""); setStatusMsg("");
    onDocumentCreated?.();
  }, [processFile, onDocumentCreated]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const files = e.dataTransfer?.files;
    if (files?.length) processBulk(files);
  }, [processBulk]);

  const handleFileInput = useCallback((e) => {
    const files = e.target.files;
    if (files?.length) processBulk(files);
  }, [processBulk]);

  return (
    <>
    {showCreditsPopup && (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "#111114", border: "1px solid rgba(255,171,0,0.3)", borderRadius: 20, padding: 32, maxWidth: 380, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚡</div>
          <h3 style={{ color: "#FFAB00", fontWeight: 900, fontSize: 20, marginBottom: 10 }}>נגמרו קרדיטי ה-AI</h3>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>על מנת להמשיך לעבד מסמכים עם OCR, יש לרכוש קרדיטי AI נוספים.</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <a href="/ai-credits" style={{ padding: "11px 24px", borderRadius: 12, background: "linear-gradient(135deg, #D4AF37, #FFAB00)", color: "#0A0A0A", fontWeight: 800, fontSize: 14, textDecoration: "none" }}>רכוש קרדיטים</a>
            <button onClick={() => setShowCreditsPopup(false)} style={{ padding: "11px 20px", borderRadius: 12, background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)", fontSize: 14, cursor: "pointer" }}>סגור</button>
          </div>
        </div>
      </div>
    )}
    {cameraOpen && (
      <CameraCapture
        onCapture={(file) => processFile(file)}
        onClose={() => setCameraOpen(false)}
      />
    )}
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "glass-card p-8 border-2 border-dashed transition-all cursor-pointer text-center",
        dragging ? "border-primary bg-primary/5" : "border-border/30 hover:border-primary/30",
        uploading && "pointer-events-none opacity-60"
      )}
      onClick={() => !uploading && document.getElementById("file-upload-input").click()}
    >
      <input
        id="file-upload-input"
        type="file"
        accept="image/*,.pdf"
        multiple
        className="hidden"
        onChange={handleFileInput}
      />
      {uploading ? (
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-neon-purple animate-spin" />
          <p className="text-sm text-neon-purple font-medium">{statusMsg || "מעבד..."}</p>
          {currentFile && (
            <p className="text-xs px-3 py-1 rounded-full" style={{ background: "rgba(179,136,255,0.1)", color: "rgba(179,136,255,0.8)", border: "1px solid rgba(179,136,255,0.2)" }}>
              📄 {currentFile}
            </p>
          )}
          {bulkProgress && (
            <div style={{ width: "100%", maxWidth: 260 }}>
              <div style={{ height: 4, borderRadius: 4, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 4, background: "#B388FF", width: `${(bulkProgress.done / bulkProgress.total) * 100}%`, transition: "width 0.4s" }} />
              </div>
              <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                {bulkProgress.done}/{bulkProgress.total} קבצים
                {bulkProgress.errors > 0 && <span style={{ color: "#ff6b6b" }}> · {bulkProgress.errors} שגיאות</span>}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Upload className="w-6 h-6 text-primary" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <p className="text-sm text-foreground font-medium">גרור קבצים לכאן — חשבוניות, קבלות</p>
              <span
                title="OCR בצובר: ניתן לגרור או לבחור מספר קבצים בו-זמנית (עד 50). AI יחלץ אוטומטית את כל הנתונים מכל קובץ ויוסיף אותם למסד הנתונים."
                onClick={e => e.stopPropagation()}
                style={{ cursor: "help", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 16, height: 16, borderRadius: "50%", background: "rgba(179,136,255,0.12)", border: "1px solid rgba(179,136,255,0.3)", color: "#B388FF", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>?</span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">PDF, PNG, JPG • קובץ אחד או מספר קבצים בו-זמנית</p>
          </div>
          {/* Camera button */}
          <button
            onClick={(e) => { e.stopPropagation(); setCameraOpen(true); }}
            style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", borderRadius: 12, background: "rgba(0,229,255,0.08)", border: "1px solid rgba(0,229,255,0.2)", color: "#00E5FF", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
          >
            <Camera size={14} /> צלם חשבונית ישירות
          </button>
        </div>
      )}
    </div>
    </>
  );
}
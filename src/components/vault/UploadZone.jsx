import { useCallback, useState } from "react";
import { Upload, FileText, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function UploadZone({ onDocumentCreated }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentFile, setCurrentFile] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  const processFile = useCallback(async (file) => {
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

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleFileInput = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  return (
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
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Upload className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-foreground font-medium">גרור לכאן חשבונית או קבלה</p>
            <p className="text-xs text-muted-foreground mt-0.5">PDF, PNG, JPG • עד 10MB</p>
          </div>
        </div>
      )}
    </div>
  );
}
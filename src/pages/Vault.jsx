import { useEffect, useState, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import UploadZone from "../components/vault/UploadZone";
import DocumentTable from "../components/vault/DocumentTable";

export default function Vault() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDocuments = useCallback(async () => {
    try {
      const docs = await base44.entities.Document.list("-created_date", 100);
      setDocuments(docs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">הכספת</h1>
        <p className="text-sm text-muted-foreground mt-1">העלה מסמכים וה-AI יעשה את השאר</p>
      </div>

      <UploadZone onDocumentCreated={loadDocuments} />
      <DocumentTable documents={documents} />
    </div>
  );
}
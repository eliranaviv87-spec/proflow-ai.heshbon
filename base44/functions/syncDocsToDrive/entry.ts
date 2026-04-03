import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const accessToken = await base44.asServiceRole.connectors.getCurrentAppUserAccessToken("ProFlow Google Drive");

    // Create ProFlow folder if not exists
    const folderRes = await fetch(
      "https://www.googleapis.com/drive/v3/files?q=name='ProFlow AI' and mimeType='application/vnd.google-apps.folder'&fields=files(id,name)",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const folderData = await folderRes.json();
    let folderId = folderData.files?.[0]?.id;

    if (!folderId) {
      const createRes = await fetch("https://www.googleapis.com/drive/v3/files", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ name: "ProFlow AI", mimeType: "application/vnd.google-apps.folder" }),
      });
      const created = await createRes.json();
      folderId = created.id;
    }

    // Get all documents
    const docs = await base44.entities.Document.list("-created_date", 100);
    const synced = [];

    for (const doc of docs) {
      if (!doc.file_url || !doc.supplier_name) continue;
      // Create a metadata file in Drive
      const metadata = {
        name: `${doc.supplier_name || 'מסמך'}_${doc.doc_number || doc.id.slice(0, 6)}.json`,
        parents: [folderId],
        mimeType: "application/json",
      };
      const fileContent = JSON.stringify({
        supplier: doc.supplier_name,
        amount: doc.total_amount,
        vat: doc.vat_amount,
        date: doc.date_issued,
        category: doc.ai_category,
        status: doc.status,
        file_url: doc.file_url,
      }, null, 2);

      const form = new FormData();
      form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
      form.append("file", new Blob([fileContent], { type: "application/json" }));

      await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: form,
      });
      synced.push(doc.id);
    }

    await base44.entities.AuditLog.create({
      action: `סנכרון Google Drive: ${synced.length} מסמכים`,
      entity_type: "Document",
      entity_id: "bulk",
    });

    return Response.json({ success: true, synced: synced.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
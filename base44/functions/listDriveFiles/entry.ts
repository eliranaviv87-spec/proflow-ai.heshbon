import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const accessToken = await base44.asServiceRole.connectors.getCurrentAppUserAccessToken("ProFlow Google Drive");

    // List files in Drive (proflow folder or recent)
    const res = await fetch(
      "https://www.googleapis.com/drive/v3/files?pageSize=20&orderBy=modifiedTime+desc&fields=files(id,name,mimeType,webViewLink,modifiedTime)",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const data = await res.json();
    return Response.json({ files: data.files || [] });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
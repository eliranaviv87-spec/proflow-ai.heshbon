import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

/**
 * GreenAPI Webhook Receiver
 * Maps sender_number → User (via whatsapp_phone) → Org
 * If message has image/PDF → saves to Document → triggers AI OCR
 * Sends feedback message back via GreenAPI
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const messageData = body?.body?.messageData;
    const senderData = body?.body?.senderData;
    if (!senderData) return Response.json({ ok: true });

    const senderPhone = senderData.sender?.replace("@c.us", "") || senderData.chatId?.replace("@c.us", "");
    if (!senderPhone) return Response.json({ ok: true });

    // Find user by whatsapp_phone
    const users = await base44.asServiceRole.entities.User.filter({ whatsapp_phone: senderPhone });
    const user = users[0];
    if (!user) {
      console.log(`Unknown sender: ${senderPhone}`);
      return Response.json({ ok: true });
    }

    const instanceId = user.whatsapp_instance_id;
    const apiToken = user.whatsapp_api_token;
    if (!instanceId || !apiToken) return Response.json({ ok: true });

    const typeMessage = messageData?.typeMessage;
    const isMedia = ["imageMessage", "documentMessage", "extendedTextMessage"].includes(typeMessage);

    if (isMedia) {
      // Download media
      const downloadRes = await fetch(`https://api.green-api.com/waInstance${instanceId}/downloadFile/${apiToken}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId: senderData.chatId, idMessage: body.body.idMessage }),
      });
      const mediaData = await downloadRes.json();
      const fileUrl = mediaData?.downloadUrl || null;

      // Save to Document entity
      if (fileUrl) {
        await base44.asServiceRole.entities.Document.create({
          file_url: fileUrl,
          status: "Processing",
          org_id: user.id,
          supplier_name: senderPhone,
          doc_type: "expense",
        });
      }

      // Send feedback via GreenAPI
      await fetch(`https://api.green-api.com/waInstance${instanceId}/sendMessage/${apiToken}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId: senderData.chatId,
          message: "✅ התקבל! החשבונית בעיבוד ותופיע בדאשבורד תוך שניות.",
        }),
      });

      console.log(`Saved document from ${senderPhone} for user ${user.id}`);
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Webhook error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
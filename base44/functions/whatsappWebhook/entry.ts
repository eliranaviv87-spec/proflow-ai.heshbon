import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

// WhatsApp Webhook - receives messages from WhatsApp Business API
// Compatible with: Twilio, 360Dialog, Meta Cloud API
Deno.serve(async (req) => {
  // Handle GET verification (Meta webhook verification)
  if (req.method === "GET") {
    const url = new URL(req.url);
    const challenge = url.searchParams.get("hub.challenge");
    const verifyToken = url.searchParams.get("hub.verify_token");
    if (verifyToken === "proflow_verify_2026" || challenge) {
      return new Response(challenge, { status: 200 });
    }
    return new Response("Forbidden", { status: 403 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    // Support Meta Cloud API format
    const entry = body.entry?.[0]?.changes?.[0]?.value;
    const messages = entry?.messages || [];
    // Support Twilio format
    const twilioMedia = body.MediaUrl0;

    let fileUrl = null;
    let senderPhone = null;
    let messageText = null;

    if (messages.length > 0) {
      const msg = messages[0];
      senderPhone = msg.from;
      if (msg.type === "image" || msg.type === "document") {
        const mediaId = msg.image?.id || msg.document?.id;
        fileUrl = `https://graph.facebook.com/v18.0/${mediaId}`;
      } else if (msg.type === "text") {
        messageText = msg.text?.body;
      }
    } else if (twilioMedia) {
      fileUrl = twilioMedia;
      senderPhone = body.From?.replace("whatsapp:", "");
    }

    if (!fileUrl && !messageText) {
      return Response.json({ status: "no_action" });
    }

    if (fileUrl) {
      // Create document record
      const doc = await base44.asServiceRole.entities.Document.create({
        file_url: fileUrl,
        status: "Processing",
      });

      // Run AI OCR
      const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: `אתה AI פיננסי. חלץ נתונים מהחשבונית. החזר JSON בלבד: {"vendor_name":"","invoice_number":"","date_issued":"YYYY-MM-DD","total_amount":0,"vat_amount":0,"net_amount":0,"category_tag":"","doc_type":"income|expense"}`,
        file_urls: [fileUrl],
        response_json_schema: {
          type: "object",
          properties: {
            vendor_name: { type: "string" },
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

      const mathOk = Math.abs((result.net_amount + result.vat_amount) - result.total_amount) < 1;
      const status = mathOk ? "Verified" : "Pending_Review";

      await base44.asServiceRole.entities.Document.update(doc.id, {
        supplier_name: result.vendor_name,
        doc_number: result.invoice_number,
        date_issued: result.date_issued,
        total_amount: result.total_amount,
        vat_amount: result.vat_amount,
        net_amount: result.net_amount,
        ai_category: result.category_tag,
        doc_type: result.doc_type || "expense",
        confidence_score: mathOk ? 0.97 : 0.75,
        status,
      });

      await base44.asServiceRole.entities.AuditLog.create({
        action: `WhatsApp OCR: ${result.vendor_name} — ₪${result.total_amount}`,
        entity_type: "Document",
        entity_id: doc.id,
      });

      // Auto-match with bank transactions
      if (result.total_amount && result.date_issued) {
        const txs = await base44.asServiceRole.entities.BankTransaction.list("-date", 100);
        const docDate = new Date(result.date_issued);
        const match = txs.find((tx) => {
          if (tx.match_status) return false;
          const diff = Math.abs(new Date(tx.date) - docDate) / 86400000;
          return Math.abs(tx.amount) === result.total_amount && diff <= 5;
        });
        if (match) {
          await base44.asServiceRole.entities.BankTransaction.update(match.id, { linked_doc_id: doc.id, match_status: true });
          await base44.asServiceRole.entities.Document.update(doc.id, { status: "Archived" });
        }
      }

      // Auto-reply message (return for WhatsApp API to send)
      const replyText = `✅ קלטתי! הוצאה של ₪${result.total_amount || "—"} מ-${result.vendor_name || "ספק לא ידוע"} עודכנה בדאשבורד. סטטוס: ${status === "Verified" ? "מאומת 🟢" : "ממתין לבדיקה 🟡"}`;

      return Response.json({
        success: true,
        doc_id: doc.id,
        extracted: result,
        reply: replyText,
      });
    }

    return Response.json({ success: true, message: "text_received", text: messageText });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
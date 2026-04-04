import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { ambassador_id, amount } = body;

    if (!ambassador_id || !amount || amount <= 0) {
      return Response.json({ error: 'ambassador_id and positive amount are required' }, { status: 400 });
    }

    // Verify minimum payout threshold
    if (amount < 500) {
      return Response.json({ error: 'Minimum payout amount is ₪500' }, { status: 400 });
    }

    // Get ambassador to verify ownership
    const apps = await base44.asServiceRole.entities.AmbassadorApplication.filter({ id: ambassador_id });
    if (!apps || apps.length === 0) {
      return Response.json({ error: 'Ambassador not found' }, { status: 404 });
    }
    const ambassador = apps[0];

    // Security: verify the requesting user owns this ambassador record
    if (ambassador.email !== user.email && user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (ambassador.status !== 'active') {
      return Response.json({ error: 'Ambassador account is not active' }, { status: 400 });
    }

    // Create payout request
    const payoutRequest = await base44.asServiceRole.entities.PayoutRequest.create({
      ambassador_id,
      ambassador_email: ambassador.email,
      amount,
      status: 'pending',
      request_date: new Date().toISOString(),
      payment_method: 'bank_transfer',
    });

    // Zero out pending payout on ambassador record
    await base44.asServiceRole.entities.AmbassadorApplication.update(ambassador_id, {
      pending_payout: 0,
    });

    // Notify admin via email
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: 'admin@proflow.ai',
      from_name: 'ProFlow AI — מערכת',
      subject: `💰 בקשת תשלום חדשה — ${ambassador.full_name} — ₪${amount}`,
      body: `
בקשת תשלום חדשה מהשגריר:

שם: ${ambassador.full_name}
אימייל: ${ambassador.email}
סכום: ₪${amount}
מסלול: ${ambassador.track === 'elite' ? 'Elite (50%)' : 'Casual Partner (40%)'}
מזהה בקשה: ${payoutRequest.id}

לאישור הבקשה, גש ללוח הניהול.
      `.trim(),
    });

    // Notify ambassador
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: ambassador.email,
      from_name: 'ProFlow AI',
      subject: `✅ בקשת תשלום התקבלה — ₪${amount}`,
      body: `
שלום ${ambassador.full_name},

בקשת התשלום שלך על סך ₪${amount} התקבלה ועוברת לאישור.

⏱️ זמן עיבוד: עד 5 ימי עסקים
💳 אמצעי תשלום: העברה בנקאית

לעקוב אחר הסטטוס: https://app.proflow.ai/ambassador-dashboard

תודה,
צוות ProFlow AI
      `.trim(),
    });

    // Audit log
    await base44.asServiceRole.entities.AuditLog.create({
      action: 'PAYOUT_REQUESTED',
      entity_type: 'PayoutRequest',
      entity_id: payoutRequest.id,
      details: `Payout request: ${ambassador.email} requested ₪${amount}`,
    });

    return Response.json({ success: true, payout_request_id: payoutRequest.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
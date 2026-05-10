import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Rate limiter: max 3 payout requests per hour per user
const rateLimitMap = new Map();
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 60 * 60 * 1000;

function checkRateLimit(key) {
  const now = Date.now();
  const entry = rateLimitMap.get(key) || { count: 0, resetAt: now + RATE_WINDOW_MS };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + RATE_WINDOW_MS;
  }
  entry.count++;
  rateLimitMap.set(key, entry);
  return { allowed: entry.count <= RATE_LIMIT };
}

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limit: 3 requests/hour per user
    const rl = checkRateLimit(`payout:${user.email}`);
    if (!rl.allowed) {
      await base44.asServiceRole.entities.AuditLog.create({
        action: 'rate_limit_exceeded',
        entity_type: 'Security',
        entity_id: user.email,
        details: `Rate limit exceeded on requestPayout by ${user.email}`,
      });
      return Response.json({ error: 'Too many payout requests. Try again later.' }, {
        status: 429,
        headers: { 'Retry-After': '3600' }
      });
    }

    const body = await req.json();
    const { ambassador_id, amount } = body;

    // Input validation
    if (!ambassador_id || typeof ambassador_id !== 'string') {
      return Response.json({ error: 'ambassador_id is required' }, { status: 400 });
    }
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return Response.json({ error: 'positive amount is required' }, { status: 400 });
    }
    if (amount > 100000) {
      return Response.json({ error: 'Amount exceeds maximum allowed' }, { status: 400 });
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

    // RBAC: only the owner or admin can request payout
    if (ambassador.email !== user.email && user.role !== 'admin') {
      await base44.asServiceRole.entities.AuditLog.create({
        action: 'unauthorized_payout_attempt',
        entity_type: 'Security',
        entity_id: user.email,
        details: `User ${user.email} attempted payout for ambassador ${ambassador.email}`,
      });
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (ambassador.status !== 'active') {
      return Response.json({ error: 'Ambassador account is not active' }, { status: 400 });
    }

    // Verify requested amount doesn't exceed pending_payout
    if (amount > (ambassador.pending_payout || 0)) {
      return Response.json({ error: 'Requested amount exceeds available pending payout' }, { status: 400 });
    }

    // Check no pending payout request already exists
    const existingRequests = await base44.asServiceRole.entities.PayoutRequest.filter({
      ambassador_id,
      status: 'pending',
    });
    if (existingRequests && existingRequests.length > 0) {
      return Response.json({ error: 'A pending payout request already exists' }, { status: 409 });
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

    // Notify admin
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: 'admin@proflow.ai',
      from_name: 'ProFlow AI — מערכת',
      subject: `💰 בקשת תשלום חדשה — ${ambassador.full_name} — ₪${amount}`,
      body: `בקשת תשלום חדשה מהשגריר:\n\nשם: ${ambassador.full_name}\nאימייל: ${ambassador.email}\nסכום: ₪${amount}\nמסלול: ${ambassador.track === 'elite' ? 'Elite (50%)' : 'Casual Partner (40%)'}\nמזהה בקשה: ${payoutRequest.id}\n\nלאישור הבקשה, גש ללוח הניהול.`,
    });

    // Notify ambassador
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: ambassador.email,
      from_name: 'ProFlow AI',
      subject: `✅ בקשת תשלום התקבלה — ₪${amount}`,
      body: `שלום ${ambassador.full_name},\n\nבקשת התשלום שלך על סך ₪${amount} התקבלה ועוברת לאישור.\n\n⏱️ זמן עיבוד: עד 5 ימי עסקים\n💳 אמצעי תשלום: העברה בנקאית\n\nלעקוב אחר הסטטוס: https://app.proflow.ai/ambassador-dashboard\n\nתודה,\nצוות ProFlow AI`,
    });

    // Audit log
    await base44.asServiceRole.entities.AuditLog.create({
      action: 'PAYOUT_REQUESTED',
      entity_type: 'PayoutRequest',
      entity_id: payoutRequest.id,
      details: `Payout request: ${ambassador.email} requested ₪${amount}. Initiated by: ${user.email}`,
    });

    return Response.json({ success: true, payout_request_id: payoutRequest.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
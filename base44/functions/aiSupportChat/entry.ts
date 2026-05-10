import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const FAQ_KNOWLEDGE_BASE = `
ProFlow AI - ידע תמיכה:

שאלות נפוצות:
- איך מעלים חשבונית? עבור לכרטיסיית "מרכז מסמכים" ← גרור קובץ. ה-AI מעבד אוטומטית.
- איך מחברים WhatsApp? עבור ל"חיבור WhatsApp" ← הזן Instance ID ו-API Token מ-green-api.com ← סרוק QR.
- איך מייצאים PCN874? עבור ל"דוחות מס" ← לחץ "צור דוח" ← הורד PCN874.
- מה ה-OCR? אנו משתמשים ב-AI Vision שמחלץ נתונים מחשבוניות בדיוק 99.7%.
- איך מחברים לבנק? כרגע אנו תומכים בייבוא ידני ב"בנקאות". אוטומציה בנקאית בקרוב.
- מה עלויות החיבור? Starter ₪149/חודש, Pro ₪299/חודש, Enterprise ₪999/חודש.
- איך מבטלים מנוי? צור קשר עם התמיכה. ביטול אפשרי בכל עת ללא קנס.
- האם המידע שלי מאובטח? כן. AES-256, הצפנה מקצה לקצה, בידוד ארגוני מלא.
- מה PCN874? דוח מע"מ תקני לרשות המסים ישראל. המערכת מייצרת אותו אוטומטית.
- איך מחשבים מקדמות מס הכנסה? בהגדרות הזן את שיעור המקדמות שלך, המערכת מחשבת מההכנסות.
`;

// In-memory rate limiter
const rateLimitMap = new Map();
const RATE_LIMIT = 10; // 10 AI messages per minute per user
const RATE_WINDOW_MS = 60 * 1000;

function checkRateLimit(key) {
  const now = Date.now();
  const entry = rateLimitMap.get(key) || { count: 0, resetAt: now + RATE_WINDOW_MS };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + RATE_WINDOW_MS;
  }
  entry.count++;
  rateLimitMap.set(key, entry);
  return { allowed: entry.count <= RATE_LIMIT, remaining: Math.max(0, RATE_LIMIT - entry.count) };
}

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    // Rate limit: 10 requests/minute per user
    const rl = checkRateLimit(`chat:${user.email}`);
    if (!rl.allowed) {
      return Response.json({ error: 'יותר מדי הודעות. נסה שוב בעוד דקה.' }, {
        status: 429,
        headers: { 'Retry-After': '60' }
      });
    }

    const { message, history = [] } = await req.json();

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return Response.json({ error: 'Message is required' }, { status: 400 });
    }

    // Sanitize: cap message length
    const safeMessage = message.slice(0, 1000);
    const safeHistory = history.slice(-6);

    const conversationContext = safeHistory.map(m =>
      `${m.role === 'user' ? 'משתמש' : 'תמיכה'}: ${m.content}`
    ).join('\n');

    const prompt = `אתה סוכן תמיכה של ProFlow AI. ענה בעברית בלבד, בצורה קצרה וידידותית.

בסיס הידע שלך:
${FAQ_KNOWLEDGE_BASE}

היסטוריית שיחה:
${conversationContext}

שאלת המשתמש: ${safeMessage}

אם אינך יכול לפתור את הבעיה מבסיס הידע, ענה בדיוק: "ESCALATE: [תיאור קצר של הבעיה]"
אחרת ענה ישירות.`;

    const aiResponse = await base44.integrations.Core.InvokeLLM({ prompt });

    const shouldEscalate = typeof aiResponse === 'string' && aiResponse.startsWith("ESCALATE:");
    let ticketId = null;

    if (shouldEscalate) {
      const slaDeadline = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
      const ticket = await base44.entities.SupportTicket.create({
        user_email: user.email,
        user_name: user.full_name,
        subject: safeMessage.slice(0, 100),
        message: safeMessage,
        status: "Open",
        priority: "Medium",
        sla_deadline: slaDeadline,
        chat_history: JSON.stringify([...safeHistory, { role: 'user', content: safeMessage }]),
      });
      ticketId = ticket.id;

      // Audit log escalation
      await base44.asServiceRole.entities.AuditLog.create({
        action: 'support_escalated',
        entity_type: 'SupportTicket',
        entity_id: ticket.id,
        details: `Support escalated for user ${user.email}: ${safeMessage.slice(0, 200)}`,
      });
    }

    return Response.json({
      reply: shouldEscalate
        ? "העברתי את פנייתך לצוות התמיכה שלנו 🎫 נחזור אליך תוך 48 שעות. מספר פנייה: #" + (ticketId || 'N/A')
        : aiResponse,
      escalated: shouldEscalate,
      ticketId,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
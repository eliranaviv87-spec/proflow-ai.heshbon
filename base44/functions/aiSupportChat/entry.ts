import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

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

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { message, history = [] } = await req.json();

    const conversationContext = history.slice(-6).map(m =>
      `${m.role === 'user' ? 'משתמש' : 'תמיכה'}: ${m.content}`
    ).join('\n');

    const prompt = `אתה סוכן תמיכה של ProFlow AI. ענה בעברית בלבד, בצורה קצרה וידידותית.

בסיס הידע שלך:
${FAQ_KNOWLEDGE_BASE}

היסטוריית שיחה:
${conversationContext}

שאלת המשתמש: ${message}

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
        subject: message.slice(0, 100),
        message,
        status: "Open",
        priority: "Medium",
        sla_deadline: slaDeadline,
        chat_history: JSON.stringify([...history, { role: 'user', content: message }]),
      });
      ticketId = ticket.id;
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
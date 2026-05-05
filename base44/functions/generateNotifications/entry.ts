import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const [docs, txs] = await Promise.all([
      base44.entities.Document.list('-created_date', 200),
      base44.entities.BankTransaction.list('-date', 100),
    ]);

    const notifications = [];
    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7);

    // 1. Pending documents alert
    const pending = docs.filter(d => d.status === 'Pending_Review');
    if (pending.length > 0) {
      notifications.push({
        type: 'document_pending',
        title: `${pending.length} מסמכים ממתינים לאישור`,
        message: `יש לך ${pending.length} מסמכים שדורשים בדיקה ידנית לפני הגשה לרשויות המס.`,
        severity: pending.length > 5 ? 'warning' : 'info',
        action_url: '/vault',
      });
    }

    // 2. VAT deadline (every 2nd of month)
    const dayOfMonth = now.getDate();
    if (dayOfMonth >= 1 && dayOfMonth <= 5) {
      const monthIncome = docs
        .filter(d => (d.date_issued || '').startsWith(currentMonth) && d.doc_type === 'income')
        .reduce((s, d) => s + (d.total_amount || 0), 0);
      const vatDue = Math.round(monthIncome * 0.17);
      if (vatDue > 0) {
        notifications.push({
          type: 'vat_reminder',
          title: '⏰ תזכורת: מועד הגשת מע"מ מתקרב',
          message: `המע"מ לתשלום עבור ${currentMonth} מוערך ב-₪${vatDue.toLocaleString('he-IL')}. יש להגיש עד ה-15 לחודש.`,
          severity: 'warning',
          action_url: '/tax-reports',
        });
      }
    }

    // 3. Unmatched transactions alert
    const unmatched = txs.filter(t => !t.match_status);
    if (unmatched.length >= 5) {
      notifications.push({
        type: 'reconciliation',
        title: `${unmatched.length} עסקאות לא מותאמות`,
        message: 'מצאנו עסקאות בנקאיות שלא הותאמו למסמכים. בדוק את הכספת לפרטים.',
        severity: 'warning',
        action_url: '/banking',
      });
    }

    // 4. Cashflow alert
    const totalBalance = txs.reduce((s, t) =>
      s + (t.tx_type === 'credit' ? (t.amount || 0) : -(t.amount || 0)), 0);
    if (totalBalance < 10000) {
      notifications.push({
        type: 'cashflow_alert',
        title: '⚠️ התראת תזרים מזומנים',
        message: `היתרה הנוכחית נמוכה (₪${totalBalance.toLocaleString('he-IL')}). מומלץ לבדוק את תחזית התזרים.`,
        severity: 'critical',
        action_url: '/smart-reports',
      });
    }

    // Save all new notifications
    const created = await Promise.all(
      notifications.map(n => base44.entities.Notification.create(n))
    );

    return Response.json({ created: created.length, notifications: created });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
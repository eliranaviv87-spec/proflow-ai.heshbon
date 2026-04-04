import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { subscription_id, customer_name, customer_email, plan_name } = body;

    if (!subscription_id) {
      return Response.json({ error: 'subscription_id is required' }, { status: 400 });
    }

    // Get subscription to find the ambassador
    const subs = await base44.asServiceRole.entities.Subscription.filter({ id: subscription_id });
    if (!subs || subs.length === 0) {
      return Response.json({ error: 'Subscription not found' }, { status: 404 });
    }
    const sub = subs[0];

    if (!sub.referred_by_ambassador_id) {
      return Response.json({ success: true, message: 'No ambassador for this subscription' });
    }

    // Get the ambassador
    const ambassadors = await base44.asServiceRole.entities.AmbassadorApplication.filter({ id: sub.referred_by_ambassador_id });
    if (!ambassadors || ambassadors.length === 0) {
      return Response.json({ error: 'Ambassador not found' }, { status: 404 });
    }
    const ambassador = ambassadors[0];

    // Calculate lost commission
    const isElite = ambassador.track === 'elite';
    const commissionRate = isElite ? 0.5 : 0.4;
    const lostCommission = (sub.monthly_price_ils || 0) * commissionRate;

    // Send churn alert email to ambassador
    const emailBody = `
⚠️ התראה דחופה — לקוח ביטל מנוי!

שלום ${ambassador.full_name},

הלקוח שלך ביטל את מנוי ה-ProFlow AI שלו:

👤 לקוח: ${customer_name || customer_email || 'לא ידוע'}
📧 אימייל: ${customer_email || sub.user_email || 'לא ידוע'}
📦 חבילה: ${plan_name || sub.plan_name || 'לא ידוע'}
💸 עמלה חודשית שאבדה: ₪${lostCommission.toFixed(0)}

🚨 פעל עכשיו!
התקשר ללקוח בהקדם האפשרי כדי להבין מדוע ביטל ולנסות לשמר אותו.
כל יום שעובר מקטין את הסיכוי להחזירו.

📞 הטיפים שלנו לשימור:
• הצע הנחה של 20% לחודש הבא
• שאל מה לא עבד ונסה לפתור את הבעיה
• הזכר את הערך שהם מאבדים

ללוח המחוונים שלך: https://app.proflow.ai/ambassador-dashboard

בהצלחה,
צוות ProFlow AI
    `.trim();

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: ambassador.email,
      from_name: 'ProFlow AI — התראת שימור',
      subject: `⚠️ התראה: הלקוח שלך ביטל — הפסד של ₪${lostCommission.toFixed(0)}/חודש`,
      body: emailBody,
    });

    // Create audit log
    await base44.asServiceRole.entities.AuditLog.create({
      action: 'CHURN_ALERT_SENT',
      entity_type: 'Subscription',
      entity_id: subscription_id,
      details: `Churn alert sent to ambassador ${ambassador.email} for customer ${customer_email}. Lost commission: ₪${lostCommission}`,
    });

    return Response.json({ success: true, message: 'Churn alert sent to ambassador', lostCommission });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
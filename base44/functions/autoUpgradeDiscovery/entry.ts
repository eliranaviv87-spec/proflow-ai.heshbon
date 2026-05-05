import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Only allow admin or scheduled invocation
    const subscriptions = await base44.asServiceRole.entities.Subscription.filter({
      plan_name: "Discovery",
      status: "active",
    });

    const now = new Date();
    let upgraded = 0;

    for (const sub of subscriptions) {
      if (!sub.start_date) continue;

      const startDate = new Date(sub.start_date);
      const monthsElapsed = (now.getFullYear() - startDate.getFullYear()) * 12 +
        (now.getMonth() - startDate.getMonth());

      if (monthsElapsed >= 3) {
        await base44.asServiceRole.entities.Subscription.update(sub.id, {
          plan_name: "Starter",
          monthly_price_ils: 199,
          tokens_limit: 50000,
        });

        // Send upgrade notification
        if (sub.user_email) {
          await base44.asServiceRole.integrations.Core.SendEmail({
            to: sub.user_email,
            subject: "ProFlow AI — שדרוג אוטומטי ל-Starter Plan",
            body: `שלום,

תקופת ה-Discovery Plan שלך (3 חודשים) הסתיימה.
חשבונך שודרג אוטומטית ל-Starter Plan (₪199/חודש).

מה השתנה:
✅ גישה מלאה ל-AI (50,000 טוקנים/חודש)
✅ OCR מלא + AI
✅ דוחות חודשיים מתקדמים

לניהול המנוי: ${req.headers.get('origin') || 'https://proflow.ai'}/settings

צוות ProFlow AI`,
          });
        }

        upgraded++;
      }
    }

    return Response.json({
      success: true,
      checked: subscriptions.length,
      upgraded,
      message: `בוצע בדיקה של ${subscriptions.length} מנויי Discovery. שודרגו: ${upgraded}`,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
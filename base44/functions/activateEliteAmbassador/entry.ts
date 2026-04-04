import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { ambassador_id } = body;

    if (!ambassador_id) {
      return Response.json({ error: 'ambassador_id is required' }, { status: 400 });
    }

    // Get ambassador application
    const apps = await base44.asServiceRole.entities.AmbassadorApplication.filter({ id: ambassador_id });
    if (!apps || apps.length === 0) {
      return Response.json({ error: 'Ambassador not found' }, { status: 404 });
    }
    const ambassador = apps[0];

    // Update status to active
    await base44.asServiceRole.entities.AmbassadorApplication.update(ambassador_id, {
      status: 'active',
      payment_authorized: true,
    });

    // Send welcome email
    const hasSalesExperience = ambassador.sales_experience === true ||
      (typeof ambassador.sales_description === 'string' && ambassador.sales_description.trim().length > 10);

    const eliteNote = hasSalesExperience
      ? `\n\n🔥 הודעה מיוחדת: אתה אחד מ-10 מובילי המכירות העילית שנבחרו להשקה זו. יש לך זכויות טלמרקטינג. מקצועיות היא חובה מוחלטת. כל התנהגות בלתי הולמת תוביל לסיום מיידי של ההסכם ואובדן כל העמלות.`
      : '';

    const emailBody = `
שלום ${ambassador.full_name},

🎉 ברוך הבא לתוכנית שגרירי Elite של ProFlow AI!

הבקשה שלך אושרה. קישור ההפניה הייחודי שלך:
https://app.proflow.ai/?ref=${ambassador.ref_code}

📊 פרטי העמלה שלך:
- עמלה: 50% חוזרת לכל חיי המנוי הפעיל
- סף תשלום מינימלי: ₪500
- תשלום: בתחילת כל חודש
${eliteNote}

⚠️ זכור: עמלות יוקפאו אם מנוי ה-₪299 שלך ייכשל. ודא שפרטי התשלום שלך מעודכנים.

לכניסה ללוח המחוונים שלך: https://app.proflow.ai/ambassador-dashboard

בהצלחה,
צוות ProFlow AI
    `.trim();

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: ambassador.email,
      from_name: 'ProFlow AI',
      subject: '🌟 ברוך הבא לתוכנית Elite — ProFlow AI',
      body: emailBody,
    });

    // Create audit log
    await base44.asServiceRole.entities.AuditLog.create({
      action: 'ELITE_AMBASSADOR_ACTIVATED',
      entity_type: 'AmbassadorApplication',
      entity_id: ambassador_id,
      details: `Elite ambassador activated: ${ambassador.email}. Sales experience: ${hasSalesExperience}`,
    });

    return Response.json({ success: true, message: 'Ambassador activated and welcome email sent' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
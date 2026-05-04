import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Token Usage Tracker
 * Called after every AI operation (OCR, LLM, analysis)
 * Updates tokens_consumed_this_month
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { user_email, tokens_used, operation_type, document_id } = await req.json();

    if (!user_email || !tokens_used || tokens_used <= 0) {
      return Response.json({ error: 'Missing user_email or valid tokens_used' }, { status: 400 });
    }

    // Get subscription
    const subs = await base44.asServiceRole.entities.Subscription.filter({
      user_email,
      status: 'active',
    });

    if (!subs || subs.length === 0) {
      return Response.json({ error: 'No active subscription' }, { status: 400 });
    }

    const subscription = subs[0];
    const newTotal = (subscription.tokens_consumed_this_month || 0) + tokens_used;

    // Update subscription
    await base44.asServiceRole.entities.Subscription.update(subscription.id, {
      tokens_consumed_this_month: newTotal,
    });

    // Log to audit
    await base44.asServiceRole.entities.AuditLog.create({
      action: 'TOKEN_CONSUMED',
      entity_type: 'Subscription',
      entity_id: subscription.id,
      details: `Operation: ${operation_type}, Tokens: ${tokens_used}, Document: ${document_id || 'N/A'}, Total: ${newTotal}/${subscription.tokens_limit}`,
    });

    return Response.json({
      success: true,
      tokensUsed: tokens_used,
      totalConsumed: newTotal,
      remaining: subscription.tokens_limit - newTotal,
    });
  } catch (error) {
    console.error('Token logging error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { user_email, tokens_used, operation_type, document_id } = await req.json();

    if (!user_email || !tokens_used || !operation_type) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get active subscription
    const subs = await base44.asServiceRole.entities.Subscription.filter({
      user_email,
      status: 'active',
    });

    if (!subs || subs.length === 0) {
      return Response.json({ error: 'No active subscription' }, { status: 404 });
    }

    const sub = subs[0];
    const newTotal = (sub.tokens_consumed_this_month || 0) + tokens_used;

    // Update subscription token consumption
    await base44.asServiceRole.entities.Subscription.update(sub.id, {
      tokens_consumed_this_month: newTotal,
    });

    // Log audit
    await base44.asServiceRole.entities.AuditLog.create({
      action: 'token_consumed',
      entity_type: 'Subscription',
      entity_id: sub.id,
      details: `${tokens_used} tokens used for ${operation_type}${document_id ? ` (doc: ${document_id})` : ''}. Total: ${newTotal}/${sub.tokens_limit || 'unlimited'}`,
    });

    return Response.json({
      success: true,
      tokens_used,
      total_consumed: newTotal,
      remaining: Math.max(0, (sub.tokens_limit || Infinity) - newTotal),
    });
  } catch (error) {
    console.error('Token logging error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
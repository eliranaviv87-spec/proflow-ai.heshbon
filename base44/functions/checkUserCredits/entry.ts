import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ allowed: false, reason: 'Not authenticated' }, { status: 401 });
    }

    // Get active subscription
    const subs = await base44.asServiceRole.entities.Subscription.filter({
      user_email: user.email,
      status: 'active',
    });

    if (!subs || subs.length === 0) {
      return Response.json({ allowed: false, reason: 'No active subscription' });
    }

    const sub = subs[0];
    const isDiscovery = sub.plan_name === 'Discovery';
    const discoveryExpired = isDiscovery && sub.discovery_expires_date && new Date(sub.discovery_expires_date) < new Date();

    // Check token limit
    if (sub.tokens_limit && sub.tokens_consumed_this_month >= sub.tokens_limit) {
      return Response.json({
        allowed: false,
        reason: `Reached monthly token limit (${sub.tokens_consumed_this_month}/${sub.tokens_limit})`,
      });
    }

    // Check Discovery expiration
    if (discoveryExpired) {
      return Response.json({ allowed: false, reason: 'Discovery trial expired' });
    }

    // Check AI credits if add-on is depleted
    if (sub.ai_credits_balance !== undefined && sub.ai_credits_balance < 0) {
      return Response.json({ allowed: false, reason: 'AI credits depleted' });
    }

    // All checks passed
    return Response.json({
      allowed: true,
      remaining_tokens: Math.max(0, (sub.tokens_limit || Infinity) - (sub.tokens_consumed_this_month || 0)),
      plan: sub.plan_name,
    });
  } catch (error) {
    console.error('Credit check error:', error.message);
    return Response.json({ allowed: false, reason: error.message }, { status: 500 });
  }
});
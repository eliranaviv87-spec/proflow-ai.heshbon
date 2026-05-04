import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * API Guard - Check if user has active subscription and credits
 * Called before: Document upload, AI processing, OCR
 * Returns: { allowed: boolean, reason?: string, subscription?: object }
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Get current user
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
      return Response.json({
        allowed: false,
        reason: 'No active subscription',
        nextStep: '/pricing',
      });
    }

    const subscription = subs[0];

    // Check token limit
    const tokensRemaining = subscription.tokens_limit - (subscription.tokens_consumed_this_month || 0);
    
    if (tokensRemaining <= 0) {
      return Response.json({
        allowed: false,
        reason: 'Token limit exceeded',
        tokensUsed: subscription.tokens_consumed_this_month,
        tokensLimit: subscription.tokens_limit,
        nextStep: '/ai-credits',
      });
    }

    // Check AI credits (if applicable)
    if (subscription.ai_credits_balance !== undefined && subscription.ai_credits_balance <= 0) {
      return Response.json({
        allowed: false,
        reason: 'No AI credits available',
        nextStep: '/ai-credits',
      });
    }

    // Allow with remaining tokens info
    return Response.json({
      allowed: true,
      subscription: {
        plan_name: subscription.plan_name,
        status: subscription.status,
        tokensRemaining,
        tokensLimit: subscription.tokens_limit,
        tokensUsed: subscription.tokens_consumed_this_month,
        aiCreditsBalance: subscription.ai_credits_balance || 0,
      },
    });
  } catch (error) {
    console.error('Credit check error:', error.message);
    return Response.json({ allowed: false, reason: error.message }, { status: 500 });
  }
});
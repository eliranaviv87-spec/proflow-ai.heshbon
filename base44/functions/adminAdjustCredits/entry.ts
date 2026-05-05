import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Admin: Manual credit/token adjustments
 * Allows admins to add/remove AI credits, reset token counters, change plans
 */
Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { 
      target_email, 
      action, 
      amount, 
      new_plan, 
      reason 
    } = await req.json();

    if (!target_email || !action) {
      return Response.json({ error: 'target_email and action are required' }, { status: 400 });
    }

    const VALID_ACTIONS = ['add_credits', 'remove_credits', 'reset_tokens', 'change_plan', 'extend_discovery'];
    if (!VALID_ACTIONS.includes(action)) {
      return Response.json({ error: `Invalid action. Must be one of: ${VALID_ACTIONS.join(', ')}` }, { status: 400 });
    }

    // Find target subscription
    const subs = await base44.asServiceRole.entities.Subscription.filter({
      user_email: target_email,
      status: 'active',
    });

    if (!subs || subs.length === 0) {
      return Response.json({ error: 'No active subscription found for this user' }, { status: 404 });
    }

    const sub = subs[0];
    let updateData = {};
    let actionDescription = '';

    const PLAN_TOKENS = { Discovery: 5000, Starter: 50000, Pro: 200000, Enterprise: 9999999 };

    switch (action) {
      case 'add_credits':
        if (!amount || amount <= 0) {
          return Response.json({ error: 'Amount must be positive for add_credits' }, { status: 400 });
        }
        const creditsExpiry = new Date();
        creditsExpiry.setMonth(creditsExpiry.getMonth() + 1);
        updateData = {
          ai_credits_balance: (sub.ai_credits_balance || 0) + amount,
          ai_credits_expiration_date: creditsExpiry.toISOString().split('T')[0],
        };
        actionDescription = `Added ${amount} AI credits to ${target_email}`;
        break;

      case 'remove_credits':
        if (!amount || amount <= 0) {
          return Response.json({ error: 'Amount must be positive for remove_credits' }, { status: 400 });
        }
        updateData = {
          ai_credits_balance: Math.max(0, (sub.ai_credits_balance || 0) - amount),
        };
        actionDescription = `Removed ${amount} AI credits from ${target_email}`;
        break;

      case 'reset_tokens':
        updateData = { tokens_consumed_this_month: 0 };
        actionDescription = `Reset monthly tokens for ${target_email}`;
        break;

      case 'change_plan':
        if (!new_plan || !PLAN_TOKENS[new_plan]) {
          return Response.json({ error: 'Invalid plan name' }, { status: 400 });
        }
        updateData = {
          plan_name: new_plan,
          tokens_limit: PLAN_TOKENS[new_plan],
          tokens_consumed_this_month: 0,
        };
        actionDescription = `Changed plan for ${target_email}: ${sub.plan_name} → ${new_plan}`;
        break;

      case 'extend_discovery':
        const newExpiry = new Date();
        newExpiry.setMonth(newExpiry.getMonth() + 3);
        updateData = {
          discovery_expires_date: newExpiry.toISOString().split('T')[0],
        };
        actionDescription = `Extended Discovery for ${target_email} by 3 months`;
        break;
    }

    await base44.asServiceRole.entities.Subscription.update(sub.id, updateData);

    // Send notification to user
    await base44.asServiceRole.entities.Notification.create({
      type: 'system',
      title: 'עדכון חשבון',
      message: `צוות ProFlow AI עדכן את חשבונך. ${reason || ''}`,
      severity: 'info',
    }).catch(() => {});

    // Audit log
    await base44.asServiceRole.entities.AuditLog.create({
      action: `admin_${action}`,
      entity_type: 'Subscription',
      entity_id: sub.id,
      details: `${actionDescription}. Admin: ${user.email}. Reason: ${reason || 'N/A'}`,
    });

    return Response.json({
      success: true,
      action,
      target: target_email,
      description: actionDescription,
      updated_subscription: { ...sub, ...updateData },
    }, { status: 200 });
  } catch (error) {
    console.error('Admin adjust error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
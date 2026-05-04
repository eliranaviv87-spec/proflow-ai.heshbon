import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@16.0.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'), {
  apiVersion: '2024-12-31.acacia',
});

const WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET');

/**
 * Stripe Webhook Handler
 * Processes: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted
 */
Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature || !WEBHOOK_SECRET) {
      return Response.json({ error: 'Missing signature or secret' }, { status: 401 });
    }

    // Verify signature
    let event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, WEBHOOK_SECRET);
    } catch (err) {
      return Response.json({ error: 'Signature verification failed' }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);

    // Handle checkout.session.completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userEmail = session.customer_email;
      const planName = session.metadata?.plan_name || 'Starter';
      const stripeSubscriptionId = session.subscription;

      if (!userEmail || !stripeSubscriptionId) {
        return Response.json({ error: 'Missing customer email or subscription ID' }, { status: 400 });
      }

      // Get subscription details from Stripe
      const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
      const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString().split('T')[0];

      // Find user's Subscription record
      const subs = await base44.asServiceRole.entities.Subscription.filter({ user_email: userEmail });
      
      if (subs && subs.length > 0) {
        // Update existing subscription
        await base44.asServiceRole.entities.Subscription.update(subs[0].id, {
          plan_name: planName,
          status: 'active',
          stripe_subscription_id: stripeSubscriptionId,
          start_date: new Date().toISOString().split('T')[0],
          end_date: currentPeriodEnd,
          billing_cycle: 'annual',
        });
      } else {
        // Create new subscription
        await base44.asServiceRole.entities.Subscription.create({
          user_email: userEmail,
          plan_name: planName,
          status: 'active',
          stripe_subscription_id: stripeSubscriptionId,
          start_date: new Date().toISOString().split('T')[0],
          end_date: currentPeriodEnd,
          billing_cycle: 'annual',
          tokens_limit: getTokenLimit(planName),
          tokens_consumed_this_month: 0,
        });
      }

      // Send confirmation email
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: userEmail,
        from_name: 'ProFlow AI',
        subject: `✅ ההרשמה אושרה — ${planName} Plan`,
        body: `שלום,\n\nברכות! ההרשמה שלך לחבילת ${planName} אושרה בהצלחה.\n\nכניסה לדשבורד: https://app.proflow.ai/dashboard\n\nבהצלחה,\nצוות ProFlow AI`,
      });

      // Audit log
      await base44.asServiceRole.entities.AuditLog.create({
        action: 'STRIPE_PAYMENT_COMPLETED',
        entity_type: 'Subscription',
        entity_id: stripeSubscriptionId,
        details: `Payment completed for ${userEmail}. Plan: ${planName}`,
      });
    }

    // Handle customer.subscription.updated
    if (event.type === 'customer.subscription.updated') {
      const subscription = event.data.object;
      const subs = await base44.asServiceRole.entities.Subscription.filter({
        stripe_subscription_id: subscription.id,
      });

      if (subs && subs.length > 0) {
        const status = subscription.status === 'active' ? 'active' : subscription.status === 'canceled' ? 'canceled' : 'past_due';
        await base44.asServiceRole.entities.Subscription.update(subs[0].id, { status });
      }
    }

    // Handle customer.subscription.deleted
    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;
      const subs = await base44.asServiceRole.entities.Subscription.filter({
        stripe_subscription_id: subscription.id,
      });

      if (subs && subs.length > 0) {
        await base44.asServiceRole.entities.Subscription.update(subs[0].id, { status: 'canceled' });
      }
    }

    return Response.json({ received: true, eventId: event.id });
  } catch (error) {
    console.error('Webhook error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function getTokenLimit(planName) {
  const limits = {
    Discovery: 0,
    Starter: 50000,
    Pro: 200000,
    Enterprise: 999999999,
  };
  return limits[planName] || 0;
}
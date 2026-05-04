import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@16.0.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

const PLAN_TOKENS = { Discovery: 0, Starter: 50000, Pro: 200000, Enterprise: Infinity };

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const signature = req.headers.get('stripe-signature');
    const body = await req.text();

    // Verify webhook signature
    const event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);

    if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated') {
      const subscription = event.data.object;
      const customerEmail = subscription.customer_email || subscription.customer;
      const planName = subscription.metadata?.plan_name || 'Starter';
      const startDate = new Date(subscription.current_period_start * 1000).toISOString().split('T')[0];
      const endDate = new Date(subscription.current_period_end * 1000).toISOString().split('T')[0];

      // Create/update Subscription record
      await base44.asServiceRole.entities.Subscription.create({
        user_email: customerEmail,
        plan_name: planName,
        stripe_subscription_id: subscription.id,
        status: 'active',
        billing_cycle: 'monthly',
        start_date: startDate,
        end_date: endDate,
        tokens_limit: PLAN_TOKENS[planName],
        tokens_consumed_this_month: 0,
        ai_credits_balance: 0,
      });

      // Log audit
      await base44.asServiceRole.entities.AuditLog.create({
        action: 'subscription_activated',
        entity_type: 'Subscription',
        entity_id: subscription.id,
        details: `Stripe subscription created for ${customerEmail} (${planName})`,
      });
    }

    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;
      const subs = await base44.asServiceRole.entities.Subscription.filter({ stripe_subscription_id: subscription.id });
      if (subs && subs.length > 0) {
        await base44.asServiceRole.entities.Subscription.update(subs[0].id, { status: 'canceled' });
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error.message);
    return Response.json({ error: error.message }, { status: 400 });
  }
});
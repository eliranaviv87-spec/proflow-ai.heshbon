import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@16.0.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

const PLAN_PRICE_IDS = {
  Discovery: Deno.env.get('STRIPE_PRICE_DISCOVERY') || 'price_discovery_monthly',
  Starter: Deno.env.get('STRIPE_PRICE_STARTER') || 'price_starter_monthly',
  Pro: Deno.env.get('STRIPE_PRICE_PRO') || 'price_pro_monthly',
  Enterprise: Deno.env.get('STRIPE_PRICE_ENTERPRISE') || 'price_enterprise_monthly',
};

const VALID_PLANS = ['Discovery', 'Starter', 'Pro', 'Enterprise'];

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { plan_name, user_email, billing_cycle = 'monthly' } = await req.json();

    // Validate inputs
    if (!plan_name || !user_email) {
      return Response.json({ error: 'Missing plan_name or user_email' }, { status: 400 });
    }

    if (!VALID_PLANS.includes(plan_name)) {
      return Response.json({ error: `Invalid plan_name. Must be one of: ${VALID_PLANS.join(', ')}` }, { status: 400 });
    }

    // Verify email matches authenticated user (prevent impersonation)
    if (user.email !== user_email) {
      return Response.json({ error: 'Email mismatch' }, { status: 403 });
    }

    // Check if already subscribed
    const existingSubs = await base44.asServiceRole.entities.Subscription.filter({
      user_email,
      status: 'active',
    });

    const priceId = PLAN_PRICE_IDS[plan_name];

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: user_email,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: `${req.headers.get('origin') || 'https://proflow.ai'}/dashboard?session_id={CHECKOUT_SESSION_ID}&plan=${plan_name}`,
      cancel_url: `${req.headers.get('origin') || 'https://proflow.ai'}/checkout?plan=${plan_name}`,
      metadata: {
        plan_name,
        user_email,
        billing_cycle,
        existing_sub_id: existingSubs[0]?.id || '',
      },
      subscription_data: {
        metadata: { plan_name, user_email },
      },
    });

    // Audit log
    await base44.asServiceRole.entities.AuditLog.create({
      action: 'checkout_session_created',
      entity_type: 'Subscription',
      entity_id: session.id,
      details: `Checkout initiated for ${user_email} (${plan_name})`,
    });

    return Response.json({ checkout_url: session.url, session_id: session.id }, { status: 200 });
  } catch (error) {
    console.error('Checkout session error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
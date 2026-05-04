import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@16.0.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

const PLAN_PRICES = {
  Discovery: 'price_discovery_monthly',
  Starter: 'price_starter_monthly',
  Pro: 'price_pro_monthly',
  Enterprise: 'price_enterprise_monthly',
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { plan_name, user_email } = await req.json();

    if (!plan_name || !user_email) {
      return Response.json({ error: 'Missing plan_name or user_email' }, { status: 400 });
    }

    const priceId = PLAN_PRICES[plan_name];
    if (!priceId) {
      return Response.json({ error: 'Invalid plan_name' }, { status: 400 });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: user_email,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: 'https://app.proflow.ai/dashboard?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://app.proflow.ai/checkout?plan=' + plan_name,
      metadata: {
        plan_name,
        user_email,
      },
    });

    return Response.json({ checkout_url: session.url });
  } catch (error) {
    console.error('Checkout session error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
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

// Rate limiter: max 5 checkout attempts per 10 minutes per user
const rateLimitMap = new Map();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

function checkRateLimit(key) {
  const now = Date.now();
  const entry = rateLimitMap.get(key) || { count: 0, resetAt: now + RATE_WINDOW_MS };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + RATE_WINDOW_MS;
  }
  entry.count++;
  rateLimitMap.set(key, entry);
  return { allowed: entry.count <= RATE_LIMIT };
}

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

    // Rate limit
    const rl = checkRateLimit(`checkout:${user.email}`);
    if (!rl.allowed) {
      await base44.asServiceRole.entities.AuditLog.create({
        action: 'rate_limit_exceeded',
        entity_type: 'Security',
        entity_id: user.email,
        details: `Checkout rate limit exceeded by ${user.email}`,
      });
      return Response.json({ error: 'Too many checkout attempts. Please wait before trying again.' }, {
        status: 429,
        headers: { 'Retry-After': '600' }
      });
    }

    const { plan_name, user_email, billing_cycle = 'monthly' } = await req.json();

    // Input validation
    if (!plan_name || !user_email) {
      return Response.json({ error: 'Missing plan_name or user_email' }, { status: 400 });
    }
    if (!VALID_PLANS.includes(plan_name)) {
      return Response.json({ error: `Invalid plan_name. Must be one of: ${VALID_PLANS.join(', ')}` }, { status: 400 });
    }

    // RBAC: email must match authenticated user — prevent impersonation
    if (user.email !== user_email) {
      await base44.asServiceRole.entities.AuditLog.create({
        action: 'impersonation_attempt',
        entity_type: 'Security',
        entity_id: user.email,
        details: `User ${user.email} attempted checkout for ${user_email}`,
      });
      return Response.json({ error: 'Email mismatch' }, { status: 403 });
    }

    // Check if already subscribed
    const existingSubs = await base44.asServiceRole.entities.Subscription.filter({
      user_email,
      status: 'active',
    });

    const priceId = PLAN_PRICE_IDS[plan_name];
    const origin = req.headers.get('origin') || 'https://proflow.ai';

    const session = await stripe.checkout.sessions.create({
      customer_email: user_email,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}&plan=${plan_name}`,
      cancel_url: `${origin}/checkout?plan=${plan_name}`,
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
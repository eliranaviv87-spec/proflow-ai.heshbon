import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

// Returns current user's active subscription and plan limits
export function useSubscription() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me().then(async (user) => {
      if (!user) { setLoading(false); return; }
      const subs = await base44.entities.Subscription.filter({ user_email: user.email, status: "active" });
      setSubscription(subs[0] || null);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const plan = subscription?.plan_name || "Discovery";

  const limits = {
    Discovery: { ai: false, tokens: 0, docs: 20, whatsapp: false },
    Starter:   { ai: true,  tokens: 50000, docs: 100, whatsapp: false },
    Pro:       { ai: true,  tokens: 200000, docs: Infinity, whatsapp: true },
    Enterprise:{ ai: true,  tokens: Infinity, docs: Infinity, whatsapp: true },
  };

  const currentLimits = limits[plan] || limits["Discovery"];
  const tokensUsed = subscription?.tokens_consumed_this_month || 0;
  const tokensLimit = currentLimits.tokens;
  const tokenPercent = tokensLimit > 0 ? Math.min(100, (tokensUsed / tokensLimit) * 100) : 0;

  return {
    subscription,
    loading,
    plan,
    limits: currentLimits,
    tokensUsed,
    tokensLimit,
    tokenPercent,
    canUseAI: currentLimits.ai,
    isDiscovery: plan === "Discovery",
  };
}
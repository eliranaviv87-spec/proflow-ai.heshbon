import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const GREENAPI_BASE = "https://api.green-api.com";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { action, instanceId, apiToken } = await req.json();

    if (action === "getQR") {
      const res = await fetch(`${GREENAPI_BASE}/waInstance${instanceId}/qr/${apiToken}`);
      const data = await res.json();
      return Response.json(data);
    }

    if (action === "getStatus") {
      const res = await fetch(`${GREENAPI_BASE}/waInstance${instanceId}/getStateInstance/${apiToken}`);
      const data = await res.json();
      return Response.json(data);
    }

    if (action === "sendMessage") {
      const { phone, message } = await req.json().catch(() => ({}));
      const res = await fetch(`${GREENAPI_BASE}/waInstance${instanceId}/sendMessage/${apiToken}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId: `${phone}@c.us`, message }),
      });
      const data = await res.json();
      return Response.json(data);
    }

    return Response.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
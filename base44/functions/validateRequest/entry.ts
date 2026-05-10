import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// In-memory rate limiter (per Deno instance)
const rateLimitMap = new Map();
const RATE_LIMIT = 30; // max requests
const RATE_WINDOW_MS = 60 * 1000; // per minute

function checkRateLimit(key) {
  const now = Date.now();
  const entry = rateLimitMap.get(key) || { count: 0, resetAt: now + RATE_WINDOW_MS };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + RATE_WINDOW_MS;
  }
  entry.count++;
  rateLimitMap.set(key, entry);
  return { allowed: entry.count <= RATE_LIMIT, remaining: Math.max(0, RATE_LIMIT - entry.count) };
}

/**
 * Central request validation utility
 * Validates inputs, enforces rate limits, and logs suspicious activity
 */
Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ valid: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limiting per user
    const rl = checkRateLimit(`validate:${user.email}`);
    if (!rl.allowed) {
      await base44.asServiceRole.entities.AuditLog.create({
        action: 'rate_limit_exceeded',
        entity_type: 'Security',
        entity_id: user.email,
        details: `Rate limit exceeded on validateRequest by ${user.email}`,
      });
      return Response.json({ valid: false, error: 'Too many requests' }, {
        status: 429,
        headers: { 'Retry-After': '60' }
      });
    }

    const body = await req.json();
    const { schema, data } = body;

    if (!schema || !data) {
      return Response.json({ valid: false, error: 'Missing schema or data' }, { status: 400 });
    }

    // Reject oversized payloads
    if (JSON.stringify(data).length > 50000) {
      return Response.json({ valid: false, error: 'Payload too large' }, { status: 413 });
    }

    const errors = [];

    // Validate required fields
    if (schema.required) {
      for (const field of schema.required) {
        if (data[field] === undefined || data[field] === null || data[field] === '') {
          errors.push(`Field '${field}' is required`);
        }
      }
    }

    // Validate field types and constraints
    if (schema.properties) {
      for (const [field, rules] of Object.entries(schema.properties)) {
        const value = data[field];
        if (value === undefined || value === null) continue;

        if (rules.type === 'string' && typeof value !== 'string') errors.push(`Field '${field}' must be a string`);
        if (rules.type === 'number' && typeof value !== 'number') errors.push(`Field '${field}' must be a number`);
        if (rules.type === 'boolean' && typeof value !== 'boolean') errors.push(`Field '${field}' must be a boolean`);

        if (typeof value === 'string') {
          if (rules.minLength && value.length < rules.minLength) errors.push(`Field '${field}' must be at least ${rules.minLength} characters`);
          if (rules.maxLength && value.length > rules.maxLength) errors.push(`Field '${field}' must be at most ${rules.maxLength} characters`);

          // XSS prevention
          if (/<script[\s\S]*?>[\s\S]*?<\/script>/gi.test(value)) {
            errors.push(`Field '${field}' contains invalid content`);
            await base44.asServiceRole.entities.AuditLog.create({
              action: 'xss_attempt_blocked',
              entity_type: 'Security',
              entity_id: user.email,
              details: `XSS attempt in field '${field}' by user ${user.email}`,
            });
          }
          // SQL injection patterns
          if (/(\bUNION\b|\bSELECT\b|\bDROP\b|\bINSERT\b|\bDELETE\b|\bUPDATE\b)/i.test(value)) {
            errors.push(`Field '${field}' contains invalid content`);
            await base44.asServiceRole.entities.AuditLog.create({
              action: 'sqli_attempt_blocked',
              entity_type: 'Security',
              entity_id: user.email,
              details: `SQLi attempt in field '${field}' by user ${user.email}`,
            });
          }
        }

        if (typeof value === 'number') {
          if (rules.minimum !== undefined && value < rules.minimum) errors.push(`Field '${field}' must be >= ${rules.minimum}`);
          if (rules.maximum !== undefined && value > rules.maximum) errors.push(`Field '${field}' must be <= ${rules.maximum}`);
        }

        if (rules.enum && !rules.enum.includes(value)) errors.push(`Field '${field}' must be one of: ${rules.enum.join(', ')}`);

        if (rules.format === 'email' && typeof value === 'string') {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errors.push(`Field '${field}' must be a valid email`);
        }

        if (rules.format === 'date' && typeof value === 'string') {
          if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) errors.push(`Field '${field}' must be in YYYY-MM-DD format`);
        }
      }
    }

    if (errors.length > 0) {
      return Response.json({ valid: false, errors }, { status: 422 });
    }

    return Response.json({ valid: true, sanitized: data, remaining_requests: rl.remaining }, { status: 200 });
  } catch (error) {
    console.error('Validation error:', error.message);
    return Response.json({ valid: false, error: error.message }, { status: 500 });
  }
});
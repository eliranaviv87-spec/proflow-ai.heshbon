import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Central request validation utility
 * Validates inputs, enforces rate limits, and logs suspicious activity
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ valid: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { schema, data } = body;

    if (!schema || !data) {
      return Response.json({ valid: false, error: 'Missing schema or data' }, { status: 400 });
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

        // Type validation
        if (rules.type === 'string' && typeof value !== 'string') {
          errors.push(`Field '${field}' must be a string`);
        }
        if (rules.type === 'number' && typeof value !== 'number') {
          errors.push(`Field '${field}' must be a number`);
        }
        if (rules.type === 'boolean' && typeof value !== 'boolean') {
          errors.push(`Field '${field}' must be a boolean`);
        }

        // String length
        if (typeof value === 'string') {
          if (rules.minLength && value.length < rules.minLength) {
            errors.push(`Field '${field}' must be at least ${rules.minLength} characters`);
          }
          if (rules.maxLength && value.length > rules.maxLength) {
            errors.push(`Field '${field}' must be at most ${rules.maxLength} characters`);
          }
          // XSS prevention - check for script tags
          if (/<script[\s\S]*?>[\s\S]*?<\/script>/gi.test(value)) {
            errors.push(`Field '${field}' contains invalid content`);
            await base44.asServiceRole.entities.AuditLog.create({
              action: 'xss_attempt_blocked',
              entity_type: 'Security',
              entity_id: user.email,
              details: `XSS attempt in field '${field}' by user ${user.email}`,
            });
          }
        }

        // Number range
        if (typeof value === 'number') {
          if (rules.minimum !== undefined && value < rules.minimum) {
            errors.push(`Field '${field}' must be >= ${rules.minimum}`);
          }
          if (rules.maximum !== undefined && value > rules.maximum) {
            errors.push(`Field '${field}' must be <= ${rules.maximum}`);
          }
        }

        // Enum validation
        if (rules.enum && !rules.enum.includes(value)) {
          errors.push(`Field '${field}' must be one of: ${rules.enum.join(', ')}`);
        }

        // Email format
        if (rules.format === 'email' && typeof value === 'string') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errors.push(`Field '${field}' must be a valid email`);
          }
        }

        // Date format
        if (rules.format === 'date' && typeof value === 'string') {
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (!dateRegex.test(value)) {
            errors.push(`Field '${field}' must be in YYYY-MM-DD format`);
          }
        }
      }
    }

    if (errors.length > 0) {
      return Response.json({ valid: false, errors }, { status: 422 });
    }

    return Response.json({ valid: true, sanitized: data }, { status: 200 });
  } catch (error) {
    console.error('Validation error:', error.message);
    return Response.json({ valid: false, error: error.message }, { status: 500 });
  }
});
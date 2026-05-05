import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * System Health Check — monitors DB connectivity, entity counts, and system status
 * Returns comprehensive health status for monitoring dashboards
 */
Deno.serve(async (req) => {
  const startTime = Date.now();

  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Parallel health checks
    const [
      docs,
      subs,
      notifications,
      auditLogs,
    ] = await Promise.all([
      base44.asServiceRole.entities.Document.list('-created_date', 1),
      base44.asServiceRole.entities.Subscription.filter({ status: 'active' }),
      base44.asServiceRole.entities.Notification.filter({ is_read: false }),
      base44.asServiceRole.entities.AuditLog.list('-created_date', 5),
    ]);

    const responseTime = Date.now() - startTime;

    return Response.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      response_time_ms: responseTime,
      checks: {
        database: { status: 'ok', message: 'Connected' },
        active_subscriptions: subs.length,
        unread_notifications: notifications.length,
        recent_audit_entries: auditLogs.length,
      },
      version: '1.0.0',
      environment: 'production',
    }, { status: 200 });
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error('Health check failed:', error.message);
    return Response.json({
      status: 'degraded',
      timestamp: new Date().toISOString(),
      response_time_ms: responseTime,
      error: error.message,
    }, { status: 500 });
  }
});
import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Activity, CheckCircle, AlertTriangle, RefreshCw, Clock } from "lucide-react";

export default function SystemHealthDashboard() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState(null);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const res = await base44.functions.invoke("healthCheck", {});
      setHealth(res.data);
      setLastChecked(new Date());
    } catch (err) {
      setHealth({ status: "error", error: err.message });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 60000); // refresh every 60s
    return () => clearInterval(interval);
  }, []);

  const statusColor = health?.status === "healthy" ? "#4ade80" : health?.status === "degraded" ? "#FFAB00" : "#ff6b6b";

  return (
    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Activity size={16} color="#00E5FF" />
          <span style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>בריאות המערכת</span>
          {health && (
            <span style={{
              padding: "3px 10px",
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 700,
              background: `${statusColor}18`,
              color: statusColor,
              border: `1px solid ${statusColor}35`,
            }}>
              {health.status === "healthy" ? "✓ תקין" : health.status === "degraded" ? "⚠ מושפע" : "✗ תקלה"}
            </span>
          )}
        </div>
        <button
          onClick={fetchHealth}
          disabled={loading}
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "6px 10px", color: "rgba(255,255,255,0.5)", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> רענן
        </button>
      </div>

      {loading && !health ? (
        <div style={{ textAlign: "center", padding: 20 }}>
          <div style={{ width: 24, height: 24, border: "2px solid rgba(0,229,255,0.2)", borderTopColor: "#00E5FF", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 10px" }} />
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>בודק מערכת...</p>
        </div>
      ) : health?.checks ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
          {[
            { label: "בסיס נתונים", value: health.checks.database?.status === "ok" ? "מחובר" : "בעיה", ok: health.checks.database?.status === "ok" },
            { label: "מנויים פעילים", value: health.checks.active_subscriptions, ok: true },
            { label: "התראות לא נקראו", value: health.checks.unread_notifications, ok: health.checks.unread_notifications < 50 },
            { label: "זמן תגובה", value: `${health.response_time_ms}ms`, ok: health.response_time_ms < 1000 },
          ].map(({ label, value, ok }) => (
            <div key={label} style={{ padding: "12px 14px", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                {ok
                  ? <CheckCircle size={12} color="#4ade80" />
                  : <AlertTriangle size={12} color="#FFAB00" />
                }
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{label}</span>
              </div>
              <p style={{ fontSize: 16, fontWeight: 700, color: ok ? "#fff" : "#FFAB00" }}>{value}</p>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ fontSize: 12, color: "#ff6b6b" }}>{health?.error || "שגיאה בטעינה"}</p>
      )}

      {lastChecked && (
        <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
          <Clock size={10} />
          עדכון אחרון: {lastChecked.toLocaleTimeString("he-IL")}
        </div>
      )}
    </div>
  );
}
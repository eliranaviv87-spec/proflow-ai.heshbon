import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Bell, X, CheckCheck, AlertTriangle, Info, Zap, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const severityConfig = {
  critical: { color: "#ff6b6b", bg: "rgba(255,107,107,0.1)", icon: AlertTriangle },
  warning: { color: "#FFAB00", bg: "rgba(255,171,0,0.1)", icon: AlertTriangle },
  info: { color: "#00E5FF", bg: "rgba(0,229,255,0.08)", icon: Info },
};

export default function NotificationsBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const load = () =>
    base44.entities.Notification.list("-created_date", 20).then(setNotifications);

  useEffect(() => {
    load();
    const unsub = base44.entities.Notification.subscribe((e) => {
      if (e.type === "create") setNotifications(prev => [e.data, ...prev].slice(0, 20));
      if (e.type === "update") setNotifications(prev => prev.map(n => n.id === e.id ? e.data : n));
      if (e.type === "delete") setNotifications(prev => prev.filter(n => n.id !== e.id));
    });
    return unsub;
  }, []);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unread = notifications.filter(n => !n.is_read).length;

  const markAllRead = async () => {
    const unreadOnes = notifications.filter(n => !n.is_read);
    await Promise.all(unreadOnes.map(n => base44.entities.Notification.update(n.id, { is_read: true })));
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const markRead = async (id) => {
    await base44.entities.Notification.update(id, { is_read: true });
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative w-9 h-9 flex items-center justify-center rounded-xl transition-all"
        style={{ background: open ? "rgba(0,229,255,0.08)" : "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        aria-label="התראות"
      >
        <Bell size={16} style={{ color: unread > 0 ? "#00E5FF" : "rgba(255,255,255,0.5)" }} />
        {unread > 0 && (
          <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold"
            style={{ background: "#ff6b6b", color: "#fff", fontSize: "10px" }}>
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-0 top-12 w-80 z-50 rounded-2xl overflow-hidden shadow-2xl"
          style={{ background: "#111114", border: "1px solid rgba(255,255,255,0.1)", maxHeight: "480px" }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-2">
              <Bell size={14} style={{ color: "#00E5FF" }} />
              <span className="text-sm font-semibold text-white">התראות</span>
              {unread > 0 && (
                <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: "rgba(255,107,107,0.15)", color: "#ff6b6b" }}>{unread} חדש</span>
              )}
            </div>
            {unread > 0 && (
              <button onClick={markAllRead} className="flex items-center gap-1 text-xs transition-colors" style={{ color: "rgba(255,255,255,0.4)" }}>
                <CheckCheck size={12} /> סמן הכל כנקרא
              </button>
            )}
          </div>

          {/* List */}
          <div className="overflow-y-auto" style={{ maxHeight: "380px" }}>
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Zap size={28} style={{ color: "rgba(255,255,255,0.1)" }} className="mb-3" />
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>אין התראות חדשות</p>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.2)" }}>המערכת תעדכן אותך כאן</p>
              </div>
            ) : notifications.map(n => {
              const cfg = severityConfig[n.severity] || severityConfig.info;
              const Icon = cfg.icon;
              return (
                <div key={n.id}
                  className="flex gap-3 px-4 py-3 transition-colors cursor-pointer"
                  style={{
                    background: n.is_read ? "transparent" : "rgba(0,229,255,0.03)",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                  }}
                  onClick={() => markRead(n.id)}
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: cfg.bg }}>
                    <Icon size={13} style={{ color: cfg.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-white leading-tight">{n.title}</p>
                      {!n.is_read && <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1" style={{ background: "#00E5FF" }} />}
                    </div>
                    <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{n.message}</p>
                    {n.action_url && (
                      <Link to={n.action_url} className="inline-flex items-center gap-1 text-xs mt-1" style={{ color: cfg.color }}>
                        לפעולה <ExternalLink size={10} />
                      </Link>
                    )}
                    <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.2)" }}>
                      {n.created_date ? new Date(n.created_date).toLocaleDateString("he-IL", { hour: "2-digit", minute: "2-digit" }) : ""}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
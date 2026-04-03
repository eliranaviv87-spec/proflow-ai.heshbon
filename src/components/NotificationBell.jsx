import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Bell, X, CheckCheck, FileText, Landmark, MessageCircle, AlertTriangle, TrendingDown, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const typeConfig = {
  document_processed: { icon: FileText, color: "#00E5FF", label: "מסמך עובד" },
  tax_due:            { icon: AlertTriangle, color: "#FFAB00", label: "תזכורת מס" },
  bank_match:         { icon: Landmark, color: "#4ade80", label: "התאמה בנקאית" },
  whatsapp_received:  { icon: MessageCircle, color: "#25D366", label: "WhatsApp" },
  cashflow_alert:     { icon: TrendingDown, color: "#ff6b6b", label: "התראת תזרים" },
  system:             { icon: Settings, color: "#B388FF", label: "מערכת" },
};

const priorityDot = { low: "#4ade80", medium: "#FFAB00", high: "#ff6b6b", critical: "#ff0040" };

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const load = () =>
    base44.entities.Notification.list("-created_date", 30).then(setNotifications);

  useEffect(() => {
    load();
    const unsub = base44.entities.Notification.subscribe((ev) => {
      if (ev.type === "create") setNotifications(prev => [ev.data, ...prev]);
      else if (ev.type === "update") setNotifications(prev => prev.map(n => n.id === ev.id ? ev.data : n));
      else if (ev.type === "delete") setNotifications(prev => prev.filter(n => n.id !== ev.id));
    });
    return unsub;
  }, []);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unread = notifications.filter(n => !n.is_read).length;

  const markRead = async (n) => {
    if (n.is_read) return;
    await base44.entities.Notification.update(n.id, { is_read: true });
    setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, is_read: true } : x));
  };

  const markAllRead = async () => {
    const unreadList = notifications.filter(n => !n.is_read);
    await Promise.all(unreadList.map(n => base44.entities.Notification.update(n.id, { is_read: true })));
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const deleteNotif = async (e, id) => {
    e.stopPropagation();
    await base44.entities.Notification.delete(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
        style={{ background: open ? "rgba(0,229,255,0.1)" : "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        aria-label="התראות"
      >
        <Bell size={15} style={{ color: unread > 0 ? "#00E5FF" : "rgba(255,255,255,0.4)" }} />
        {unread > 0 && (
          <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: "#ff6b6b", color: "#fff", fontSize: "10px" }}>
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-0 top-10 z-50 w-80 rounded-2xl shadow-2xl overflow-hidden"
          style={{ background: "rgba(14,14,18,0.97)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(20px)" }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-2">
              <Bell size={14} style={{ color: "#00E5FF" }} />
              <span className="text-sm font-semibold text-white">התראות</span>
              {unread > 0 && (
                <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: "rgba(255,107,107,0.15)", color: "#ff6b6b" }}>
                  {unread} חדשות
                </span>
              )}
            </div>
            {unread > 0 && (
              <button onClick={markAllRead} className="flex items-center gap-1 text-xs transition-colors" style={{ color: "rgba(0,229,255,0.7)" }}>
                <CheckCheck size={12} /> סמן הכל כנקרא
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                <Bell size={28} style={{ color: "rgba(255,255,255,0.1)" }} className="mb-3" />
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>אין התראות חדשות</p>
              </div>
            ) : notifications.map(n => {
              const cfg = typeConfig[n.type] || typeConfig.system;
              const Icon = cfg.icon;
              return (
                <div
                  key={n.id}
                  onClick={() => markRead(n)}
                  className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors group"
                  style={{
                    background: n.is_read ? "transparent" : "rgba(0,229,255,0.03)",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: `${cfg.color}15` }}>
                    <Icon size={13} style={{ color: cfg.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      {!n.is_read && (
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: priorityDot[n.priority] || "#FFAB00" }} />
                      )}
                      <p className="text-xs font-semibold text-white truncate">{n.title}</p>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{n.message}</p>
                    <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.2)" }}>
                      {new Date(n.created_date).toLocaleString("he-IL", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <button
                    onClick={(e) => deleteNotif(e, n.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                    aria-label="מחק"
                  >
                    <X size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
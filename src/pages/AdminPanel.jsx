import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Crown, Users, Building2, FileText, TrendingUp, RefreshCw, Ticket, Clock, CheckCircle, AlertCircle } from "lucide-react";

const formatCurrency = (n) =>
  new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS", maximumFractionDigits: 0 }).format(n || 0);

export default function AdminPanel() {
  const [orgs, setOrgs] = useState([]);
  const [docs, setDocs] = useState([]);
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [reply, setReply] = useState("");
  const [savingReply, setSavingReply] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      base44.entities.Organization.list("-created_date", 500),
      base44.entities.Document.list("-created_date", 500),
      base44.entities.User.list("-created_date", 500),
      base44.entities.SupportTicket.list("-created_date", 100),
    ]).then(([o, d, u, t]) => {
      setOrgs(o);
      setDocs(d);
      setUsers(u);
      setTickets(t);
      setLoading(false);
    });
  }, []);

  const orgDocs = selectedOrg
    ? docs.filter(d => d.org_id === selectedOrg.id)
    : [];

  const sendReply = async () => {
    if (!reply.trim() || !selectedTicket) return;
    setSavingReply(true);
    await base44.entities.SupportTicket.update(selectedTicket.id, {
      admin_reply: reply,
      status: "In_Progress",
    });
    setTickets(prev => prev.map(t => t.id === selectedTicket.id ? { ...t, admin_reply: reply, status: "In_Progress" } : t));
    setSelectedTicket(prev => ({ ...prev, admin_reply: reply, status: "In_Progress" }));
    setReply("");
    setSavingReply(false);
  };

  const totalRevenue = docs
    .filter(d => d.doc_type === "income")
    .reduce((s, d) => s + (d.total_amount || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw size={24} className="animate-spin" style={{ color: "#FFAB00" }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,171,0,0.12)", border: "1px solid rgba(255,171,0,0.25)" }}>
          <Crown size={18} style={{ color: "#FFAB00" }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">ניהול מערכת</h1>
          <p className="text-xs" style={{ color: "rgba(255,171,0,0.6)" }}>Master Admin — גישה מלאה</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "סה\"כ ארגונים", value: orgs.length, icon: Building2, color: "#00E5FF" },
          { label: "סה\"כ משתמשים", value: users.length, icon: Users, color: "#B388FF" },
          { label: "סה\"כ מסמכים", value: docs.length, icon: FileText, color: "#FFAB00" },
          { label: "סה\"כ הכנסות", value: formatCurrency(totalRevenue), icon: TrendingUp, color: "#4ade80" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon size={14} style={{ color }} />
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</p>
            </div>
            <p className="text-xl font-bold" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Org List */}
        <div className="glass-card p-5">
          <p className="text-sm font-semibold text-white mb-4">כל הארגונים ({orgs.length})</p>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {orgs.length === 0 && (
              <p className="text-sm text-center py-8" style={{ color: "rgba(255,255,255,0.3)" }}>אין ארגונים רשומים</p>
            )}
            {orgs.map(org => (
              <button
                key={org.id}
                onClick={() => setSelectedOrg(selectedOrg?.id === org.id ? null : org)}
                className="w-full flex items-center justify-between p-3 rounded-xl text-right transition-all"
                style={{
                  background: selectedOrg?.id === org.id ? "rgba(255,171,0,0.08)" : "rgba(255,255,255,0.02)",
                  border: selectedOrg?.id === org.id ? "1px solid rgba(255,171,0,0.2)" : "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{org.business_name || "—"}</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                    {org.tax_id || "ח.פ. לא הוזן"} · {org.subscription_tier || "Starter"}
                  </p>
                </div>
                <Building2 size={14} style={{ color: "rgba(255,255,255,0.3)" }} />
              </button>
            ))}
          </div>
        </div>

        {/* Selected Org Details */}
        <div className="glass-card p-5">
          <p className="text-sm font-semibold text-white mb-4">
            {selectedOrg ? `מסמכי: ${selectedOrg.business_name}` : "בחר ארגון לצפייה בפרטים"}
          </p>
          {!selectedOrg ? (
            <div className="flex flex-col items-center justify-center h-52 text-center">
              <Building2 size={32} style={{ color: "rgba(255,255,255,0.1)" }} className="mb-3" />
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>לחץ על ארגון מהרשימה</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {orgDocs.length === 0 ? (
                <p className="text-sm text-center py-8" style={{ color: "rgba(255,255,255,0.3)" }}>אין מסמכים לארגון זה</p>
              ) : orgDocs.map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-2.5 rounded-lg" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <div>
                    <p className="text-xs font-medium text-white">{doc.supplier_name || "לא ידוע"}</p>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{doc.date_issued || "—"}</p>
                  </div>
                  <p className="text-sm font-semibold" style={{ color: doc.doc_type === "income" ? "#4ade80" : "#ff6b6b" }}>
                    {formatCurrency(doc.total_amount)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ticket Manager */}
      <div className="glass-card p-5" style={{ border: "1px solid rgba(179,136,255,0.1)" }}>
        <div className="flex items-center gap-2 mb-4">
          <Ticket size={16} style={{ color: "#B388FF" }} />
          <p className="text-sm font-semibold text-white">מנהל פניות תמיכה ({tickets.length})</p>
          <span className="mr-auto text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,107,107,0.1)", color: "#ff6b6b", border: "1px solid rgba(255,107,107,0.2)" }}>
            {tickets.filter(t => t.status === "Open").length} פתוחות
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Ticket List */}
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {tickets.length === 0 && <p className="text-sm text-center py-8" style={{ color: "rgba(255,255,255,0.3)" }}>אין פניות תמיכה</p>}
            {tickets.map(t => {
              const overdue = t.sla_deadline && new Date(t.sla_deadline) < new Date() && t.status !== "Resolved";
              return (
                <button key={t.id} onClick={() => { setSelectedTicket(t); setReply(t.admin_reply || ""); }}
                  className="w-full text-right p-3 rounded-xl transition-all"
                  style={{
                    background: selectedTicket?.id === t.id ? "rgba(179,136,255,0.08)" : "rgba(255,255,255,0.02)",
                    border: selectedTicket?.id === t.id ? "1px solid rgba(179,136,255,0.25)" : overdue ? "1px solid rgba(255,107,107,0.2)" : "1px solid rgba(255,255,255,0.04)",
                  }}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium text-white truncate">{t.subject || t.message?.slice(0, 50)}</p>
                    {overdue && <AlertCircle size={12} style={{ color: "#ff6b6b" }} />}
                  </div>
                  <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                    <span>{t.user_name || t.user_email}</span>
                    <span className="px-1.5 py-0.5 rounded-full" style={{
                      background: t.status === "Open" ? "rgba(255,107,107,0.1)" : t.status === "Resolved" ? "rgba(74,222,128,0.1)" : "rgba(255,171,0,0.1)",
                      color: t.status === "Open" ? "#ff6b6b" : t.status === "Resolved" ? "#4ade80" : "#FFAB00",
                    }}>{t.status}</span>
                  </div>
                </button>
              );
            })}
          </div>
          {/* Ticket Detail */}
          <div className="glass-card p-4" style={{ background: "rgba(255,255,255,0.02)" }}>
            {!selectedTicket ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>בחר פנייה לצפייה</p>
              </div>
            ) : (
              <div className="space-y-3 h-full flex flex-col">
                <div>
                  <p className="text-xs font-semibold text-white mb-1">{selectedTicket.user_name} — {selectedTicket.user_email}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>{selectedTicket.message}</p>
                </div>
                {selectedTicket.sla_deadline && (
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                    <Clock size={11} />
                    SLA: {new Date(selectedTicket.sla_deadline).toLocaleString("he-IL")}
                  </div>
                )}
                {selectedTicket.admin_reply && (
                  <div className="p-3 rounded-xl text-xs" style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.15)", color: "rgba(255,255,255,0.7)" }}>
                    <strong style={{ color: "#4ade80" }}>תגובה קודמת:</strong><br />{selectedTicket.admin_reply}
                  </div>
                )}
                <div className="mt-auto space-y-2">
                  <textarea value={reply} onChange={e => setReply(e.target.value)}
                    placeholder="כתוב תגובה למשתמש..."
                    rows={3}
                    className="w-full text-xs px-3 py-2 rounded-xl resize-none outline-none"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff" }} />
                  <div className="flex gap-2">
                    <button onClick={sendReply} disabled={savingReply || !reply.trim()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                      style={{ background: "rgba(179,136,255,0.15)", color: "#B388FF", border: "1px solid rgba(179,136,255,0.25)" }}>
                      {savingReply ? <RefreshCw size={11} className="animate-spin" /> : <CheckCircle size={11} />}
                      שלח תגובה
                    </button>
                    <button onClick={() => base44.entities.SupportTicket.update(selectedTicket.id, { status: "Resolved" }).then(() => setTickets(prev => prev.map(t => t.id === selectedTicket.id ? { ...t, status: "Resolved" } : t)))}
                      className="px-3 py-1.5 rounded-lg text-xs"
                      style={{ background: "rgba(74,222,128,0.08)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.15)" }}>
                      סמן כפתור
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card p-5">
        <p className="text-sm font-semibold text-white mb-4">כל המשתמשים ({users.length})</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["שם", "אימייל", "תפקיד", "תאריך הצטרפות"].map(h => (
                  <th key={h} className="text-right pb-3 px-2 text-xs font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                  <td className="py-2.5 px-2 text-white">{u.full_name || "—"}</td>
                  <td className="py-2.5 px-2" style={{ color: "rgba(255,255,255,0.5)" }}>{u.email}</td>
                  <td className="py-2.5 px-2">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{
                      background: u.role === "admin" ? "rgba(255,171,0,0.1)" : "rgba(255,255,255,0.05)",
                      color: u.role === "admin" ? "#FFAB00" : "rgba(255,255,255,0.4)",
                      border: `1px solid ${u.role === "admin" ? "rgba(255,171,0,0.2)" : "rgba(255,255,255,0.08)"}`,
                    }}>
                      {u.role === "admin" ? "👑 Admin" : "משתמש"}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                    {u.created_date ? new Date(u.created_date).toLocaleDateString("he-IL") : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
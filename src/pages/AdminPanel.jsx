import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Crown, Users, Building2, FileText, TrendingUp, RefreshCw } from "lucide-react";

const formatCurrency = (n) =>
  new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS", maximumFractionDigits: 0 }).format(n || 0);

export default function AdminPanel() {
  const [orgs, setOrgs] = useState([]);
  const [docs, setDocs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrg, setSelectedOrg] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      base44.entities.Organization.list("-created_date", 500),
      base44.entities.Document.list("-created_date", 500),
      base44.entities.User.list("-created_date", 500),
    ]).then(([o, d, u]) => {
      setOrgs(o);
      setDocs(d);
      setUsers(u);
      setLoading(false);
    });
  }, []);

  const orgDocs = selectedOrg
    ? docs.filter(d => d.org_id === selectedOrg.id)
    : [];

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
import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { UserPlus, RefreshCw, Crown, Shield, Check, Trash2 } from "lucide-react";

const ALL_PERMISSIONS = [
  { key: "manage_users", label: "ניהול משתמשים" },
  { key: "manage_vault", label: "ניהול מסמכים" },
  { key: "manage_banking", label: "ניהול בנקאות" },
  { key: "view_reports", label: "צפייה בדוחות" },
  { key: "manage_tax", label: "ניהול מס" },
  { key: "manage_affiliates", label: "ניהול שגרירים" },
  { key: "manage_integrations", label: "ניהול אינטגרציות" },
  { key: "manage_settings", label: "הגדרות מערכת" },
  { key: "manage_support", label: "ניהול תמיכה" },
];

export default function ManageAdmins({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [inviting, setInviting] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [savingPerms, setSavingPerms] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const list = await base44.entities.User.list("-created_date", 200);
    setUsers(list);
    setLoading(false);
  };

  const togglePermission = (key, arr, setArr) => {
    setArr(prev =>
      prev.includes(key) ? prev.filter(p => p !== key) : [...prev, key]
    );
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    setInviting(true);
    await base44.users.inviteUser(inviteEmail.trim(), "admin");
    setInviteSuccess(true);
    setInviteEmail("");
    setSelectedPermissions([]);
    setTimeout(() => setInviteSuccess(false), 3000);
    setInviting(false);
    await loadUsers();
  };

  const handleSavePermissions = async () => {
    if (!selectedUser) return;
    setSavingPerms(true);
    await base44.entities.User.update(selectedUser.id, {
      permissions: selectedUser.permissions || [],
    });
    setSavingPerms(false);
    setUsers(prev =>
      prev.map(u => u.id === selectedUser.id ? { ...u, permissions: selectedUser.permissions } : u)
    );
  };

  const admins = users.filter(u => u.role === "admin");

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <RefreshCw size={20} className="animate-spin" style={{ color: "#FFAB00" }} />
    </div>
  );

  return (
    <div className="space-y-6" dir="rtl">

      {/* Invite New Admin */}
      <div className="glass-card p-5" style={{ border: "1px solid rgba(255,171,0,0.15)" }}>
        <div className="flex items-center gap-2 mb-4">
          <UserPlus size={16} style={{ color: "#FFAB00" }} />
          <p className="text-sm font-semibold text-white">הזמנת מנהל חדש</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>כתובת אימייל</label>
            <input
              type="email"
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
              placeholder="admin@example.com"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", color: "#fff", padding: "10px 14px", fontSize: "13px", outline: "none", width: "100%" }}
            />
          </div>

          <div>
            <label className="block text-xs mb-2" style={{ color: "rgba(255,255,255,0.45)" }}>הרשאות ראשוניות למנהל החדש</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {ALL_PERMISSIONS.map(({ key, label }) => {
                const checked = selectedPermissions.includes(key);
                return (
                  <button
                    key={key}
                    onClick={() => togglePermission(key, selectedPermissions, setSelectedPermissions)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all text-right"
                    style={{
                      background: checked ? "rgba(255,171,0,0.1)" : "rgba(255,255,255,0.02)",
                      border: checked ? "1px solid rgba(255,171,0,0.3)" : "1px solid rgba(255,255,255,0.06)",
                      color: checked ? "#FFAB00" : "rgba(255,255,255,0.5)",
                    }}
                  >
                    <div style={{ width: 14, height: 14, borderRadius: 4, border: `1px solid ${checked ? "#FFAB00" : "rgba(255,255,255,0.2)"}`, background: checked ? "rgba(255,171,0,0.2)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {checked && <Check size={9} style={{ color: "#FFAB00" }} />}
                    </div>
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleInvite}
            disabled={inviting || !inviteEmail.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: inviteSuccess ? "rgba(74,222,128,0.15)" : "rgba(255,171,0,0.15)",
              color: inviteSuccess ? "#4ade80" : "#FFAB00",
              border: inviteSuccess ? "1px solid rgba(74,222,128,0.3)" : "1px solid rgba(255,171,0,0.3)",
              opacity: (!inviteEmail.trim() || inviting) ? 0.5 : 1,
            }}
          >
            {inviting ? <RefreshCw size={14} className="animate-spin" /> : inviteSuccess ? <Check size={14} /> : <UserPlus size={14} />}
            {inviteSuccess ? "הזמנה נשלחה בהצלחה!" : inviting ? "שולח..." : "הזמן מנהל"}
          </button>
        </div>
      </div>

      {/* Existing Admins */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Crown size={16} style={{ color: "#FFAB00" }} />
          <p className="text-sm font-semibold text-white">מנהלים קיימים ({admins.length})</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Admin List */}
          <div className="space-y-2">
            {admins.length === 0 && (
              <p className="text-sm text-center py-8" style={{ color: "rgba(255,255,255,0.3)" }}>אין מנהלים נוספים</p>
            )}
            {admins.map(u => (
              <button
                key={u.id}
                onClick={() => setSelectedUser(selectedUser?.id === u.id ? null : { ...u, permissions: u.permissions || [] })}
                className="w-full flex items-center justify-between p-3 rounded-xl text-right transition-all"
                style={{
                  background: selectedUser?.id === u.id ? "rgba(255,171,0,0.08)" : "rgba(255,255,255,0.02)",
                  border: selectedUser?.id === u.id ? "1px solid rgba(255,171,0,0.25)" : "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div>
                  <p className="text-sm font-medium text-white">{u.full_name || "—"}</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{u.email}</p>
                  <p className="text-xs mt-1" style={{ color: "rgba(255,171,0,0.6)" }}>
                    {(u.permissions || []).length > 0
                      ? `${(u.permissions || []).length} הרשאות מוגדרות`
                      : "ללא הגבלת הרשאות (גישה מלאה)"}
                  </p>
                </div>
                <Shield size={14} style={{ color: "rgba(255,171,0,0.5)" }} />
              </button>
            ))}
          </div>

          {/* Permission Editor */}
          <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 12, padding: 16, border: "1px solid rgba(255,255,255,0.05)", minHeight: 200 }}>
            {!selectedUser ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-center" style={{ color: "rgba(255,255,255,0.25)" }}>בחר מנהל לעריכת הרשאות</p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-white">הרשאות — {selectedUser.full_name || selectedUser.email}</p>
                <div className="space-y-1.5">
                  {ALL_PERMISSIONS.map(({ key, label }) => {
                    const checked = (selectedUser.permissions || []).includes(key);
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedUser(prev => ({
                          ...prev,
                          permissions: checked
                            ? prev.permissions.filter(p => p !== key)
                            : [...(prev.permissions || []), key]
                        }))}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-right transition-all"
                        style={{
                          background: checked ? "rgba(255,171,0,0.08)" : "transparent",
                          border: checked ? "1px solid rgba(255,171,0,0.2)" : "1px solid rgba(255,255,255,0.04)",
                          color: checked ? "#FFAB00" : "rgba(255,255,255,0.45)",
                        }}
                      >
                        <div style={{ width: 14, height: 14, borderRadius: 4, border: `1px solid ${checked ? "#FFAB00" : "rgba(255,255,255,0.2)"}`, background: checked ? "rgba(255,171,0,0.2)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          {checked && <Check size={9} style={{ color: "#FFAB00" }} />}
                        </div>
                        {label}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={handleSavePermissions}
                  disabled={savingPerms}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold w-full justify-center transition-all"
                  style={{ background: "rgba(255,171,0,0.12)", color: "#FFAB00", border: "1px solid rgba(255,171,0,0.25)" }}
                >
                  {savingPerms ? <RefreshCw size={12} className="animate-spin" /> : <Check size={12} />}
                  שמור הרשאות
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
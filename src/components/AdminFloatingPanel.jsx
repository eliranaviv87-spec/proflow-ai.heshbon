import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import {
  Crown, X, LayoutDashboard, Archive, Landmark, BarChart3,
  FileText, BrainCircuit, MessageCircle, Building2, Users,
  Link2, Settings, Home, ShieldCheck, ChevronLeft
} from "lucide-react";

const allLinks = [
  { section: "ניהול", items: [
    { path: "/admin", label: "ניהול מערכת", icon: Crown },
    { path: "/affiliates", label: "ניהול שגרירים", icon: Users },
    { path: "/integrations", label: "אינטגרציות", icon: Link2 },
    { path: "/settings", label: "הגדרות גלובליות", icon: Settings },
  ]},
  { section: "משתמש", items: [
    { path: "/", label: "דף הבית", icon: Home },
    { path: "/dashboard", label: "דשבורד", icon: LayoutDashboard },
    { path: "/vault", label: "מרכז מסמכים", icon: Archive },
    { path: "/banking", label: "בנקאות", icon: Landmark },
    { path: "/reports", label: "דוחות AI", icon: BarChart3 },
    { path: "/tax-reports", label: "דוחות מס", icon: FileText },
    { path: "/smart-reports", label: "מנוע דוחות חכם", icon: BrainCircuit },
    { path: "/whatsapp", label: "חיבור WhatsApp", icon: MessageCircle },
    { path: "/tax-authority", label: "רשויות המס", icon: Building2 },
  ]},
];

export default function AdminFloatingPanel() {
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    base44.auth.me().then((u) => {
      console.log("AdminFloatingPanel user:", u);
      if (u?.role === "admin" || u?.data?.role === "admin") {
        setIsAdmin(true);
      }
    }).catch(() => {});
  }, []);

  // Close panel on route change
  useEffect(() => { setOpen(false); }, [location.pathname]);

  if (!isAdmin) return null;

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-sm transition-all shadow-lg"
        style={{
          background: open ? "rgba(255,171,0,0.2)" : "rgba(255,171,0,0.12)",
          border: "1px solid rgba(255,171,0,0.4)",
          color: "#FFAB00",
          boxShadow: "0 0 20px rgba(255,171,0,0.15)",
        }}
        aria-label="תפריט ניהול"
      >
        <Crown size={16} />
        {!open && <span>Admin</span>}
        {open && <X size={16} />}
      </button>

      {/* Slide-out Panel */}
      <div
        className="fixed top-0 left-0 h-full z-50 flex flex-col transition-all duration-300 overflow-hidden"
        style={{
          width: open ? "260px" : "0px",
          background: "rgba(10,10,12,0.97)",
          borderRight: "1px solid rgba(255,171,0,0.15)",
          backdropFilter: "blur(20px)",
        }}
      >
        {open && (
          <div className="flex flex-col h-full" style={{ minWidth: 260 }}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "rgba(255,171,0,0.15)" }}>
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} style={{ color: "#FFAB00" }} />
                <span className="font-bold text-white text-sm">פאנל ניהול</span>
              </div>
              <button onClick={() => setOpen(false)} style={{ color: "rgba(255,255,255,0.4)" }}>
                <X size={18} />
              </button>
            </div>

            {/* Links */}
            <nav className="flex-1 overflow-y-auto p-3 space-y-4">
              {allLinks.map(({ section, items }) => (
                <div key={section}>
                  <p className="text-xs font-semibold px-2 mb-2" style={{ color: section === "ניהול" ? "rgba(255,171,0,0.6)" : "rgba(255,255,255,0.3)" }}>
                    {section}
                  </p>
                  <div className="space-y-1">
                    {items.map(({ path, label, icon: Icon }) => {
                      const active = location.pathname === path;
                      const isAdminLink = section === "ניהול";
                      return (
                        <Link
                          key={path}
                          to={path}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium"
                          style={{
                            background: active
                              ? isAdminLink ? "rgba(255,171,0,0.1)" : "rgba(0,229,255,0.08)"
                              : "transparent",
                            border: active
                              ? isAdminLink ? "1px solid rgba(255,171,0,0.25)" : "1px solid rgba(0,229,255,0.15)"
                              : "1px solid transparent",
                            color: active
                              ? isAdminLink ? "#FFAB00" : "#00E5FF"
                              : "rgba(255,255,255,0.6)",
                          }}
                        >
                          <Icon size={16} className="flex-shrink-0" />
                          {label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <p className="text-xs text-center" style={{ color: "rgba(255,255,255,0.2)" }}>ProFlow AI — Admin Panel</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
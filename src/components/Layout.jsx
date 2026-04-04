import { Outlet, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { LayoutDashboard, Archive, Landmark, BarChart3, Settings, ChevronLeft, Zap, Users, FileText, Link2, Home, Crown, BrainCircuit, MessageCircle, Building2, Menu, X } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import NotificationsBell from "./NotificationsBell";
import SupportChatWidget from "./SupportChatWidget";

const userNavItems = [
  { path: "/", label: "דף הבית", icon: Home },
  { path: "/dashboard", label: "דשבורד", icon: LayoutDashboard },
  { path: "/vault", label: "מרכז מסמכים", icon: Archive },
  { path: "/banking", label: "בנקאות", icon: Landmark },
  { path: "/reports", label: "דוחות AI", icon: BarChart3 },
  { path: "/tax-reports", label: "דוחות מס", icon: FileText },
  { path: "/smart-reports", label: "מנוע דוחות חכם", icon: BrainCircuit },
  { path: "/whatsapp", label: "חיבור WhatsApp", icon: MessageCircle },
  { path: "/tax-authority", label: "רשויות המס", icon: Building2 },
];

const adminNavItems = [
  { path: "/admin", label: "ניהול מערכת", icon: Crown },
  { path: "/affiliates", label: "ניהול שגרירים", icon: Users },
  { path: "/integrations", label: "אינטגרציות", icon: Link2 },
  { path: "/settings", label: "הגדרות גלובליות", icon: Settings },
];

const mobileNavItems = [
  { path: "/dashboard", label: "דשבורד", icon: LayoutDashboard },
  { path: "/vault", label: "מסמכים", icon: Archive },
  { path: "/banking", label: "בנקאות", icon: Landmark },
  { path: "/smart-reports", label: "דוחות", icon: BrainCircuit },
  { path: "/tax-authority", label: "מס", icon: Building2 },
];

export default function Layout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem("sidebar_collapsed") === "true"; } catch { return false; }
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin" || user?.data?.role === "admin";

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    try { localStorage.setItem("sidebar_collapsed", String(next)); } catch {}
  };

  const SidebarContent = ({ mobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg, rgba(0,229,255,0.15), rgba(212,175,55,0.15))", border: "1px solid rgba(212,175,55,0.3)" }}>
          <Zap size={16} style={{ color: "#D4AF37" }} />
        </div>
        {(!collapsed || mobile) && (
          <div>
            <div className="font-bold text-sm text-white">ProFlow<span style={{ color: "#00E5FF" }}>AI</span></div>
            <div className="text-xs" style={{ color: "rgba(212,175,55,0.7)" }}>Financial OS</div>
          </div>
        )}
        {mobile && (
          <button onClick={() => setMobileOpen(false)} className="mr-auto" style={{ color: "rgba(255,255,255,0.4)" }}>
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {userNavItems.map(({ path, label, icon: Icon }) => {
          const active = location.pathname === path;
          return (
            <Link key={path} to={path} onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
              style={{
                transition: "all 0.15s ease-in-out",
                background: active ? "rgba(0,229,255,0.08)" : "transparent",
                border: active ? "1px solid rgba(0,229,255,0.15)" : "1px solid transparent",
                color: active ? "#00E5FF" : "rgba(255,255,255,0.5)",
              }}
            >
              <Icon size={18} className="flex-shrink-0" />
              {(!collapsed || mobile) && <span className="text-sm font-medium">{label}</span>}
            </Link>
          );
        })}

        {isAdmin && (
          <>
            {(!collapsed || mobile) && (
              <div className="flex items-center gap-2 px-3 pt-4 pb-1">
                <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, rgba(212,175,55,0.4), transparent)" }} />
                <span className="text-xs font-bold" style={{ color: "#D4AF37" }}>ADMIN</span>
                <Crown size={10} style={{ color: "#D4AF37" }} />
              </div>
            )}
            {collapsed && !mobile && (
              <div className="my-2 h-px mx-3" style={{ background: "rgba(212,175,55,0.25)" }} />
            )}
            {adminNavItems.map(({ path, label, icon: Icon }) => {
              const active = location.pathname === path || location.pathname.startsWith(path + "/");
              return (
                <Link key={path} to={path} onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200"
                  style={{
                    background: active ? "rgba(212,175,55,0.1)" : "transparent",
                    border: active ? "1px solid rgba(212,175,55,0.25)" : "1px solid transparent",
                    color: active ? "#D4AF37" : "rgba(255,171,0,0.45)",
                  }}
                >
                  <Icon size={18} className="flex-shrink-0" />
                  {(!collapsed || mobile) && <span className="text-sm font-medium">{label}</span>}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* Collapse Toggle — desktop only */}
      {!mobile && (
        <button onClick={toggleCollapsed}
          className="p-4 flex items-center justify-center gap-2 transition-colors border-t"
          style={{ color: "rgba(255,255,255,0.3)", borderColor: "rgba(255,255,255,0.06)" }}
        >
          <ChevronLeft size={16} style={{ transform: collapsed ? "rotate(180deg)" : "none", transition: "transform 0.3s" }} />
          {!collapsed && <span className="text-xs">כווץ</span>}
        </button>
      )}
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#0A0A0C", direction: "rtl" }}>
      {/* Mobile overlay */}
      {isMobile && mobileOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-64 h-full flex flex-col"
            style={{ background: "rgba(12,12,16,0.98)", backdropFilter: "blur(20px)", borderLeft: "1px solid rgba(255,255,255,0.08)" }}>
            <SidebarContent mobile={true} />
          </div>
          <div className="flex-1" style={{ background: "rgba(0,0,0,0.5)" }} onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <div className="flex flex-col border-l flex-shrink-0"
          style={{ width: collapsed ? "64px" : "220px", transition: "width 0.2s ease-in-out", background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
          <SidebarContent mobile={false} />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
          {isMobile ? (
            <>
              <button onClick={() => setMobileOpen(true)} style={{ color: "rgba(255,255,255,0.5)" }}>
                <Menu size={20} />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, rgba(0,229,255,0.15), rgba(212,175,55,0.15))", border: "1px solid rgba(212,175,55,0.3)" }}>
                  <Zap size={13} style={{ color: "#D4AF37" }} />
                </div>
                <span className="font-bold text-sm text-white">ProFlow<span style={{ color: "#00E5FF" }}>AI</span></span>
              </div>
              <div className="flex items-center gap-2">
                <NotificationsBell />
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: "rgba(179,136,255,0.2)", color: "#B388FF", border: "1px solid rgba(179,136,255,0.3)" }}>
                  {user?.full_name?.[0] || "א"}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full pulse-dot flex-shrink-0" style={{ background: "#00E5FF" }} />
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>AI Engine Online</span>
              </div>
              <div className="flex-1 max-w-md mx-6">
                <input
                  type="search"
                  placeholder="חפש מסמכים, ספקים, עסקאות..."
                  className="w-full px-4 py-2 rounded-xl text-sm outline-none"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.8)" }}
                />
              </div>
              <div className="flex items-center gap-3">
                <NotificationsBell />
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: "rgba(179,136,255,0.2)", color: "#B388FF", border: "1px solid rgba(179,136,255,0.3)" }}>
                  {user?.full_name?.[0] || "א"}
                </div>
              </div>
            </>
          )}
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6" style={{ paddingBottom: isMobile ? "80px" : undefined }}>
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-2 border-t"
          style={{ background: "rgba(10,10,12,0.97)", backdropFilter: "blur(20px)", borderColor: "rgba(255,255,255,0.08)" }}>
          {mobileNavItems.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <Link key={path} to={path} className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all"
                style={{ color: active ? "#00E5FF" : "rgba(255,255,255,0.35)" }}>
                <Icon size={20} />
                <span style={{ fontSize: "10px" }}>{label}</span>
              </Link>
            );
          })}
          {isAdmin && (
            <Link to="/admin" className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all"
              style={{ color: location.pathname === "/admin" ? "#FFAB00" : "rgba(255,255,255,0.35)" }}>
              <Crown size={20} />
              <span style={{ fontSize: "10px" }}>ניהול</span>
            </Link>
          )}
        </nav>
      )}

      <SupportChatWidget />
    </div>
  );
}
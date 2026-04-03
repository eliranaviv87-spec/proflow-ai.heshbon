import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, Building2, BarChart3, Settings, ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", label: "דשבורד", icon: LayoutDashboard },
  { path: "/vault", label: "הכספת", icon: FileText },
  { path: "/banking", label: "בנקאות", icon: Building2 },
  { path: "/reports", label: "דוחות AI", icon: BarChart3 },
  { path: "/settings", label: "הגדרות", icon: Settings },
];

export default function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "fixed top-0 right-0 h-screen z-40 flex flex-col transition-all duration-300 ease-in-out",
        "bg-sidebar border-l border-sidebar-border",
        collapsed ? "w-[72px]" : "w-[240px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-primary" />
        </div>
        {!collapsed && (
          <span className="font-bold text-lg text-foreground tracking-tight font-inter">
            ProFlow<span className="text-primary">AI</span>
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className={cn("w-5 h-5 flex-shrink-0", isActive && "drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]")} />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mx-3 mb-4 p-2 rounded-xl text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors flex items-center justify-center"
        aria-label={collapsed ? "הרחב סרגל" : "כווץ סרגל"}
      >
        {collapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
    </aside>
  );
}
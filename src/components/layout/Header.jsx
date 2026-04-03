import { Search, Bell, User } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { base44 } from "@/api/base44Client";

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-border/50">
      {/* AI Status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 glass-card px-3 py-1.5">
          <div className="w-2 h-2 rounded-full bg-primary pulse-neon" />
          <span className="text-xs text-muted-foreground font-medium">AI פעיל</span>
        </div>
      </div>

      {/* Search & Actions */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="חיפוש מסמכים, ספקים..."
            className="w-64 pr-9 bg-secondary/50 border-border/50 text-sm placeholder:text-muted-foreground/60 focus:ring-primary/30"
          />
        </div>

        <button className="relative p-2 rounded-xl hover:bg-secondary/50 transition-colors" aria-label="התראות">
          <Bell className="w-5 h-5 text-muted-foreground" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors" aria-label="תפריט משתמש">
              <User className="w-4 h-4 text-primary" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="bg-card border-border">
            <DropdownMenuItem onClick={() => base44.auth.logout()}>
              התנתק
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
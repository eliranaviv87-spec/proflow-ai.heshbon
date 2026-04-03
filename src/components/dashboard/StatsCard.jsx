import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function StatsCard({ title, value, subtitle, icon: Icon, color = "cyan", delay = 0 }) {
  const colorMap = {
    cyan: { text: "text-neon-cyan", bg: "bg-neon-cyan/10", glow: "neon-cyan-glow" },
    amber: { text: "text-neon-amber", bg: "bg-neon-amber/10", glow: "neon-amber-glow" },
    purple: { text: "text-neon-purple", bg: "bg-neon-purple/10", glow: "neon-purple-glow" },
  };
  const c = colorMap[color] || colorMap.cyan;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn("glass-card glass-card-hover p-5 cursor-default", c.glow)}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-muted-foreground">{title}</p>
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", c.bg)}>
          <Icon className={cn("w-4 h-4", c.text)} />
        </div>
      </div>
      <p className="text-2xl font-bold text-foreground font-inter">{value}</p>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    </motion.div>
  );
}
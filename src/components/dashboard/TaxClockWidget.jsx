import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function TaxClockWidget({ vatDue = 0, incomeTaxDue = 0 }) {
  const totalDue = vatDue + incomeTaxDue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-6 neon-amber-glow col-span-2"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-neon-amber">חבות מס בזמן אמת</h3>
          <p className="text-xs text-muted-foreground mt-0.5">אל תנחש, תדע</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-neon-amber/10 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-neon-amber" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="glass-card p-4">
          <p className="text-xs text-muted-foreground mb-1">מע״מ לתשלום</p>
          <p className="text-2xl font-bold text-foreground font-inter">
            ₪{vatDue.toLocaleString("he-IL")}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3 text-neon-cyan" />
            <span className="text-xs text-neon-cyan">עדכני</span>
          </div>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-muted-foreground mb-1">מקדמות מס הכנסה</p>
          <p className="text-2xl font-bold text-foreground font-inter">
            ₪{incomeTaxDue.toLocaleString("he-IL")}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingDown className="w-3 h-3 text-neon-amber" />
            <span className="text-xs text-neon-amber">משוער</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">סה״כ חבות</p>
          <p className="text-3xl font-extrabold text-foreground font-inter">
            ₪{totalDue.toLocaleString("he-IL")}
          </p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-neon-amber/10 text-neon-amber text-sm font-medium hover:bg-neon-amber/20 transition-colors border border-neon-amber/20">
          אופטימיזציית מס
        </button>
      </div>
    </motion.div>
  );
}
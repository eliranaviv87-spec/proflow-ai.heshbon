import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const MONTHS_HEB = ["ינו", "פבר", "מרץ", "אפר", "מאי", "יונ", "יול", "אוג", "ספט", "אוק", "נוב", "דצמ"];

function generateProjection(transactions) {
  const now = new Date();
  const data = [];
  let balance = 50000; // placeholder starting balance

  // Past 3 months
  for (let i = 2; i >= 0; i--) {
    const d = new Date(now);
    d.setMonth(d.getMonth() - i);
    const monthIdx = d.getMonth();
    balance += (Math.random() - 0.4) * 15000;
    data.push({
      month: MONTHS_HEB[monthIdx],
      actual: Math.round(balance),
      predicted: null,
    });
  }

  // Current + 3 future months (prediction)
  for (let i = 0; i < 4; i++) {
    const d = new Date(now);
    d.setMonth(d.getMonth() + i);
    const monthIdx = d.getMonth();
    balance += (Math.random() - 0.35) * 12000;
    if (i === 0) {
      data.push({
        month: MONTHS_HEB[monthIdx],
        actual: Math.round(balance),
        predicted: Math.round(balance),
      });
    } else {
      data.push({
        month: MONTHS_HEB[monthIdx],
        actual: null,
        predicted: Math.round(balance),
      });
    }
  }
  return data;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card p-3 !border-primary/20">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-medium font-inter" style={{ color: entry.color }}>
          ₪{entry.value?.toLocaleString("he-IL")}
          <span className="text-xs text-muted-foreground mr-1">
            {entry.dataKey === "actual" ? "בפועל" : "תחזית"}
          </span>
        </p>
      ))}
    </div>
  );
};

export default function CashflowChart({ transactions = [] }) {
  const data = generateProjection(transactions);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-card p-6 col-span-2"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-medium text-foreground">תחזית תזרים מזומנים</h3>
          <p className="text-xs text-muted-foreground mt-0.5">90 יום קדימה • מבוסס AI</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary" />
            בפועל
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-neon-purple" />
            תחזית
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <defs>
            <linearGradient id="gradCyan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(187, 100%, 50%)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="hsl(187, 100%, 50%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradPurple" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(262, 83%, 77%)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="hsl(262, 83%, 77%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="month" tick={{ fill: "hsl(240,5%,55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "hsl(240,5%,55%)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="actual" stroke="hsl(187, 100%, 50%)" strokeWidth={2} fill="url(#gradCyan)" connectNulls={false} />
          <Area type="monotone" dataKey="predicted" stroke="hsl(262, 83%, 77%)" strokeWidth={2} strokeDasharray="6 3" fill="url(#gradPurple)" connectNulls={false} />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
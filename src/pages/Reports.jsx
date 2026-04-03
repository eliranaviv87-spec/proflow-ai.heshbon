import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { BarChart3, Loader2, Sparkles } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const COLORS = ["hsl(187,100%,50%)", "hsl(262,83%,77%)", "hsl(40,100%,50%)", "hsl(150,60%,50%)", "hsl(0,84%,60%)"];

export default function Reports() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiInsight, setAiInsight] = useState("");
  const [insightLoading, setInsightLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const docs = await base44.entities.Document.list("-created_date", 200);
        setDocuments(docs);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Category breakdown
  const categoryMap = {};
  documents.forEach((d) => {
    if (d.ai_category && d.total_amount) {
      categoryMap[d.ai_category] = (categoryMap[d.ai_category] || 0) + d.total_amount;
    }
  });
  const pieData = Object.entries(categoryMap).map(([name, value]) => ({ name, value: Math.round(value) }));

  // Monthly breakdown
  const monthMap = {};
  documents.forEach((d) => {
    if (d.date_issued && d.total_amount) {
      const month = d.date_issued.substring(0, 7);
      if (!monthMap[month]) monthMap[month] = { income: 0, expense: 0 };
      if (d.doc_type === "income") monthMap[month].income += d.total_amount;
      else monthMap[month].expense += d.total_amount;
    }
  });
  const barData = Object.entries(monthMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, val]) => ({ month, ...val }));

  async function generateInsight() {
    setInsightLoading(true);
    try {
      const summary = documents.slice(0, 30).map((d) => `${d.supplier_name || "unknown"}: ₪${d.total_amount} (${d.ai_category})`).join("\n");
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `אתה יועץ פיננסי בכיר. נתח את ההוצאות הבאות ותן 3 תובנות פעולה קצרות ומעשיות בעברית, עם המלצות לחיסכון:\n\n${summary}\n\nענה בעברית בלבד, בצורה תמציתית ומקצועית.`,
      });
      setAiInsight(result);
    } catch (e) {
      toast.error("שגיאה ביצירת תובנות");
    } finally {
      setInsightLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">דוחות AI</h1>
          <p className="text-sm text-muted-foreground mt-1">ניתוח חכם של הנתונים הפיננסיים שלך</p>
        </div>
        <Button
          onClick={generateInsight}
          disabled={insightLoading || documents.length === 0}
          className="gap-2 bg-neon-purple/10 text-neon-purple hover:bg-neon-purple/20 border border-neon-purple/20"
        >
          {insightLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          צור תובנות AI
        </Button>
      </div>

      {/* AI Insight */}
      {aiInsight && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 neon-purple-glow">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-neon-purple" />
            <h3 className="text-sm font-medium text-neon-purple">תובנות AI</h3>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{aiInsight}</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly Bar Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h3 className="text-sm font-medium text-foreground mb-4">הכנסות vs הוצאות (חודשי)</h3>
          {barData.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">אין מספיק נתונים</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: "hsl(240,5%,55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(240,5%,55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "hsl(240,6%,8%)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
                <Bar dataKey="income" fill="hsl(187,100%,50%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="hsl(40,100%,50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Category Pie */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
          <h3 className="text-sm font-medium text-foreground mb-4">התפלגות לפי קטגוריה</h3>
          {pieData.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">אין מספיק נתונים</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(240,6%,8%)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            {pieData.map((item, i) => (
              <span key={item.name} className="text-xs flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                {item.name}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
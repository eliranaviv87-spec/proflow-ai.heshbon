import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Sparkles } from "lucide-react";

const formatCurrency = (n) =>
  new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS", maximumFractionDigits: 0 }).format(n || 0);

const COLORS = ["#00E5FF", "#B388FF", "#FFAB00", "#4ade80", "#ff6b6b", "#60a5fa", "#f472b6"];

export default function AIReports() {
  const [docs, setDocs] = useState([]);
  const [aiInsight, setAiInsight] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    base44.entities.Document.list("-created_date", 200).then(setDocs);
  }, []);

  const totalIncome = docs.filter(d => d.doc_type === "income").reduce((s, d) => s + (d.total_amount || 0), 0);
  const totalExpense = docs.filter(d => d.doc_type === "expense").reduce((s, d) => s + (d.total_amount || 0), 0);
  const totalVAT = docs.reduce((s, d) => s + (d.vat_amount || 0), 0);

  // Category breakdown
  const catMap = {};
  docs.forEach(d => {
    const cat = d.ai_category || "אחר";
    catMap[cat] = (catMap[cat] || 0) + (d.total_amount || 0);
  });
  const catData = Object.entries(catMap).map(([name, value]) => ({ name, value }));

  // Monthly breakdown (last 6 months)
  const monthMap = {};
  docs.forEach(d => {
    const month = (d.date_issued || d.created_date || "").slice(0, 7);
    if (!month) return;
    if (!monthMap[month]) monthMap[month] = { month, income: 0, expense: 0 };
    if (d.doc_type === "income") monthMap[month].income += d.total_amount || 0;
    else monthMap[month].expense += d.total_amount || 0;
  });
  const monthData = Object.values(monthMap).sort((a, b) => a.month.localeCompare(b.month)).slice(-6);

  const getInsight = async () => {
    setLoadingAI(true);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `אתה אנליסט פיננסי AI. נתח את הנתונים הבאים וספק תובנות עסקיות עמוקות בעברית (3-5 נקודות):
      הכנסות כוללות: ${formatCurrency(totalIncome)}
      הוצאות כוללות: ${formatCurrency(totalExpense)}
      מע"מ כולל: ${formatCurrency(totalVAT)}
      קטגוריות הוצאות: ${JSON.stringify(catData.slice(0, 5))}
      כמות מסמכים: ${docs.length}`,
    });
    setAiInsight(res);
    setLoadingAI(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">דוחות AI</h1>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>ניתוח פיננסי חכם מבוסס AI</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-4 neon-glow-cyan">
          <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>סה"כ הכנסות</p>
          <p className="text-2xl font-bold" style={{ color: "#00E5FF" }}>{formatCurrency(totalIncome)}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>סה"כ הוצאות</p>
          <p className="text-2xl font-bold" style={{ color: "#ff6b6b" }}>{formatCurrency(totalExpense)}</p>
        </div>
        <div className="glass-card p-4 neon-glow-amber">
          <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>רווח גולמי</p>
          <p className="text-2xl font-bold" style={{ color: totalIncome - totalExpense >= 0 ? "#4ade80" : "#ff6b6b" }}>
            {formatCurrency(totalIncome - totalExpense)}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly */}
        <div className="glass-card p-5">
          <p className="text-sm font-semibold text-white mb-4">הכנסות vs הוצאות לפי חודש</p>
          {monthData.length === 0 ? (
            <p className="text-sm text-center py-10" style={{ color: "rgba(255,255,255,0.3)" }}>אין נתונים</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthData}>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.35)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.35)" }} axisLine={false} tickLine={false} tickFormatter={v => `₪${(v/1000).toFixed(0)}K`} />
                <Tooltip contentStyle={{ background: "#111114", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#fff", fontSize: "12px" }} formatter={v => formatCurrency(v)} />
                <Bar dataKey="income" fill="#00E5FF" fillOpacity={0.7} radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#ff6b6b" fillOpacity={0.7} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Category Pie */}
        <div className="glass-card p-5">
          <p className="text-sm font-semibold text-white mb-4">פילוח לפי קטגוריה</p>
          {catData.length === 0 ? (
            <p className="text-sm text-center py-10" style={{ color: "rgba(255,255,255,0.3)" }}>אין נתונים</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={catData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {catData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#111114", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#fff", fontSize: "12px" }} formatter={v => formatCurrency(v)} />
                <Legend wrapperStyle={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* AI Insight */}
      <div className="glass-card p-5 neon-glow-purple">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={16} style={{ color: "#B388FF" }} />
            <p className="text-sm font-semibold text-white">תובנות AI</p>
          </div>
          <button onClick={getInsight} className="px-4 py-1.5 rounded-xl text-sm font-medium transition-all" style={{ background: "rgba(179,136,255,0.1)", color: "#B388FF", border: "1px solid rgba(179,136,255,0.25)" }} aria-label="ייצר ניתוח AI">
            {loadingAI ? "מנתח..." : "ייצר ניתוח"}
          </button>
        </div>
        {loadingAI ? (
          <div className="flex items-center gap-3 py-4">
            <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: "rgba(179,136,255,0.2)", borderTopColor: "#B388FF" }} />
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>ה-AI מנתח את הנתונים הפיננסיים שלך...</p>
          </div>
        ) : aiInsight ? (
          <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "rgba(255,255,255,0.75)" }}>{aiInsight}</p>
        ) : (
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>לחץ על "ייצר ניתוח" לקבלת תובנות AI מבוססות הנתונים שלך</p>
        )}
      </div>
    </div>
  );
}
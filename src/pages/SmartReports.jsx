import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from "recharts";
import { Sparkles, TrendingUp, Calendar, Download, RefreshCw, AlertTriangle } from "lucide-react";
import { formatCurrency, CHART_COLORS, CHART_TOOLTIP_STYLE, AXIS_TICK_STYLE } from "@/lib/format";
import KpiRow from "@/components/reports/KpiRow";
import AISummaryPanel from "@/components/reports/AISummaryPanel";
import GlassCard from "@/components/ui/GlassCard";
import NeonButton from "@/components/ui/NeonButton";

const REPORT_TYPES = [
  { id: "monthly", label: "דוח חודשי" },
  { id: "categories", label: "פילוח קטגוריות" },
  { id: "cashflow", label: "תחזית תזרים" },
  { id: "tax", label: "מס וחובות" },
];

function useReportsData() {
  const [docs, setDocs] = useState([]);
  const [txs, setTxs] = useState([]);

  useEffect(() => {
    Promise.all([
      base44.entities.Document.list("-created_date", 500),
      base44.entities.BankTransaction.list("-date", 200),
    ]).then(([d, t]) => { setDocs(d); setTxs(t); });
  }, []);

  return { docs, txs };
}

function computeReportData(docs, txs) {
  const monthMap = {};
  docs.forEach(d => {
    const m = (d.date_issued || d.created_date || "").slice(0, 7);
    if (!m) return;
    if (!monthMap[m]) monthMap[m] = { month: m, income: 0, expense: 0, vat: 0, docs: 0 };
    if (d.doc_type === "income") monthMap[m].income += d.total_amount || 0;
    else monthMap[m].expense += d.total_amount || 0;
    monthMap[m].vat += d.vat_amount || 0;
    monthMap[m].docs++;
  });
  const monthData = Object.values(monthMap).sort((a, b) => a.month.localeCompare(b.month)).slice(-12);

  const catMap = {};
  docs.forEach(d => {
    const cat = d.ai_category || "אחר";
    catMap[cat] = (catMap[cat] || 0) + (d.total_amount || 0);
  });
  const catData = Object.entries(catMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 8);

  const totalIncome = docs.filter(d => d.doc_type === "income").reduce((s, d) => s + (d.total_amount || 0), 0);
  const totalExpense = docs.filter(d => d.doc_type === "expense").reduce((s, d) => s + (d.total_amount || 0), 0);
  const totalVAT = docs.reduce((s, d) => s + (d.vat_amount || 0), 0);
  const netProfit = totalIncome - totalExpense;

  const lastBalance = txs.reduce((s, t) => s + (t.tx_type === "credit" ? (t.amount || 0) : -(t.amount || 0)), 0);
  const avgMonthly = monthData.length > 0
    ? monthData.reduce((s, m) => s + m.income - m.expense, 0) / monthData.length
    : 5000;
  const cashflowData = ["ינו", "פבר", "מרץ", "אפר", "מאי", "יוני", "יולי"].map((m, i) => ({
    month: m,
    actual: i < 3 ? Math.round(lastBalance + avgMonthly * (i - 2)) : null,
    forecast: i >= 2 ? Math.round(lastBalance + avgMonthly * (i - 2)) : null,
  }));

  return { monthData, catData, totalIncome, totalExpense, totalVAT, netProfit, avgMonthly, cashflowData };
}

export default function SmartReports() {
  const { docs, txs } = useReportsData();
  const [activeReport, setActiveReport] = useState("monthly");
  const [aiSummary, setAiSummary] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  const { monthData, catData, totalIncome, totalExpense, totalVAT, netProfit, avgMonthly, cashflowData } = computeReportData(docs, txs);

  const generateAI = async () => {
    setLoadingAI(true);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `אתה CFO AI מומחה. נתח את הנתונים הפיננסיים הבאים וצור דוח ניהולי מקצועי בעברית עם המלצות ספציפיות לשיפור:

📊 נתונים:
- סה"כ הכנסות: ${formatCurrency(totalIncome)}
- סה"כ הוצאות: ${formatCurrency(totalExpense)}  
- רווח נקי: ${formatCurrency(netProfit)}
- מע"מ שנאסף: ${formatCurrency(totalVAT)}
- מספר מסמכים: ${docs.length}
- קטגוריות הוצאה גדולות: ${catData.slice(0, 3).map(c => c.name + ": " + formatCurrency(c.value)).join(", ")}
- ממוצע חודשי: ${formatCurrency(avgMonthly)}

תוציא:
1. 🎯 סיכום ביצועים (2 שורות)
2. ⚠️ 3 סיכונים שזיהית
3. 💡 3 המלצות לשיפור מיידי
4. 📈 תחזית לרבעון הבא`,
    });
    setAiSummary(res);
    setLoadingAI(false);

    await base44.entities.Notification.create({
      type: "system",
      title: "דוח AI חדש נוצר",
      message: "מנוע הדוחות החכם יצר ניתוח פיננסי מעמיק. לחץ לצפייה.",
      severity: "info",
      action_url: "/smart-reports",
    });
  };

  const exportExcel = () => {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
      ["חודש", "הכנסות", "הוצאות", 'מע"מ', "מסמכים"],
      ...monthData.map(m => [m.month, m.income, m.expense, m.vat, m.docs]),
    ]), "דוח חודשי");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
      ["קטגוריה", "סכום"],
      ...catData.map(c => [c.name, c.value]),
    ]), "קטגוריות");
    XLSX.writeFile(wb, `ProFlow_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const exportPDF = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    doc.setFont("helvetica");
    doc.setFontSize(18);
    doc.text("ProFlow AI - Financial Report", 20, 20);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString("he-IL")}`, 20, 30);
    doc.setFontSize(13);
    doc.text("Summary", 20, 42);
    doc.setFontSize(10);
    doc.text(`Total Income: ${formatCurrency(totalIncome)}`, 20, 50);
    doc.text(`Total Expenses: ${formatCurrency(totalExpense)}`, 20, 57);
    doc.text(`Net Profit: ${formatCurrency(netProfit)}`, 20, 64);
    doc.text(`VAT Collected: ${formatCurrency(totalVAT)}`, 20, 71);
    doc.setFontSize(13);
    doc.text("Monthly Breakdown", 20, 83);
    doc.setFontSize(9);
    let y = 90;
    ["Month", "Income", "Expenses", "VAT", "Docs"].forEach((h, i) => doc.text(h, 20 + i * 34, y));
    y += 6;
    monthData.forEach(m => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.text(m.month, 20, y);
      doc.text(String(Math.round(m.income)), 54, y);
      doc.text(String(Math.round(m.expense)), 88, y);
      doc.text(String(Math.round(m.vat)), 122, y);
      doc.text(String(m.docs), 156, y);
      y += 7;
    });
    doc.save(`ProFlow_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">מנוע דוחות חכם</h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>ניתוח פיננסי AI מעמיק + תחזיות אוטומטיות</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <NeonButton onClick={exportExcel} color="#4ade80">
            <Download size={14} /> ייצוא Excel
          </NeonButton>
          <NeonButton onClick={exportPDF} color="#00E5FF">
            <Download size={14} /> ייצוא PDF
          </NeonButton>
          <NeonButton onClick={generateAI} disabled={loadingAI} color="#B388FF">
            {loadingAI ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
            {loadingAI ? "מנתח..." : "ייצר דוח AI"}
          </NeonButton>
        </div>
      </div>

      <KpiRow totalIncome={totalIncome} totalExpense={totalExpense} netProfit={netProfit} totalVAT={totalVAT} />

      {/* Report Tabs */}
      <div className="flex gap-2 flex-wrap">
        {REPORT_TYPES.map(r => (
          <button key={r.id} onClick={() => setActiveReport(r.id)}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: activeReport === r.id ? "rgba(0,229,255,0.1)" : "rgba(255,255,255,0.03)",
              color: activeReport === r.id ? "#00E5FF" : "rgba(255,255,255,0.45)",
              border: activeReport === r.id ? "1px solid rgba(0,229,255,0.25)" : "1px solid rgba(255,255,255,0.06)",
            }}>
            {r.label}
          </button>
        ))}
      </div>

      {/* Monthly */}
      {activeReport === "monthly" && (
        <GlassCard className="p-5">
          <p className="text-sm font-semibold text-white mb-4">הכנסות vs הוצאות — 12 חודשים אחרונים</p>
          {monthData.length === 0 ? (
            <div className="text-center py-16">
              <Calendar size={32} className="mx-auto mb-3" style={{ color: "rgba(255,255,255,0.1)" }} />
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>אין מסמכים עדיין</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthData} barGap={4}>
                <XAxis dataKey="month" tick={AXIS_TICK_STYLE} axisLine={false} tickLine={false} />
                <YAxis tick={AXIS_TICK_STYLE} axisLine={false} tickLine={false} tickFormatter={v => `₪${(v / 1000).toFixed(0)}K`} />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} formatter={v => formatCurrency(v)} />
                <Bar dataKey="income" name="הכנסות" fill="#00E5FF" fillOpacity={0.7} radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="הוצאות" fill="#ff6b6b" fillOpacity={0.7} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </GlassCard>
      )}

      {/* Categories */}
      {activeReport === "categories" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <GlassCard className="p-5">
            <p className="text-sm font-semibold text-white mb-4">פילוח לפי קטגוריה</p>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={catData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" paddingAngle={3}>
                  {catData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} formatter={v => formatCurrency(v)} />
              </PieChart>
            </ResponsiveContainer>
          </GlassCard>
          <GlassCard className="p-5">
            <p className="text-sm font-semibold text-white mb-4">טבלת קטגוריות</p>
            <div className="space-y-2">
              {catData.map((cat, i) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                    <span className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>{cat.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-white">{formatCurrency(cat.value)}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {/* Cashflow */}
      {activeReport === "cashflow" && (
        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} style={{ color: "#00E5FF" }} />
            <p className="text-sm font-semibold text-white">תחזית תזרים 90 יום — AI Predictive</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={cashflowData}>
              <defs>
                <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00E5FF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#B388FF" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#B388FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={AXIS_TICK_STYLE} axisLine={false} tickLine={false} />
              <YAxis tick={AXIS_TICK_STYLE} axisLine={false} tickLine={false} tickFormatter={v => `₪${(v / 1000).toFixed(0)}K`} />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} formatter={v => formatCurrency(v)} />
              <Area type="monotone" dataKey="actual" name="בפועל" stroke="#00E5FF" strokeWidth={2} fill="url(#actualGrad)" connectNulls={false} />
              <Area type="monotone" dataKey="forecast" name="תחזית AI" stroke="#B388FF" strokeWidth={2} strokeDasharray="5 4" fill="url(#forecastGrad)" connectNulls={false} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-3 justify-center">
            <div className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}><div className="w-6 h-0.5 rounded" style={{ background: "#00E5FF" }} /> נתונים בפועל</div>
            <div className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}><div className="w-6 h-0.5 rounded border-t-2 border-dashed" style={{ borderColor: "#B388FF" }} /> תחזית AI</div>
          </div>
        </GlassCard>
      )}

      {/* Tax */}
      {activeReport === "tax" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'מע"מ לתשלום (17%)', value: formatCurrency(totalIncome * 0.17), color: "#FFAB00", warning: totalIncome * 0.17 > 10000 },
              { label: "מקדמות מס הכנסה", value: formatCurrency(netProfit * 0.25), color: "#B388FF", warning: false },
              { label: "חוב מס כולל (הערכה)", value: formatCurrency(totalIncome * 0.17 + netProfit * 0.25), color: "#ff6b6b", warning: true },
            ].map(({ label, value, color, warning }) => (
              <GlassCard key={label} className="p-5" style={warning ? { border: `1px solid ${color}30` } : {}}>
                {warning && <div className="flex items-center gap-1.5 mb-2"><AlertTriangle size={12} style={{ color }} /><span className="text-xs" style={{ color }}>שים לב</span></div>}
                <p className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</p>
                <p className="text-2xl font-bold" style={{ color }}>{value}</p>
              </GlassCard>
            ))}
          </div>
          <GlassCard className="p-5">
            <p className="text-sm font-semibold text-white mb-4">מע"מ חודשי</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthData}>
                <XAxis dataKey="month" tick={AXIS_TICK_STYLE} axisLine={false} tickLine={false} />
                <YAxis tick={AXIS_TICK_STYLE} axisLine={false} tickLine={false} tickFormatter={v => `₪${(v / 1000).toFixed(0)}K`} />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} formatter={v => formatCurrency(v)} />
                <Bar dataKey="vat" name={'מע"מ'} fill="#FFAB00" fillOpacity={0.7} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>
      )}

      <AISummaryPanel summary={aiSummary} loading={loadingAI} />
    </div>
  );
}
import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, Sparkles, RefreshCw } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import AIAdviceModal from "../components/AIAdviceModal";
import AiSmartSummary from "../components/AiSmartSummary";
import TaxPredictorWidget from "../components/TaxPredictorWidget";

const formatCurrency = (n) =>
  new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS", maximumFractionDigits: 0 }).format(n || 0);

const StatCard = ({ title, value, sub, color, glow, icon: Icon }) => (
  <div className={`glass-card p-5 ${glow}`}>
    <div className="flex items-start justify-between mb-3">
      <p className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.45)" }}>{title}</p>
      {Icon && <Icon size={16} style={{ color }} />}
    </div>
    <p className="text-2xl font-bold mb-1" style={{ color }}>{value}</p>
    {sub && <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{sub}</p>}
  </div>
);

const StatusBadge = ({ status }) => {
  const map = {
    Verified: { label: "מאומת", color: "#00E5FF" },
    Archived: { label: "הותאם", color: "#4ade80" },
    Pending_Review: { label: "ממתין", color: "#FFAB00" },
    Processing: { label: "מעבד...", color: "#B388FF" },
  };
  const s = map[status] || { label: status, color: "#fff" };
  return (
    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${s.color}18`, color: s.color, border: `1px solid ${s.color}33` }}>
      {s.label}
    </span>
  );
};

export default function Dashboard() {
  const [docs, setDocs] = useState([]);
  const [txs, setTxs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.Document.list("-created_date", 50),
      base44.entities.BankTransaction.list("-date", 100),
    ]).then(([d, t]) => {
      setDocs(d);
      setTxs(t);
      setLoading(false);
    });
  }, []);

  const income = docs.filter(d => d.doc_type === "income");
  const expenses = docs.filter(d => d.doc_type === "expense");
  const totalIncome = income.reduce((s, d) => s + (d.total_amount || 0), 0);
  const totalExpenses = expenses.reduce((s, d) => s + (d.total_amount || 0), 0);
  const vatOwed = income.reduce((s, d) => s + (d.vat_amount || 0), 0) - expenses.reduce((s, d) => s + (d.vat_amount || 0), 0);
  const incomeTax = totalIncome * 0.15;
  const savings = expenses.reduce((s, d) => s + (d.vat_amount || 0), 0);

  // 90-day cashflow prediction
  const balance = txs.reduce((s, t) => s + (t.tx_type === "credit" ? t.amount : -t.amount || 0), 0);
  const avgMonthly = txs.length > 0 ? (txs.reduce((s, t) => s + (t.amount || 0), 0) / Math.max(1, txs.length)) * 30 : 5000;
  const cashflowData = Array.from({ length: 9 }, (_, i) => ({
    day: `יום ${(i + 1) * 10}`,
    balance: Math.max(0, balance + avgMonthly * (i - 3) + Math.random() * 2000 - 1000),
  }));

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white mb-1">המיליונים שלך עובדים בשבילך. הנה תמונת המצב.</h1>
        <p className="text-xs md:text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>עדכון אחרון: {new Date().toLocaleDateString("he-IL")}</p>
      </div>

      {/* AI Smart Summary */}
      <AiSmartSummary totalIncome={totalIncome} totalExpenses={totalExpenses} vatOwed={vatOwed} docsCount={docs.length} />

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard title="הכנסות" value={formatCurrency(totalIncome)} sub={`${income.length} מסמכים`} color="#00E5FF" glow="neon-glow-cyan" icon={TrendingUp} />
        <StatCard title="הוצאות" value={formatCurrency(totalExpenses)} sub={`${expenses.length} מסמכים`} color="#ff6b6b" icon={TrendingDown} />
        <StatCard title='מע"מ לתשלום' value={formatCurrency(vatOwed)} sub="חבות מס בזמן אמת" color="#FFAB00" glow="neon-glow-amber" icon={AlertTriangle} />
        <StatCard title='חסכון מע"מ' value={formatCurrency(savings)} sub="ניכוי מס תשומות" color="#B388FF" glow="neon-glow-purple" icon={Sparkles} />
      </div>

      {/* Tax Predictor AI Widget */}
      <TaxPredictorWidget
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        vatOwed={vatOwed}
        incomeTax={incomeTax}
      />

      {/* Tax Widget + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Tax Clock */}
        <div className="glass-card p-6 neon-glow-amber lg:col-span-1">
          <p className="text-xs font-semibold mb-4" style={{ color: "#FFAB00" }}>חבות מס בזמן אמת (אל תנחש, תדע)</p>
          <div className="space-y-4 mb-5">
            <div>
              <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>מע"מ לתשלום</p>
              <p className="text-3xl font-black" style={{ color: "#FFAB00" }}>{formatCurrency(vatOwed)}</p>
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>מקדמת מס הכנסה</p>
              <p className="text-2xl font-bold" style={{ color: "#ff6b6b" }}>{formatCurrency(incomeTax)}</p>
            </div>
          </div>
          <button onClick={() => setShowModal(true)} className="w-full btn-amber rounded-xl py-2.5 text-sm font-semibold">
            ⚡ אופטימיזציית מס עכשיו
          </button>
        </div>

        {/* Cashflow Chart */}
        <div className="glass-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold" style={{ color: "#00E5FF" }}>תחזית תזרים 90 יום</p>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(0,229,255,0.1)", color: "#00E5FF", border: "1px solid rgba(0,229,255,0.2)" }}>AI Predictive</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={cashflowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.35)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.35)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₪${(v / 1000).toFixed(0)}K`} />
              <Tooltip contentStyle={{ background: "#111114", border: "1px solid rgba(0,229,255,0.2)", borderRadius: "10px", color: "#fff", fontSize: "12px" }} formatter={(v) => [formatCurrency(v), "יתרה"]} />
              <Line type="monotone" dataKey="balance" stroke="#00E5FF" strokeWidth={2} dot={false} style={{ filter: "drop-shadow(0 0 6px #00E5FF)" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-white">פיד פעילות — מסמכים אחרונים</p>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{docs.length} מסמכים סה"כ</span>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: "rgba(0,229,255,0.2)", borderTopColor: "#00E5FF" }} />
          </div>
        ) : docs.length === 0 ? (
          <div className="text-center py-10" style={{ color: "rgba(255,255,255,0.3)" }}>
            <p className="text-sm">אין מסמכים עדיין</p>
          </div>
        ) : (
          <div className="space-y-2">
            {docs.slice(0, 8).map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl transition-colors" style={{ background: "rgba(255,255,255,0.02)" }}>
                <div className="flex items-center gap-3">
                  {doc.status === "Archived" ? <CheckCircle size={14} style={{ color: "#4ade80" }} /> : <Clock size={14} style={{ color: "#FFAB00" }} />}
                  <div>
                    <p className="text-sm font-medium text-white">{doc.supplier_name || "ספק לא ידוע"}</p>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{doc.date_issued || doc.created_date?.split("T")[0]}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-semibold" style={{ color: doc.doc_type === "income" ? "#00E5FF" : "#ff6b6b" }}>
                    {doc.doc_type === "income" ? "+" : "-"}{formatCurrency(doc.total_amount)}
                  </p>
                  <StatusBadge status={doc.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && <AIAdviceModal vatOwed={vatOwed} incomeTax={incomeTax} totalIncome={totalIncome} onClose={() => setShowModal(false)} />}
    </div>
  );
}
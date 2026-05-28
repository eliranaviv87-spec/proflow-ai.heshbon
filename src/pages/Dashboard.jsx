import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { TrendingUp, TrendingDown, AlertTriangle, Sparkles } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import StatCard from "@/components/dashboard/StatCard";
import TaxClockWidget from "@/components/dashboard/TaxClockWidget";
import CashflowChart from "@/components/dashboard/CashflowChart";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import AIAdviceModal from "@/components/AIAdviceModal";
import AiSmartSummary from "@/components/AiSmartSummary";
import TaxPredictorWidget from "@/components/TaxPredictorWidget";
import NextStepsWidget from "@/components/NextStepsWidget";

function useDashboardData() {
  const [docs, setDocs] = useState([]);
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.Document.list("-created_date", 50),
      base44.entities.BankTransaction.list("-date", 100),
    ]).then(([d, t]) => {
      setDocs(d);
      setTxs(t);
    }).finally(() => setLoading(false));

    const unsub = base44.entities.Document.subscribe((event) => {
      if (event.type === "create") setDocs(prev => [event.data, ...prev]);
      else if (event.type === "update") setDocs(prev => prev.map(d => d.id === event.id ? event.data : d));
      else if (event.type === "delete") setDocs(prev => prev.filter(d => d.id !== event.id));
    });
    return () => unsub();
  }, []);

  return { docs, txs, loading };
}

function computeFinancials(docs, txs) {
  const income = docs.filter(d => d.doc_type === "income");
  const expenses = docs.filter(d => d.doc_type === "expense");
  const totalIncome = income.reduce((s, d) => s + (d.total_amount || 0), 0);
  const totalExpenses = expenses.reduce((s, d) => s + (d.total_amount || 0), 0);
  const vatOwed = income.reduce((s, d) => s + (d.vat_amount || 0), 0) - expenses.reduce((s, d) => s + (d.vat_amount || 0), 0);
  const incomeTax = totalIncome * 0.15;
  const savings = expenses.reduce((s, d) => s + (d.vat_amount || 0), 0);

  const balance = txs.reduce((s, t) => s + (t.tx_type === "credit" ? t.amount : -(t.amount || 0)), 0);
  const avgMonthly = txs.length > 0
    ? (txs.reduce((s, t) => s + (t.amount || 0), 0) / Math.max(1, txs.length)) * 30
    : 5000;
  const cashflowData = Array.from({ length: 9 }, (_, i) => ({
    day: `יום ${(i + 1) * 10}`,
    balance: Math.max(0, balance + avgMonthly * (i - 3) + Math.random() * 2000 - 1000),
  }));

  return { income, expenses, totalIncome, totalExpenses, vatOwed, incomeTax, savings, cashflowData };
}

export default function Dashboard() {
  const { docs, txs, loading } = useDashboardData();
  const [showModal, setShowModal] = useState(false);
  const { income, expenses, totalIncome, totalExpenses, vatOwed, incomeTax, savings, cashflowData } = computeFinancials(docs, txs);

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white mb-1">המיליונים שלך עובדים בשבילך. הנה תמונת המצב.</h1>
        <p className="text-xs md:text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>עדכון אחרון: {new Date().toLocaleDateString("he-IL")}</p>
      </div>

      <NextStepsWidget docs={docs} />
      <AiSmartSummary totalIncome={totalIncome} totalExpenses={totalExpenses} vatOwed={vatOwed} docsCount={docs.length} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard title="הכנסות" value={formatCurrency(totalIncome)} sub={`${income.length} מסמכים`} color="#00E5FF" glow="cyan" icon={TrendingUp} />
        <StatCard title="הוצאות" value={formatCurrency(totalExpenses)} sub={`${expenses.length} מסמכים`} color="#ff6b6b" icon={TrendingDown} />
        <StatCard title='מע"מ לתשלום' value={formatCurrency(vatOwed)} sub="חבות מס בזמן אמת" color="#FFAB00" glow="amber" icon={AlertTriangle} />
        <StatCard title='חסכון מע"מ' value={formatCurrency(savings)} sub="ניכוי מס תשומות" color="#B388FF" glow="purple" icon={Sparkles} />
      </div>

      <TaxPredictorWidget totalIncome={totalIncome} totalExpenses={totalExpenses} vatOwed={vatOwed} incomeTax={incomeTax} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <TaxClockWidget vatOwed={vatOwed} incomeTax={incomeTax} onOptimize={() => setShowModal(true)} />
        <CashflowChart data={cashflowData} />
      </div>

      <ActivityFeed docs={docs} loading={loading} />

      {showModal && (
        <AIAdviceModal vatOwed={vatOwed} incomeTax={incomeTax} totalIncome={totalIncome} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
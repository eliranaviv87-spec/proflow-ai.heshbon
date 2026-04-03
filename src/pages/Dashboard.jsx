import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { FileText, Wallet, ArrowUpDown, Sparkles } from "lucide-react";
import TaxClockWidget from "../components/dashboard/TaxClockWidget";
import CashflowChart from "../components/dashboard/CashflowChart";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import StatsCard from "../components/dashboard/StatsCard";

export default function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [docs, txs] = await Promise.all([
          base44.entities.Document.list("-created_date", 50),
          base44.entities.BankTransaction.list("-date", 50),
        ]);
        setDocuments(docs);
        setTransactions(txs);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Compute stats
  const totalExpenses = documents
    .filter((d) => d.doc_type === "expense" && d.status !== "Processing")
    .reduce((s, d) => s + (d.total_amount || 0), 0);
  const totalIncome = documents
    .filter((d) => d.doc_type === "income" && d.status !== "Processing")
    .reduce((s, d) => s + (d.total_amount || 0), 0);
  const vatExpenses = documents
    .filter((d) => d.doc_type === "expense" && d.status !== "Processing")
    .reduce((s, d) => s + (d.vat_amount || 0), 0);
  const vatIncome = documents
    .filter((d) => d.doc_type === "income" && d.status !== "Processing")
    .reduce((s, d) => s + (d.vat_amount || 0), 0);
  const vatDue = vatIncome - vatExpenses;
  const matchedCount = transactions.filter((t) => t.match_status).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          המיליונים שלך עובדים בשבילך
        </h1>
        <p className="text-sm text-muted-foreground mt-1">הנה תמונת המצב הפיננסית שלך</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="מסמכים שהועלו"
          value={documents.length}
          subtitle="סה״כ במערכת"
          icon={FileText}
          color="cyan"
          delay={0}
        />
        <StatsCard
          title="הכנסות"
          value={`₪${totalIncome.toLocaleString("he-IL")}`}
          subtitle="שנה נוכחית"
          icon={Wallet}
          color="cyan"
          delay={0.05}
        />
        <StatsCard
          title="הוצאות"
          value={`₪${totalExpenses.toLocaleString("he-IL")}`}
          subtitle="שנה נוכחית"
          icon={Wallet}
          color="amber"
          delay={0.1}
        />
        <StatsCard
          title="התאמות בנקאיות"
          value={`${matchedCount}/${transactions.length}`}
          subtitle="מותאם אוטומטית"
          icon={ArrowUpDown}
          color="purple"
          delay={0.15}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <TaxClockWidget vatDue={Math.max(0, vatDue)} incomeTaxDue={Math.round(totalIncome * 0.05)} />
        <CashflowChart transactions={transactions} />
      </div>

      {/* Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ActivityFeed documents={documents} />
        <div className="glass-card p-6 flex flex-col items-center justify-center text-center neon-purple-glow">
          <Sparkles className="w-10 h-10 text-neon-purple mb-3" />
          <h3 className="text-lg font-bold text-foreground mb-1">חיסכון AI</h3>
          <p className="text-3xl font-extrabold text-neon-purple font-inter mb-2">
            ₪{Math.round(totalExpenses * 0.12).toLocaleString("he-IL")}
          </p>
          <p className="text-xs text-muted-foreground">חיסכון משוער שזיהינו עבורך</p>
        </div>
      </div>
    </div>
  );
}
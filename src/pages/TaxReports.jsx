import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { FileText, Download, Plus, CheckCircle, Clock, AlertTriangle, Sparkles } from "lucide-react";

const formatCurrency = (n) =>
  new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS", maximumFractionDigits: 0 }).format(n || 0);

const statusConfig = {
  Draft: { label: "טיוטה", color: "#FFAB00" },
  Ready: { label: "מוכן להגשה", color: "#00E5FF" },
  Submitted: { label: "הוגש", color: "#4ade80" },
};

function generatePCN874(report) {
  const lines = [
    `PCN874`,
    `PERIOD:${report.period}`,
    `TOTAL_INCOME:${report.total_income || 0}`,
    `TOTAL_EXPENSES:${report.total_expenses || 0}`,
    `VAT_DUE:${report.vat_due || 0}`,
    `INCOME_TAX_DUE:${report.income_tax_due || 0}`,
    `GENERATED:${new Date().toISOString()}`,
  ];
  return lines.join("\n");
}

export default function TaxReports() {
  const [reports, setReports] = useState([]);
  const [docs, setDocs] = useState([]);
  const [generating, setGenerating] = useState(false);

  const load = async () => {
    const [r, d] = await Promise.all([
      base44.entities.TaxReport.list("-period", 24),
      base44.entities.Document.list("-date_issued", 200),
    ]);
    setReports(r);
    setDocs(d);
  };

  useEffect(() => { load(); }, []);

  const generateCurrentReport = async () => {
    setGenerating(true);
    const period = new Date().toISOString().slice(0, 7);
    const periodDocs = docs.filter(d => (d.date_issued || "").startsWith(period));

    const totalIncome = periodDocs.filter(d => d.doc_type === "income").reduce((s, d) => s + (d.total_amount || 0), 0);
    const totalExpenses = periodDocs.filter(d => d.doc_type === "expense").reduce((s, d) => s + (d.total_amount || 0), 0);
    const vatIncome = periodDocs.filter(d => d.doc_type === "income").reduce((s, d) => s + (d.vat_amount || 0), 0);
    const vatExpenses = periodDocs.filter(d => d.doc_type === "expense").reduce((s, d) => s + (d.vat_amount || 0), 0);
    const vatDue = vatIncome - vatExpenses;
    const incomeTaxDue = totalIncome * 0.15;

    const existing = reports.find(r => r.period === period);
    const data = {
      period,
      total_income: totalIncome,
      total_expenses: totalExpenses,
      vat_due: vatDue,
      income_tax_due: incomeTaxDue,
      status: "Ready",
      pcn874_data: generatePCN874({ period, total_income: totalIncome, total_expenses: totalExpenses, vat_due: vatDue, income_tax_due: incomeTaxDue }),
    };

    if (existing) {
      await base44.entities.TaxReport.update(existing.id, data);
    } else {
      await base44.entities.TaxReport.create(data);
    }

    await load();
    setGenerating(false);
  };

  const downloadPCN874 = (report) => {
    const content = report.pcn874_data || generatePCN874(report);
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `PCN874_${report.period}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">דוחות מס</h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>מע"מ, מקדמות מס הכנסה ויצוא PCN874</p>
        </div>
        <button
          onClick={generateCurrentReport}
          disabled={generating}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
          style={{ background: "rgba(0,229,255,0.1)", color: "#00E5FF", border: "1px solid rgba(0,229,255,0.25)" }}
          aria-label="צור דוח לחודש הנוכחי"
        >
          {generating ? <Sparkles size={14} className="animate-pulse" /> : <Plus size={14} />}
          {generating ? "מחשב..." : "צור דוח לחודש הנוכחי"}
        </button>
      </div>

      {reports.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <FileText size={40} className="mx-auto mb-3" style={{ color: "rgba(255,255,255,0.2)" }} />
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>אין דוחות עדיין. לחץ "צור דוח" ליצירת הדוח הראשון.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => {
            const s = statusConfig[report.status] || statusConfig.Draft;
            return (
              <div key={report.id} className="glass-card p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${s.color}15` }}>
                    <FileText size={18} style={{ color: s.color }} />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{report.period}</p>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                      מע"מ: {formatCurrency(report.vat_due)} · מקדמות: {formatCurrency(report.income_tax_due)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-left">
                    <p className="text-xs mb-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>הכנסות</p>
                    <p className="text-sm font-semibold" style={{ color: "#00E5FF" }}>{formatCurrency(report.total_income)}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-xs mb-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>הוצאות</p>
                    <p className="text-sm font-semibold" style={{ color: "#ff6b6b" }}>{formatCurrency(report.total_expenses)}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full" style={{ background: `${s.color}15`, color: s.color, border: `1px solid ${s.color}30` }}>
                    {s.label}
                  </span>
                  <button
                    onClick={() => downloadPCN874(report)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                    style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.08)" }}
                    aria-label="הורד PCN874"
                  >
                    <Download size={12} /> PCN874
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
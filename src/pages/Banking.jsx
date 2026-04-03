import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link2, Link2Off, Plus, TrendingUp, TrendingDown } from "lucide-react";

const formatCurrency = (n) =>
  new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS", maximumFractionDigits: 0 }).format(n || 0);

export default function Banking() {
  const [txs, setTxs] = useState([]);
  const [docs, setDocs] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ date: "", description: "", amount: "", tx_type: "debit" });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [t, d] = await Promise.all([
      base44.entities.BankTransaction.list("-date", 100),
      base44.entities.Document.list("-created_date", 200),
    ]);
    setTxs(t);
    setDocs(d);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!form.date || !form.description || !form.amount) return;
    const tx = await base44.entities.BankTransaction.create({
      date: form.date,
      description: form.description,
      amount: parseFloat(form.amount),
      tx_type: form.tx_type,
      match_status: false,
    });

    // Auto-match
    const amount = parseFloat(form.amount);
    const txDate = new Date(form.date);
    const match = docs.find((doc) => {
      if (!doc.date_issued || doc.status === "Archived") return false;
      const diff = Math.abs(new Date(doc.date_issued) - txDate) / 86400000;
      return doc.total_amount === amount && diff <= 5;
    });

    if (match) {
      await base44.entities.BankTransaction.update(tx.id, { linked_doc_id: match.id, match_status: true });
      await base44.entities.Document.update(match.id, { status: "Archived" });
      await base44.entities.AuditLog.create({ action: `התאמה אוטומטית מעסקה: ${tx.id} ← ${match.id}`, entity_type: "BankTransaction", entity_id: tx.id });
    }

    setForm({ date: "", description: "", amount: "", tx_type: "debit" });
    setShowAdd(false);
    load();
  };

  const totalCredit = txs.filter(t => t.tx_type === "credit").reduce((s, t) => s + (t.amount || 0), 0);
  const totalDebit = txs.filter(t => t.tx_type === "debit").reduce((s, t) => s + (t.amount || 0), 0);
  const matched = txs.filter(t => t.match_status).length;

  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px",
    color: "#fff",
    padding: "8px 12px",
    fontSize: "13px",
    outline: "none",
    width: "100%",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">בנקאות</h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>ניהול עסקאות והתאמות אוטומטיות</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="btn-cyan px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2" aria-label="הוסף עסקה">
          <Plus size={14} /> הוסף עסקה
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-4 neon-glow-cyan">
          <p className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>זיכויים</p>
          <p className="text-xl font-bold" style={{ color: "#00E5FF" }}>{formatCurrency(totalCredit)}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>חיובים</p>
          <p className="text-xl font-bold" style={{ color: "#ff6b6b" }}>{formatCurrency(totalDebit)}</p>
        </div>
        <div className="glass-card p-4 neon-glow-purple">
          <p className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>הותאמו אוטומטית</p>
          <p className="text-xl font-bold" style={{ color: "#B388FF" }}>{matched} / {txs.length}</p>
        </div>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="glass-card p-5 neon-glow-cyan">
          <p className="text-sm font-semibold text-white mb-4">הוספת עסקה ידנית</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={inputStyle} aria-label="תאריך" />
            <input type="text" placeholder="תיאור" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={inputStyle} aria-label="תיאור" />
            <input type="number" placeholder="סכום" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} style={inputStyle} aria-label="סכום" />
            <select value={form.tx_type} onChange={e => setForm({ ...form, tx_type: e.target.value })} style={inputStyle} aria-label="סוג עסקה">
              <option value="debit">חיוב</option>
              <option value="credit">זיכוי</option>
            </select>
          </div>
          <button onClick={handleAdd} className="btn-cyan px-5 py-2 rounded-xl text-sm font-medium">שמור</button>
        </div>
      )}

      {/* Transactions List */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <p className="text-sm font-semibold text-white">עסקאות</p>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: "rgba(0,229,255,0.2)", borderTopColor: "#00E5FF" }} />
          </div>
        ) : txs.length === 0 ? (
          <div className="text-center py-10" style={{ color: "rgba(255,255,255,0.3)" }}>
            <p className="text-sm">אין עסקאות עדיין</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
            {txs.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-white hover:bg-opacity-[0.02]">
                <div className="flex items-center gap-3">
                  {tx.tx_type === "credit" ? <TrendingUp size={16} style={{ color: "#00E5FF" }} /> : <TrendingDown size={16} style={{ color: "#ff6b6b" }} />}
                  <div>
                    <p className="text-sm font-medium text-white">{tx.description}</p>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{tx.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-sm font-semibold" style={{ color: tx.tx_type === "credit" ? "#00E5FF" : "#ff6b6b" }}>
                    {tx.tx_type === "credit" ? "+" : "-"}{formatCurrency(tx.amount)}
                  </p>
                  {tx.match_status ? (
                    <span className="flex items-center gap-1 text-xs" style={{ color: "#4ade80" }}><Link2 size={12} /> מותאם</span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}><Link2Off size={12} /> לא מותאם</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
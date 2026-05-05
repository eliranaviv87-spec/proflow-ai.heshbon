import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Zap, Plus, Minus, RefreshCw, ArrowUpCircle, Clock } from "lucide-react";
import { toast } from "sonner";

const ACTIONS = [
  { id: "add_credits", label: "הוסף קרדיטים", icon: Plus, color: "#4ade80" },
  { id: "remove_credits", label: "הסר קרדיטים", icon: Minus, color: "#ff6b6b" },
  { id: "reset_tokens", label: "אפס טוקנים", icon: RefreshCw, color: "#00E5FF" },
  { id: "change_plan", label: "שנה חבילה", icon: ArrowUpCircle, color: "#B388FF" },
  { id: "extend_discovery", label: "הארך Discovery", icon: Clock, color: "#FFAB00" },
];

const PLANS = ["Discovery", "Starter", "Pro", "Enterprise"];

export default function CreditsManager() {
  const [email, setEmail] = useState("");
  const [action, setAction] = useState("add_credits");
  const [amount, setAmount] = useState(1000);
  const [newPlan, setNewPlan] = useState("Starter");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10,
    color: "#fff",
    padding: "9px 13px",
    fontSize: 13,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  };

  const handleSubmit = async () => {
    if (!email.trim()) { toast.error("יש להזין אימייל"); return; }
    setLoading(true);
    try {
      const payload = { target_email: email, action, reason };
      if (["add_credits", "remove_credits"].includes(action)) payload.amount = amount;
      if (action === "change_plan") payload.new_plan = newPlan;

      const res = await base44.functions.invoke("adminAdjustCredits", payload);
      if (res.data?.success) {
        toast.success(res.data.description || "הפעולה בוצעה בהצלחה");
        setEmail(""); setReason("");
      } else {
        toast.error(res.data?.error || "שגיאה לא ידועה");
      }
    } catch (err) {
      toast.error("שגיאה: " + (err.message || "לא ידוע"));
    }
    setLoading(false);
  };

  const selectedAction = ACTIONS.find(a => a.id === action);

  return (
    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <Zap size={16} color="#FFAB00" />
        <span style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>ניהול קרדיטים ידני</span>
      </div>

      {/* Action Select */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {ACTIONS.map(a => (
          <button
            key={a.id}
            onClick={() => setAction(a.id)}
            style={{
              padding: "7px 14px",
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              background: action === a.id ? `${a.color}18` : "rgba(255,255,255,0.03)",
              color: action === a.id ? a.color : "rgba(255,255,255,0.4)",
              border: action === a.id ? `1px solid ${a.color}40` : "1px solid rgba(255,255,255,0.07)",
              display: "flex", alignItems: "center", gap: 5,
            }}
          >
            <a.icon size={11} /> {a.label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <div>
          <label style={{ display: "block", fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>אימייל משתמש</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="user@example.com"
            style={inputStyle}
          />
        </div>

        {["add_credits", "remove_credits"].includes(action) && (
          <div>
            <label style={{ display: "block", fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>כמות קרדיטים</label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(parseInt(e.target.value) || 0)}
              min="1"
              style={inputStyle}
            />
          </div>
        )}

        {action === "change_plan" && (
          <div>
            <label style={{ display: "block", fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>חבילה חדשה</label>
            <select value={newPlan} onChange={e => setNewPlan(e.target.value)} style={inputStyle}>
              {PLANS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        )}
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>סיבה (לשדה ביקורת)</label>
        <input
          type="text"
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="לדוגמה: תיקון שגיאה, פיצוי ללקוח..."
          style={inputStyle}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || !email}
        style={{
          padding: "11px 24px",
          borderRadius: 12,
          fontWeight: 800,
          fontSize: 13,
          cursor: loading || !email ? "not-allowed" : "pointer",
          background: loading ? "rgba(255,255,255,0.05)" : selectedAction ? `${selectedAction.color}18` : "rgba(0,229,255,0.12)",
          color: loading ? "rgba(255,255,255,0.3)" : selectedAction?.color || "#00E5FF",
          border: `1px solid ${selectedAction?.color || "#00E5FF"}30`,
          opacity: !email ? 0.5 : 1,
        }}
      >
        {loading ? "מבצע..." : `בצע: ${selectedAction?.label}`}
      </button>
    </div>
  );
}
import { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { MessageCircle, X, Send, Loader2, Ticket } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

export default function SupportChatWidget() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "שלום! אני סוכן התמיכה של ProFlow AI 🤖\nאיך אוכל לעזור לך היום?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [ticketCreated, setTicketCreated] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    const newMessages = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await base44.functions.invoke("aiSupportChat", {
        message: userMsg,
        history: newMessages.slice(-8),
      });
      const { reply, escalated, ticketId } = res.data;
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
      if (escalated && ticketId) setTicketCreated(ticketId);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "אירעה שגיאה. נסה שוב." }]);
    }
    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-20 md:bottom-6 left-6 z-[60] w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all"
        style={{
          background: open ? "rgba(255,107,107,0.9)" : "linear-gradient(135deg,#25D366,#128C7E)",
          boxShadow: "0 4px 24px rgba(37,211,102,0.35)",
        }}
        aria-label="פתח תמיכה"
      >
        {open ? <X size={22} color="#fff" /> : <MessageCircle size={22} color="#fff" />}
      </button>

      {/* Chat Panel */}
      {open && (
        <div
          className="fixed bottom-36 md:bottom-24 left-6 z-[60] w-80 rounded-2xl overflow-hidden flex flex-col"
          style={{
            height: 420,
            background: "#111114",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3" style={{ background: "rgba(37,211,102,0.1)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(37,211,102,0.2)" }}>
              <MessageCircle size={16} style={{ color: "#25D366" }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">תמיכת ProFlow AI</p>
              <p className="text-xs" style={{ color: "#25D366" }}>פעיל 24/7</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-start" : "justify-end"}`}>
                <div
                  className="max-w-[80%] px-3 py-2 rounded-2xl text-xs leading-relaxed whitespace-pre-line"
                  style={m.role === "user"
                    ? { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.8)" }
                    : { background: "rgba(37,211,102,0.12)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(37,211,102,0.15)" }
                  }
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-end">
                <div className="px-3 py-2 rounded-2xl text-xs" style={{ background: "rgba(37,211,102,0.08)", color: "#25D366" }}>
                  <Loader2 size={12} className="animate-spin inline mr-1" /> מעבד...
                </div>
              </div>
            )}
            {ticketCreated && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs" style={{ background: "rgba(179,136,255,0.08)", border: "1px solid rgba(179,136,255,0.2)", color: "#B388FF" }}>
                <Ticket size={12} /> פנייה נפתחה — SLA 48 שעות
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 flex gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="כתוב שאלה..."
              className="flex-1 text-xs px-3 py-2 rounded-xl outline-none"
              style={{ background: "rgba(255,255,255,0.05)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" }}
            />
            <button onClick={sendMessage} disabled={loading || !input.trim()}
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(37,211,102,0.15)", color: "#25D366" }}>
              <Send size={13} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
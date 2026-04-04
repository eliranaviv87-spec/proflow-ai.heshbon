import { Link } from "react-router-dom";
import { Zap, FileText, AlertTriangle } from "lucide-react";
import Footer from "../components/Footer";

const SECTIONS = [
  {
    title: "1. הסכמה לתנאים",
    content: "שימוש בפלטפורמת ProFlow AI מהווה הסכמה מלאה לתנאים אלה. אם אינך מסכים לתנאים, אנא הפסק את השימוש מיידית. תנאים אלה מהווים הסכם משפטי מחייב בינך לבין ProFlow AI Ltd.",
    warning: false,
  },
  {
    title: "2. תיאור השירות",
    content: "ProFlow AI מספקת פלטפורמה לניהול פיננסי אוטומטי הכוללת: OCR לחשבוניות, ניתוח AI, חישובי מס, דוחות פיננסיים, וניהול תזרים מזומנים. השירות מיועד לעסקים הפועלים בישראל.",
    warning: false,
  },
  {
    title: "3. חבילות ומחירים",
    content: "שלוש חבילות עיקריות: Starter (₪199/חודש), Pro (₪399/חודש), Enterprise (₪999/חודש). Discovery Plan (₪99/חודש) תקפה ל-3 חודשים בלבד, לאחריה שדרוג אוטומטי ל-Starter. מחירים חודשיים ללא התחייבות כוללים תוספת 25%.",
    warning: false,
  },
  {
    title: "4. ביטול ומדיניות החזרים",
    content: "ניתן לבטל מנוי בכל עת. ביטול ייכנס לתוקף בסוף תקופת החיוב הנוכחית. אין החזרים כספיים על תקופות חיוב שכבר עברו. קרדיטים AI שנרכשו אינם ניתנים להחזרה לאחר ניצול חלקי.",
    warning: false,
  },
  {
    title: "5. אחריות המשתמש",
    content: "המשתמש אחראי ל: (א) דיוק הנתונים המוזנים למערכת; (ב) עמידה בהתחייבויות המס שלו; (ג) שמירת סודיות פרטי הגישה; (ד) שימוש בשירות אך ורק לפעילות חוקית. ProFlow AI אינה רואה חשבון מורשה ואינה מספקת ייעוץ מס מחייב.",
    warning: true,
  },
  {
    title: "6. הגבלת אחריות",
    content: "ProFlow AI לא תישא באחריות לנזקים עקיפים, תוצאתיים, עונשיים או מיוחדים. האחריות המקסימלית של החברה מוגבלת לסכום ששולם על ידי המשתמש ב-12 החודשים שקדמו לאירוע.",
    warning: true,
  },
  {
    title: "7. קניין רוחני",
    content: "כל תוכן הפלטפורמה, לרבות קוד, עיצוב, לוגו, ואלגוריתמים, הינו רכושה הבלעדי של ProFlow AI ומוגן בזכויות יוצרים. אין להעתיק, לשכפל או לחקות ללא אישור בכתב מראש.",
    warning: false,
  },
  {
    title: "8. דין שיפוט",
    content: "תנאים אלה כפופים לדין הישראלי. סכסוכים יידונו בבית המשפט המוסמך במחוז תל אביב. הצדדים מסכימים לנסות ליישב מחלוקות בגישור לפני פנייה לערכאות משפטיות.",
    warning: false,
  },
  {
    title: "9. שינויים בתנאים",
    content: "ProFlow AI שומרת על הזכות לעדכן תנאים אלה בכל עת. הודעה על שינויים מהותיים תישלח ל-30 יום מראש. המשך שימוש לאחר כניסת השינויים לתוקף מהווה הסכמה לתנאים המעודכנים.",
    warning: false,
  },
];

export default function TermsOfService() {
  return (
    <div dir="rtl" style={{ background: "#0A0A0A", minHeight: "100vh", color: "#fff", fontFamily: "Heebo, sans-serif" }}>
      <nav style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(10,10,10,0.97)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <Link to="/landing" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <Zap size={18} color="#D4AF37" />
            <span style={{ fontWeight: 900, fontSize: 18, color: "#fff" }}>ProFlow<span style={{ color: "#00E5FF" }}>AI</span></span>
          </Link>
          <Link to="/" style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, textDecoration: "none" }}>→ כניסה למערכת</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "56px 24px 80px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FileText size={22} color="#D4AF37" />
          </div>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 900 }}>תנאי שימוש</h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>עדכון אחרון: אפריל 2025 | ProFlow AI Ltd.</p>
          </div>
        </div>

        <div style={{ padding: "16px 20px", background: "rgba(255,171,0,0.06)", border: "1px solid rgba(255,171,0,0.2)", borderRadius: 14, marginBottom: 36, fontSize: 14, color: "rgba(255,171,0,0.85)", lineHeight: 1.7, display: "flex", gap: 12, alignItems: "flex-start" }}>
          <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
          <span>ProFlow AI אינה מספקת ייעוץ מס, ייעוץ משפטי או ייעוץ פיננסי מחייב. כל המידע והחישובים הינם להמחשה בלבד. יש להתייעץ עם רואה חשבון מורשה לפני קבלת החלטות פיננסיות.</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {SECTIONS.map(({ title, content, warning }) => (
            <div key={title} style={{
              background: warning ? "rgba(255,107,107,0.03)" : "rgba(255,255,255,0.02)",
              border: `1px solid ${warning ? "rgba(255,107,107,0.15)" : "rgba(255,255,255,0.06)"}`,
              borderRadius: 16, padding: "22px 26px"
            }}>
              {warning && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <AlertTriangle size={13} color="#ff6b6b" />
                  <span style={{ fontSize: 11, color: "#ff6b6b", fontWeight: 700 }}>חשוב לקרוא</span>
                </div>
              )}
              <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 10, color: "#fff" }}>{title}</h2>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.85 }}>{content}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 40, textAlign: "center", padding: "20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14 }}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
            לשאלות: legal@proflow.ai | ProFlow AI Ltd. | תל אביב, ישראל
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
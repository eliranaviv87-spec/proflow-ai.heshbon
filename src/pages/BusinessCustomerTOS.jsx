import { Link } from "react-router-dom";
import { Shield, ArrowRight } from "lucide-react";

const SECTIONS = [
  {
    title: "1. הסכם זה",
    content: "הסכם תנאי שימוש זה ('ההסכם') נכנס לתוקף ביום ההרשמה לשירות ProFlow AI ('השירות'). על ידי הרשמה לשירות, הלקוח מסכים לתנאים המפורטים בהסכם זה.",
  },
  {
    title: "2. היקף השירות",
    content: "ProFlow AI מספקת פלטפורמת ניהול פיננסי מבוסס בינה מלאכותית הכוללת: עיבוד מסמכים אוטומטי (OCR), ניתוח פיננסי, חישוב מס, חיבור לרשויות המס הישראליות, ניהול תזרים מזומנים ואוטומציות עסקיות.",
  },
  {
    title: "3. תמחור ותשלומים",
    content: "המחירים הינם: Starter – ₪199/חודש, Pro – ₪399/חודש, Enterprise – ₪999/חודש. התשלום מבוצע מראש בתחילת כל תקופת חיוב. אי תשלום יביא להשעיית הגישה לשירות.",
  },
  {
    title: "4. מגבלות AI ומדיניות שימוש הוגן",
    content: "חבילת Starter כוללת 50,000 טוקנים/חודש עם מודל GPT-4o Mini. חבילת Pro כוללת 200,000 טוקנים/חודש עם מודל GPT-4o Full. חבילת Enterprise כוללת שימוש ללא הגבלה בכפוף למדיניות שימוש הוגן, עם מודלים Claude 3.5 Sonnet ו-GPT-4o.",
  },
  {
    title: "5. פרטיות ואבטחת מידע",
    content: "ProFlow AI מחויבת לאבטחת המידע הפיננסי של לקוחותיה. כל המידע מוצפן ב-AES-256 ומאוחסן בשרתים מאובטחים בישראל ו/או באיחוד האירופי. ProFlow AI לא תמכור, תשאיל או תעביר מידע אישי לצדדים שלישיים ללא הסכמה מפורשת.",
  },
  {
    title: "6. זמינות השירות (SLA)",
    content: "ProFlow AI מתחייבת לזמינות שירות של 99.5% בחבילת Pro ו-99.9% בחבילת Enterprise. תקלות מתוכננות יימסרו מראש. פיצוי ניתן בגין הפרת SLA על פי הסכם נפרד.",
  },
  {
    title: "7. הגבלת אחריות",
    content: "ProFlow AI אינה אחראית לנזקים עקיפים, מקריים או תוצאתיים הנובעים מהשימוש בשירות. האחריות המקסימלית של ProFlow AI מוגבלת לסכום ששולם עבור השירות ב-12 החודשים האחרונים.",
  },
  {
    title: "8. סיום ההסכם",
    content: "כל צד רשאי לסיים את ההסכם בהודעה של 30 יום מראש. במקרה של הפרה מהותית, ProFlow AI רשאית לסיים את השירות מיידית. אין החזר כספי לתקופות שכבר חויבו.",
  },
  {
    title: "9. שינויים בתנאים",
    content: "ProFlow AI שומרת לעצמה את הזכות לשנות תנאים אלו בכל עת, בהודעה מוקדמת של 14 יום. המשך השימוש בשירות לאחר ההודעה מהווה הסכמה לתנאים החדשים.",
  },
  {
    title: "10. סמכות שיפוטית",
    content: "הסכם זה כפוף לחוקי מדינת ישראל. כל מחלוקת תידון בבתי המשפט המוסמכים בתל אביב-יפו.",
  },
];

export default function BusinessCustomerTOS() {
  return (
    <div dir="rtl" style={{ background: "#0A0A0A", minHeight: "100vh", color: "#fff", fontFamily: "Heebo, sans-serif" }}>
      {/* Nav */}
      <nav style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(10,10,10,0.95)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 50 }}>
        <Link to="/landing" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: "rgba(255,255,255,0.6)", fontSize: 14 }}>
          <ArrowRight size={16} /> חזור לדף הבית
        </Link>
        <span style={{ fontWeight: 800, fontSize: 16 }}>ProFlow<span style={{ color: "#00E5FF" }}>AI</span></span>
      </nav>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(0,229,255,0.1)", border: "1px solid rgba(0,229,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Shield size={26} style={{ color: "#00E5FF" }} />
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 12 }}>תנאי שימוש — לקוח עסקי</h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>עדכון אחרון: אפריל 2025 | גרסה 1.0</p>
        </div>

        {/* Intro */}
        <div style={{ background: "rgba(0,229,255,0.05)", border: "1px solid rgba(0,229,255,0.15)", borderRadius: 16, padding: "20px 24px", marginBottom: 40 }}>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, lineHeight: 1.8 }}>
            ברוכים הבאים ל-ProFlow AI. בטרם תשתמשו בשירות, אנא קראו תנאים אלו בעיון. שימוש בשירות מהווה הסכמה מלאה לתנאים אלו.
          </p>
        </div>

        {/* Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {SECTIONS.map(({ title, content }) => (
            <div key={title} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "24px" }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: "#00E5FF" }}>{title}</h2>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, lineHeight: 1.8 }}>{content}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 48, padding: "24px", background: "rgba(255,255,255,0.02)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)" }}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 12 }}>לשאלות בנוגע לתנאי שימוש אלו, צור קשר:</p>
          <a href="mailto:legal@proflow.ai" style={{ color: "#00E5FF", fontSize: 14, textDecoration: "none" }}>legal@proflow.ai</a>
        </div>
      </div>
    </div>
  );
}
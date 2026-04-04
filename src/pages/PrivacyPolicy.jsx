import { Link } from "react-router-dom";
import { Zap, Shield } from "lucide-react";
import Footer from "../components/Footer";

const SECTIONS = [
  {
    title: "1. מבוא",
    content: "ProFlow AI ('החברה', 'אנו') מחויבת להגנה על פרטיותך. מדיניות זו מסבירה כיצד אנו אוספים, משתמשים ומגנים על המידע שלך בהתאם לחוק הגנת הפרטיות הישראלי ותקנות GDPR.",
  },
  {
    title: "2. מידע שאנו אוספים",
    content: "אנו אוספים: (א) מידע זיהוי — שם, כתובת דוא\"ל, מספר טלפון; (ב) מידע עסקי — חשבוניות, עסקאות, מסמכים פיננסיים; (ג) נתוני שימוש — כיצד אתה משתמש בפלטפורמה; (ד) מידע טכני — כתובת IP, סוג הדפדפן, מזהה המכשיר.",
  },
  {
    title: "3. כיצד אנו משתמשים במידע",
    content: "המידע שנאסף משמש אך ורק ל: (א) מתן שירותי ניהול פיננסי; (ב) שיפור חוויית המשתמש; (ג) עמידה בחובות משפטיות ורגולטוריות; (ד) שליחת עדכונים חיוניים הקשורים לחשבונך.",
  },
  {
    title: "4. אבטחת מידע",
    content: "כל הנתונים מוצפנים ב-AES-256 במנוחה ו-TLS 1.3 בתעבורה. אנו מיישמים בקרות גישה קפדניות, ביקורות אבטחה תקופתיות ועמידה בתקן SOC 2 Type II. הגישה למידע רגיש מוגבלת לעובדים מורשים בלבד.",
  },
  {
    title: "5. שיתוף מידע עם צדדים שלישיים",
    content: "אנו לא מוכרים או משכירים את המידע שלך לצדדים שלישיים. מידע עשוי להיות משותף עם: ספקי שירות הכרחיים (לדוגמה, ספקי ענן, עיבוד תשלומים), רשויות מדינה בהתאם לדרישות חוק, שותפים עסקיים בהסכמתך המפורשת בלבד.",
  },
  {
    title: "6. זכויותיך",
    content: "בהתאם לחוק הישראלי ולתקנות GDPR, יש לך זכות: (א) לעיין במידע המוחזק עליך; (ב) לתקן מידע שגוי; (ג) לבקש מחיקת המידע ('הזכות להישכח'); (ד) להתנגד לעיבוד מידע; (ה) לקבל עותק של המידע (ניידות נתונים).",
  },
  {
    title: "7. קובצי Cookie",
    content: "אנו משתמשים בקובצי Cookie חיוניים להפעלת השירות, קובצי Cookie אנליטיים (אנונימיים) לשיפור הפלטפורמה, וקובצי Cookie של העדפות לשמירת הגדרותיך. ניתן לבטל קובצי Cookie לא-חיוניים דרך הגדרות הדפדפן.",
  },
  {
    title: "8. שינויים במדיניות",
    content: "אנו עשויים לעדכן מדיניות זו מעת לעת. בשינויים מהותיים, נשלח הודעה לכתובת הדוא\"ל הרשומה שלך לפחות 30 יום מראש. המשך השימוש בשירות לאחר עדכון ייחשב כהסכמה.",
  },
  {
    title: "9. יצירת קשר",
    content: "לשאלות בנושא פרטיות: privacy@proflow.ai | ProFlow AI, תל אביב, ישראל. ממונה הגנת פרטיות (DPO): dpo@proflow.ai",
  },
];

export default function PrivacyPolicy() {
  return (
    <div dir="rtl" style={{ background: "#0A0A0A", minHeight: "100vh", color: "#fff", fontFamily: "Heebo, sans-serif" }}>
      {/* Nav */}
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
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(0,229,255,0.1)", border: "1px solid rgba(0,229,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Shield size={22} color="#00E5FF" />
          </div>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 900 }}>מדיניות פרטיות</h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>עדכון אחרון: אפריל 2025 | ProFlow AI</p>
          </div>
        </div>

        <div style={{ padding: "16px 20px", background: "rgba(0,229,255,0.05)", border: "1px solid rgba(0,229,255,0.15)", borderRadius: 14, marginBottom: 36, fontSize: 14, color: "rgba(0,229,255,0.8)", lineHeight: 1.7 }}>
          מדיניות זו מפרטת את ההתחייבויות שלנו להגנה על פרטיותך. אנחנו לא מוכרים את הנתונים שלך ולא נמכור אותם אי-פעם.
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {SECTIONS.map(({ title, content }) => (
            <div key={title} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "24px 28px" }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 12, color: "#fff" }}>{title}</h2>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.85 }}>{content}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 40, textAlign: "center", padding: "20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14 }}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
            ProFlow AI | privacy@proflow.ai | תל אביב, ישראל
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
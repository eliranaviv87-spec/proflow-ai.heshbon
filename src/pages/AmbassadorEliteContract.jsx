import { Link } from "react-router-dom";
import { Star, ArrowRight, AlertTriangle } from "lucide-react";

const SECTIONS = [
  {
    title: "1. מבוא והגדרות",
    content: "הסכם שגריר עלית זה ('ההסכם') מגדיר את היחסים המסחריים בין ProFlow AI Ltd ('החברה') לבין השגריר עלית ('השגריר'). הסכם זה נכנס לתוקף עם אישור הבקשה ותשלום דמי המנוי החודשיים.",
    warning: false,
  },
  {
    title: "2. הצטרפות לתוכנית ועלויות",
    content: "השגריר מתחייב לתשלום חודשי של ₪299 עבור חברות בתוכנית Elite. תשלום זה מאפשר גישה לעמלות של 50% מהכנסות מנויים מופנים, לכל חיי המנוי הפעיל. אי תשלום יביא להקפאת כל העמלות הצבורות.",
    warning: true,
  },
  {
    title: "3. מבנה העמלות",
    content: "השגריר יקבל 50% מהכנסות חודשיות גולמיות של כל מנוי שהופנה על ידו, כל עוד: (א) מנוי הלקוח פעיל, (ב) מנוי השגריר פעיל ומשולם. תשלומי עמלה יתבצעו בתחילת כל חודש עבור החודש הקודם, בכפוף לסף מינימום של ₪500.",
    warning: false,
  },
  {
    title: "4. הגבלות ואיסורים מוחלטים",
    content: "השגריר נאסר עליו: (א) הגנת לקוחות שגויה או מצגי שווא לגבי המוצר; (ב) שימוש בשפה פוגענית, הטרדות או לחץ מכירתי בלתי הולם; (ג) הצגת עצמו כעובד ProFlow AI; (ד) פרסום תוכן פרסומי מטעה בשמנו; (ה) ניצול רשימות תפוצה שגויות. הפרה = ביטול מיידי ללא החזר.",
    warning: true,
  },
  {
    title: "5. זכויות טלמרקטינג — לשגרירים עם ניסיון",
    content: "שגרירים שהצהירו על ניסיון בטלמרקטינג/מכירות ואושרו על ידי הניהול זכאים לבצע פניות טלפוניות יוצאות ללקוחות פוטנציאליים. על השגרירים לאמר בתחילת כל שיחה: 'אני שגריר עצמאי של ProFlow AI'. מקצועיות היא חובה מוחלטת. כל התנהגות בלתי הולמת תגרור סיום מיידי של ההסכם.",
    warning: false,
  },
  {
    title: "6. הגנה מפני נטישת לקוחות",
    content: "במידה ולקוח שהופנה על ידי השגריר מבטל את מנויו, השגריר יקבל התראה מיידית בדוא\"ל ו-SMS. מומלץ מאוד לפנות ללקוח בתוך 24 שעות מקבלת ההתראה על מנת לשמר את מנויו ואת העמלה החוזרת.",
    warning: false,
  },
  {
    title: "7. קניין רוחני",
    content: "השגריר אינו רוכש כל זכות קניינית ב-ProFlow AI, במותג, בקוד, בממשק, או בנכסי החברה. שימוש בלוגו ובשם המותג אפשרי אך ורק לצורך שיווק מוסכם ובהתאם להנחיות המותג הרשמיות.",
    warning: false,
  },
  {
    title: "8. ביטול וסיום",
    content: "כל צד רשאי לסיים הסכם זה בהודעה של 30 יום. החברה שומרת לעצמה את הזכות לסיים את ההסכם מיידית במקרה של הפרה מהותית. עם ביטול, כל עמלות שטרם שולמו ישולמו עד 60 יום ממועד הביטול, בכפוף לבדיקה.",
    warning: false,
  },
  {
    title: "9. דין חל",
    content: "הסכם זה כפוף לדיני מדינת ישראל. כל מחלוקת תידון בבתי המשפט המוסמכים במחוז תל אביב.",
    warning: false,
  },
];

export default function AmbassadorEliteContract() {
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
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Star size={26} style={{ color: "#D4AF37" }} />
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 12 }}>הסכם שגריר עלית</h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>עדכון אחרון: אפריל 2025 | גרסה 1.0</p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12, padding: "6px 14px", borderRadius: 50, background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.25)" }}>
            <Star size={12} style={{ color: "#D4AF37" }} />
            <span style={{ fontSize: 12, color: "#D4AF37", fontWeight: 600 }}>Elite Program · 50% עמלה חוזרת לכל חיים</span>
          </div>
        </div>

        {/* Alert */}
        <div style={{ background: "rgba(255,107,107,0.06)", border: "1px solid rgba(255,107,107,0.2)", borderRadius: 16, padding: "16px 20px", marginBottom: 40, display: "flex", gap: 12, alignItems: "flex-start" }}>
          <AlertTriangle size={18} style={{ color: "#ff6b6b", flexShrink: 0, marginTop: 2 }} />
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, lineHeight: 1.7 }}>
            <strong style={{ color: "#ff6b6b" }}>חשוב לקרוא בעיון:</strong> הסכם זה מחייב מקצועיות ברמה הגבוהה ביותר. הפרה של כל סעיף עלולה לגרור סיום מיידי של ההשתתפות בתוכנית ואובדן כל העמלות הצבורות.
          </p>
        </div>

        {/* Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {SECTIONS.map(({ title, content, warning }) => (
            <div key={title} style={{ background: warning ? "rgba(255,107,107,0.04)" : "rgba(255,255,255,0.02)", border: `1px solid ${warning ? "rgba(255,107,107,0.15)" : "rgba(255,255,255,0.06)"}`, borderRadius: 16, padding: "24px" }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: warning ? "#ff6b6b" : "#D4AF37" }}>{title}</h2>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, lineHeight: 1.8 }}>{content}</p>
            </div>
          ))}
        </div>

        {/* Signature Block */}
        <div style={{ textAlign: "center", marginTop: 48, padding: "28px", background: "linear-gradient(135deg, rgba(212,175,55,0.06), rgba(0,229,255,0.03))", borderRadius: 20, border: "1px solid rgba(212,175,55,0.2)" }}>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, marginBottom: 16 }}>הרשמה לתוכנית השגרירים מהווה חתימה דיגיטלית על הסכם זה</p>
          <a href="/ambassador-program" style={{ display: "inline-block", background: "linear-gradient(135deg, #D4AF37, #FFAB00)", color: "#0A0A0A", padding: "12px 28px", borderRadius: 12, fontWeight: 800, textDecoration: "none", fontSize: 14 }}>
            הצטרף לתוכנית Elite
          </a>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginTop: 12 }}>שאלות: <a href="mailto:ambassadors@proflow.ai" style={{ color: "#D4AF37", textDecoration: "none" }}>ambassadors@proflow.ai</a></p>
        </div>
      </div>
    </div>
  );
}
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

const SOCIAL_LINKS = [
  {
    name: "WhatsApp",
    color: "#25D366",
    href: "https://wa.me/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    color: "#1877F2",
    href: "https://facebook.com/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    color: "#E4405F",
    href: "https://instagram.com/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    color: "#0A66C2",
    href: "https://linkedin.com/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(10,10,10,0.98)", padding: "40px 24px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Social Row */}
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 32 }}>
          {SOCIAL_LINKS.map(({ name, color, href, icon }) => (
            <a key={name} href={href} target="_blank" rel="noopener noreferrer"
              title={name}
              style={{
                width: 46, height: 46, borderRadius: 12,
                background: `${color}18`,
                border: `1px solid ${color}40`,
                color,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s",
                textDecoration: "none",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = `${color}30`; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = `${color}18`; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {icon}
            </a>
          ))}
        </div>

        {/* Links Row */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Zap size={16} color="#D4AF37" />
            <span style={{ fontWeight: 800, fontSize: 16 }}>ProFlow<span style={{ color: "#00E5FF" }}>AI</span></span>
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
            <a href="/ambassador-program" style={{ color: "rgba(212,175,55,0.9)", fontSize: 13, textDecoration: "none", fontWeight: 700, border: "1px solid rgba(212,175,55,0.3)", padding: "5px 12px", borderRadius: 8, background: "rgba(212,175,55,0.06)" }}>🔥 תוכנית שגרירים מוגבלת — הצטרפות לסיירת</a>
            <Link to="/terms" style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, textDecoration: "none" }}>תנאי שימוש</Link>
            <Link to="/privacy" style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, textDecoration: "none" }}>מדיניות פרטיות</Link>
            <Link to="/business-tos" style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, textDecoration: "none" }}>תנאי שימוש עסקי</Link>
            <Link to="/ambassador-elite-contract" style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, textDecoration: "none" }}>הסכם שגריר עלית</Link>
            <Link to="/" style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, textDecoration: "none" }}>כניסה למערכת</Link>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "space-between", alignItems: "center", paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>© 2025 ProFlow AI. כל הזכויות שמורות.</p>
          <p style={{ color: "rgba(255,255,255,0.15)", fontSize: 11 }}>Powered by AI · Secured by Design · Built for Israeli Business</p>
        </div>
      </div>
    </footer>
  );
}
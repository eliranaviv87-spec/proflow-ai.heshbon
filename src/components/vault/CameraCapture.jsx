import { useRef, useState, useCallback } from "react";
import { Camera, X, RefreshCw, Check } from "lucide-react";

export default function CameraCapture({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [active, setActive] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  const startCamera = useCallback(async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } }
      });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      setActive(true);
    } catch {
      setError("לא ניתן לגשת למצלמה. אנא אשר הרשאה.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    setActive(false);
  }, []);

  const capture = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    setPreview(dataUrl);
    stopCamera();
  }, [stopCamera]);

  const confirm = useCallback(() => {
    if (!preview) return;
    // Convert base64 to File
    const arr = preview.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    const file = new File([u8arr], `camera-${Date.now()}.jpg`, { type: mime });
    onCapture(file);
    onClose();
  }, [preview, onCapture, onClose]);

  const retake = useCallback(() => {
    setPreview(null);
    startCamera();
  }, [startCamera]);

  const handleClose = useCallback(() => {
    stopCamera();
    onClose();
  }, [stopCamera, onClose]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "16px"
    }}>
      <div style={{
        width: "100%", maxWidth: 480, borderRadius: 24,
        background: "rgba(12,12,16,0.98)", border: "1px solid rgba(255,255,255,0.1)",
        overflow: "hidden"
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Camera size={18} color="#00E5FF" />
            <span style={{ fontWeight: 700, color: "#fff", fontSize: 15 }}>צילום חשבונית</span>
          </div>
          <button onClick={handleClose} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 8, padding: "6px", cursor: "pointer", color: "rgba(255,255,255,0.5)" }}>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "20px" }}>
          {error && (
            <div style={{ padding: "12px", borderRadius: 12, background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.2)", color: "#ff6b6b", fontSize: 13, marginBottom: 16 }}>
              {error}
            </div>
          )}

          {/* Preview or video */}
          <div style={{ borderRadius: 16, overflow: "hidden", background: "#000", marginBottom: 16, position: "relative", minHeight: 260 }}>
            {preview ? (
              <img src={preview} alt="preview" style={{ width: "100%", display: "block" }} />
            ) : (
              <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", display: "block", minHeight: 260, objectFit: "cover" }} />
            )}
            {!active && !preview && (
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
                <Camera size={40} color="rgba(255,255,255,0.15)" />
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>לחץ "הפעל מצלמה" להתחלה</p>
              </div>
            )}
          </div>

          <canvas ref={canvasRef} style={{ display: "none" }} />

          {/* Actions */}
          <div style={{ display: "flex", gap: 10 }}>
            {!active && !preview && (
              <button onClick={startCamera} style={{ flex: 1, padding: "12px", borderRadius: 14, background: "linear-gradient(135deg,#00E5FF,#0099cc)", color: "#0A0A0A", fontWeight: 800, fontSize: 14, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <Camera size={16} /> הפעל מצלמה
              </button>
            )}
            {active && (
              <button onClick={capture} style={{ flex: 1, padding: "12px", borderRadius: 14, background: "linear-gradient(135deg,#D4AF37,#FFAB00)", color: "#0A0A0A", fontWeight: 800, fontSize: 14, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <Camera size={16} /> צלם עכשיו
              </button>
            )}
            {preview && (
              <>
                <button onClick={retake} style={{ flex: 1, padding: "12px", borderRadius: 14, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)", fontWeight: 700, fontSize: 14, border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <RefreshCw size={15} /> צלם שוב
                </button>
                <button onClick={confirm} style={{ flex: 1, padding: "12px", borderRadius: 14, background: "linear-gradient(135deg,#4ade80,#22c55e)", color: "#0A0A0A", fontWeight: 800, fontSize: 14, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <Check size={16} /> אשר ועבד AI
                </button>
              </>
            )}
          </div>

          <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 12 }}>
            התמונה תעובד אוטומטית ע״י AI לחילוץ נתוני החשבונית
          </p>
        </div>
      </div>
    </div>
  );
}
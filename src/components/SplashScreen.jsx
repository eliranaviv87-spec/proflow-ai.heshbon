import { useEffect, useRef, useState } from "react";

class Particle {
  constructor() {
    this.pos = { x: 0, y: 0 };
    this.vel = { x: 0, y: 0 };
    this.acc = { x: 0, y: 0 };
    this.target = { x: 0, y: 0 };
    this.closeEnoughTarget = 100;
    this.maxSpeed = 1.0;
    this.maxForce = 0.1;
    this.particleSize = 10;
    this.isKilled = false;
    this.startColor = { r: 0, g: 0, b: 0 };
    this.targetColor = { r: 0, g: 0, b: 0 };
    this.colorWeight = 0;
    this.colorBlendRate = 0.01;
  }

  move() {
    const distance = Math.sqrt(
      Math.pow(this.pos.x - this.target.x, 2) + Math.pow(this.pos.y - this.target.y, 2)
    );
    let proximityMult = distance < this.closeEnoughTarget ? distance / this.closeEnoughTarget : 1;

    const towardsTarget = { x: this.target.x - this.pos.x, y: this.target.y - this.pos.y };
    const magnitude = Math.sqrt(towardsTarget.x ** 2 + towardsTarget.y ** 2);
    if (magnitude > 0) {
      towardsTarget.x = (towardsTarget.x / magnitude) * this.maxSpeed * proximityMult;
      towardsTarget.y = (towardsTarget.y / magnitude) * this.maxSpeed * proximityMult;
    }

    const steer = { x: towardsTarget.x - this.vel.x, y: towardsTarget.y - this.vel.y };
    const steerMag = Math.sqrt(steer.x ** 2 + steer.y ** 2);
    if (steerMag > 0) {
      steer.x = (steer.x / steerMag) * this.maxForce;
      steer.y = (steer.y / steerMag) * this.maxForce;
    }

    this.acc.x += steer.x;
    this.acc.y += steer.y;
    this.vel.x += this.acc.x;
    this.vel.y += this.acc.y;
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    this.acc.x = 0;
    this.acc.y = 0;
  }

  draw(ctx) {
    if (this.colorWeight < 1.0) {
      this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1.0);
    }
    const r = Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight);
    const g = Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight);
    const b = Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight);
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(this.pos.x, this.pos.y, 2, 2);
  }

  kill(width, height) {
    if (!this.isKilled) {
      const cx = width / 2, cy = height / 2, mag = (width + height) / 2;
      const rx = Math.random() * width, ry = Math.random() * height;
      const dx = rx - cx, dy = ry - cy;
      const m = Math.sqrt(dx ** 2 + dy ** 2);
      this.target.x = m > 0 ? cx + (dx / m) * mag : cx;
      this.target.y = m > 0 ? cy + (dy / m) * mag : cy;
      this.startColor = {
        r: this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight,
        g: this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight,
        b: this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight,
      };
      this.targetColor = { r: 0, g: 0, b: 0 };
      this.colorWeight = 0;
      this.isKilled = true;
    }
  }
}

const WORDS = ["המערכת האטרקטיבית", "ביותר של", "רואי החשבון", "ברוכים הבאים"];

export default function SplashScreen({ onDone }) {
  const canvasRef = useRef(null);
  const animationRef = useRef();
  const particlesRef = useRef([]);
  const frameCountRef = useRef(0);
  const wordIndexRef = useRef(0);
  const [fading, setFading] = useState(false);

  const pixelSteps = 6;

  const generateRandomPos = (cx, cy, mag, cw, ch) => {
    const rx = Math.random() * cw, ry = Math.random() * ch;
    const dx = rx - cx, dy = ry - cy;
    const m = Math.sqrt(dx ** 2 + dy ** 2);
    return m > 0 ? { x: cx + (dx / m) * mag, y: cy + (dy / m) * mag } : { x: cx, y: cy };
  };

  const nextWord = (word, canvas) => {
    const offscreen = document.createElement("canvas");
    offscreen.width = canvas.width;
    offscreen.height = canvas.height;
    const octx = offscreen.getContext("2d");

    octx.fillStyle = "white";
    // Responsive font size
    const fontSize = Math.min(canvas.width / 10, 80);
    octx.font = `bold ${fontSize}px Heebo, Arial`;
    octx.textAlign = "center";
    octx.textBaseline = "middle";
    octx.fillText(word, canvas.width / 2, canvas.height / 2);

    const imageData = octx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    const newColor = { r: Math.random() * 255, g: Math.random() * 255, b: Math.random() * 255 };
    // Force cyan/gold palette to match the app
    const palette = [
      { r: 0, g: 229, b: 255 },   // cyan
      { r: 212, g: 175, b: 55 },  // gold
      { r: 179, g: 136, b: 255 }, // purple
    ];
    const chosenColor = palette[Math.floor(Math.random() * palette.length)];

    const particles = particlesRef.current;
    let particleIndex = 0;

    const coordsIndexes = [];
    for (let i = 0; i < pixels.length; i += pixelSteps * 4) coordsIndexes.push(i);
    for (let i = coordsIndexes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [coordsIndexes[i], coordsIndexes[j]] = [coordsIndexes[j], coordsIndexes[i]];
    }

    for (const coordIndex of coordsIndexes) {
      const alpha = pixels[coordIndex + 3];
      if (alpha > 0) {
        const x = (coordIndex / 4) % canvas.width;
        const y = Math.floor(coordIndex / 4 / canvas.width);

        let particle;
        if (particleIndex < particles.length) {
          particle = particles[particleIndex];
          particle.isKilled = false;
          particleIndex++;
        } else {
          particle = new Particle();
          const rp = generateRandomPos(canvas.width / 2, canvas.height / 2, (canvas.width + canvas.height) / 2, canvas.width, canvas.height);
          particle.pos.x = rp.x;
          particle.pos.y = rp.y;
          particle.maxSpeed = Math.random() * 6 + 4;
          particle.maxForce = particle.maxSpeed * 0.05;
          particle.particleSize = Math.random() * 6 + 6;
          particle.colorBlendRate = Math.random() * 0.0275 + 0.0025;
          particles.push(particle);
        }

        particle.startColor = {
          r: particle.startColor.r + (particle.targetColor.r - particle.startColor.r) * particle.colorWeight,
          g: particle.startColor.g + (particle.targetColor.g - particle.startColor.g) * particle.colorWeight,
          b: particle.startColor.b + (particle.targetColor.b - particle.startColor.b) * particle.colorWeight,
        };
        particle.targetColor = chosenColor;
        particle.colorWeight = 0;
        particle.target.x = x;
        particle.target.y = y;
      }
    }

    for (let i = particleIndex; i < particles.length; i++) {
      particles[i].kill(canvas.width, canvas.height);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const setSize = () => {
      canvas.width = Math.min(window.innerWidth, 1000);
      canvas.height = Math.min(window.innerHeight * 0.6, 500);
    };
    setSize();

    nextWord(WORDS[0], canvas);

    const animate = () => {
      const ctx = canvas.getContext("2d");
      const particles = particlesRef.current;

      ctx.fillStyle = "rgba(0,0,0,0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.move();
        p.draw(ctx);
        if (p.isKilled && (p.pos.x < 0 || p.pos.x > canvas.width || p.pos.y < 0 || p.pos.y > canvas.height)) {
          particles.splice(i, 1);
        }
      }

      frameCountRef.current++;
      // Change word every ~4s (240 frames at 60fps)
      if (frameCountRef.current % 240 === 0) {
        wordIndexRef.current = (wordIndexRef.current + 1) % WORDS.length;
        nextWord(WORDS[wordIndexRef.current], canvas);

        // After last word, start fading out
        if (wordIndexRef.current === WORDS.length - 1) {
          setTimeout(() => {
            setFading(true);
            setTimeout(onDone, 1000);
          }, 3000);
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "#000",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        transition: "opacity 1s ease",
        opacity: fading ? 0 : 1,
        pointerEvents: fading ? "none" : "auto",
      }}
    >
      {/* App logo */}
      <div style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, rgba(0,229,255,0.15), rgba(212,175,55,0.15))", border: "1px solid rgba(212,175,55,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
        </div>
        <span style={{ fontWeight: 900, fontSize: 22, color: "#fff", fontFamily: "Heebo, sans-serif" }}>
          ProFlow<span style={{ color: "#00E5FF" }}>AI</span>
        </span>
      </div>

      <canvas ref={canvasRef} style={{ maxWidth: "100%", height: "auto" }} />

      <p style={{ marginTop: 20, color: "rgba(255,255,255,0.3)", fontSize: 12, fontFamily: "Heebo, sans-serif" }}>
        המילים מתחלפות אוטומטית • לחץ לדלג
      </p>

      {/* Skip button */}
      <button
        onClick={() => { setFading(true); setTimeout(onDone, 800); }}
        style={{
          marginTop: 16, padding: "8px 24px", borderRadius: 12,
          background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
          color: "rgba(255,255,255,0.5)", fontSize: 13, cursor: "pointer",
          fontFamily: "Heebo, sans-serif",
        }}
      >
        דלג ←
      </button>
    </div>
  );
}
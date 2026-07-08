"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";

interface HeroOrbProps {
  baseSrc: string;
  revealSrc: string;
}

export function HeroOrb({ baseSrc, revealSrc }: HeroOrbProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const layer = layerRef.current;
    if (!wrap || !layer) return;

    // Target = where we want the reveal to go.
    // Current = where it actually is (lerps toward target each frame).
    const target = { x: 0.5, y: 0.45 };
    const current = { x: 0.5, y: 0.45 };

    let raf = 0;
    let lastInteraction = 0;

    const onMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      target.x = Math.min(Math.max(px, 0), 1);
      target.y = Math.min(Math.max(py, 0), 1);
      lastInteraction = performance.now();
    };

    const onLeave = () => {
      // Reset target to center; idle drift will move it gently from there.
      target.x = 0.5;
      target.y = 0.45;
    };

    const start = performance.now();
    const tick = () => {
      const now = performance.now();
      const sinceTouch = now - lastInteraction;

      // Idle drift — a slow Lissajous orbit around the center when the user
      // hasn't interacted for >800ms. Composed of two sin waves.
      if (sinceTouch > 800) {
        const t = (now - start) / 1000;
        const driftAmp = 0.12; // ±12% of width/height
        const driftX = 0.5 + Math.sin(t * 0.35) * driftAmp;
        const driftY = 0.45 + Math.cos(t * 0.28) * driftAmp * 0.7;
        // Blend the drift into target so it feels alive but not jittery.
        target.x += (driftX - target.x) * 0.02;
        target.y += (driftY - target.y) * 0.02;
      }

      // Lerp current toward target — 0.08 per frame ≈ 120-180ms perceived lag.
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;

      layer.style.setProperty("--mx", `${current.x * 100}%`);
      layer.style.setProperty("--my", `${current.y * 100}%`);

      raf = requestAnimationFrame(tick);
    };

    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        zIndex: 1,
        background: "#000",
      }}
      aria-label="Hero visual — move cursor to reveal"
    >
      {/* PLANET — floating group, larger amplitude + slow rotate/scale breathing */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          animation: "heroFloat 5.8s ease-in-out infinite",
          willChange: "transform",
        }}
      >
        {/* BASE — desaturated background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${baseSrc})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "grayscale(0.55) brightness(0.42) contrast(1.05)",
          }}
        />

        {/* COLOR REVEAL — small radial mask, follows target with lag */}
        <div
          ref={layerRef}
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${revealSrc})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "saturate(1.45) brightness(1.05) contrast(1.05)",
            WebkitMaskImage:
              "radial-gradient(circle 150px at var(--mx, 50%) var(--my, 45%), #000 0%, #000 25%, rgba(0,0,0,0.9) 45%, rgba(0,0,0,0.6) 62%, rgba(0,0,0,0.3) 78%, rgba(0,0,0,0.1) 90%, transparent 100%)",
            maskImage:
              "radial-gradient(circle 150px at var(--mx, 50%) var(--my, 45%), #000 0%, #000 25%, rgba(0,0,0,0.9) 45%, rgba(0,0,0,0.6) 62%, rgba(0,0,0,0.3) 78%, rgba(0,0,0,0.1) 90%, transparent 100%)",
          }}
        />

        {/* INNER HIGHLIGHT — tight bright pulse */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${revealSrc})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            mixBlendMode: "screen",
            opacity: 0.5,
            filter: "saturate(1.6) brightness(1.15)",
            WebkitMaskImage:
              "radial-gradient(circle 50px at var(--mx, 50%) var(--my, 45%), #000 0%, #000 30%, rgba(0,0,0,0.6) 65%, transparent 100%)",
            maskImage:
              "radial-gradient(circle 50px at var(--mx, 50%) var(--my, 45%), #000 0%, #000 30%, rgba(0,0,0,0.6) 65%, transparent 100%)",
          }}
        />
      </div>

      {/* Vignette — fades everything into pure black at edges */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 90% 90% at center, transparent 0%, transparent 35%, rgba(0,0,0,0.55) 65%, #000 95%)",
          pointerEvents: "none",
        }}
      />

      <style>{`
        @keyframes heroFloat {
          0%   { transform: translate3d(0, 0, 0) rotate(-2deg) scale(0.99); }
          20%  { transform: translate3d(-10px, -26px, 0) rotate(1.5deg) scale(1.01); }
          40%  { transform: translate3d(14px, -10px, 0) rotate(-1deg) scale(0.995); }
          60%  { transform: translate3d(6px, 24px, 0) rotate(2deg) scale(1.012); }
          80%  { transform: translate3d(-8px, 14px, 0) rotate(-1.5deg) scale(1.003); }
          100% { transform: translate3d(0, 0, 0) rotate(-2deg) scale(0.99); }
        }
      `}</style>
    </div>
  );
}

export function HeroCallToAction() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "clamp(2rem, 4rem, 4rem)",
        left: "clamp(1rem, 3.5rem, 3.5rem)",
        right: "clamp(1rem, 3.5rem, 3.5rem)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        zIndex: 5,
        pointerEvents: "none",
      }}
    >
      <Link
        href="#selected-work"
        className="site-nav-btn nav-pink-hover"
        style={{ pointerEvents: "auto", fontWeight: 600 }}
      >
        Selected Work ↓
      </Link>
      <span
        style={{
          fontSize: "0.75rem",
          opacity: 0.6,
          fontFamily: "var(--font-mono-2)",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
        }}
      >
        Move cursor to reveal
      </span>
    </div>
  );
}
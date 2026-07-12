"use client";
import { FloatingMotifs } from "./FloatingMotifs";

/**
 * Full-page layered background shared by all non-hero pages.
 * - Blurred background image (60% opacity)
 * - Dot-pattern texture overlay
 * - Fixed position, z-index 1, pointer-events none
 */
export function SiteBackground() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* Blurred background image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/about/bg-about.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.6,
          filter: "blur(8px) brightness(0.45) saturate(1.2)",
        }}
      />

      {/* Dot grid */}
      <div
        className="site-bg-dots"
        style={{ position: "absolute", inset: 0 }}
      />

      {/* Top feather — softens the very top edge of the dot grid */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "40vh",
          background: "linear-gradient(to bottom, var(--background-1) 0%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Bottom feather — softens the very bottom edge */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "40vh",
          background: "linear-gradient(to top, var(--background-1) 0%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Radial vignette — softens the four corners */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 30%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* Sparse pink pixel accents */}
      {[
        { top: "12%", left: "18%" }, { top: "28%", left: "75%" },
        { top: "55%", left: "8%" },  { top: "70%", left: "55%" },
        { top: "38%", left: "42%" }, { top: "85%", left: "25%" },
        { top: "15%", left: "60%" }, { top: "60%", left: "88%" },
        { top: "45%", left: "30%" }, { top: "80%", left: "68%" },
        { top: "22%", left: "90%" }, { top: "90%", left: "12%" },
      ].map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: p.top,
            left: p.left,
            width: 3,
            height: 3,
            borderRadius: 1,
            background: "rgba(255,126,182,0.35)",
            transform: "translate(-50%,-50%)",
          }}
        />
      ))}

      <FloatingMotifs />
    </div>
  );
}

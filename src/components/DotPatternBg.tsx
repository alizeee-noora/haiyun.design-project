"use client";
/**
 * Fixed dot-pattern overlay for non-home pages.
 * Layered on top of a blurred background image — faint pixel dots
 * that add texture without competing with the content.
 * z-index 2 (above the bg image, below content), pointer-events none.
 */
export function DotPatternBg() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* Radial vignette fade at edges */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      {/* Dot grid — repeated via background-image */}
      <div
        className="dot-pattern-layer"
        style={{
          position: "absolute",
          inset: 0,
        }}
      />

      {/* Sparse bright dots as pixel-art accents */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 3,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        {[
          { top: "12%", left: "18%" }, { top: "28%", left: "75%" },
          { top: "55%", left: "8%" },  { top: "70%", left: "55%" },
          { top: "38%", left: "42%" }, { top: "85%", left: "25%" },
          { top: "15%", left: "60%" }, { top: "60%", left: "88%" },
          { top: "45%", left: "30%" }, { top: "80%", left: "68%" },
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
              background: "rgba(255,126,182,0.3)",
              transform: "translate(-50%,-50%)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

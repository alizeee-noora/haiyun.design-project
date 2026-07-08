"use client";

/**
 * Fixed full-viewport 3×3 grid backdrop.
 * Sits below all interactive content (z-index 0) with pointer-events: none.
 * Lines render at low opacity and use theme variables so they remain
 * unobtrusive yet visible in both dark and light modes.
 */
export function GridBackdrop() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.5,
        backgroundImage: `
          linear-gradient(to right, var(--grid-line, rgba(255,255,255,0.5)) 1px, transparent 1px),
          linear-gradient(to bottom, var(--grid-line, rgba(255,255,255,0.5)) 1px, transparent 1px)
        `,
        backgroundSize: "33.333% 33.333%",
      }}
    />
  );
}
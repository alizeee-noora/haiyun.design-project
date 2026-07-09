"use client";

/**
 * Fixed full-viewport 3×3 grid backdrop.
 * Two-level lines: outer border is stronger, inner grid lines are subtle.
 * Light blue-gray palette with pink accent at intersection dots.
 * z-index 1, pointer-events none.
 */
export function GridBackdrop() {
  return (
    <div aria-hidden className="grid-backdrop">
      {/* Outer frame */}
      <div className="grid-outer-frame" />

      {/* Vertical lines — 3 columns */}
      <div className="grid-vline" style={{ left: "33.3333%" }} />
      <div className="grid-vline" style={{ left: "66.6666%" }} />

      {/* Horizontal lines — 3 rows */}
      <div className="grid-hline" style={{ top: "33.3333%" }} />
      <div className="grid-hline" style={{ top: "66.6666%" }} />

      {/* Intersection dots — pink accent */}
      <div className="grid-dot" style={{ top: "33.3333%", left: "33.3333%" }} />
      <div className="grid-dot" style={{ top: "33.3333%", left: "66.6666%" }} />
      <div className="grid-dot" style={{ top: "66.6666%", left: "33.3333%" }} />
      <div className="grid-dot" style={{ top: "66.6666%", left: "66.6666%" }} />
    </div>
  );
}

"use client";
/**
 * Colorful, glowing geometric shapes that drift down the page.
 * Pure CSS animations — no canvas, no JS animation loop.
 * Each piece has a random horizontal position, drift duration, delay,
 * color from a curated palette, soft drop-shadow glow, and slow rotation.
 */

const PALETTE = [
  "#FF7EB6", // pink
  "#FFD56B", // amber
  "#7BD3F7", // sky
  "#B07CFF", // violet
  "#7CFFB2", // mint
  "#FF9F70", // peach
  "#FF5C8A", // hot pink
  "#A0E7FF", // ice
];

const SHAPES = ["circle", "square", "triangle", "ring", "cross"] as const;
type Shape = (typeof SHAPES)[number];

interface Piece {
  id: number;
  left: number;          // 0-100 (% of viewport width)
  size: number;          // px
  duration: number;      // s — fall time
  delay: number;         // s — negative for staggered start
  drift: number;         // px — horizontal sway amplitude
  rotateDir: number;     // -1 | 1
  color: string;
  shape: Shape;
  opacity: number;       // 0.35 - 0.9
  blur: number;          // px — glow softness multiplier
}

// Deterministic pseudo-random so SSR and client match (avoids hydration warnings).
function seededRand(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

function buildPieces(count: number): Piece[] {
  const rand = seededRand(1337);
  const pieces: Piece[] = [];
  for (let i = 0; i < count; i++) {
    pieces.push({
      id: i,
      left: rand() * 100,
      size: 10 + rand() * 26,           // 10-36px
      duration: 14 + rand() * 22,       // 14-36s
      delay: -(rand() * 36),            // negative delay so pieces are mid-fall on load
      drift: 30 + rand() * 80,          // 30-110px sway
      rotateDir: rand() > 0.5 ? 1 : -1,
      color: PALETTE[Math.floor(rand() * PALETTE.length)],
      shape: SHAPES[Math.floor(rand() * SHAPES.length)],
      opacity: 0.45 + rand() * 0.45,
      blur: 0.6 + rand() * 0.8,
    });
  }
  return pieces;
}

const PIECES = buildPieces(34);

function shapeStyle(p: Piece): React.CSSProperties {
  const baseShadow = `0 0 ${8 * p.blur}px ${p.color}, 0 0 ${20 * p.blur}px ${p.color}88`;
  const style: React.CSSProperties = {
    position: "absolute",
    top: -50,
    left: `${p.left}%`,
    width: p.size,
    height: p.size,
    background: p.shape === "ring" ? "transparent" : p.color,
    opacity: p.opacity,
    boxShadow: baseShadow,
    animation: `fall-${p.id} ${p.duration}s linear ${p.delay}s infinite, glow-pulse ${3 + (p.id % 5)}s ease-in-out infinite`,
    pointerEvents: "none",
    willChange: "transform, opacity",
  };

  switch (p.shape) {
    case "circle":
      style.borderRadius = "50%";
      break;
    case "square":
      style.borderRadius = "3px";
      style.transform = "rotate(15deg)";
      break;
    case "ring":
      style.border = `2.5px solid ${p.color}`;
      style.borderRadius = "50%";
      style.background = "transparent";
      style.boxShadow = `0 0 ${10 * p.blur}px ${p.color}, inset 0 0 ${6 * p.blur}px ${p.color}aa`;
      break;
    case "triangle":
      style.background = "transparent";
      style.width = 0;
      style.height = 0;
      style.borderLeft = `${p.size / 2}px solid transparent`;
      style.borderRight = `${p.size / 2}px solid transparent`;
      style.borderBottom = `${p.size}px solid ${p.color}`;
      style.boxShadow = `0 0 ${10 * p.blur}px ${p.color}`;
      style.filter = `drop-shadow(0 0 ${6 * p.blur}px ${p.color})`;
      break;
    case "cross": {
      // Render as two rotated squares via background gradients for a plus sign
      style.background = `linear-gradient(${p.color}, ${p.color}), linear-gradient(${p.color}, ${p.color})`;
      style.backgroundSize = "30% 100%, 100% 30%";
      style.backgroundPosition = "center, center";
      style.backgroundRepeat = "no-repeat";
      style.borderRadius = "2px";
      style.transform = "rotate(0deg)";
      break;
    }
  }

  return style;
}

export function FloatingMotifs() {
  // Inject the @keyframes once. We embed per-piece keyframes so each one
  // can have its own sway amplitude / rotation direction.
  const keyframes = PIECES.map((p) => {
    const dx = p.drift * p.rotateDir;
    const rot = 720 * p.rotateDir;
    return `@keyframes fall-${p.id}{
      0%   { transform: translate3d(0, -60px, 0) rotate(0deg); }
      50%  { transform: translate3d(${dx}px, 55vh, 0) rotate(${rot / 2}deg); }
      100% { transform: translate3d(0, 115vh, 0) rotate(${rot}deg); }
    }`;
  }).join("");

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes glow-pulse {
          0%, 100% { filter: brightness(1) saturate(1); }
          50%      { filter: brightness(1.35) saturate(1.25); }
        }
        ${keyframes}
      ` }} />
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
        {PIECES.map((p) => (
          <span key={p.id} style={shapeStyle(p)} />
        ))}
      </div>
    </>
  );
}

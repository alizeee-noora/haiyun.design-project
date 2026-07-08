"use client";
import { useCallback, useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Item = { src: string; type: "image" | "video"; name: string };

interface Props {
  items: Item[];
  poster?: string;
}

export function ProjectGalleryClient({ items, poster }: Props) {
  const [displayIndex, setDisplayIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [cursorDirection, setCursorDirection] = useState<"up" | "down" | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const total = items.length;

  const current = items[displayIndex];
  const showPoster = displayIndex === 0 && poster;

  const advance = useCallback(
    (delta: number) => {
      if (isAnimating || total <= 1) return;
      setIsAnimating(true);
      // 等待 exit 动画结束再切换 index
      window.setTimeout(() => {
        setDisplayIndex((i) => (i + delta + total) % total);
        setIsAnimating(false);
      }, 200);
    },
    [isAnimating, total]
  );

  const goToNext = useCallback(() => advance(1), [advance]);
  const goToPrev = useCallback(() => advance(-1), [advance]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goToNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goToNext, goToPrev]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isAnimating) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mouseY = e.clientY - rect.top;
    const threshold = rect.height / 2;
    setCursorDirection(mouseY < threshold ? "up" : "down");
  };

  const handleMouseLeave = () => {
    setCursorDirection(null);
  };

  const getCursor = () => {
    if (cursorDirection === "up") return "n-resize";
    if (cursorDirection === "down") return "s-resize";
    return "pointer";
  };

  return (
    <div
      ref={containerRef}
      onClick={goToNext}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        width: "100%",
        height: "calc(100dvh - 120px)",
        minHeight: "500px",
        background: "#000",
        overflow: "hidden",
        userSelect: "none",
        cursor: getCursor(),
      }}
      title="Click to view next image"
    >
      {/* Poster layer — z-index: 1, shows only at index 0 when poster provided */}
      {showPoster && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={poster}
            alt="poster"
            draggable={false}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>
      )}

      {/* Media — hard cross-fade like /studio */}
      <AnimatePresence mode="wait">
        <motion.div
          key={displayIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            background: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {current.type === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={current.src}
              alt={current.name}
              draggable={false}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
              }}
            />
          ) : (
            <video
              src={current.src}
              autoPlay
              muted
              loop
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Prev / Next arrow buttons */}
      {total > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous"
            onClick={(e) => {
              e.stopPropagation();
              goToPrev();
            }}
            style={arrowStyle("left")}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            style={arrowStyle("right")}
          >
            ›
          </button>
        </>
      )}

      {/* Bottom-right counter */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          bottom: "1.25rem",
          right: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "0.5rem 0.9rem",
          borderRadius: "999px",
          background: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          color: "#fff",
          fontFamily: "var(--font-mono-2)",
          fontSize: "0.75rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          pointerEvents: "auto",
        }}
      >
        <span style={{ opacity: 0.7 }}>{String(displayIndex + 1).padStart(2, "0")}</span>
        <span style={{ opacity: 0.4 }}>/</span>
        <span>{String(total).padStart(2, "0")}</span>
      </div>

      {/* Bottom-left hint */}
      <div
        style={{
          position: "absolute",
          bottom: "1.25rem",
          left: "1.5rem",
          color: "rgba(255,255,255,0.55)",
          fontFamily: "var(--font-mono-2)",
          fontSize: "0.7rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          pointerEvents: "none",
        }}
      >
        Click image to advance
      </div>
    </div>
  );
}

function arrowStyle(side: "left" | "right"): React.CSSProperties {
  return {
    position: "absolute",
    top: "50%",
    [side]: "1.25rem",
    transform: "translateY(-50%)",
    width: "3rem",
    height: "3rem",
    borderRadius: "50%",
    border: "1px solid rgba(255,255,255,0.25)",
    background: "rgba(0,0,0,0.35)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    color: "#fff",
    fontSize: "1.6rem",
    lineHeight: 1,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  };
}

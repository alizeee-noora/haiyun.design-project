"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Item = { src: string; type: "image" | "video"; name: string };

interface Props {
  items: Item[];
}

const TILE = 50;
const GAP = 14;
// How far below the tile the cursor may travel (in px) before hover ends.
// This bridges the gap between the tile and the preview so the user can
// hover the card and slide straight onto the preview.
const HOVER_BRIDGE_PX = 100;
const PREVIEW_MAX_W = 720;
const PREVIEW_MAX_H = 540;
const PREVIEW_PAD = 12;

/**
 * 50x50 thumbnail grid for the gift-motion page.
 *
 * - First frame of every video is the **middle frame**, captured once on mount
 *   by loading the video in a hidden <video> and drawing it into a canvas.
 * - On hover the tile reveals a full-size video preview positioned absolutely
 *   directly underneath itself. The preview's hit-zone extends HOVER_BRIDGE_PX
 *   below the tile, so the cursor can slide the ~100px gap between them without
 *   losing hover.
 * - Clicking a tile opens a centered modal with native video controls (sound on).
 */
export function MotionGallery({ items }: Props) {
  // Full-playback modal state.
  const [playing, setPlaying] = useState<Item | null>(null);

  return (
    <div style={{ padding: "0 clamp(1rem, 3.5rem, 3.5rem)", maxWidth: "1600px", margin: "0 auto" }}>
      <motion.div
        initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
        animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: `${GAP}px`,
        }}
      >
        {items.map((item, i) => (
          <MotionTile key={item.src} item={item} index={i} onPlay={() => setPlaying(item)} />
        ))}
      </motion.div>

      {/* Full-playback modal — click any tile to play it through with sound. */}
      <AnimatePresence>
        {playing && playing.type === "video" && (
          <motion.div
            key={playing.src}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={() => setPlaying(null)}
            role="dialog"
            aria-modal="true"
            aria-label={playing.name}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.86)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "clamp(1rem, 4vw, 3rem)",
              cursor: "zoom-out",
            }}
          >
            <motion.video
              key={`v-${playing.src}`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              src={playing.src}
              controls
              autoPlay
              playsInline
              onClick={(e) => e.stopPropagation()}
              onLoadedMetadata={(e) => {
                const v = e.currentTarget;
                v.currentTime = 0;
                const p = v.play();
                if (p && typeof p.catch === "function") p.catch(() => {});
              }}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                width: "auto",
                height: "auto",
                borderRadius: 8,
                background: "#000",
                boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
                cursor: "default",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Esc closes the modal; body scroll is locked while it is open. */}
      <ModalA11y playing={playing} onClose={() => setPlaying(null)} />
    </div>
  );
}

function ModalA11y({ playing, onClose }: { playing: Item | null; onClose: () => void }) {
  useEffect(() => {
    if (!playing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [playing, onClose]);
  return null;
}

function MotionTile({ item, index, onPlay }: { item: Item; index: number; onPlay: () => void }) {
  const [thumb, setThumb] = useState<string | null>(null);
  const [hover, setHover] = useState(false);
  const [nativeSize, setNativeSize] = useState<{ w: number; h: number } | null>(null);
  const previewRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Capture the middle frame of the video exactly once.
  useEffect(() => {
    if (item.type !== "video") return;
    let cancelled = false;
    const v = document.createElement("video");
    v.src = item.src;
    v.crossOrigin = "anonymous";
    v.muted = true;
    v.playsInline = true;
    v.preload = "auto";

    const capture = () => {
      if (cancelled || !isFinite(v.duration) || v.duration <= 0) return;
      v.currentTime = v.duration / 2;
    };
    const draw = () => {
      if (cancelled) return;
      const w = v.videoWidth || TILE;
      const h = v.videoHeight || TILE;
      const canvas = document.createElement("canvas");
      canvas.width = TILE;
      canvas.height = TILE;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const scale = Math.max(TILE / w, TILE / h);
      const dw = w * scale;
      const dh = h * scale;
      const dx = (TILE - dw) / 2;
      const dy = (TILE - dh) / 2;
      ctx.drawImage(v, dx, dy, dw, dh);
      setThumb(canvas.toDataURL("image/png"));
    };
    v.addEventListener("loadedmetadata", capture);
    v.addEventListener("seeked", draw);
    v.addEventListener("error", () => {});
    return () => {
      cancelled = true;
      v.src = "";
    };
  }, [item.src, item.type]);

  // Probe native dimensions on demand so the preview keeps the real ratio.
  useEffect(() => {
    if (!hover || item.type !== "video") return;
    let cancelled = false;
    const v = document.createElement("video");
    v.src = item.src;
    v.preload = "metadata";
    const onMeta = () => {
      if (cancelled) return;
      if (v.videoWidth && v.videoHeight) {
        setNativeSize({ w: v.videoWidth, h: v.videoHeight });
      }
    };
    v.addEventListener("loadedmetadata", onMeta);
    return () => {
      cancelled = true;
      v.removeEventListener("loadedmetadata", onMeta);
    };
  }, [hover, item.src, item.type]);

  // Slide-down reveal: pull the preview into view; collapse on hover-end.
  useEffect(() => {
    const v = previewRef.current;
    if (!v || item.type !== "video") return;
    if (hover) {
      v.currentTime = 0;
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    } else {
      v.pause();
    }
  }, [hover, item.type]);

  // Compute preview display size from the native ratio, clamped to viewport.
  const ratio = nativeSize ? nativeSize.w / nativeSize.h : 16 / 9;
  const rawW = nativeSize ? nativeSize.w : PREVIEW_MAX_W;
  const rawH = nativeSize ? nativeSize.h : PREVIEW_MAX_W / ratio;
  let displayW = rawW;
  let displayH = rawH;
  if (displayW > PREVIEW_MAX_W) {
    const k = PREVIEW_MAX_W / displayW;
    displayW *= k;
    displayH *= k;
  }
  if (displayH > PREVIEW_MAX_H) {
    const k = PREVIEW_MAX_H / displayH;
    displayW *= k;
    displayH *= k;
  }

  // --- Hover tracking. The wrapper itself spans `TILE + HOVER_BRIDGE_PX` tall;
  // pointer events on the invisible bridge keep the preview alive as the cursor
  // travels the ~100px gap down onto the video. ---
  const handlePointerEnter = () => setHover(true);
  const handlePointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    // Defensive: if relatedTarget is inside wrapper, do nothing.
    const next = e.relatedTarget as Node | null;
    if (next && wrapperRef.current?.contains(next)) return;
    setHover(false);
  };

  return (
    <div
      ref={wrapperRef}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      style={{
        position: "relative",
        width: `${TILE}px`,
        height: `${TILE + HOVER_BRIDGE_PX}px`,
        flexShrink: 0,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: hover ? 1.15 : 1 }}
        whileHover={{ scale: 1.15 }}
        transition={{
          opacity: { duration: 0.35, delay: 0.45 + index * 0.04, ease: "easeOut" },
          scale: { type: "tween", duration: 0.12, ease: "easeOut" },
        }}
        onClick={onPlay}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onPlay();
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={`Play ${item.name}`}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: `${TILE}px`,
          height: `${TILE}px`,
          borderRadius: "8px",
          overflow: "hidden",
          background: "rgba(255,255,255,0.04)",
          border: hover ? "1px solid rgba(255,255,255,0.35)" : "1px solid rgba(255,255,255,0.08)",
          cursor: "pointer",
          outline: "none",
          transition: "border-color 160ms ease-out",
          transformOrigin: "center center",
          zIndex: 5,
        }}
        title={item.name}
      >
        {/* Static thumbnail (middle frame for video, original for image). */}
        {item.type === "video" && thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumb}
            alt={item.name}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              pointerEvents: "none",
            }}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.src}
            alt={item.name}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              pointerEvents: "none",
            }}
          />
        )}
      </motion.div>

      {/* Invisible hit-bridge below the tile so cursor can travel onto the
          preview without breaking hover. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: `${TILE}px`,
          left: 0,
          width: `${TILE}px`,
          height: `${HOVER_BRIDGE_PX}px`,
          pointerEvents: "auto",
          zIndex: 1,
        }}
      />

      {/* Full-size preview, slides down from the tile. */}
      <AnimatePresence>
        {hover && item.type === "video" && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{
              position: "absolute",
              top: `${TILE + GAP / 2}px`,
              left: 0,
              width: `${displayW}px`,
              height: `${displayH}px`,
              borderRadius: 12,
              overflow: "hidden",
              background: "#000",
              border: "1px solid rgba(255,255,255,0.18)",
              boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
              zIndex: 3,
              pointerEvents: "none",
            }}
          >
            <video
              ref={previewRef}
              src={item.src}
              muted
              loop
              playsInline
              preload="auto"
              style={{
                width: "100%",
                height: "100%",
                display: "block",
                objectFit: "cover",
                background: "#000",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

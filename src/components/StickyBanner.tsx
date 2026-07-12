"use client";
import { useEffect, useRef, useState } from "react";

/**
 * StickyBanner — scroll-driven hero section.
 *
 * Plays a video scrubbed by scroll progress, smoothly in both
 * directions and **without decoder seek lag**.
 *
 * Why sprite sheets (not <video>)?
 *   The browser cannot play a <video> at a negative playbackRate.
 *   To support reverse scrubbing we generated a reversed source —
 *   but a forward <video> at a hard-coded currentTime still pays a
 *   ~30–200 ms decoder seek cost every time the user jumps, so the
 *   visual playhead lags behind scroll position. With a sprite
 *   sheet the playhead is just a `background-position-y` change:
 *   GPU-composited, instantaneous, exactly frame-accurate. Both
 *   forward and reverse use the same trick (each has its own
 *   pre-baked sprite), so reversal is a CSS visibility swap with
 *   no seek pipeline at all.
 *
 * Files (kept in /public/hero-video):
 *   sprite-fwd.jpg — 181 frames stacked vertically (640 × 65 160)
 *   sprite-rev.jpg — same frames in reverse time order
 *
 * The active sprite is moved by setting `background-position-y`
 * each animation frame to `-frame * frameH`. `frameH` is measured
 * from the rendered element so it survives `background-size: cover`
 * scaling.
 */

// Sprite sheet layout
// --------------------
// One sprite per *chunk* of 64 frames. Chunks are needed because
// 1280×720 frames tiled 12×15 = 15360×10800 = 165M px exceeds the
// GPU texture limit on most setups, leaving the whole sheet
// un-rendered (the page just shows the dark background colour).
// Splitting into 64-frame chunks of 8×8 (10240×5760 = 59M px)
// keeps every sprite safely inside the GPU limit. The browser
// only has one chunk decoded + uploaded at a time.
const FRAMES_PER_CHUNK = 64;
const CHUNK_COLS = 8;
const CHUNK_ROWS = 8; // 64 frames per chunk
const CHUNK_W = CHUNK_COLS * 1280; // 10240
const CHUNK_H = CHUNK_ROWS * 720; //  5760
const CHUNK_COUNT = 3; // 3 × 64 = 192, covers 181 frames of source
// Source sprite native dimensions per frame.
const NATIVE_FRAME_W = 1280;
const NATIVE_FRAME_H = 720;

export function StickyBanner() {
  const containerRef = useRef<HTMLDivElement>(null);
  // 3 forward chunks + 3 reverse chunks, each layer is one div
  // sitting on top of the others. We toggle visibility to choose
  // which chunk is currently visible based on progress.
  const fwdLayersRef = useRef<(HTMLDivElement | null)[]>([null, null, null]);
  const revLayersRef = useRef<(HTMLDivElement | null)[]>([null, null, null]);
  const [stage, setStage] = useState(0);
  // Track which direction is currently shown so we can flip on
  // direction change.
  const [activeDir, setActiveDir] = useState<"fwd" | "rev">("fwd");
  // Rendered frame height on screen — used as the step size for
  // background-position-y. Recomputed when the layer resizes.
  const frameHRef = useRef<number>(720);
  // Live diagnostics
  const [dbg, setDbg] = useState({
    progress: 0,
    chunk: 0,
    frame: 0,
    frameH: 0,
    dir: "fwd" as "fwd" | "rev",
  });
  // When the video hits its last frame the entire sticky panel
  // disappears instantly so the user is dropped onto the Contact
  // section instead of watching the panel slide up another 100vh.
  const [cut, setCut] = useState(false);

  // When `cut` is true, pin the Contact section over the viewport so
  // the cut is visible immediately (no 100vh of black before the user
  // sees Contact). When `cut` flips back to false (user scrolled up)
  // we restore the normal layout.
  useEffect(() => {
    const contact = document.getElementById("contact");
    if (!contact) return;
    if (cut) {
      contact.style.position = "fixed";
      contact.style.top = "0";
      contact.style.left = "0";
      contact.style.width = "100%";
      contact.style.height = "100vh";
      contact.style.zIndex = "60";
      contact.style.transform = "translateZ(0)";
    } else {
      contact.style.position = "";
      contact.style.top = "";
      contact.style.left = "";
      contact.style.width = "";
      contact.style.height = "";
      contact.style.zIndex = "";
      contact.style.transform = "";
    }
  }, [cut]);

  const getScrollRoot = (): HTMLElement | Window => {
    const root = document.querySelector(".site-scroll");
    return (root as HTMLElement) ?? window;
  };

  // ===== Stage updates from scroll =====
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let raf = 0;

    const updateStage = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const total = el.offsetHeight;
        const root = getScrollRoot();
        const viewportH =
          root === window
            ? window.innerHeight
            : (root as HTMLElement).clientHeight;
        const rect = el.getBoundingClientRect();
        const scrolled = Math.max(0, -rect.top);
        const progress = Math.min(
          1,
          scrolled / Math.max(1, total - viewportH)
        );
        const seg = Math.floor(progress * 8);
        setStage(Math.min(seg, 7));
      });
    };

    const root = getScrollRoot();
    root.addEventListener(
      "scroll",
      updateStage,
      { passive: true } as AddEventListenerOptions
    );
    window.addEventListener("resize", updateStage);
    updateStage();
    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener("scroll", updateStage as EventListener);
      window.removeEventListener("resize", updateStage);
    };
  }, []);

  // ===== Sprite scrub from scroll =====
  useEffect(() => {
    const el = containerRef.current;
    const fwd = fwdLayersRef.current.filter(Boolean) as HTMLDivElement[];
    const rev = revLayersRef.current.filter(Boolean) as HTMLDivElement[];
    if (!el || fwd.length === 0 || rev.length === 0) return;

    let raf = 0;
    let lastScrollY = -1;
    let lastDir: "fwd" | "rev" = "fwd";
    let lastDbgAt = 0;
    let currentChunk = 0; // which sprite chunk is currently painted

    const measure = () => {
      // background-size: cover scales the sprite (much taller than
      // any 16:9+ box) so cover matches the WIDTH:
      //   scale = boxW / CHUNK_W
      //   rendered frame height = boxW * (NATIVE_FRAME_H / NATIVE_FRAME_W)
      const layer = activeDirRef.current === "fwd" ? fwd[0] : rev[0];
      if (!layer) return;
      const rect = layer.getBoundingClientRect();
      if (rect.width <= 0) return;
      frameHRef.current =
        (rect.width / NATIVE_FRAME_W) * NATIVE_FRAME_H;
    };

    const activeDirRef: { current: "fwd" | "rev" } = { current: "fwd" };

    const setPosition = () => {
      const root = getScrollRoot();
      const total = el.offsetHeight;
      const rect = el.getBoundingClientRect();
      const viewportH =
        root === window
          ? window.innerHeight
          : (root as HTMLElement).clientHeight;
      const scrolled = Math.max(0, -rect.top);
      const progress = Math.max(
        0,
        Math.min(1, scrolled / Math.max(1, total - viewportH))
      );
      // 181 frames in the source — pad to 192 (= 3 × 64) for the
      // chunk boundary maths.
      const TOTAL_FRAMES = 192;

      const scrollY =
        root === window
          ? window.scrollY
          : (root as HTMLElement).scrollTop;
      const direction: "fwd" | "rev" =
        scrollY > lastScrollY + 0.5
          ? "fwd"
          : scrollY < lastScrollY - 0.5
            ? "rev"
            : lastDir;
      lastScrollY = scrollY;

      if (direction !== lastDir) {
        activeDirRef.current = direction;
        lastDir = direction;
        setActiveDir(direction);
      }

      // Determine which chunk the current frame lives in.
      //   forward:  frame 0 → chunk 0,  frame 64 → chunk 1, …
      //   reverse:  frame 0 (= source frame 192) → chunk 2,
      //             frame 64 → chunk 1, …
      const chunkFwd = Math.min(
        CHUNK_COUNT - 1,
        Math.floor(progress * CHUNK_COUNT)
      );
      const frameInChunkFwd = Math.round(
        (progress * CHUNK_COUNT - chunkFwd) * (FRAMES_PER_CHUNK - 1)
      );

      const chunkRev = Math.min(
        CHUNK_COUNT - 1,
        Math.floor((1 - progress) * CHUNK_COUNT)
      );
      const frameInChunkRev = Math.round(
        ((1 - progress) * CHUNK_COUNT - chunkRev) *
          (FRAMES_PER_CHUNK - 1)
      );

      // Show only the active chunk for each direction; hide the rest.
      // (We're hiding, not display:none, so the browser keeps the
      // decoded bitmap cached in memory and the swap is instant.)
      const showOnly = (
        layers: HTMLDivElement[],
        idx: number,
        dir: "fwd" | "rev"
      ) => {
        for (let i = 0; i < layers.length; i++) {
          const v =
            dir === activeDirRef.current && i === idx
              ? "visible"
              : "hidden";
          if (layers[i].style.visibility !== v) {
            layers[i].style.visibility = v;
          }
        }
      };
      showOnly(fwd, chunkFwd, "fwd");
      showOnly(rev, chunkRev, "rev");

      // Inside the visible chunk, offset by frame index × rendered
      // frame height.
      const frameH = frameHRef.current || NATIVE_FRAME_H;
      fwd[chunkFwd].style.backgroundPositionY = `-${frameInChunkFwd * frameH}px`;
      rev[chunkRev].style.backgroundPositionY = `-${frameInChunkRev * frameH}px`;

      // Hard cut: at progress >= 0.985 the user has reached the
      // last frame of the video. Hide the whole sticky panel so the
      // next scroll position reveals the Contact section directly,
      // without a slow 100vh slide.
      if (progress >= 0.985 && !cut) setCut(true);
      if (progress < 0.97 && cut) setCut(false);

      if (
        performance.now() - lastDbgAt > 150 &&
        currentChunk !== chunkFwd
      ) {
        lastDbgAt = performance.now();
        currentChunk = chunkFwd;
      }
      if (performance.now() - lastDbgAt > 150) {
        lastDbgAt = performance.now();
        setDbg({
          progress,
          chunk: chunkFwd,
          frame: frameInChunkFwd,
          frameH,
          dir: direction,
        });
      }
    };

    // rAF loop + scroll listener for responsiveness
    const loopTick = () => {
      setPosition();
      raf = requestAnimationFrame(loopTick);
    };
    raf = requestAnimationFrame(loopTick);

    const root = getScrollRoot();
    root.addEventListener(
      "scroll",
      setPosition,
      { passive: true } as AddEventListenerOptions
    );
    window.addEventListener("resize", () => {
      measure();
      setPosition();
    });

    measure();
    const ro = new ResizeObserver(() => {
      measure();
      setPosition();
    });
    fwd.forEach((l) => ro.observe(l));
    rev.forEach((l) => ro.observe(l));

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      root.removeEventListener("scroll", setPosition as EventListener);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const isCircleStage = stage >= 1 && stage <= 5;

  return (
    <div
      ref={containerRef}
      style={{
        /* The video scrub range is 6.04s × 100vh = 604vh of scroll.
           We size the container to 504vh so progress hits 1.0 right
           at the container's end (= sticky unlock). The remaining
           100vh would otherwise be a slow slide-up of the panel;
           instead we hard-cut the panel away at progress ≥ 0.985
           so the next section is revealed immediately. */
        height: "504vh",
        minHeight: "504vh",
        position: "relative",
      }}
    >
      <div
        className="banner-sticky"
        style={{
          width: "100%",
          display: cut ? "none" : "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          padding: "clamp(2rem, 4.5rem, 6rem) clamp(1rem, 3.5rem, 3.5rem)",
          minHeight: "100vh",
          background: "var(--background-1)",
          overflow: "hidden",
          isolation: "isolate",
        }}
      >
        {/* Forward sprite layers — one per chunk. Each chunk holds
            64 frames at 1280×720. Only one chunk is visible at a
            time, chosen by progress. Smaller sprites stay inside
            the GPU texture limit so they actually render. */}
        {[0, 1, 2].map((i) => (
          <div
            key={`fwd-${i}`}
            ref={(el) => {
              fwdLayersRef.current[i] = el;
            }}
            className="banner-sprite"
            style={{
              backgroundImage: `url(/hero-video/sprite-fwd-${i + 1}.jpg)`,
              opacity: 0.75,
              visibility: i === 0 ? "visible" : "hidden",
            }}
          />
        ))}
        {/* Reverse sprite layers — same chunking, mirrored so the
            frame index advances in reverse when scrolling up. */}
        {[0, 1, 2].map((i) => (
          <div
            key={`rev-${i}`}
            ref={(el) => {
              revLayersRef.current[i] = el;
            }}
            className="banner-sprite"
            style={{
              backgroundImage: `url(/hero-video/sprite-rev-${i + 1}.jpg)`,
              opacity: 0.75,
              visibility: "hidden",
            }}
          />
        ))}

        <div className="banner-fade-top" />

        {/* Stage 0: Large heading */}
        {stage === 0 && (
          <div
            className="col-span-12 flex flex-col justify-center items-center font-bold uppercase"
            style={{
              fontSize: "clamp(2rem, 7.2vw, 6rem)",
              fontVariationSettings: '"wdth" 120',
              lineHeight: 1,
              color: "var(--color-pink)",
              textAlign: "center",
              position: "relative",
              zIndex: 2,
            }}
          >
            Innovate<br />with<br />purpose
          </div>
        )}

        {/* Stage 1-5: Circle + text blocks */}
        {isCircleStage && (
          <div
            className="col-span-12 flex flex-col justify-center items-center gap-8"
            style={{ position: "relative", zIndex: 2 }}
          >
            <div
              style={{
                width: "clamp(80px, 20vw, 240px)",
                height: "clamp(80px, 20vw, 240px)",
                position: "relative",
              }}
            >
              <svg
                viewBox="0 0 200 200"
                fill="none"
                style={{ width: "100%", height: "100%" }}
              >
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  stroke="#C0FE04"
                  strokeWidth="3"
                  strokeDasharray="502"
                  strokeDashoffset={
                    stage <= 3 ? (3 - stage) * 125 : (stage - 3) * 125
                  }
                  strokeLinecap="round"
                  transform="rotate(-90 100 100)"
                  style={{
                    transition:
                      "stroke-dashoffset 1s cubic-bezier(0.66, 0, 0.01, 1)",
                  }}
                />
              </svg>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "2rem 4rem",
                textAlign: "center",
                maxWidth: "800px",
                width: "100%",
              }}
            >
              {[
                ["Building tomorrow's", "digital products."],
                ["Independent by", "design & engineering."],
                ["Clarity first.", "Delight second."],
                ["Ship in small loops.", "Aim for long arcs."],
              ].map(([a, b], i) => (
                <div
                  key={i}
                  style={{
                    fontWeight: 500,
                    fontSize: "clamp(1rem, 2vw, 1.5rem)",
                    color: "var(--color-pink)",
                    lineHeight: 1.3,
                  }}
                >
                  <div>{a}</div>
                  <div>{b}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stage 6-7: FUTURE-FIRST */}
        {stage >= 6 && (
          <div
            className="col-span-12 flex flex-col justify-center items-center font-bold uppercase"
            style={{
              fontSize: "clamp(1.75rem, 6vw, 5rem)",
              fontVariationSettings: '"wdth" 120',
              lineHeight: 1,
              color: "var(--color-pink)",
              textAlign: "center",
              position: "relative",
              zIndex: 2,
            }}
          >
            FUTURE-FIRST<br />ALWAYS
          </div>
        )}
      </div>
    </div>
  );
}
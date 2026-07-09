"use client";
import { useEffect, useRef, useState } from "react";

export function StickyBanner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stage, setStage] = useState(0);

  // The site uses a custom scroll container, not window.
  const getScrollRoot = (): HTMLElement | Window => {
    const root = document.querySelector(".site-scroll");
    return (root as HTMLElement) ?? window;
  };

  // Bind scroll-driven stage to whichever element actually scrolls.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let raf = 0;

    const update = () => {
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
        const progress = Math.min(1, scrolled / Math.max(1, total - viewportH));
        const seg = Math.floor(progress * 8);
        setStage(Math.min(seg, 7));
      });
    };

    const root = getScrollRoot();
    root.addEventListener("scroll", update, { passive: true } as AddEventListenerOptions);
    window.addEventListener("resize", update);
    update();
    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener("scroll", update as EventListener);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Bind video playback to scroll progress so the video plays only as the
// user scrolls. We let the video run naturally at variable playbackRate
// instead of seeking every frame, which avoids the per-frame seek
// micro-stutter caused by the decode pipeline.
  useEffect(() => {
    const el = containerRef.current;
    const video = videoRef.current;
    if (!el || !video) return;

    // Ensure the video can play programmatically and stays muted/autoplays
    // inline so playbackRate adjustments don't trip browser autoplay rules.
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;

    let raf = 0;
    let lastTarget = 0;
    let lastSeekAt = 0;
    let lastSeekTarget = -1;
    let playPromise: Promise<void> | null = null;

    const ensurePlaying = () => {
      if (video.paused && video.readyState >= 2) {
        playPromise = video.play();
        if (playPromise) {
          playPromise.catch(() => {
            /* autoplay can be rejected; we just keep paused */
          });
        }
      }
    };

    const onLoaded = () => {
      try {
        video.currentTime = 0;
      } catch {
        /* ignore */
      }
      lastTarget = 0;
      ensurePlaying();
    };

    if (video.readyState >= 1) {
      onLoaded();
    } else {
      video.addEventListener("loadedmetadata", onLoaded, { once: true });
    }

    // We use requestAnimationFrame (not requestVideoFrameCallback) because
    // we need to schedule work even when the video is paused between
    // seeks — rVFC stops firing when no frame is presented. At 60 Hz
    // with a tight GOP, per-frame hard seeks back to target look like
    // genuine reverse playback on Chromium; the decoder eats the
    // cost gracefully because we never queue two seeks against the
    // same RAF tick (cancelAnimationFrame at the top).
    const sync = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
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
          Math.min(0.999, scrolled / Math.max(1, total - viewportH))
        );
        const dur = video.duration || 0;

        if (dur <= 0 || video.readyState < 2) {
          return;
        }

        const target = progress * dur;
        lastTarget = target;

        // Outside the active range: pause the video to save CPU.
        if (progress <= 0) {
          if (!video.paused) video.pause();
          return;
        }
        if (progress >= 0.999) {
          if (!video.paused) video.pause();
          return;
        }

        const cur = video.currentTime;
        const diff = target - cur;
        const now = performance.now();

        // Reverse direction. Chrome rejects negative playbackRate, so
        // we update currentTime on every RAF tick. With a tight GOP
        // (small keyframe interval) and at 60 Hz, successive seeks
        // back to target read as smooth reverse playback.
        if (diff < 0) {
          if (Math.abs(diff) > 0.005) {
            try {
              video.currentTime = target;
            } catch {
              /* ignore */
            }
          }
          // Keep the decoder live (so seeks resolve quickly) but stop
          // time advancing forward between seeks.
          if (video.paused) ensurePlaying();
          if (video.playbackRate !== 0) video.playbackRate = 0;
          return;
        }

        // Forward direction: smooth playbackRate steering to catch up
        // without re-decoding every frame.
        ensurePlaying();

        if (Math.abs(diff) < 0.05) {
          if (video.playbackRate !== 1) video.playbackRate = 1;
          return;
        }

        // Big jump scroll: a single hard seek is cleaner than letting the
        // video whip through at 4x.
        if (diff > 0.5) {
          try {
            video.currentTime = target;
            lastSeekAt = now;
            lastSeekTarget = target;
          } catch {
            /* ignore */
          }
          video.playbackRate = 1;
          return;
        }

        // Gentle catch-up (positive rate only — Chrome blocks negative).
        const rate = Math.max(0.25, Math.min(4, 1 + diff * 8));
        video.playbackRate = rate;
      });
    };

    const root = getScrollRoot();
    root.addEventListener("scroll", sync, { passive: true } as AddEventListenerOptions);
    window.addEventListener("resize", sync);
    let loop: number;
    const loopTick = () => {
      sync();
      loop = requestAnimationFrame(loopTick);
    };
    loop = requestAnimationFrame(loopTick);

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(loop);
      root.removeEventListener("scroll", sync as EventListener);
      window.removeEventListener("resize", sync);
      video.removeEventListener("loadedmetadata", onLoaded);
      if (!video.paused) video.pause();
    };
  }, []);

  const isCircleStage = stage >= 1 && stage <= 5;

  return (
    <div
      ref={containerRef}
      style={{ height: "800vh", minHeight: "800vh", position: "relative" }}
    >
      <div
        className="banner-sticky"
        style={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          padding: "clamp(2rem, 4.5rem, 6rem) clamp(1rem, 3.5rem, 3.5rem)",
          minHeight: "100vh",
          background: "var(--background-1)",
          overflow: "hidden",
          isolation: "isolate",
          /* Soft fade in/out at top & bottom — eliminates hard cut into the dot grid */
          maskImage: "linear-gradient(to bottom, transparent 0%, #000 20%, #000 80%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 20%, #000 80%, transparent 100%)",
        }}
      >
        {/* Video: currentTime is updated directly from scroll position */}
        <video
          ref={videoRef}
          src="/hero-video/innovate.mp4?v=20260709v2"
          muted
          playsInline
          autoPlay
          preload="auto"
          className="banner-video"
        />

        {/* Soft top fade matching the section above */}
        <div className="banner-fade-top" />

        {/* Soft bottom fade matching the Contact section below */}
        <div className="banner-fade-bottom" />

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
          <div className="col-span-12 flex flex-col justify-center items-center gap-8" style={{ position: "relative", zIndex: 2 }}>
            <div style={{ width: "clamp(80px, 20vw, 240px)", height: "clamp(80px, 20vw, 240px)", position: "relative" }}>
              <svg viewBox="0 0 200 200" fill="none" style={{ width: "100%", height: "100%" }}>
                <circle
                  cx="100" cy="100" r="80"
                  stroke="#C0FE04"
                  strokeWidth="3"
                  strokeDasharray="502"
                  strokeDashoffset={stage <= 3 ? (3 - stage) * 125 : (stage - 3) * 125}
                  strokeLinecap="round"
                  transform="rotate(-90 100 100)"
                  style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.66, 0, 0.01, 1)" }}
                />
              </svg>
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "2rem 4rem",
              textAlign: "center",
              maxWidth: "800px",
              width: "100%",
            }}>
              {[
                ["Building tomorrow's", "digital products."],
                ["Independent by", "design & engineering."],
                ["Clarity first.", "Delight second."],
                ["Ship in small loops.", "Aim for long arcs."],
              ].map(([a, b], i) => (
                <div key={i} style={{ fontWeight: 500, fontSize: "clamp(1rem, 2vw, 1.5rem)", color: "var(--color-pink)", lineHeight: 1.3 }}>
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

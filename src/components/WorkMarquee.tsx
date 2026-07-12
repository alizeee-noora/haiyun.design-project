"use client";
import { useEffect, useRef, useState } from "react";
import { WorkCard } from "./WorkCard";

interface Work {
  title: string;
  subtitle?: string;
  href: string;
  year: string;
  tag?: string;
  tagEn?: string;
  poster?: string;
  external?: boolean;
}

interface Props {
  works: Work[];
  /** Vertical pixels scrolled per second while idle. */
  speed?: number;
  /** ms to wait after the last user activity before resuming. */
  resumeDelay?: number;
}

/**
 * Seamless infinite vertical marquee for the existing 12-column Work grid.
 *
 * - Renders three identical copies of `works` stacked vertically.
 * - The track translates upward at a fixed px/sec. When one copy has fully
 *   scrolled past the top, we jump the translate back by exactly one copy's
 *   height — the next copy is visually identical to the first, so the loop
 *   is seamless.
 * - Animation is paused on hover, mouse movement, touch, wheel, scroll and
 *   keyboard activity, then resumes after `resumeDelay` ms of idle.
 * - Respects `prefers-reduced-motion` (renders a single static copy).
 *
 * Why JS instead of CSS keyframes? The height of one copy depends on the
 * user’s viewport and the cards’ intrinsic aspect, so a CSS `translateY(-33%)`
 * doesn't give a stable px/sec. We measure the copy height and run rAF so
 * the speed is exact regardless of layout.
 */
export function WorkMarquee({
  works,
  speed = 70,
  resumeDelay = 1200,
}: Props) {
  const [isPaused, setIsPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const firstCopyRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);
  // Each item's (setIndex, in-set center Y) so the rAF loop can compute
  // its logical Y without reading post-transform bounding rects.
  const itemGeometryRef = useRef<{ setIdx: number; centerY: number }[]>([]);
  const translateYRef = useRef(0);
  const copyHeightRef = useRef(0);
  const viewportCenterRef = useRef(0);

  const renderCopy = (copyIndex: number) => (
    <div
      ref={copyIndex === 0 ? firstCopyRef : undefined}
      className="work-marquee-set"
      data-copy={copyIndex}
    >
      {works.map((work, i) => (
        <div key={`c${copyIndex}-${i}-${work.href}`} className="work-grid-item">
          <WorkCard {...work} delay={0} />
        </div>
      ))}
    </div>
  );

  // Reduced-motion preference (read once; cheap to recompute on change).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  // Measure one copy's height; re-measure on resize. Also collect all
  // `.work-grid-item` nodes so the rAF loop can update their scale.
  useEffect(() => {
    if (reducedMotion) return;
    const measure = () => {
      const el = firstCopyRef.current;
      if (!el) return;
      copyHeightRef.current = el.getBoundingClientRect().height;
    };
    const collect = () => {
      const root = trackRef.current;
      if (!root) return;
      const items = Array.from(
        root.querySelectorAll<HTMLDivElement>(".work-grid-item")
      );
      itemsRef.current = items;
      // Capture each item's set index + center offset inside that set,
      // so the rAF loop can place them in document space without reading
      // post-transform rects (which would chase themselves).
      itemGeometryRef.current = items.map((el) => {
        const setEl = el.closest<HTMLElement>(".work-marquee-set");
        const setIdx = setEl ? Number(setEl.dataset.copy ?? 0) : 0;
        // offsetTop = el's top inside its set; + half height → center.
        const top = el.offsetTop;
        const centerY = top + el.offsetHeight / 2;
        return { setIdx, centerY };
      });
    };
    measure();
    collect();
    const ro = new ResizeObserver(() => {
      measure();
      // Items themselves don't change count here, but a reflow could.
      collect();
    });
    if (firstCopyRef.current) ro.observe(firstCopyRef.current);
    window.addEventListener("resize", () => {
      measure();
      collect();
    });
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [reducedMotion, works.length]);

  // Pause on any user activity, resume after idle window.
  useEffect(() => {
    if (reducedMotion) return;
    let resumeTimer: number | undefined;
    const pause = () => {
      setIsPaused(true);
      if (resumeTimer) window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => setIsPaused(false), resumeDelay);
    };
    const events: (keyof WindowEventMap)[] = [
      "mousemove",
      "mousedown",
      "touchstart",
      "touchmove",
      "wheel",
      "keydown",
      "scroll",
    ];
    events.forEach((ev) => window.addEventListener(ev, pause, { passive: true }));
    return () => {
      events.forEach((ev) => window.removeEventListener(ev, pause));
      if (resumeTimer) window.clearTimeout(resumeTimer);
    };
  }, [reducedMotion, resumeDelay]);

  // rAF loop: translate upward at `speed` px/sec; jump back when one copy
  // height has scrolled past the top. Also applies the "barrel" scale
  // effect — cards grow toward the viewport's vertical center.
  useEffect(() => {
    if (reducedMotion) return;
    let rafId = 0;
    let lastT = performance.now();

    const tick = (now: number) => {
      const dt = (now - lastT) / 1000;
      lastT = now;
      const track = trackRef.current;
      const copyH = copyHeightRef.current;
      if (track && copyH > 0) {
        translateYRef.current -= speed * dt;
        // Wrap: when one full copy has scrolled past, snap back by copyH.
        if (translateYRef.current <= -copyH) {
          translateYRef.current += copyH;
        }
        track.style.transform = `translate3d(0, ${translateYRef.current}px, 0)`;

        // Curl effect: rotate each card around its horizontal axis
        // proportional to its signed distance from the viewport's
        // vertical center. Cards near the top edge tilt forward
        // (top rolls back); cards near the bottom edge tilt backward
        // (bottom rolls back). Center stays flat. Reading pre-transform
        // geometry (offsetTop + track rect + translate) avoids the
        // bounding-rect feedback loop a rotating element would cause.
        const trackRect = track.getBoundingClientRect();
        const trackTopInDoc = trackRect.top + window.scrollY;
        const winH = window.innerHeight;
        const viewportCenter = winH / 2 + window.scrollY;
        viewportCenterRef.current = viewportCenter;
        // Larger on desktop where cards are wider; smaller on mobile so the
        // foreshortening doesn't visually flatten already-narrow cards.
        const maxAngleDeg = window.innerWidth < 640 ? 18 : 28;
        const halfWindow = winH / 2;
        const ty = translateYRef.current;
        const items = itemsRef.current;
        const geom = itemGeometryRef.current;
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const g = geom[i];
          if (!g) continue;
          // Logical center Y in document space:
          //   trackTopInDoc + ty (track translate) + setIdx * copyH + centerY
          const setOffset = g.setIdx * copyH;
          const logicalY =
            trackTopInDoc + ty + setOffset + g.centerY;
          const signedDist = logicalY - viewportCenter;
          // signedDist>0 → item is below center → tilt bottom back (negative angle)
          // signedDist<0 → item is above center → tilt top back (positive angle)
          const norm = Math.max(-1, Math.min(1, signedDist / halfWindow));
          const angleDeg = norm * maxAngleDeg;
          const prev = item.style.transform;
          const next = `rotateX(${angleDeg.toFixed(2)}deg)`;
          if (prev !== next) item.style.transform = next;
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    const start = () => {
      lastT = performance.now();
      rafId = requestAnimationFrame(tick);
    };
    const stop = () => cancelAnimationFrame(rafId);

    if (!isPaused) start(); else stop();
    return stop;
  }, [isPaused, reducedMotion, speed]);

  if (reducedMotion) {
    return <div className="work-marquee-static">{renderCopy(0)}</div>;
  }

  return (
    <div
      className="work-marquee"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div ref={trackRef} className="work-marquee-track">
        {renderCopy(0)}
        {renderCopy(1)}
        {renderCopy(2)}
      </div>
    </div>
  );
}
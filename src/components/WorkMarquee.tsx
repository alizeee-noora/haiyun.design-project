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
}

/**
 * Two-part work section:
 *
 *   1. <div.work-pinboard-track>
 *      A vertical mosaic grid (the "main" work viewport). Each card is
 *      one row in the 12-column grid, with the grid-column offsets
 *      applied via CSS so consecutive cards stagger left/right. The
 *      user scrolls vertically through the cards.
 *
 *   2. <div.work-thumbstrip>
 *      A horizontal strip of compact cards (poster + title + year)
 *      rendered AFTER the main grid in document order. Each thumbnail
 *      scrolls the main viewport to its corresponding card on click,
 *      giving quick navigation without leaving the page. The strip is
 *      a horizontal scroll-snap container, so it overflows naturally
 *      and never changes the height of the page.
 *
 * Cards live in two stacked sections; CSS places them so the thumbstrip
 * always renders below the main grid on every viewport.
 */
export function WorkMarquee({ works }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  const scrollToCard = (i: number) => {
    const root = trackRef.current;
    if (!root) return;
    const target = root.querySelector<HTMLElement>(`[data-work-card="${i}"]`);
    if (!target) return;
    target.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <>
      {/* Main viewport — vertical mosaic grid, scrolls with the page. */}
      <div ref={trackRef} className="work-pinboard">
        <div className="work-pinboard-track">
          {works.map((work, i) => (
            <div
              key={`${i}-${work.href}`}
              data-work-card={i}
              className="work-grid-item"
            >
              <WorkCard {...work} delay={0} />
            </div>
          ))}
        </div>
      </div>

      {/* Thumbstrip — horizontal row of compact cards. Each button scrolls
          the main viewport to its card. Rendered after the main grid in
          document order so it sits below it visually. */}
      <nav className="work-thumbstrip" aria-label="Work quick navigation">
        <div className="work-thumbstrip-inner">
          {works.map((work, i) => (
            <button
              type="button"
              key={`thumb-${i}-${work.href}`}
              onClick={() => scrollToCard(i)}
              className="work-thumb"
              aria-label={`Jump to ${work.title}`}
            >
              {work.poster ? (
                <span className="work-thumb-poster">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={work.poster} alt="" loading="lazy" />
                </span>
              ) : (
                <span className="work-thumb-poster work-thumb-poster-fallback" />
              )}
              <span className="work-thumb-meta">
                <span className="work-thumb-title">{work.title}</span>
                <span className="work-thumb-year">{work.year}</span>
              </span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
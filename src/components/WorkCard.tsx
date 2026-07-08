"use client";
import { useEffect, useRef, useState } from "react";

interface Props {
  title: string;
  subtitle?: string;
  href: string;
  year: string;
  tag?: string;
  tagEn?: string;
  poster?: string;
  external?: boolean;
  delay?: number;
}

export function WorkCard({ title, subtitle, href, year, tag, tagEn, poster, external, delay = 0 }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  const cardInner = (
    <>
      {/* Hover scale wrapper — animates the entire card body */}
      <div className="relative overflow-hidden rounded-3xl border border-stroke bg-surface aspect-video cursor-pointer transition-transform duration-500 ease-out group-hover:scale-[1.03]">
        {/* Cover image */}
        {poster ? (
          <img
            src={poster}
            alt=""
            draggable={false}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundColor: "#0d0d0d" }}
          />
        ) : (
          <div className="h-full w-full bg-surface transition-transform duration-700 group-hover:scale-105" />
        )}

        {/* Halftone overlay — always visible */}
        <div
          className="absolute inset-0 opacity-20 mix-blend-multiply pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
            backgroundSize: "4px 4px",
          }}
          aria-hidden
        />

        {/* Top-right pink English tag */}
        {tagEn && (
          <div
            className="absolute top-0 right-0 z-10 px-3 py-1.5 bg-[var(--color-pink)] text-black text-[0.65rem] uppercase font-bold leading-none rounded-bl-lg pointer-events-none"
            style={{
              fontFamily: "var(--font-mono-2)",
              letterSpacing: "0.12em",
            }}
          >
            {tagEn}
          </div>
        )}

        {/* Glass hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-bg/70 opacity-0 backdrop-blur-lg transition-all duration-500 group-hover:opacity-100 z-20">
          <div className="accent-gradient p-[1px] rounded-full shadow-xl">
            <span
              className="inline-block bg-text-primary text-bg font-medium text-sm px-6 py-2.5 rounded-full"
              style={{ color: "var(--bg)" }}
            >
              View — <span className="font-display italic">{title}</span>
            </span>
          </div>
        </div>

        {/* Optional subtitle below the pill */}

      </div>

      {/* Titlebar — outside the overflow-hidden card body, always visible */}
      <div
        className="mt-3 flex items-center justify-between pointer-events-none"
        style={{
          fontFamily: "var(--font-mono-2)",
          fontSize: "0.7rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--label-1)",
        }}
      >
        <span className="truncate">{title}</span>
        <span
          className="ml-2"
          style={{ opacity: 0.6, fontVariantNumeric: "tabular-nums" }}
        >
          {year}
        </span>
      </div>
    </>
  );

  const wrapper: React.CSSProperties = {
    display: "block",
    textDecoration: "none",
    color: "inherit",
    padding: "8px",
    position: "relative",
    cursor: "pointer",
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(40px)",
    transition:
      "opacity 800ms cubic-bezier(0.66, 0, 0.01, 1), transform 800ms cubic-bezier(0.66, 0, 0.01, 1)",
  };

  if (external) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${title} - ${year} (external)`}
        style={wrapper}
        className="group"
      >
        {cardInner}
      </a>
    );
  }

  return (
    <a ref={ref} href={href} aria-label={`${title} - ${year}`} style={wrapper} className="group">
      {cardInner}
    </a>
  );
}
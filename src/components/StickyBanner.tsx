"use client";
import { useEffect, useRef, useState } from "react";

export function StickyBanner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight;
      const scrolled = Math.max(0, -rect.top);
      const progress = Math.min(1, scrolled / total);
      const seg = Math.floor(progress * 8);
      setStage(Math.min(seg, 7));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
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
        }}
      >
        {/* Stage 0: Large heading */}
        {stage === 0 && (
          <div
            className="col-span-12 flex flex-col justify-center items-center font-bold uppercase"
            style={{
              fontSize: "clamp(2.5rem, 7.2vw, 7.2vw)",
              fontVariationSettings: '"wdth" 120',
              lineHeight: 1,
              color: "var(--label-1)",
              textAlign: "center",
            }}
          >
            Innovate<br />with<br />purpose
          </div>
        )}

        {/* Stage 1-5: Circle + text blocks */}
        {isCircleStage && (
          <div className="col-span-12 flex flex-col justify-center items-center gap-8">
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
                <div key={i} style={{ fontWeight: 500, fontSize: "clamp(1rem, 2vw, 1.5rem)", color: "var(--label-1)", lineHeight: 1.3 }}>
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
              fontSize: "clamp(2rem, 6vw, 6vw)",
              fontVariationSettings: '"wdth" 120',
              lineHeight: 1,
              color: "#C0FE04",
              textAlign: "center",
            }}
          >
            FUTURE-FIRST<br />ALWAYS
          </div>
        )}
      </div>
    </div>
  );
}

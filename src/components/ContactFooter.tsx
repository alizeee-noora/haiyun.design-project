"use client";
import { useEffect, useRef, useState } from "react";
import { TypewriterText } from "@/components/TypewriterText";
import { HeroOrb } from "@/components/HeroOrb";

interface ContactFooterProps {
  padX: string;
  padY: string;
  monoFont: string;
}

/** Resolve the page's actual overflow container and smooth-scroll a hash
 *  target into view. Shared with the header nav so both stay in sync. */
function scrollToHash(hash: string) {
  const id = hash.startsWith("#") ? hash.slice(1) : hash;
  const target = document.getElementById(id);
  if (!target) return;
  const scrollContainer =
    document.querySelector<HTMLElement>(".site-scroll") ??
    (document.scrollingElement as HTMLElement | null);
  if (!scrollContainer) {
    target.scrollIntoView({ behavior: "smooth" });
    return;
  }
  const containerTop = scrollContainer.getBoundingClientRect().top;
  const targetTop = target.getBoundingClientRect().top;
  const top = targetTop - containerTop + scrollContainer.scrollTop - 80;
  scrollContainer.scrollTo({ top, behavior: "smooth" });
}

/** Contact footer with a typewriter-driven headline that mirrors the hero section. The typewriter chain only mounts once the footer is in view. */
export function ContactFooter({ padX, padY, monoFont }: ContactFooterProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || armed) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setArmed(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.18 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [armed]);

  const SPEED = 55;
  const lines = [
    { text: "Let's", align: "left" as const },
    { text: "Design", align: "right" as const },
    { text: "Something", align: "left" as const },
    { text: "With Craft", align: "right" as const },
  ];
  const startDelays: number[] = (() => {
    const out: number[] = [];
    let cursor = 150;
    for (const { text } of lines) {
      out.push(cursor);
      cursor += text.length * SPEED + 180;
    }
    return out;
  })();

  return (
    <footer
      id="contact"
      ref={rootRef as React.RefObject<HTMLElement>}
      style={{
        position: "relative",
        padding: `${padY} ${padX}`,
        width: "100%",
        minHeight: "100dvh",
        background: "var(--background-1)",
        color: "#fff",
        zIndex: 10,
        overflow: "hidden",
        /* No top mask — the hero video above hands off directly into
           the contact content here. Previously a transparent top 30%
           created a black band right where the user looked for the
           transition. */
        maskImage: "linear-gradient(to bottom, #000 0%, #000 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, #000 0%, #000 100%)",
      }}
    >
      <HeroOrb baseSrc="/hero/base.png" revealSrc="/hero/revel.png" />

      <div
        style={{
          position: "relative",
          zIndex: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          minHeight: "calc(100dvh - 12rem)",
          paddingBottom: "100px",
          pointerEvents: "none",
        }}
      >
        {armed &&
          lines.map(({ text, align }, i) => (
            <div
              key={text}
              style={{
                overflow: "hidden",
                lineHeight: 1,
                fontWeight: 700,
                textTransform: "uppercase",
                fontSize: "clamp(2.5rem, 9vw, 8rem)",
                fontVariationSettings: '"wdth" 120',
                textAlign: align,
                letterSpacing: "-0.02em",
                color: "#fff",
              }}
            >
              <TypewriterText
                text={text}
                speed={SPEED}
                startDelay={startDelays[i]}
                className="hero-typewriter"
              />
            </div>
          ))}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: `${padY} ${padX}`,
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          fontFamily: monoFont,
          fontSize: "0.875rem",
          zIndex: 4,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <a
            href="mailto:1950523773@qq.com"
            className="site-nav-btn nav-pink-hover"
            style={{ textDecoration: "none", pointerEvents: "auto" }}
          >
            1950523773@qq.com
          </a>
          <a
            href="tel:13221161752"
            className="site-nav-btn nav-pink-hover"
            style={{ textDecoration: "none", pointerEvents: "auto" }}
          >
            132 2116 1752
          </a>
          <button
            type="button"
            onClick={() => scrollToHash("#selected-work")}
            className="site-nav-btn nav-pink-hover"
            style={{
              pointerEvents: "auto",
              fontWeight: 600,
              letterSpacing: "0.02em",
            }}
            aria-label="Scroll back up to the Selected Work section"
          >
            ↑ Work
          </button>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "2rem 1rem",
          }}
        >
          {[
            ["姓名", "刘海云 · Haiyun Liu"],
            ["学校", "中央美术学院 (硕士)"],
            ["专业", "建筑设计 · B.Arch"],
            ["求职岗位", "平面设计 · UI 设计"],
          ].map(([k, v]) => (
            <div key={k}>
              <div
                style={{
                  fontSize: "0.7em",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#fff",
                }}
              >
                {k}
              </div>
              <div style={{ marginTop: "4px", color: "#fff" }}>{v}</div>
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontSize: "0.75em",
            color: "#fff",
            gap: "0.5rem",
          }}
        >
          <span>
            意向城市 · <span style={{ color: "#fff" }}>北京 / 杭州 / 上海</span>
          </span>
          <span>&copy; 2026 · 刘海云 · All work shown by permission</span>
        </div>
      </div>
    </footer>
  );
}
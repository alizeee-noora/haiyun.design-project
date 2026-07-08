"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ProjectGalleryClient } from "./ProjectGalleryClient";

type Item = { src: string; type: "image" | "video"; name: string };

interface Props {
  title: string;
  subtitle?: string;
  year?: string;
  description?: string;
  poster?: string;
  items: Item[];
}

const textEnter = (delay: number) => ({
  initial: { filter: "blur(10px)", opacity: 0, y: 20 },
  animate: { filter: "blur(0px)", opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut", delay },
});

export function ProjectGalleryView({ title, subtitle, year, description, poster, items }: Props) {
  return (
    <div className="grid-bg" style={{ height: "100dvh", overflow: "auto", background: "var(--background-1)", color: "var(--label-1)" }}>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "clamp(1rem, 2.5rem, 2.5rem) clamp(1rem, 3.5rem, 3.5rem)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        <Link
          href="/"
          className="site-nav-btn"
          style={{ pointerEvents: "auto", fontWeight: 700, textDecoration: "none", color: "#fff", letterSpacing: "0.12em", fontFamily: "var(--font-mono-2)" }}
        >
          HAIYUN.DESIGN
        </Link>
        <Link
          href="/"
          className="site-nav-btn nav-pink-hover"
          style={{ pointerEvents: "auto", fontWeight: 600, textDecoration: "none" }}
        >
          ← Back
        </Link>
      </header>

      <main style={{ position: "relative", zIndex: 10, paddingTop: "120px", paddingBottom: "40px" }}>
        <div style={{ padding: "0 clamp(1rem, 3.5rem, 3.5rem)", maxWidth: "1600px", margin: "0 auto" }}>
          <div style={{ marginBottom: "2rem" }}>
            <motion.div
              {...textEnter(0.1)}
              style={{ fontSize: "0.75rem", opacity: 0.6, fontFamily: "var(--font-mono-2)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}
            >
              {year || "Selected Work"}
              {subtitle && ` · ${subtitle}`}
            </motion.div>
            <motion.h1
              {...textEnter(0.25)}
              style={{
                fontWeight: 700,
                textTransform: "uppercase",
                lineHeight: 1,
                fontSize: "clamp(3rem, 8vw, 7.2vw)",
                fontVariationSettings: '"wdth" 120',
                color: "#fff",
                marginBottom: "1rem",
              }}
            >
              {title}
            </motion.h1>
            {description && (
              <motion.p
                {...textEnter(0.4)}
                style={{ fontSize: "1rem", opacity: 0.7, maxWidth: "60ch", lineHeight: 1.5 }}
              >
                {description}
              </motion.p>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          <div style={{ padding: "4rem", textAlign: "center", opacity: 0.5, fontFamily: "var(--font-mono-2)" }}>
            暂无作品素材
          </div>
        ) : (
          <ProjectGalleryClient items={items} poster={poster} />
        )}
      </main>
    </div>
  );
}

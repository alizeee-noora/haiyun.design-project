"use client";
import { useState } from "react";

export function PortraitCard() {
  const [hover, setHover] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Frame */}
      <div
        style={{
          position: "relative",
          width: "70%",
          maxWidth: "220px",
          aspectRatio: "3 / 4",
          overflow: "hidden",
          background: "var(--background-elevated)",
          cursor: "pointer",
          borderRadius: "4px",
        }}
      >
        {/* Portrait */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/about/portrait.png"
          alt="刘海云 / Haiyun Liu"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            filter: hover ? "blur(2px) brightness(0.6)" : "blur(0) brightness(1)",
            transition: "filter 400ms cubic-bezier(0.66, 0, 0.01, 1)",
          }}
        />

        {/* Hover: Resume CTA */}
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            textDecoration: "none",
            opacity: hover ? 1 : 0,
            transform: hover ? "scale(1)" : "scale(0.9)",
            transition: "all 400ms cubic-bezier(0.66, 0, 0.01, 1)",
          }}
          aria-label="View Resume PDF"
        >
          <span
            style={{
              padding: "10px 24px",
              background: "#ff7eb6",
              color: "#000",
              fontFamily: "var(--font-mono-2)",
              fontSize: "0.875rem",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              fontWeight: 600,
            }}
          >
            简历 ↗
          </span>
          <span
            style={{
              color: "#fff",
              fontFamily: "var(--font-mono-2)",
              fontSize: "0.7rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Resume PDF
          </span>
        </a>
      </div>

      {/* Caption under photo */}
      <div
        style={{
          fontFamily: "var(--font-mono-2)",
          fontSize: "0.65rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--label-2)",
          textAlign: "center",
          opacity: hover ? 0 : 1,
          transition: "opacity 300ms",
        }}
      >
        Hover for 简历
      </div>
    </div>
  );
}
"use client";
import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";

function useTime() {
  const [time, setTime] = useState("--:--");
  useEffect(() => {
    const fmt = () => {
      const d = new Date();
      return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    };
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function usePointer() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e: PointerEvent) =>
      setCoords({ x: Math.round(e.clientX), y: Math.round(e.clientY) });
    window.addEventListener("pointermove", handler);
    return () => window.removeEventListener("pointermove", handler);
  }, []);
  return coords;
}

export function SiteShell() {
  const { mode, setMode } = useTheme();
  const time = useTime();
  const { x, y } = usePointer();
  const [soundOn, setSoundOn] = useState(false);

  return (
    <header className="site-header" suppressHydrationWarning>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <a
          href="/"
          className="site-nav-btn"
          style={{ fontWeight: 700, textDecoration: "none", letterSpacing: "0.12em", color: "#fff", fontFamily: "var(--font-mono-2)" }}
        >
          HAIYUN.DESIGN
        </a>

        <nav style={{ display: "flex", flexWrap: "wrap", gap: "4px", alignItems: "flex-start" }} aria-label="Main navigation">
          <a href="#selected-work" className="site-nav-btn nav-pink-hover" style={{ fontWeight: 600 }}>
            Work
          </a>
          <a href="#contact" className="site-nav-btn nav-pink-hover" style={{ fontWeight: 600 }}>
            Contact
          </a>
          <button
            onClick={() => setMode(mode === "A" ? "B" : mode === "B" ? "C" : "A")}
            className="site-nav-btn nav-pink-hover"
            aria-label={`Theme mode: ${mode}`}
          >
            Theme[{mode}]
          </button>
          <button
            onClick={() => setSoundOn(!soundOn)}
            className="site-nav-btn nav-pink-hover"
            aria-label={`Sound: ${soundOn ? "On" : "Off"}`}
          >
            Sound[{soundOn ? " |" : "  "}]
          </button>
        </nav>
      </div>

      <div className="site-nav-row-bottom" style={{ display: "flex", justifyContent: "center", alignItems: "flex-end" }} suppressHydrationWarning>
        <span className="site-nav-btn site-nav-coords" style={{ fontSize: "0.75rem", opacity: 0.5 }} suppressHydrationWarning>
          {String(x).padStart(4, "0")} X{" "}
          {String(y).padStart(4, "0")} Y
        </span>
      </div>
    </header>
  );
}
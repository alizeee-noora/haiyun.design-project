"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import { BackgroundMusic } from "./BackgroundMusic";

/** Smooth-scroll to a hash target that lives inside `.site-scroll`.
 *  The page is its own overflow-y container, so the native hash-anchor
 *  jump cannot find a scrollable parent — we resolve the container at
 *  click time and scroll it explicitly. */
function scrollToHash(hash: string) {
  const id = hash.startsWith("#") ? hash.slice(1) : hash;
  const target = document.getElementById(id);
  if (!target) return false;
  /* The scrolling parent is `.site-scroll` (a fixed-height overflow:auto
   * div in app/page.tsx). `target.closest()` only walks up the tree, so
   * we query `.site-scroll` directly and read its scrollTop. */
  const scrollContainer =
    document.querySelector<HTMLElement>(".site-scroll") ??
    (document.scrollingElement as HTMLElement | null);
  if (!scrollContainer) {
    target.scrollIntoView({ behavior: "smooth" });
    return true;
  }
  /* distance from target's top to the visible top of the scroll container,
   * accounting for the container's own scroll offset */
  const containerTop = scrollContainer.getBoundingClientRect().top;
  const targetTop = target.getBoundingClientRect().top;
  const top = targetTop - containerTop + scrollContainer.scrollTop - 80;
  scrollContainer.scrollTo({ top, behavior: "smooth" });
  return true;
}

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
  const [bgmOn, setBgmOn] = useState(true);
  const pathname = usePathname();

  /** On the home page, the nav anchors are in-page smooth scrolls.
   *  From any other route, they need a real navigation to "/#hash". */
  const onHome = pathname === "/";
  const handleHashNav = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    if (!onHome) return;
    e.preventDefault();
    if (scrollToHash(hash)) {
      history.replaceState(null, "", hash);
    }
  };

  return (
    <>
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
            <a
              href={onHome ? "#selected-work" : "/#selected-work"}
              onClick={(e) => handleHashNav(e, "#selected-work")}
              className="site-nav-btn nav-pink-hover"
              style={{ fontWeight: 600 }}
            >
              Work
            </a>
            <a
              href={onHome ? "#contact" : "/#contact"}
              onClick={(e) => handleHashNav(e, "#contact")}
              className="site-nav-btn nav-pink-hover"
              style={{ fontWeight: 600 }}
            >
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
              onClick={() => setBgmOn(!bgmOn)}
              className="site-nav-btn nav-pink-hover"
              aria-label={`Background music: ${bgmOn ? "On" : "Off"}`}
            >
              BGM[{bgmOn ? " |" : "  "}]
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
      <BackgroundMusic playing={bgmOn} />
    </>
  );
}
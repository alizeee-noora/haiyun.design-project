"use client";
import { useEffect } from "react";

/** Scroll `.site-scroll` to the URL's hash once both exist. The home
 *  page's scroll container is `.site-scroll` (overflow:auto), not
 *  `<html>`/`<body>` (which are overflow:hidden), so the browser's
 *  native hash-jump is a no-op here. */
export function HashScrollOnMount() {
  useEffect(() => {
    const jump = () => {
      const hash = window.location.hash;
      if (!hash) return;
      const id = hash.startsWith("#") ? hash.slice(1) : hash;
      const target = document.getElementById(id);
      if (!target) return;
      const scrollContainer = document.querySelector<HTMLElement>(".site-scroll");
      if (!scrollContainer) return;
      const containerTop = scrollContainer.getBoundingClientRect().top;
      const targetTop = target.getBoundingClientRect().top;
      const top = targetTop - containerTop + scrollContainer.scrollTop - 80;
      scrollContainer.scrollTo({ top, behavior: "smooth" });
    };
    /* Run on every layout & content paint cycle for the first second
     * — selected-work may mount a beat after initial paint and the
     * first jump often lands too early. */
    jump();
    const t1 = window.setTimeout(jump, 80);
    const t2 = window.setTimeout(jump, 250);
    const t3 = window.setTimeout(jump, 600);
    window.addEventListener("hashchange", jump);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.removeEventListener("hashchange", jump);
    };
  }, []);
  return null;
}

"use client";
import { useState, useEffect, useRef } from "react";

interface TypewriterTextProps {
  /** Full text to type out */
  text: string;
  /** ms per character */
  speed?: number;
  /** ms delay before starting */
  startDelay?: number;
  /** CSS class for the wrapper */
  className?: string;
  /** Whether to show a blinking cursor */
  cursor?: boolean;
  /** Cursor blink rate in ms */
  cursorRate?: number;
}

/**
 * Types text character by character, then stays visible.
 * Uses requestAnimationFrame for smooth timing.
 */
export function TypewriterText({
  text,
  speed = 60,
  startDelay = 0,
  className,
  cursor = true,
  cursorRate = 530,
}: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const charIndexRef = useRef(0);

  useEffect(() => {
    // Reset on text change
    setDisplayed("");
    setDone(false);
    charIndexRef.current = 0;
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    startRef.current = null;

    const totalMs = text.length * speed + startDelay;

    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;

      const elapsed = now - startRef.current;

      if (elapsed < startDelay) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const localElapsed = elapsed - startDelay;
      const targetChar = Math.floor(localElapsed / speed);

      if (targetChar !== charIndexRef.current) {
        charIndexRef.current = targetChar;
        setDisplayed(text.slice(0, targetChar));
      }

      if (targetChar < text.length) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDone(true);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [text, speed, startDelay]);

  return (
    <span className={className} aria-live="polite" aria-label={text}>
      {displayed}
      {cursor && !done && (
        <span
          style={{
            display: "inline-block",
            width: "0.55em",
            height: "0.9em",
            background: "#ff7eb6",
            marginLeft: "1px",
            verticalAlign: "text-bottom",
            animation: `typewriterCursor ${cursorRate}ms steps(1) infinite`,
            boxShadow: "0 0 6px rgba(255,126,182,0.6)",
          }}
          aria-hidden
        />
      )}
    </span>
  );
}

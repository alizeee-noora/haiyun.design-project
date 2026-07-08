"use client";
import { useEffect, useRef } from "react";

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export function BlurText({ text, className, delay = 0 }: BlurTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const words = text.split(" ");
    container.innerHTML = words
      .map(
        (word, i) =>
          `<span style="display: inline-block; opacity: 0; filter: blur(10px); transform: translateY(20px); transition: all 0.5s ease-out; transition-delay: ${delay + i * 0.05}s">${word}</span>`
      )
      .join(" ");

    requestAnimationFrame(() => {
      const spans = container.querySelectorAll("span");
      spans.forEach((span) => {
        (span as HTMLElement).style.opacity = "1";
        (span as HTMLElement).style.filter = "blur(0px)";
        (span as HTMLElement).style.transform = "translateY(0)";
      });
    });
  }, [text, delay]);

  return (
    <span ref={containerRef} className={className}>
      {text}
    </span>
  );
}

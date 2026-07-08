"use client";
import { useEffect, useRef, useState, type ElementType } from "react";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  as?: ElementType;
  className?: string;
  style?: React.CSSProperties;
}

export function FadeIn({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
  style,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      className={className}
      style={{
        ...style,
        opacity: visible ? undefined : 0,
        transform: visible ? undefined : "translateY(8px)",
        transition: `opacity 660ms cubic-bezier(0.66, 0, 0.01, 1) ${delay}ms, transform 660ms cubic-bezier(0.66, 0, 0.01, 1) ${delay}ms`,
      }}
    >
      {children}
    </Tag>
  );
}

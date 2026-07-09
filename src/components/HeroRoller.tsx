"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

interface HeroRollerProps {
  children: React.ReactNode;
  /** How far (0–1) into the section the effect lasts */
  range?: [number, number];
}

/**
 * Applies a "tambour / drum roll" 3D perspective effect to its children
 * as the user scrolls past the hero section:
 *   - subtle forward tilt (rotateX)
 *   - gentle scale-down
 *   - upward drift
 *   - fade-out
 *
 * Uses framer-motion useScroll / useTransform — no layout shift.
 */
export function HeroRoller({ children, range = [0, 1] }: HeroRollerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rotateX = useTransform(scrollYProgress, range, [0, -18]);
  const scale = useTransform(scrollYProgress, range, [1, 0.88]);
  const y = useTransform(scrollYProgress, range, [0, -60]);

  return (
    <div ref={ref} style={{ perspective: "800px", perspectiveOrigin: "center bottom" }}>
      <motion.div
        style={{
          rotateX,
          scale,
          y,
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

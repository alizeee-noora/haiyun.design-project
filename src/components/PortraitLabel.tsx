"use client";
import { motion } from "framer-motion";

/**
 * Handwritten "haiyun" — overlaid inside the portrait, top-left corner.
 * Clean, minimal: one line of cursive letters with a subtle underline.
 */
export function PortraitLabel() {
  return (
    <div
      style={{
        position: "absolute",
        top: "14px",
        left: "16px",
        zIndex: 10,
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      {/* Cursive haiyun */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          fontFamily: "var(--font-caveat), cursive",
          fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)",
          color: "#ff7eb6",
          lineHeight: 1.0,
          filter: "drop-shadow(0 2px 8px rgba(255,126,182,0.6))",
          letterSpacing: "0.02em",
        }}
      >
        haiyun
      </motion.div>

      {/* Thin underline */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.9, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          transformOrigin: "left",
          height: "1.5px",
          width: "4.2rem",
          marginTop: "3px",
          background: "linear-gradient(90deg, #ff7eb6 60%, rgba(255,126,182,0))",
          borderRadius: "1px",
        }}
      />
    </div>
  );
}

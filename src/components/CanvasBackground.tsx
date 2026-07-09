"use client";
import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  rotSpeed: number;
  scale: number;
  opacity: number;
  char: string;
}

const CHARS = ["●", "○", "■", "□", "◆", "▲", "△", "◇", "▽", "☆", "★"];

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function CanvasBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let particles: Particle[] = [];
    let mouseX = 0;
    let mouseY = 0;
    let scrollY = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const spawnParticle = () => {
      const w = canvas.width;
      const h = canvas.height;
      particles.push({
        x: random(0, w),
        y: random(-200, -20),
        vx: random(-0.3, 0.3),
        vy: random(0.8, 1.8),
        rot: random(0, Math.PI * 2),
        rotSpeed: random(-0.02, 0.02),
        scale: random(0.6, 1.2),
        opacity: random(0.08, 0.2),
        char: CHARS[Math.floor(Math.random() * CHARS.length)],
      });
    };

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Spawn new particles on scroll
      if (Math.random() < 0.15) spawnParticle();

      // Update and draw
      particles = particles.filter((p) => {
        const windPhase = (scrollY * 0.001) + p.x * 0.002;
        const wind = Math.sin(windPhase) * 1.8 * 0.3;
        p.x += p.vx + wind;
        p.y += p.vy;
        p.rot += p.rotSpeed;

        if (p.y > h + 60) return false;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = getComputedStyle(document.documentElement)
          .getPropertyValue("--label-1")
          .trim() || "#fff";
        ctx.font = `${Math.round(p.scale * 22)}px monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.char, 0, 0);
        ctx.restore();

        return true;
      });

      animId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", () => {
      scrollY = window.scrollY;
    });
    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Spawn initial batch
    for (let i = 0; i < 12; i++) {
      const p: Particle = {
        x: random(0, canvas.width),
        y: random(0, canvas.height),
        vx: random(-0.3, 0.3),
        vy: random(0.5, 1.5),
        rot: random(0, Math.PI * 2),
        rotSpeed: random(-0.02, 0.02),
        scale: random(0.6, 1.2),
        opacity: random(0.08, 0.2),
        char: CHARS[Math.floor(Math.random() * CHARS.length)],
      };
      particles.push(p);
    }

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 2,
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
}

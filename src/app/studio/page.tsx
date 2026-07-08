"use client";
import React, { useState } from "react";
import { motion, AnimatePresence, type Transition } from "framer-motion";
import { FadingVideo } from "@/components/FadingVideo";
import { BlurText } from "@/components/BlurText";
import * as Icons from "@/components/Icons";

const baseTransition: Transition = { duration: 0.5, ease: "easeOut" };

const sharedMotionProps = {
  initial: { filter: "blur(10px)", opacity: 0, y: 20 },
  animate: { filter: "blur(0px)", opacity: 1, y: 0 },
  exit: { filter: "blur(10px)", opacity: 0, y: -20 },
  transition: baseTransition,
};

export default function StudioPage() {
  const [currentSection, setCurrentSection] = useState<"hero" | "capabilities">("hero");

  return (
    <main className="bg-black text-white selection:bg-white/20 select-none h-screen w-screen overflow-hidden relative">

      <nav className="fixed top-4 left-0 right-0 z-50 flex items-center justify-between px-8 lg:px-16">
        <div
          className="liquid-glass h-12 w-12 rounded-full flex items-center justify-center cursor-pointer"
          onClick={() => setCurrentSection("hero")}
        >
          <span className="font-heading italic text-2xl lowercase">a</span>
        </div>

        <div className="hidden md:flex liquid-glass rounded-full px-1.5 py-1.5 items-center gap-1">
          <button
            onClick={() => setCurrentSection("hero")}
            className={`px-3 py-2 text-sm font-medium font-body rounded-full transition-colors ${
              currentSection === "hero" ? "bg-white/10 text-white" : "text-white/60 hover:text-white"
            }`}
          >
            Studio
          </button>
          <button
            onClick={() => setCurrentSection("capabilities")}
            className={`px-3 py-2 text-sm font-medium font-body rounded-full transition-colors ${
              currentSection === "capabilities" ? "bg-white/10 text-white" : "text-white/60 hover:text-white"
            }`}
          >
            Capabilities
          </button>

          <button
            onClick={() => setCurrentSection("capabilities")}
            className="bg-white text-black rounded-full px-4 py-2 text-sm font-medium font-body flex items-center gap-1.5 transition-transform active:scale-95 ml-2"
          >
            Start a Project
            <Icons.ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
          </button>
        </div>
        <div className="h-12 w-12" />
      </nav>

      <AnimatePresence mode="wait">
        {currentSection === "hero" ? (
          <motion.div
            key="hero-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 h-full w-full overflow-hidden bg-black"
          >
            <FadingVideo
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260619_191346_9d19d66e-86a4-47f7-8dc6-712c1788c3b2.mp4"
              className="absolute left-1/2 top-0 -translate-x-1/2 object-cover object-top z-0"
              style={{ width: "120%", height: "120%" }}
            />

            <div className="relative z-10 flex flex-col h-full items-center justify-center pt-24 px-4 text-center">
              <motion.div
                {...sharedMotionProps}
                transition={{ ...sharedMotionProps.transition, delay: 0.1 }}
                className="liquid-glass rounded-full pl-1.5 pr-4 py-1.5 flex items-center gap-2 text-xs font-body tracking-wide"
              >
                <span className="bg-white text-black px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider text-[10px]">New</span>
                <span className="text-white/90">Booking Q3 2026 engagements -- limited capacity</span>
              </motion.div>

              <div className="mt-6 max-w-3xl">
                <BlurText
                  text="Crafted Digital Experiences Built to Outlast Trends"
                  className="text-6xl md:text-7xl lg:text-[5.5rem] font-heading italic text-white leading-[0.8] tracking-[-4px]"
                />
              </div>

              <motion.p
                {...sharedMotionProps}
                transition={{ ...sharedMotionProps.transition, delay: 0.3 }}
                className="text-sm md:text-base text-white max-w-2xl font-body font-light leading-tight mt-4"
              >
                We are a small studio of designers and engineers shaping brand-defining websites for ambitious companies. Precise typography, cinematic motion, and code you can be proud of.
              </motion.p>

              <motion.div
                {...sharedMotionProps}
                transition={{ ...sharedMotionProps.transition, delay: 0.4 }}
                className="mt-6 flex gap-6 items-center"
              >
                <button
                  onClick={() => setCurrentSection("capabilities")}
                  className="liquid-glass-strong rounded-full px-5 py-2.5 flex items-center gap-2 text-sm font-medium font-body tracking-wide transition-transform active:scale-95"
                >
                  Start a Project
                  <Icons.ArrowUpRight className="h-4 w-4" />
                </button>
                <button className="flex items-center gap-2 text-sm font-medium font-body text-white/90 hover:text-white transition-colors">
                  <Icons.Play className="h-4 w-4" />
                  Watch Showreel
                </button>
              </motion.div>

              <motion.div
                {...sharedMotionProps}
                transition={{ ...sharedMotionProps.transition, delay: 0.5 }}
                className="mt-8 flex flex-wrap justify-center gap-4"
              >
                <div className="liquid-glass p-5 w-[220px] rounded-[1.25rem] text-left flex flex-col justify-between">
                  <Icons.ClockIcon className="h-5 w-5 text-white/80" />
                  <div>
                    <h4 className="text-4xl font-heading italic tracking-[-1px] leading-none mt-4">6 Weeks</h4>
                    <p className="text-xs font-body font-light text-white/60 mt-1 uppercase tracking-wider">Average End-to-End Launch Time</p>
                  </div>
                </div>

                <div className="liquid-glass p-5 w-[220px] rounded-[1.25rem] text-left flex flex-col justify-between">
                  <Icons.GlobeIcon className="h-5 w-5 text-white/80" />
                  <div>
                    <h4 className="text-4xl font-heading italic tracking-[-1px] leading-none mt-4">140+</h4>
                    <p className="text-xs font-body font-light text-white/60 mt-1 uppercase tracking-wider">Brands Shipped Across Four Continents</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                {...sharedMotionProps}
                transition={{ ...sharedMotionProps.transition, delay: 0.6 }}
                className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-4 px-4"
              >
                <div className="liquid-glass rounded-full px-4 py-1 text-xs font-body font-light text-white/60 tracking-wide uppercase">
                  Trusted by founders, operators, and creative directors worldwide
                </div>
                <div className="flex items-center gap-12 md:gap-16 opacity-40">
                  {["Aeon", "Vela", "Apex", "Orbit", "Zeno"].map((logo) => (
                    <span key={logo} className="font-heading italic text-2xl md:text-3xl tracking-tight select-none">{logo}</span>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="capabilities-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 h-full w-full overflow-hidden bg-black"
          >
            <FadingVideo
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_093722_ccfc7ebf-182f-419f-8a62-2dc02db7dd9d.mp4"
              className="absolute inset-0 w-full h-full object-cover z-0"
            />

            <div className="relative z-10 px-8 md:px-16 lg:px-20 pt-24 pb-10 flex flex-col h-full justify-between overflow-y-auto">
              <motion.div
                {...sharedMotionProps}
                className="mb-auto text-left mt-8"
              >
                <span className="text-sm font-body text-white/80 tracking-widest block mb-4">// Capabilities</span>
                <h2 className="font-heading italic text-6xl md:text-7xl lg:text-[6rem] leading-[0.9] tracking-[-3px] whitespace-pre-line">
                  {"Studio craft,\nend to end"}
                </h2>
              </motion.div>

              <motion.div
                initial={{ filter: "blur(10px)", opacity: 0, y: 30 }}
                animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 mb-4"
              >
                <div className="liquid-glass rounded-[1.25rem] p-6 min-h-[340px] flex flex-col justify-between">
                  <div className="flex items-start justify-between w-full">
                    <div className="liquid-glass h-11 w-11 rounded-[0.75rem] flex items-center justify-center">
                      <Icons.ImageIcon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex flex-wrap gap-1.5 justify-end max-w-[70%]">
                      {["Brand Systems", "Art Direction", "Visual Identity", "Motion"].map((tag) => (
                        <span key={tag} className="liquid-glass rounded-full px-3 py-1 text-[11px] text-white/90 font-body whitespace-nowrap">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1" />
                  <div>
                    <h3 className="font-heading italic text-3xl md:text-4xl tracking-[-1px] leading-none mb-3">Design</h3>
                    <p className="text-sm text-white/90 font-body font-light leading-snug max-w-[32ch]">
                      We shape identities and interfaces that feel unmistakably yours -- typographic systems, component libraries, and art-directed pages that scale without losing soul.
                    </p>
                  </div>
                </div>

                <div className="liquid-glass rounded-[1.25rem] p-6 min-h-[340px] flex flex-col justify-between">
                  <div className="flex items-start justify-between w-full">
                    <div className="liquid-glass h-11 w-11 rounded-[0.75rem] flex items-center justify-center">
                      <Icons.MovieIcon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex flex-wrap gap-1.5 justify-end max-w-[70%]">
                      {["React", "Next.js", "Headless CMS", "Edge-Ready"].map((tag) => (
                        <span key={tag} className="liquid-glass rounded-full px-3 py-1 text-[11px] text-white/90 font-body whitespace-nowrap">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1" />
                  <div>
                    <h3 className="font-heading italic text-3xl md:text-4xl tracking-[-1px] leading-none mb-3">Engineering</h3>
                    <p className="text-sm text-white/90 font-body font-light leading-snug max-w-[32ch]">
                      Production-grade front-ends built on modern stacks. Performant, accessible, and instrumented -- with code your team will enjoy extending long after launch.
                    </p>
                  </div>
                </div>

                <div className="liquid-glass rounded-[1.25rem] p-6 min-h-[340px] flex flex-col justify-between">
                  <div className="flex items-start justify-between w-full">
                    <div className="liquid-glass h-11 w-11 rounded-[0.75rem] flex items-center justify-center">
                      <Icons.LightbulbIcon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex flex-wrap gap-1.5 justify-end max-w-[70%]">
                      {["SEO", "Analytics", "A/B Testing", "Retention"].map((tag) => (
                        <span key={tag} className="liquid-glass rounded-full px-3 py-1 text-[11px] text-white/90 font-body whitespace-nowrap">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1" />
                  <div>
                    <h3 className="font-heading italic text-3xl md:text-4xl tracking-[-1px] leading-none mb-3">Growth</h3>
                    <p className="text-sm text-white/90 font-body font-light leading-snug max-w-[32ch]">
                      Launch is the starting line. We partner with your team on conversion, content, and iteration loops that turn a beautiful site into a compounding asset.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}

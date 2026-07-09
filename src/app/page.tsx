import { CanvasBackground } from "@/components/CanvasBackground";
import { SiteShell } from "@/components/SiteShell";
import { FadeIn } from "@/components/FadeIn";
import { SignSvg } from "@/components/SignSvg";
import { WorkCard } from "@/components/WorkCard";
import { StickyBanner } from "@/components/StickyBanner";
import { HeroOrb, HeroCallToAction } from "@/components/HeroOrb";
import { HeroRoller } from "@/components/HeroRoller";
import { TypewriterText } from "@/components/TypewriterText";
import { SiteBackground } from "@/components/SiteBackground";
import { PortraitLabel } from "@/components/PortraitLabel";
import { ContactFooter } from "@/components/ContactFooter";

const WORKS = [
  { title: "甜品小镇", subtitle: "Sweet Town · Game UI", href: "/game-sweet-town", year: "2024", tag: "Game UI", tagEn: "Sweet Town", poster: "/works/sweet-town/poster.png" },
  { title: "我的农场", subtitle: "My Farm · Game UI", href: "/game-my-farm", year: "2024", tag: "Game UI", tagEn: "My Farm", poster: "/works/my-farm/poster.png" },
  { title: "RED ROCK STUDIOS", subtitle: "Brand UI Design", href: "/red-rock-studios", year: "2024-2025", tag: "Brand UI", tagEn: "Red Rock", poster: "/works/brand-ui/poster.png" },
  { title: "游戏页面 UI", subtitle: "Game Page UI · System", href: "/game-page-ui", year: "2025", tag: "Game UI", tagEn: "Game Page UI", poster: "/works/merged/poster.png" },
  { title: "Anylist", subtitle: "Coffee App · Mobile UI", href: "/anylist", year: "2025", tag: "Mobile UI", tagEn: "Anylist", poster: "/works/self-game/poster.png" },
  { title: "网页设计", subtitle: "Web Design", href: "/web-design", year: "2024", tag: "Web", tagEn: "Web Design", poster: "/works/web/poster.png" },
  { title: "建筑设计", subtitle: "Architecture", href: "/3d-modeling", year: "2023-2024", tag: "Architecture", tagEn: "Architecture", poster: "/works/architecture/poster.png" },
  { title: "IP 角色设计", subtitle: "IP Character Design", href: "/ip-design", year: "2024-2025", tag: "IP", tagEn: "IP Design", poster: "/works/ip/poster.png" },
  { title: "贺卡", subtitle: "Greeting Cards", href: "/greeting-cards", year: "2024", tag: "Print", tagEn: "Greeting Cards", poster: "/works/greeting-cards/poster.png" },
  { title: "活动视觉 KV", subtitle: "Event Key Visual", href: "/event-kv", year: "2025", tag: "Visual", tagEn: "Event KV", poster: "/works/visual-kv/poster.png" },
  { title: "礼物动效", subtitle: "Gift Motion", href: "/gift-motion", year: "2025", tag: "Motion", tagEn: "Gift Motion", poster: "/posters/cupid.png" },
  { title: "海报", subtitle: "Poster Design", href: "/poster", year: "2024-2025", tag: "Print", tagEn: "Poster", poster: "/works/poster/poster.png" },
];

const PAD_X = "clamp(1.5rem, 4rem, 4rem)";
const PAD_Y = "clamp(2rem, 5rem, 7rem)";

/** ms to type each line */
const SPEED = 55;

function heroLine(text: string, startDelay: number) {
  return (
    <div style={{ overflow: "hidden", lineHeight: 1 }}>
      <TypewriterText
        text={text}
        speed={SPEED}
        startDelay={startDelay}
        className="hero-typewriter"
      />
    </div>
  );
}

export default function Home() {
  // Timing for typewriter: each line starts when the previous one finishes
  // "I craft" = 7 chars, "vision & taste" = 14, "into pixels" = 11
  const line1End = 0 + 7 * SPEED;
  const line2Start = line1End + 150;
  const line2End = line2Start + 14 * SPEED;
  const line3Start = line2End + 200;

  return (
    <div style={{ background: "var(--background-1)", color: "#fff", minHeight: "100dvh" }}>
      {/* Hero particles (only visible in Hero section via CSS isolation) */}
      <CanvasBackground />
      {/* Full-bleed background for pages below hero */}
      <SiteBackground />
      <SiteShell />

      <main className="site-main">
        <div className="site-scroll">

          {/* ===== Hero ===== */}
          <section style={{
            position: "relative",
            padding: `${PAD_Y} ${PAD_X}`,
            width: "100%",
            minHeight: "100dvh",
            overflow: "hidden",
            /* Soft fade out the bottom 30% so the hero blends into
               the SiteBackground dot layer below. */
            maskImage: "linear-gradient(to bottom, #000 0%, #000 70%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, #000 0%, #000 70%, transparent 100%)",
          }}>
            {/* Hero orb + particles — contained within hero section */}
            <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
              <HeroOrb baseSrc="/hero/base.png" revealSrc="/hero/revel.png" />
              <CanvasBackground />
            </div>

            <div style={{
              position: "relative",
              zIndex: 3,
              pointerEvents: "none",
              minHeight: "calc(100dvh - 12rem)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}>
              <FadeIn delay={100}>
                <div style={{ fontFamily: "var(--font-mono-2)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.18em", color: "#fff" }}>
                  Haiyun Liu · Visual Designer
                </div>
              </FadeIn>

              {/* Drum-roll exit on scroll */}
              <HeroRoller>
                <div style={{
                  fontWeight: 700,
                  textTransform: "uppercase",
                  lineHeight: 1.0,
                  fontSize: "clamp(3rem, 10vw, 9rem)",
                  fontVariationSettings: '"wdth" 120',
                  color: "#fff",
                }}>
                  {heroLine("I craft", 400)}
                  {heroLine("vision & taste", line2Start)}
                  {heroLine("into pixels", line3Start)}
                </div>
              </HeroRoller>
            </div>

            <HeroCallToAction />
          </section>

          {/* ===== About — left 1/3 portrait + right 2/3 quotes ===== */}
          <section style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            padding: `${PAD_Y} ${PAD_X}`,
            paddingBottom: "clamp(3rem, 6rem, 8rem)",
            gap: "clamp(3rem, 5rem, 6rem)",
            width: "100%",
            alignItems: "start",
          }} className="about-new-section">

            {/* Left column */}
            <div className="about-portrait-col">
              {/* Portrait — haiyun label overlaid inside, resume on hover */}
              <a
                href="/about/resume.pdf"
                download
                title="下载简历"
                style={{ display: "block", textDecoration: "none" }}
              >
                <div
                  className="portrait-frame"
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "3 / 4",
                    overflow: "hidden",
                    borderRadius: "6px",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/about/portrait.png"
                    alt="刘海云"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      filter: "saturate(1.4) brightness(1.05) hue-rotate(10deg)",
                    }}
                  />

                  {/* Gradient overlays */}
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.3) 100%)",
                    pointerEvents: "none",
                  }} />

                  {/* Handwritten "haiyun" — inside photo top-left */}
                  <PortraitLabel />

                  {/* Resume label — centered, pink pill on hover */}
                  <div className="resume-text-wrap">
                    <span className="resume-text">简历</span>
                  </div>
                </div>
              </a>

              {/* Signature */}
              <div style={{ position: "relative", pointerEvents: "none", width: "60%", marginTop: "1.5rem" }}>
                <SignSvg />
              </div>
            </div>

            {/* Right: two large quote paragraphs */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "clamp(2rem, 4rem, 5rem)",
              paddingTop: "0.5rem",
            }}>
              <FadeIn delay={100}>
                <blockquote style={{
                  fontSize: "clamp(1.4rem, 3.5vw, 2.2rem)",
                  fontWeight: 600,
                  lineHeight: 1.2,
                  color: "#fff",
                  fontFamily: "var(--font-heading)",
                  fontStyle: "normal",
                  margin: 0,
                  padding: 0,
                }}>
                  关注视觉语言的延展：从屏幕到空间、从静态到动效，让设计在多媒介之间保持一致的性格与表达。
                </blockquote>
              </FadeIn>

              <FadeIn delay={300}>
                <blockquote style={{
                  fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)",
                  fontWeight: 400,
                  lineHeight: 1.5,
                  color: "#fff",
                  fontStyle: "normal",
                  margin: 0,
                  padding: 0,
                }}>
                  我是{" "}
                  <a
                    href="https://www.cafa.edu.cn"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#fff", textDecoration: "underline", textUnderlineOffset: "4px", textDecorationColor: "rgba(255,255,255,0.25)" }}
                  >刘海云</a>
                  ，硕士就读于{" "}
                  <a
                    href="https://www.cafa.edu.cn"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#fff", textDecoration: "underline", textUnderlineOffset: "4px", textDecorationColor: "rgba(255,255,255,0.25)" }}
                  >中央美术学院</a>
                  ，本科毕业于山东工艺美术学院{" "}
                  <span style={{ color: "#fff", textDecoration: "underline", textUnderlineOffset: "4px", textDecorationColor: "rgba(255,255,255,0.25)" }}>建筑设计</span>
                  {" "}专业，2026 年应届毕业。曾参加{" "}
                  <span style={{ color: "#fff" }}>霍普杯、天作杯</span>
                  {" "}设计竞赛，热衷于把建筑学的空间思维带入 UI、动效与品牌视觉。
                </blockquote>
              </FadeIn>
            </div>
          </section>

          {/* ===== Selected Work ===== */}
          <section id="selected-work" style={{ padding: `${PAD_Y} ${PAD_X}`, width: "100%" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "0" }}>
              {WORKS.map((work, i) => (
                <div key={work.href} className="work-grid-item">
                  <WorkCard {...work} delay={i * 60} />
                </div>
              ))}
            </div>
          </section>

          {/* ===== Sticky Banner ===== */}
          <StickyBanner />

          {/* ===== Contact Footer ===== */}
          <ContactFooter
            padX={PAD_X}
            padY={PAD_Y}
            monoFont="var(--font-mono-2)"
          />
        </div>
      </main>
    </div>
  );
}

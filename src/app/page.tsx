import { CanvasBackground } from "@/components/CanvasBackground";
import { SiteShell } from "@/components/SiteShell";
import { FadeIn } from "@/components/FadeIn";
import { SignSvg } from "@/components/SignSvg";
import { WorkCard } from "@/components/WorkCard";
import { StickyBanner } from "@/components/StickyBanner";
import { HeroOrb, HeroCallToAction } from "@/components/HeroOrb";
import { PortraitCard } from "@/components/PortraitCard";

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

const PAD_X = "clamp(1rem, 3.5rem, 3.5rem)";
const PAD_Y = "clamp(2rem, 4.5rem, 6rem)";

export default function Home() {
  return (
    <div className="grid-bg" style={{ background: "var(--background-1)", color: "var(--label-1)", minHeight: "100dvh" }}>
      <CanvasBackground />
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
          }}>
            <HeroOrb baseSrc="/hero/base.png" revealSrc="/hero/revel.png" />

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
                <div style={{ fontFamily: "var(--font-mono-2)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.18em", opacity: 0.7 }}>
                  Haiyun Liu · Visual Designer
                </div>
              </FadeIn>

              <div style={{ fontWeight: 700, textTransform: "uppercase", lineHeight: 0.9, fontSize: "clamp(3rem, 9vw, 8vw)", fontVariationSettings: '"wdth" 120', color: "#fff" }}>
                {["I craft", "vision & taste", "into pixels"].map((text, i) => (
                  <FadeIn key={text} delay={150 + i * 150}>
                    {text}
                  </FadeIn>
                ))}
              </div>
            </div>

            <HeroCallToAction />
          </section>

          {/* ===== About ===== */}
          <section style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            padding: `${PAD_Y} ${PAD_X}`,
            paddingBottom: "clamp(2rem, 4.5rem, 7rem)",
            gap: "0",
            width: "100%",
          }}>
            {/* Portrait + signature */}
            <div style={{ gridColumn: "1 / 5", padding: "8px 16px 8px 0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", gap: "1rem" }}>
              <PortraitCard />
              <div style={{ position: "relative", pointerEvents: "none", width: "70%", maxWidth: "220px", marginTop: "0.5rem" }}>
                <SignSvg />
              </div>
            </div>

            {/* About text */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
              gridColumn: "5 / -1",
              justifyContent: "center",
            }}>
              <FadeIn delay={150}>
                <p style={{ fontSize: "clamp(1.1rem, 3vw, 1.5rem)", lineHeight: 1.3, color: "var(--label-1)" }}>
                  关注视觉语言的延展：从屏幕到空间、从静态到动效，让设计在多媒介之间保持一致的性格与表达。
                </p>
              </FadeIn>
              <FadeIn delay={300}>
                <p style={{ fontSize: "clamp(1.1rem, 3vw, 1.5rem)", lineHeight: 1.3, color: "var(--label-2)" }}>
                  我是{" "}
                  <span style={{ color: "#fff", textDecoration: "underline", textUnderlineOffset: "3px", textDecorationColor: "rgba(255,255,255,0.3)" }}>刘海云</span>
                  ，硕士就读于{" "}
                  <span style={{ color: "#fff", textDecoration: "underline", textUnderlineOffset: "3px", textDecorationColor: "rgba(255,255,255,0.3)" }}>中央美术学院</span>
                  ，本科毕业于山东工艺美术学院{" "}
                  <span style={{ color: "#fff", textDecoration: "underline", textUnderlineOffset: "3px", textDecorationColor: "rgba(255,255,255,0.3)" }}>建筑设计</span>
                  专业，2026 年应届毕业。曾参加{" "}
                  <span style={{ color: "#fff" }}>霍普杯、天作杯</span>
                  {" "}设计竞赛，热衷于把建筑学的空间思维带入 UI、动效与品牌视觉。
                </p>
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
          <footer id="contact" style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: `${PAD_Y} ${PAD_X}`,
            width: "100%",
            minHeight: "100dvh",
            background: "var(--background-1)",
            color: "var(--label-1)",
            zIndex: 10,
          }}>
            {[
              { text: "Let's", align: "left", delay: 100 },
              { text: "Design", align: "right", delay: 250 },
              { text: "Something", align: "left", delay: 400 },
              { text: "With Craft", align: "right", delay: 550 },
            ].map(({ text, align, delay }) => (
              <FadeIn key={text} delay={delay}>
                <div style={{
                  fontWeight: 700,
                  textTransform: "uppercase",
                  lineHeight: 1,
                  fontSize: "clamp(2.5rem, 7.2vw, 7.2vw)",
                  fontVariationSettings: '"wdth" 120',
                  textAlign: align as "left" | "right",
                  letterSpacing: "-0.02em",
                  color: "#fff",
                }}>
                  {text}
                </div>
              </FadeIn>
            ))}

            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: `${PAD_Y} ${PAD_X}`,
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
              fontFamily: "var(--font-mono-2)",
              fontSize: "0.875rem",
            }}>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "1rem" }}>
                <a href="mailto:1950523773@qq.com" className="site-nav-btn nav-pink-hover" style={{ textDecoration: "none" }}>
                  1950523773@qq.com
                </a>
                <a href="tel:13221161752" className="site-nav-btn nav-pink-hover" style={{ textDecoration: "none" }}>
                  132 2116 1752
                </a>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "2rem 1rem" }}>
                {[
                  ["姓名", "刘海云 · Haiyun Liu"],
                  ["学校", "中央美术学院 (硕士)"],
                  ["专业", "建筑设计 · B.Arch"],
                  ["求职岗位", "平面设计 · UI 设计"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ fontSize: "0.7em", textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.6, color: "var(--label-2)" }}>{k}</div>
                    <div style={{ marginTop: "4px", color: "#fff" }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "0.75em", color: "var(--label-2)", gap: "0.5rem" }}>
                <span>意向城市 · <span style={{ color: "#fff" }}>北京 / 杭州 / 上海</span></span>
                <span>&copy; 2026 · 刘海云 · All work shown by permission</span>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
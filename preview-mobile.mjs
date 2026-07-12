// Mobile preview — emulates iPhone 14 Pro (390×844 @3x) viewport.
// Captures 4 snapshots at different scroll positions, then assembles them
// onto a single sheet so we can confirm the rotateX curl + compact layout
// reads correctly on a phone-sized screen.
import { chromium, devices } from "playwright";
import { mkdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

const OUT_DIR = "C:\\Users\\alizeeleah\\Desktop\\mobile-preview";
if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

const URL = "http://localhost:3000";

const iphone = devices["iPhone 14 Pro"];
if (!iphone) throw new Error("iPhone 14 Pro device descriptor missing");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    ...iphone,
    deviceScaleFactor: 2, // smaller PNGs, still sharp enough
    isMobile: true,
    hasTouch: true,
  });
  const page = await ctx.newPage();
  console.log("→ goto", URL);
  await page.goto(URL, { waitUntil: "networkidle", timeout: 30000 });
  // Wait for hydration & first paint of the marquee
  await page.waitForTimeout(800);

  const dump = async (label, scrollY) => {
    if (scrollY !== null) {
      await page.evaluate((y) => window.scrollTo(0, y), scrollY);
      await page.waitForTimeout(900); // let rAF catch up + curl apply
    } else {
      await page.waitForTimeout(600);
    }
    const file = resolve(OUT_DIR, `${label}.png`);
    await page.screenshot({ path: file, fullPage: false });
    console.log("✓ saved", file, `scroll=${scrollY ?? 0}`);
  };

  await dump("01-top", 0);
  await dump("02-q1", Math.floor(await page.evaluate(() => document.documentElement.scrollHeight * 0.25)));
  await dump("03-mid", Math.floor(await page.evaluate(() => document.documentElement.scrollHeight * 0.55)));
  await dump("04-end", await page.evaluate(() => document.documentElement.scrollHeight));

  // Mobile full-page reference (everything stacked, not just viewport)
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  const fullPath = resolve(OUT_DIR, "00-full-page.png");
  await page.screenshot({ path: fullPath, fullPage: true });
  console.log("✓ saved", fullPath, "(full page)");

  await browser.close();
})().catch((e) => {
  console.error("FAIL", e);
  process.exit(1);
});

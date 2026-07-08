import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GridBackdrop } from "@/components/GridBackdrop";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "刘海云 Portfolio © 2026",
  description: "刘海云（Haiyun Liu）设计师作品集 · 平面设计、视觉设计、品牌 UI 与游戏 UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased" style={{ background: "var(--background-1)" }}>
        <GridBackdrop />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

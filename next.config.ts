import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // 👈 核心：强制 Next.js 在打包时生成 "out" 文件夹
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export so Cloudflare Pages can ship the `out/` directory
  // directly (no Node runtime required).
  output: "export",
  images: {
    // Static export has no image optimization server; unoptimized keeps
    // <Image> working by serving the source asset as-is.
    unoptimized: true,
  },
  // Trailing slash helps Cloudflare's static handler match routes cleanly
  // when the build emits /index.html.
  trailingSlash: true,
};

export default nextConfig;

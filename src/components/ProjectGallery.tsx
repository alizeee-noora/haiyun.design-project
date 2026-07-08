import fs from "fs";
import path from "path";
import { ProjectGalleryView } from "./ProjectGalleryView";

interface Props {
  folder: string;
  title: string;
  subtitle?: string;
  year?: string;
  description?: string;
  poster?: string;
  /** "lightbox" = single full-screen with prev/next (default)
   *  "grid"     = 50x50 thumbnail grid, hover-to-play (videos) or hover-zoom (images) */
  layout?: "lightbox" | "grid";
}

const VIDEO_EXT = new Set([".mp4", ".webm", ".mov"]);
const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);

function listMedia(folder: string) {
  const dir = path.join(process.cwd(), "public", "works", folder);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => {
      const ext = path.extname(f).toLowerCase();
      return IMAGE_EXT.has(ext) || VIDEO_EXT.has(ext);
    })
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

export function ProjectGallery({ folder, title, subtitle, year, description, poster, layout = "lightbox" }: Props) {
  const files = listMedia(folder);

  // Grid layouts (motion page, etc.) only support videos — hide static images
  // like poster.png from the thumbnail strip.
  const allowedExts = layout === "grid" ? VIDEO_EXT : new Set([...VIDEO_EXT, ...IMAGE_EXT]);

  const items = files
    .filter((f) => allowedExts.has(path.extname(f).toLowerCase()))
    .map((file) => {
      const ext = path.extname(file).toLowerCase();
      const src = `/works/${folder}/${encodeURIComponent(file)}`;
      return { src, type: VIDEO_EXT.has(ext) ? ("video" as const) : ("image" as const), name: file };
    });

  return (
    <ProjectGalleryView
      title={title}
      subtitle={subtitle}
      year={year}
      description={description}
      poster={poster}
      items={items}
      layout={layout}
    />
  );
}

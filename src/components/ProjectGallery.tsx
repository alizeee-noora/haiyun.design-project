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

export function ProjectGallery({ folder, title, subtitle, year, description, poster }: Props) {
  const files = listMedia(folder);

  const items = files.map((file) => {
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
    />
  );
}

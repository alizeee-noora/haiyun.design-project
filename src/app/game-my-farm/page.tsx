import { ProjectGallery } from "@/components/ProjectGallery";

export default function MyFarm() {
  return (
    <ProjectGallery
      folder="my-farm"
      title="我的农场"
      subtitle="My Farm"
      year="2024"
      description="休闲农场经营游戏 UI · 播种、收获、商店等核心界面设计。"
      poster="/works/my-farm/poster.png"
    />
  );
}
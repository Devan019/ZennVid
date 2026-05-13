"use client";

import { DashboardTab } from "../types";
import MagicVideoFeature from "../features/magic-video";
import SyncStudioFeature from "../features/sync-studio";
import AnimeTwinFeature from "../features/anime-twin";
import YourVideosFeature from "../features/your-videos";

interface FeatureRendererProps {
  activeTab: DashboardTab;
  onGenerate: (jobId?: string) => void;
}

export const FeatureRenderer: React.FC<
  FeatureRendererProps
> = ({ activeTab, onGenerate }) => {
  switch (activeTab) {
    case "magic-video":
      return (
        <MagicVideoFeature
          onGenerate={onGenerate}
        />
      );

    case "syncstudio":
      return (
        <SyncStudioFeature
          onGenerate={onGenerate}
        />
      );

    case "your-videos":
      return (
        <YourVideosFeature
          onGenerate={onGenerate}
        />
      );

    case "anime-matcher":
      return (
        <AnimeTwinFeature
          onGenerate={onGenerate}
        />
      );

    default:
      return (
        <MagicVideoFeature
          onGenerate={onGenerate}
        />
      );
  }
};

import { DashboardTab, PageMeta } from "../types";

export const TAB_ORDER: DashboardTab[] = [
  "magic-video",
  "syncstudio",
  "your-videos",
  "anime-matcher",
];

export const normalizeHash = (hash: string) =>
  hash.replace(/^#/, "");

export const isDashboardTab = (
  value: string
): value is DashboardTab =>
  TAB_ORDER.includes(value as DashboardTab);

export const getPageMeta = (
  activeTab: DashboardTab
): PageMeta => {
  switch (activeTab) {
    case "magic-video":
      return {
        eyebrow: "AI CINEMA ENGINE",
        title: "Magic Studio",
        description:
          "Transform prompts into cinematic AI-generated stories with motion, atmosphere, and emotion.",
      };

    case "syncstudio":
      return {
        eyebrow: "LIP SYNC SYSTEM",
        title: "Sync Studio",
        description:
          "Create realistic synced performances with cinematic facial motion and dialogue alignment.",
      };

    case "anime-matcher":
      return {
        eyebrow: "ANIME IDENTITY",
        title: "Anime Twin",
        description:
          "Discover your anime-inspired cinematic identity using generative AI.",
      };

    case "your-videos":
      return {
        eyebrow: "VIDEO LIBRARY",
        title: "Your Videos",
        description:
          "Manage, preview, and revisit your generated cinematic creations.",
      };

    default:
      return {
        eyebrow: "AI CINEMA ENGINE",
        title: "Magic Studio",
        description:
          "Transform prompts into cinematic AI-generated stories.",
      };
  }
};

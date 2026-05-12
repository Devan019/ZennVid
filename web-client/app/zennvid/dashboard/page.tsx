"use client";

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import { toast } from "sonner";

import MagicVideo from "../../../components/dashboard/magic-video/magic-video";

import SyncStudio from "../../../components/dashboard/syncstudio/syncstudio";

import AnimeMatcher from "../../../components/dashboard/anime-matcher/anime-matcher";

import VideoGallery from "../../../components/dashboard/your-videos/gallery";

type DashboardTab =
  | "magic-video"
  | "syncstudio"
  | "your-videos"
  | "anime-matcher";

const tabOrder: DashboardTab[] = [
  "magic-video",
  "syncstudio",
  "your-videos",
  "anime-matcher",
];

const normalizeHash = (hash: string) =>
  hash.replace(/^#/, "");

const isDashboardTab = (
  value: string
): value is DashboardTab =>
  tabOrder.includes(
    value as DashboardTab
  );

export default function DashboardPage() {
  const [activeTab, setActiveTab] =
    useState<DashboardTab>(
      "magic-video"
    );

  useEffect(() => {
    const syncTabFromHash = () => {
      const hashValue =
        normalizeHash(
          window.location.hash
        );

      setActiveTab(
        isDashboardTab(hashValue)
          ? hashValue
          : "magic-video"
      );
    };

    syncTabFromHash();

    window.addEventListener(
      "hashchange",
      syncTabFromHash
    );

    return () =>
      window.removeEventListener(
        "hashchange",
        syncTabFromHash
      );
  }, []);

  const showVideoGallery = () => {
    window.location.hash =
      "your-videos";

    setActiveTab("your-videos");
  };

  const startVideoMonitor = () => {
    toast.success(
      "Generating cinematic video"
    );

    showVideoGallery();
  };

  const pageMeta = useMemo(() => {
    switch (activeTab) {
      case "magic-video":
        return {
          eyebrow:
            "AI CINEMA ENGINE",
          title: "Magic Video",
          description:
            "Transform prompts into cinematic AI-generated stories with motion, atmosphere, and emotion.",
        };

      case "syncstudio":
        return {
          eyebrow:
            "LIP SYNC SYSTEM",
          title: "Sync Studio",
          description:
            "Create realistic synced performances with cinematic facial motion and dialogue alignment.",
        };

      case "anime-matcher":
        return {
          eyebrow:
            "ANIME IDENTITY",
          title: "Anime Twin",
          description:
            "Discover your anime-inspired cinematic identity using generative AI.",
        };

      case "your-videos":
        return {
          eyebrow:
            "VIDEO LIBRARY",
          title: "Your Videos",
          description:
            "Manage, preview, and revisit your generated cinematic creations.",
        };

      default:
        return {
          eyebrow:
            "AI CINEMA ENGINE",
          title: "Magic Video",
          description:
            "Transform prompts into cinematic AI-generated stories.",
        };
    }
  }, [activeTab]);

  const renderedTab = (() => {
    switch (activeTab) {
      case "magic-video":
        return (
          <MagicVideo
            onGenerate={
              startVideoMonitor
            }
          />
        );

      case "syncstudio":
        return (
          <SyncStudio
            onGenerate={
              startVideoMonitor
            }
          />
        );

      case "your-videos":
        return <VideoGallery />;

      case "anime-matcher":
        return <AnimeMatcher />;

      default:
        return (
          <MagicVideo
            onGenerate={
              startVideoMonitor
            }
          />
        );
    }
  })();

  return (
    <div
      className="
        relative
        min-h-screen
        overflow-x-hidden
      "
    >
      {/* BACKGROUND */}
      <div
        className="
  pointer-events-none
  absolute
  inset-0
  z-0
  overflow-hidden
"
      >
        <div
          className="
            absolute
            left-1/2
            top-0
            h-[500px]
            w-[500px]
            -translate-x-1/2
            rounded-full
            bg-black/[0.03]
            blur-[120px]
          "
        />

        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute left-1/3 top-0 h-full w-px bg-black" />
          <div className="absolute left-2/3 top-0 h-full w-px bg-black" />
          <div className="absolute left-0 top-1/3 h-px w-full bg-black" />
          <div className="absolute left-0 top-2/3 h-px w-full bg-black" />
        </div>
      </div>

      {/* CONTENT */}
      <div
        className="
  relative
  z-[20]
  mx-auto
  w-full
  max-w-[850px]
  3xl:max-w-[1600px]
"
      >
        {/* HERO */}
        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
          className="
            mb-6
            border-b
            border-black/10
            pb-6
            md:mb-10
            md:pb-10
          "
        >
          {/* EYEBROW */}
          <div
            className="
              mb-4
              text-[10px]
              uppercase
              tracking-[0.35em]
              text-black/40
              md:text-[11px]
            "
          >
            {pageMeta.eyebrow}
          </div>

          {/* TITLE */}
          <h1
            className="
              max-w-5xl
              text-[14vw]
              font-medium
              uppercase
              leading-[0.9]
              tracking-[-0.08em]
              text-black

              sm:text-[10vw]
              md:text-[7vw]
              xl:text-[5vw]
            "
          >
            {pageMeta.title}
          </h1>

          {/* DESC */}
          <p
            className="
              mt-4
              max-w-2xl
              text-sm
              leading-relaxed
              text-black/60
              md:mt-6
              md:text-lg
            "
          >
            {pageMeta.description}
          </p>
        </motion.div>

        {/* CONTENT */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{
              opacity: 0,
              y: 30,
              filter:
                "blur(10px)",
            }}
            animate={{
              opacity: 1,
              y: 0,
              filter:
                "blur(0px)",
            }}
            exit={{
              opacity: 0,
              y: -20,
              filter:
                "blur(10px)",
            }}
            transition={{
              duration: 0.5,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
          >
            {renderedTab}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
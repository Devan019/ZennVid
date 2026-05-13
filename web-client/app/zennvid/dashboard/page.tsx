"use client";

import React from "react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import { toast } from "sonner";
import { useDashboardTabs } from "./hooks/useDashboardTabs";
import PageHeader from "./components/PageHeader";
import DashboardBackground from "./components/DashboardBackground";
import { FeatureRenderer } from "./components/FeatureRenderer";

export default function DashboardPage() {
  const {
    activeTab,
    pageMeta,
    showVideoGallery,
  } = useDashboardTabs();

  const startVideoMonitor = () => {
    toast.success(
      "Generating cinematic video"
    );

    showVideoGallery();
  };

  return (
    <div
      className="
        relative
        min-h-screen
        overflow-x-hidden
      "
    >
      {/* BACKGROUND */}
      <DashboardBackground />

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
        {/* PAGE HEADER */}
        <PageHeader pageMeta={pageMeta} />

        {/* FEATURES */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{
              opacity: 0,
              y: 30,
              filter: "blur(10px)",
            }}
            animate={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
            }}
            exit={{
              opacity: 0,
              y: -20,
              filter: "blur(10px)",
            }}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <FeatureRenderer
              activeTab={activeTab}
              onGenerate={startVideoMonitor}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
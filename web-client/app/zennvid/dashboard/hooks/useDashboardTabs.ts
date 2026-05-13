"use client";

import { useEffect, useState } from "react";
import {
  DashboardTab,
  PageMeta,
} from "../types";
import {
  normalizeHash,
  isDashboardTab,
  getPageMeta,
} from "../utils";

export const useDashboardTabs = () => {
  const [activeTab, setActiveTab] =
    useState<DashboardTab>("magic-video");
  const [pageMeta, setPageMeta] =
    useState<PageMeta>(
      getPageMeta("magic-video")
    );

  // Sync tab from URL hash
  useEffect(() => {
    const syncTabFromHash = () => {
      const hashValue = normalizeHash(
        window.location.hash
      );

      const newTab: DashboardTab =
        isDashboardTab(hashValue)
          ? hashValue
          : "magic-video";

      setActiveTab(newTab);
      setPageMeta(getPageMeta(newTab));
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

  // Update URL hash when tab changes
  const switchTab = (tab: DashboardTab) => {
    window.location.hash = tab;
    setActiveTab(tab);
    setPageMeta(getPageMeta(tab));
  };

  // Show video gallery
  const showVideoGallery = () => {
    switchTab("your-videos");
  };

  return {
    activeTab,
    pageMeta,
    switchTab,
    showVideoGallery,
  };
};

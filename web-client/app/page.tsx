"use client";

import {
  useEffect,
  useState,
} from "react";

import { ReactLenis } from "@studio-freight/react-lenis";

import { Footer } from "@/components/common/Footer";

import { FullscreenMenu } from "@/components/common/FullscreenMenu";

import { Navbar } from "@/components/common/Navbar";

import { AnimeTwinSection } from "@/components/Home/AnimeTwinSection";

import { FinalCTASection } from "@/components/Home/cta";

import { AboutSection } from "@/components/Home/FeatureSection";

import { HeroSection } from "@/components/Home/HeroSection";

import { IntroVideo } from "@/components/Home/IntroVideo";

import { MagicStudioSection } from "@/components/Home/MagicStudioSection";

import { SyncStudioSection } from "@/components/Home/SyncStudioSection";

const INTRO_KEY =
  "zennvid-intro-finished";

const Page = () => {
  const [
    introFinished,
    setIntroFinished,
  ] = useState(false);

  const [
    introReady,
    setIntroReady,
  ] = useState(false);

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  /* CHECK INTRO STATUS */
  useEffect(() => {
    const alreadySeen =
      sessionStorage.getItem(
        INTRO_KEY
      );

    if (alreadySeen === "true") {
      setIntroFinished(true);
      setIntroReady(true);
    }

    setLoading(false);
  }, []);

  /* INTRO END */
  const handleIntroFinish = () => {
    sessionStorage.setItem(
      INTRO_KEY,
      "true"
    );

    setIntroFinished(true);
  };

  /* PREVENT HYDRATION FLASH */
  if (loading) return null;

  return (
    <ReactLenis root>
      <div className="relative overflow-hidden bg-white text-black">
        {/* VIDEO LOADING SCREEN */}
        {/* VIDEO LOADING SCREEN */}
        {!introReady && (
          <div
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black"
          >
            <div
              className="flex flex-col items-center gap-6"
            >
              {/* LOGO */}
              <div
                className="text-sm font-semibold uppercase tracking-[0.45em] text-white"
              >
                ZENNVID
              </div>

              {/* LOADER */}
              <div
                className="relative h-[2px] w-32 overflow-hidden rounded-full bg-white/10"
              >
                <div
                  className="absolute left-0 top-0 h-full w-1/2 animate-[loader_1.2s_ease-in-out_infinite] bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* NAV */}
        <Navbar
          setMenuOpen={
            setMenuOpen
          }
        />

        {/* MENU */}
        <FullscreenMenu
          menuOpen={menuOpen}
          setMenuOpen={
            setMenuOpen
          }
        />

        {/* INTRO VIDEO */}
        {!introFinished && (
          <IntroVideo
            introFinished={
              introFinished
            }
            setIntroFinished={
              handleIntroFinish
            }
            setIntroReady={
              setIntroReady
            }
          />
        )}

        {/* MAIN */}
        <main className="relative">
          <HeroSection
            introFinished={
              introFinished
            }
          />

          <AboutSection />

          <MagicStudioSection />

          <SyncStudioSection />

          <AnimeTwinSection />

          <FinalCTASection />
        </main>

        <Footer />

        {/* LOADER KEYFRAMES */}
        <style jsx global>{`
          @keyframes loader {
            0% {
              transform: translateX(-100%);
            }

            100% {
              transform: translateX(250%);
            }
          }
        `}</style>
      </div>
    </ReactLenis>
  );
};

export default Page;
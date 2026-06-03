"use client";

import { motion } from "framer-motion";
//@ts-ignore
import "./home.css";

export const HeroSection = ({
  introFinished,
}: {
  introFinished: boolean;
}) => {
  const videoUrl = "https://cdn.zennvid.tech/media/zenvvid_bg.mp4";

  return (
    <section
      data-theme="light"
      className="relative flex h-screen items-center justify-center overflow-hidden bg-[#f5f5f2]"
    >
      <div className="relative z-20 w-full px-4">
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{
            opacity: introFinished ? 1 : 0,
            y: introFinished ? 0 : 80,
          }}
          transition={{
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <svg
            viewBox="0 0 1400 500"
            className="h-auto w-full"
          >
            <defs>
              <mask id="text-mask">
                <rect
                  width="100%"
                  height="100%"
                  fill="black"
                />

                <text
                  x="50%"
                  y="32%"
                  textAnchor="middle"
                  className="hero-svg-text"
                  fill="white"
                >
                  Imagine
                </text>

                <text
                  x="50%"
                  y="63%"
                  textAnchor="middle"
                  className="hero-svg-text"
                  fill="white"
                >
                  It Into
                </text>

                <text
                  x="50%"
                  y="93%"
                  textAnchor="middle"
                  className="hero-svg-text"
                  fill="white"
                >
                  Motion.
                </text>
              </mask>
            </defs>

            <foreignObject
              width="100%"
              height="100%"
              mask="url(#text-mask)"
            >
              <video
                autoPlay
                muted
                loop
                playsInline
                className="hero-video"
                src={videoUrl}
                ref={(video) => {
                  if (video) {
                    video.playbackRate = 0.6;
                  }
                }}
              />
            </foreignObject>
          </svg>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{
            opacity: introFinished ? 1 : 0,
          }}
          transition={{
            delay: 0.3,
            duration: 1,
          }}
          className="mt-8 text-center text-sm uppercase tracking-[0.3em] text-black/60"
        >
          Cinematic AI for creators, dreamers, and impossible ideas.
        </motion.p>
      </div>
    </section>
  );
};
"use client";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

interface IntroVideoProps {
  introFinished: boolean;

  setIntroFinished: (
    val: boolean
  ) => void;

  setIntroReady: (
    val: boolean
  ) => void;
}

export const IntroVideo = ({
  introFinished,
  setIntroFinished,
  setIntroReady,
}: IntroVideoProps) => {
  
  const videoUrl = "https://cdn.zennvid.tech/media/zenvvid_bg.mp4";
  
  return (
    <AnimatePresence>
      {!introFinished && (
        <motion.div
          initial={{
            y: 0,
          }}
          exit={{
            y: "-100%",
            transition: {
              duration: 1.2,
              ease: [
                0.76,
                0,
                0.24,
                1,
              ],
            },
          }}
          className="
            fixed
            inset-0
            z-40
            overflow-hidden
            bg-black
          "
        >
          <video
            autoPlay
            muted
            playsInline
            preload="metadata"
            onCanPlayThrough={() =>
              setIntroReady(true)
            }
            onEnded={() =>
              setIntroFinished(
                true
              )
            }
            className="
              h-full
              w-full
              object-cover
            "
          >
            <source
              src={videoUrl}
              type="video/mp4"
            />
          </video>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
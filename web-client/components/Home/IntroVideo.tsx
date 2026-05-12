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
            preload="auto"
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
              src="https://res.cloudinary.com/dpnae0bod/video/upload/v1778564088/zenvvidbg_weihbz.mp4"
              type="video/mp4"
            />
          </video>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
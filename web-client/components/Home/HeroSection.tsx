"use client";

import { motion } from "framer-motion";

export const HeroSection = ({ introFinished }: { introFinished: boolean }) => {
  return (
    <section data-theme="light" className="relative flex h-screen items-center justify-center overflow-hidden bg-[#f5f5f2] ">
      <div className="relative z-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 80 }}
          animate={{
            opacity: introFinished ? 1 : 0,
            y: introFinished ? 0 : 80,
          }}
          transition={{
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="uppercase leading-[0.9] tracking-tight"
        >
          <span className="block text-[14vw] font-black">Imagine</span>
          <span className="block text-[14vw] font-black">It Into</span>
          <span className="block text-[14vw] font-black">Motion.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{
            opacity: introFinished ? 1 : 0,
          }}
          transition={{
            delay: 0.3,
            duration: 1,
          }}
          className="mt-8 text-sm uppercase tracking-[0.3em] text-black/60"
        >
          Cinematic AI for creators, dreamers, and impossible ideas.
        </motion.p>
      </div>
    </section>
  );
};

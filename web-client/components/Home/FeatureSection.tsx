"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const AboutSection = () => {
  return (
    <section data-theme="dark" id="about" className="relative min-h-screen overflow-hidden bg-black px-10 py-40 text-white">
      {/* DOT BACKGROUND */}
      <div
        className={cn(
          "absolute inset-0 z-0",
          "[background-size:20px_20px]",
          "[background-image:radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)]"
        )}
      />

      {/* RADIAL FADE */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      {/* SOFT GLOW */}
      <div className="absolute left-1/2 top-1/2 z-0 h-[40vw] w-[40vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-[120px]" />

      {/* CONTENT */}
      <div className="relative z-10 flex min-h-screen flex-col justify-between">
        {/* TOP */}
        <div className="flex flex-col gap-20 lg:flex-row lg:items-start lg:justify-between">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              ease: [0.22, 1, 0.36, 1],
            }}
            viewport={{ once: true }}
            className="max-w-5xl"
          >
            <h2 className="text-[10vw] uppercase leading-[0.9] tracking-tight">
              AI video
              <br />
              generation
              <br />
              reimagined.
            </h2>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.2,
              duration: 1,
            }}
            viewport={{ once: true }}
            className="max-w-md pt-10"
          >
            <p className="text-lg leading-relaxed text-white/60">
              Zennvid transforms prompts,
              voices, and identities into
              cinematic motion through
              intelligent generative storytelling.
            </p>
          </motion.div>
        </div>

        {/* BOTTOM */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{
            delay: 0.4,
            duration: 1,
          }}
          viewport={{ once: true }}
          className="mt-40 flex justify-between border-t border-white/10 pt-8 uppercase text-white/40"
        >
          <div>Cinematic AI Studio</div>
          <div>Built For Creators</div>
        </motion.div>
      </div>
    </section>
  );
};

"use client";

import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa6";

export const FinalCTASection = () => {
  return (
    <section data-theme="dark" id="contact" className="min-h-screen relative overflow-hidden bg-black px-6 py-32 text-white md:px-10">

      {/* GRID LINES */}
      <div className="absolute inset-0 opacity-20">

        <div className="absolute left-[3%] top-0 h-full w-px border-l border-dashed border-white/20" />

        <div className="absolute left-1/2 top-0 h-full w-px border-l border-dashed border-white/20" />

        <div className="absolute right-[3%] top-0 h-full w-px border-l border-dashed border-white/20" />

        <div className="absolute top-[20%] left-0 h-px w-full border-t border-dashed border-white/20" />

        <div className="absolute bottom-[20%] left-0 h-px w-full border-t border-dashed border-white/20" />
      </div>

      {/* GLOW */}
      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-[500px]
          w-[500px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-blue-500/10
          blur-[140px]
        "
      />

      {/* CONTENT */}
      <div className="relative z-10 mx-auto grid max-w-8xl grid-cols-1 gap-20 lg:grid-cols-[1.5fr_0.7fr]">

        {/* LEFT SIDE */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
          }}
          viewport={{ once: true }}
        >

          {/* SMALL TEXT */}
          <div className="mb-8 uppercase tracking-[0.3em] text-white/40">

            Cinematic AI For Modern Creators

          </div>

          {/* MAIN HEADING */}
          <h2 className="max-w-6xl text-[5vw] leading-[1.05] tracking-tight text-white">

            Turn imagination
            into <span className="text-blue-500">motion</span>.

            <br />

            Create cinematic AI stories
            with the future of generative video.

          </h2>

          {/* BUTTONS */}
          <div className="mt-14 flex flex-wrap gap-5">

            {/* PRIMARY */}
            <button
              className="
                group
                inline-flex
                items-center
                gap-3
                rounded-2xl
                bg-blue-600
                px-8
                py-5
                text-sm
                uppercase
                tracking-[0.25em]
                text-white
                transition-all
                duration-500
                hover:scale-105
                hover:bg-blue-500
              "
            >
              <span>Start Creating</span>

              <FaArrowRight
                className="
                  transition-transform
                  duration-500
                  group-hover:translate-x-1
                "
              />
            </button>

            {/* SECONDARY */}
            <button
              className="
                group
                inline-flex
                items-center
                gap-3
                rounded-2xl
                border
                border-white/10
                bg-white/5
                px-8
                py-5
                text-sm
                uppercase
                tracking-[0.25em]
                text-white
                backdrop-blur-xl
                transition-all
                duration-500
                hover:border-white/20
                hover:bg-white/10
              "
            >
              <span>Talk To Us</span>
            </button>
          </div>
        </motion.div>

        {/* RIGHT SIDE */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{
            delay: 0.2,
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
          }}
          viewport={{ once: true }}
          className="flex items-center"
        >

          <div className="max-w-sm">

            {/* QUOTE */}
            <p className="text-2xl leading-relaxed text-white/90">

              “Zennvid feels like the future
              of cinematic storytelling.
              Ideas become motion in seconds.”

            </p>

            {/* AUTHOR */}
            <div className="mt-10">

              <h4 className="text-xl font-semibold text-white">

                Creative AI Studio

              </h4>

              <p className="mt-2 text-white/40">

                Built for creators, dreamers,
                and impossible ideas.

              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
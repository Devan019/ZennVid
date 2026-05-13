"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { FaArrowRight } from "react-icons/fa6";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FRONTEND_ROUTES } from "@/constants/frontend_routes";

export const MagicStudioSection = () => {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handlePlay = async () => {
    if (videoRef.current) {
      videoRef.current.muted = false;

      await videoRef.current.play();

      setIsPlaying(true);
    }
  };

  return (
    <section data-theme="light" id="magicstudio" className="relative min-h-screen overflow-hidden bg-[#f5f5f2] px-10 py-40 text-black">

      {/* TOP LINE */}
      <div className="mb-20 flex items-center justify-between border-b border-black/10 pb-6 uppercase text-black/40">

        <div>01 / Magic Studio</div>

        <div>Prompt → Cinema</div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 items-center gap-20 lg:grid-cols-2">

        {/* LEFT SIDE - VIDEO */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
          }}
          viewport={{ once: true }}
          className="relative"
        >
          <Card
            className="
              group
              relative
              overflow-hidden
              rounded-[2rem]
              border
              border-black/10
              bg-black
              shadow-[0_0_50px_rgba(0,0,0,0.05)]
              transition-all
              duration-500
            "
          >

            {/* VIDEO CONTAINER */}
            <div className="relative flex h-[720px] items-center justify-center overflow-hidden bg-black">

              {/* VIDEO */}
              <video
                ref={videoRef}
                controls={isPlaying}
                playsInline
                preload="metadata"
                className={`
                  h-full
                  w-full
                  object-contain
                  transition-all
                  duration-700
                  ${!isPlaying ? "group-hover:scale-[1.03]" : ""}
                `}
              >
                <source
                  src="https://res.cloudinary.com/dpnae0bod/video/upload/v1778478670/zennvid/arkdth7uddlusktwtpnm.mp4"
                  type="video/mp4"
                />
              </video>

              {/* BEFORE PLAY */}
              {!isPlaying && (
                <>
                  {/* OVERLAY */}
                  <div
                    className="
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-black/70
                      via-transparent
                      to-black/20
                    "
                  />

                  {/* LIGHT GLOW */}
                  <div
                    className="
                      absolute
                      left-1/2
                      top-0
                      h-[200px]
                      w-[70%]
                      -translate-x-1/2
                      rounded-full
                      bg-white/10
                      blur-[120px]
                    "
                  />

                  {/* PLAY BUTTON */}
                  <button
                    onClick={handlePlay}
                    className="
                      absolute
                      inset-0
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <div
                      className="
                        flex
                        h-28
                        w-28
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-white/20
                        bg-white/90
                        text-xs
                        uppercase
                        tracking-[0.25em]
                        text-black
                        shadow-2xl
                        transition-all
                        duration-500
                        group-hover:scale-110
                      "
                    >
                      Play Video
                    </div>
                  </button>

                  {/* BOTTOM CONTENT */}
                  <div className="absolute bottom-0 left-0 z-10 p-10">
                    <div className="mb-3 uppercase tracking-[0.3em] text-white/40">
                      Generative Cinema Engine
                    </div>

                    <h3 className="text-[3vw] uppercase tracking-tight text-white">
                      Magic Studio
                    </h3>

                    <p className="mt-2 max-w-md text-white/60">
                      Cinematic AI storytelling powered
                      by prompts, voices, and imagination.
                    </p>
                  </div>
                </>
              )}
            </div>
          </Card>
        </motion.div>

        {/* RIGHT SIDE - TEXT */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
          }}
          viewport={{ once: true }}
          className="sticky top-32"
        >

          {/* LABEL */}
          <div className="mb-6 uppercase tracking-[0.3em] text-black/40">
            Generative Cinema Engine
          </div>

          {/* HEADING */}
          <h2 className="text-[7vw] uppercase leading-[0.9] tracking-tight">
            MAGIC
            <br />
            STUDIO.
          </h2>

          {/* DESCRIPTION */}
          <p className="mt-10 max-w-xl text-xl leading-relaxed text-black/60">
            Transform prompts, voices, and ideas
            into cinematic AI-generated videos with
            intelligent storytelling, motion scenes,
            visual transitions, and immersive composition.
          </p>

          {/* META */}
          <div className="mt-12 flex flex-wrap gap-4 uppercase text-black/40">

            {[
              "Prompt Based",
              "AI Motion",
              "Voice Driven",
              "Cinematic Scenes",
            ].map((item) => (
              <div
                key={item}
                className="
                  rounded-full
                  border
                  border-black/10
                  px-5
                  py-2
                  text-sm
                "
              >
                {item}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-14 flex items-start">

            <button
              onClick={
                () => router.push(FRONTEND_ROUTES.MAGICSTUDIO)
              }
              className="
                group
                inline-flex
                items-center
                gap-3
                rounded-full
                border
                border-black/10
                bg-black
                px-8
                py-4
                text-sm
                uppercase
                tracking-[0.25em]
                text-white
                transition-all
                duration-500
                hover:scale-105
                hover:gap-5
              "
            >
              <span>Create Cinema</span>

              <FaArrowRight
                className="
                  transition-transform
                  duration-500
                  group-hover:translate-x-1
                "
              />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
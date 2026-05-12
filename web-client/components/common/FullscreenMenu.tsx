"use client";

import { AnimatePresence, motion } from "framer-motion";

interface FullscreenMenuProps {
  menuOpen: boolean;
  setMenuOpen: (val: boolean) => void;
}

const links = [
  {
    title: "Home",
    href: "#",
  },
  {
    title: "About",
    href: "#about",
  },
  {
    title: "Magic Studio",
    href: "#magicstudio",
  },
  {
    title: "Sync Studio",
    href: "#syncstudio",
  },
  {
    title: "Anime Twin",
    href: "#animetwin",
  },
  {
    title: "Contact",
    href: "#contact",
  },
];

export const FullscreenMenu = ({
  menuOpen,
  setMenuOpen,
}: FullscreenMenuProps) => {
  return (
    <AnimatePresence mode="wait">
      {menuOpen && (
        <motion.div
          initial={{
            y: "-100%",
            opacity: 0,
            filter: "blur(20px)",
          }}
          animate={{
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
          }}
          exit={{
            y: "-100%",
            opacity: 0,
            filter: "blur(20px)",
          }}
          transition={{
            duration: 1,
            ease: [0.76, 0, 0.24, 1],
          }}
          className="
            fixed
            inset-0
            z-[999]
            overflow-hidden
            bg-[#F4F1EA]
            text-black
          "
        >
          {/* BACKGROUND GLOW */}
          <div
            className="
              absolute
              left-1/2
              top-1/2
              h-[700px]
              w-[700px]
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-black/[0.04]
              blur-[140px]
            "
          />

          {/* GRID LINES */}
          <div className="absolute inset-0 opacity-[0.07]">
            <div className="absolute left-0 top-1/3 h-px w-full bg-black" />
            <div className="absolute left-0 top-2/3 h-px w-full bg-black" />
            <div className="absolute top-0 left-1/3 h-full w-px bg-black" />
            <div className="absolute top-0 left-2/3 h-full w-px bg-black" />
          </div>

          {/* TOP NAV */}
          <div className="relative z-20 flex items-center justify-between px-6 py-8 md:px-10">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="
                text-[11px]
                uppercase
                tracking-[0.35em]
                text-black/70
              "
            >
              ZENNVID
            </motion.div>

            <motion.button
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.92,
              }}
              onClick={() => setMenuOpen(false)}
              className="
                group
                relative
                overflow-hidden
                text-[11px]
                uppercase
                tracking-[0.35em]
                text-black/70
              "
            >
              CLOSE

              <span
                className="
                  absolute
                  bottom-0
                  left-0
                  h-px
                  w-0
                  bg-black
                  transition-all
                  duration-500
                  group-hover:w-full
                "
              />
            </motion.button>
          </div>

          {/* MENU LINKS */}
          <div
            className="
              relative
              z-20
              flex
              h-[78vh]
              flex-col
              justify-center
              px-6
              md:px-10
            "
          >
            {links.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{
                  y: 120,
                  opacity: 0,
                }}
                animate={{
                  y: 0,
                  opacity: 1,
                }}
                exit={{
                  y: 100,
                  opacity: 0,
                }}
                transition={{
                  delay: 0.15 + index * 0.08,
                  duration: 1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="overflow-hidden"
              >
                <motion.a
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  whileHover={{
                    x: 30,
                  }}
                  whileTap={{
                    scale: 0.96,
                  }}
                  className="
                    group
                    relative
                    flex
                    items-center
                    gap-6
                    py-1
                    uppercase
                    leading-[0.9]
                    tracking-[-0.04em]
                    text-black
                  "
                >
                  {/* NUMBER */}
                  <span
                    className="
                      hidden
                      min-w-[40px]
                      text-sm
                      tracking-[0.2em]
                      text-black/40
                      md:block
                    "
                  >
                    0{index + 1}
                  </span>

                  {/* TITLE */}
                  <span
                    className="
                      relative
                      text-[15vw]
                      font-medium
                      md:text-[8vw]
                      lg:text-[7vw]
                    "
                  >
                    {item.title}

                    {/* HOVER LINE */}
                    <motion.span
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.5 }}
                      className="
                        absolute
                        bottom-1
                        left-0
                        h-[3px]
                        w-full
                        origin-left
                        bg-black
                      "
                    />
                  </span>

                  {/* ARROW */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileHover={{
                      opacity: 1,
                      x: 0,
                    }}
                    className="
                      hidden
                      text-xl
                      md:block
                    "
                  >
                    ↗
                  </motion.div>
                </motion.a>
              </motion.div>
            ))}
          </div>

          {/* FOOTER */}
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.6,
            }}
            className="
              absolute
              bottom-0
              left-0
              z-20
              flex
              w-full
              flex-col
              gap-5
              border-t
              border-black/10
              px-6
              py-6
              text-[11px]
              uppercase
              tracking-[0.2em]
              md:flex-row
              md:items-center
              md:justify-between
              md:px-10
            "
          >
            <div className="text-black/70">
              Tomorrow&apos;s Creative Engine.
            </div>

            <div className="flex gap-8 text-black/50">
              {["Instagram", "X", "LinkedIn"].map((social) => (
                <motion.div
                  key={social}
                  whileHover={{
                    y: -2,
                    color: "#000",
                  }}
                  className="
                    cursor-pointer
                    transition-colors
                  "
                >
                  {social}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
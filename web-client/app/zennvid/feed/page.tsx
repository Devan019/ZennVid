"use client";

import {
  useState,
  useEffect,
  useRef,
} from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  Sparkles,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { getFeedPosts } from "@/lib/apiProvider";
import { VideoCard } from "@/app/zennvid/feed/components/video-card";
import { FRONTEND_ROUTES } from "@/constants/frontend_routes";
import { useRouter } from "next/navigation";

export default function page() {
  const router = useRouter();

  const feedQuery = useQuery({
    queryKey: ["videoFeed"],
    queryFn: getFeedPosts,
  });

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [direction, setDirection] =
    useState(0);

  const scrollRef =
    useRef<HTMLDivElement>(null);

  const [posts, setPosts] = useState<
    any[]
  >([]);

  async function fetchFeedVideos() {
    if (
      feedQuery.data &&
      Array.isArray(
        feedQuery.data.DATA
      )
    ) {
      setPosts(
        feedQuery.data.DATA || []
      );

      return;
    }

    const queryData =
      await feedQuery.refetch();

    setPosts(
      queryData.data.DATA || []
    );
  }

  useEffect(() => {
    fetchFeedVideos();
  }, []);

  const slideVariants = {
    enter: (
      dir: number
    ) => ({
      y:
        dir > 0
          ? 1000
          : -1000,

      opacity: 0,
    }),

    center: {
      zIndex: 1,
      y: 0,
      opacity: 1,
    },

    exit: (
      dir: number
    ) => ({
      zIndex: 0,

      y:
        dir < 0
          ? 1000
          : -1000,

      opacity: 0,
    }),
  };

  const paginate = (
    newDirection: number
  ) => {
    setDirection(newDirection);

    setCurrentIndex((prev) => {
      const newIndex =
        prev + newDirection;

      if (newIndex < 0)
        return posts.length - 1;

      if (
        newIndex >= posts.length
      )
        return 0;

      return newIndex;
    });
  };

  useEffect(() => {
    let scrollTimeout:
      | NodeJS.Timeout
      | null = null;

    const handleWheel = (
      e: WheelEvent
    ) => {
      if (
        !scrollRef.current?.contains(
          e.target as Node
        )
      )
        return;

      if (scrollTimeout) return;

      if (e.deltaY > 50)
        paginate(1);
      else if (e.deltaY < -50)
        paginate(-1);

      scrollTimeout = setTimeout(
        () => {
          scrollTimeout = null;
        },
        700
      );
    };

    const handleKeyDown = (
      e: KeyboardEvent
    ) => {
      if (
        e.key === "ArrowDown"
      ) {
        paginate(1);

        e.preventDefault();
      } else if (
        e.key === "ArrowUp"
      ) {
        paginate(-1);

        e.preventDefault();
      }
    };

    window.addEventListener(
      "wheel",
      handleWheel
    );

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "wheel",
        handleWheel
      );

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [posts]);

  if (posts.length === 0) {
    return (
      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
          px-6
        "
      >
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="
            rounded-[40px]
            border
            border-black/10
            bg-white/60
            px-10
            py-16
            text-center
            backdrop-blur-xl
          "
        >
          <div
            className="
              mx-auto
              mb-6
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-full
              bg-black
              text-white
            "
          >
            <Sparkles className="h-8 w-8" />
          </div>

          <h2
            className="
              text-3xl
              font-semibold
              tracking-tight
            "
          >
            No videos yet
          </h2>

          <p
            className="
              mt-3
              text-black/50
            "
          >
            Feed videos will appear
            here.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="
        relative
        h-screen
        w-full
        overflow-hidden
      "
    >
      {/* TOP BAR */}
      <motion.div
        initial={{
          opacity: 0,
          y: -30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="
          fixed
          left-0
          top-0
          px-5
          py-5
          z-[10]
          md:px-8
          cursor-pointer
        "
      >
        <motion.button
        className="cursor-pointer"
          type="button"
          initial={{
            opacity: 0,
            y: -10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          whileHover={{
            scale: 1.02,
          }}
          whileTap={{
            scale: 0.98,
          }}
          onClick={() => {
            router.push(
              FRONTEND_ROUTES.HOME
            );
          }}
        >
          <span
            className="
                text-sm
                font-semibold
                uppercase
                tracking-[0.3em]
                text-black
                lg:text-base
                cursor-pointer
              "
          >
            Zennvid
          </span>
        </motion.button>


      </motion.div>

      {/* VIDEO */}
      <div
        className="
          relative
          flex
          h-full
          w-full
          items-center
          justify-center
          px-3
          pt-24
          pb-10

          md:px-10
        "
      >
        <AnimatePresence
          initial={false}
          custom={direction}
          mode="wait"
        >
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              y: {
                type: "spring",
                stiffness: 260,
                damping: 28,
              },

              opacity: {
                duration: 0.4,
              },
            }}
            className="
              h-full
              w-full
              max-w-[720px]
            "
          >
            <VideoCard
              feed={
                posts[currentIndex]
              }
              onNext={() =>
                paginate(1)
              }
              onPrev={() =>
                paginate(-1)
              }
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* INDICATORS */}
      <motion.div
        className="
          fixed
          right-5
          top-1/2
          z-40
          hidden
          -translate-y-1/2
          flex-col
          gap-3

          md:flex
        "
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
      >
        {posts.map((_, idx) => (
          <motion.button
            key={idx}
            onClick={() => {
              setDirection(
                idx >
                  currentIndex
                  ? 1
                  : -1
              );

              setCurrentIndex(idx);
            }}
            className={`
              rounded-full
              transition-all

              ${idx === currentIndex
                ? `
                    h-12
                    w-[6px]
                    bg-black
                  `
                : `
                    h-3
                    w-[6px]
                    bg-black/20
                    hover:bg-black/50
                  `
              }
            `}
            whileHover={{
              scale: 1.05,
            }}
          />
        ))}
      </motion.div>

      {/* MOBILE DOTS */}
      <div
        className="
          fixed
          bottom-6
          left-1/2
          z-40
          flex
          -translate-x-1/2
          gap-2

          md:hidden
        "
      >
        {posts.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setDirection(
                idx >
                  currentIndex
                  ? 1
                  : -1
              );

              setCurrentIndex(idx);
            }}
            className={`
              rounded-full
              transition-all

              ${idx === currentIndex
                ? `
                    h-2
                    w-8
                    bg-black
                  `
                : `
                    h-2
                    w-2
                    bg-black/30
                  `
              }
            `}
          />
        ))}
      </div>

      {/* SCROLL HINT */}
      <motion.div
        className="
    fixed
    left-1/4
    bottom-12
    hidden
    -translate-y-1/2
    rounded-full
    border
    border-black/10
    bg-white/70
    px-4
    py-3
    text-[11px]
    uppercase
    tracking-[0.25em]
    text-black/60
    backdrop-blur-xl

    md:flex
  "
      >
        Scroll to explore
      </motion.div>
    </div>
  );
}
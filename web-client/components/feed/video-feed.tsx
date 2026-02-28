"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { VideoCard } from "./video-card"
import { useQuery } from "@tanstack/react-query"
import { getFeedPosts } from "@/lib/apiProvider"

export function VideoFeed() {

  const feedQuery = useQuery({
    queryKey: ["videoFeed"],
    queryFn: getFeedPosts
  })

  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [posts, setPosts] = useState([])

  async function fetchFeedVideos() {
    if (feedQuery.data && Array.isArray(feedQuery.data.DATA)) {
      setPosts(feedQuery.data.DATA || []);
      return;
    }
    const queryData = await feedQuery.refetch();
    setPosts(queryData.data.DATA || []);
  }

  useEffect(() => {
    fetchFeedVideos();

  }, [])


  const slideVariants = {
    enter: (dir: number) => ({
      y: dir > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      y: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      y: dir < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  }

  const paginate = (newDirection: number) => {
    setDirection(newDirection)
    setCurrentIndex((prev) => {
      const newIndex = prev + newDirection
      if (newIndex < 0) return posts.length - 1
      if (newIndex >= posts.length) return 0
      return newIndex
    })
  }

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout | null = null


    const handleWheel = (e: WheelEvent) => {
      if (!scrollRef.current?.contains(e.target as Node)) return;

      if (scrollTimeout) return;

      if (e.deltaY > 50) paginate(1);
      else if (e.deltaY < -50) paginate(-1);

      scrollTimeout = setTimeout(() => {
        scrollTimeout = null;
      }, 700);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        paginate(1)
        e.preventDefault()
      } else if (e.key === "ArrowUp") {
        paginate(-1)
        e.preventDefault()
      }
    }

    window.addEventListener("wheel", handleWheel)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("wheel", handleWheel)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [posts])


  if (posts.length === 0) {
    return (
      <div className="ml-[35vw] relative w-full h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">No videos available in the feed.</p>
      </div>
    )
  }

  return (
    <div
      ref={scrollRef}
      className="ml-[35vw] relative w-full h-screen overflow-hidden flex items-center justify-center z-[999] dark:bg-zinc-900 bg-white text-black dark:text-white"
    >
      {/* Video Container */}
      <div className="relative w-full h-full ">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              y: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.5 },
            }}
            className="absolute inset-0"
          >
            <VideoCard feed={posts[currentIndex]} onNext={() => paginate(1)} onPrev={() => paginate(-1)} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Indicators */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {posts && posts.length > 0 && posts?.map((_, idx) => (
          <motion.button
            key={idx}
            onClick={() => {
              setDirection(idx > currentIndex ? 1 : -1)
              setCurrentIndex(idx)
            }}
            className={`h-1 rounded-full transition-all ${idx === currentIndex ? "w-8 bg-accent" : "w-2 bg-muted-foreground/50 hover:bg-muted-foreground"
              }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          />
        ))}
      </motion.div>

      {/* Gesture Hint */}
      <motion.div
        className="absolute top-8 left-1/2 -translate-x-1/2 text-xs text-muted-foreground md:hidden"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        Swipe or scroll
      </motion.div>
    </div>
  )
}

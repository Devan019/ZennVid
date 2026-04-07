"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Heart, MessageCircle, Share2, Play, Pause } from "lucide-react"
import { CommentPanel } from "./comment"
import { useUser } from "@/context/UserProvider"
import { useMutation } from "@tanstack/react-query"
import { feedLikeCountUpdate } from "@/lib/apiProvider"
import { ResponseData } from "@/constants/response"
import { toast } from "sonner"
import { getTimeSince } from "@/lib/calculateTime"

export interface IFeed {
  _id: string;
  video: {
    _id: string;
    videoUrl: string;
    videoMetadata?: {
      publicId: string;
      resourceType: string;
      format: string;
    };
    type: string;
    title?: string;
    style?: string;
    language?: string;
    voiceCharacter?: string;
  };
  user: {
    _id: string;
    email?: string;
    username: string;
    profilePicture?: string;
  };
  likes: {
    _id: string;
    user: string;
    createdAt: string;
    updatedAt: string;
  }[];
  comments: {
    _id: string;
    user: {
      username: string;
      _id: string;
      profilePicture?: string;
    }
    content: string;
    createdAt: string;
    updatedAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface VideoCardProps {
  feed: IFeed
  onNext: () => void
  onPrev: () => void
}

export function VideoCard({ feed }: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [showComments, setShowComments] = useState(false)
  const [duration, setDuration] = useState("0:00")
  const { user } = useUser();
  const [isLiked, setIsLiked] = useState(
    feed?.likes?.some((like) => like?.user === user?._id) || false
  )
  const [likeCount, setLikeCount] = useState(feed?.likes?.length)
  const [timeSincePosted, setTimeSincePosted] = useState("");

  useEffect(() => {
    setTimeSincePosted(getTimeSince(new Date(feed.createdAt)));
  }, []);


  const likeMutation = useMutation({
    mutationKey: ["likeVideo"],
    mutationFn: async () => {
      return await feedLikeCountUpdate({
        feedId: feed._id,
        userId: user?._id || ""
      })
    },
    onSuccess: (data: ResponseData) => {
      if (data.SUCCESS) {
        setLikeCount(data.DATA.likeCount);
        setIsLiked(data.DATA.isLiked);
        toast.success(data.MESSAGE);
      } else {
        toast.error(data.MESSAGE);
      }
    },
    onError: () => {
      toast.error("An error occurred while updating like status.");
    }

  })



  const handleLike = () => {
    likeMutation.mutate();
  }




  const videoRef = useRef<HTMLVideoElement | null>(null)

  const togglePlay = () => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  const onLoadVideo = () => {
    if (videoRef.current) {
      const totalSeconds = Math.floor(videoRef.current.duration);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      setDuration(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
    }
  }

  return (
    <>
      <div className="relative w-full h-full rounded-2xl overflow-hidden backdrop-blur-sm bg-gray-100 dark:bg-gray-900">
        {/* Video Container */}
        <div className={`relative w-full h-full ${feed.video.type === "magic_video" ? "scale-y-[1.4] scale-x-[1.3]" : ""}`}>
          <video
            src={feed?.video?.videoUrl}
            ref={videoRef}
            className={`w-full h-full `}
            autoPlay
            loop
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onLoadedMetadata={onLoadVideo}
          />

          {/* Play Button Overlay */}
          <motion.button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ scale: isPlaying ? 0 : 1, opacity: isPlaying ? 0 : 1 }}
              className="bg-white/20 dark:bg-white/30 backdrop-blur-md p-4 rounded-full hover:bg-white/30 dark:hover:bg-white/40 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 text-white" />
              ) : (
                <Play className="w-8 h-8 text-white fill-white" />
              )}
            </motion.div>
          </motion.button>
        </div>

        {/* Header - Creator Info */}
        <motion.div
          className="absolute top-0 left-0 right-0 p-4 "
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-500 flex items-center justify-center text-white font-bold text-sm border-2 border-white/30 dark:border-white/40">
              {feed?.user?.username?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="dark:text-white text-black font-semibold text-sm truncate">{feed?.user?.username}</h3>
              <p className="text-black dark:text-white/80 text-xs">{duration}</p>
            </div>

          </div>
        </motion.div>

        {/* Footer - Time Since Posted */}
        <motion.div
          className="absolute top-0 right-0 p-4 "
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3">
            <p className="text-black dark:text-white/80 text-xs">{timeSincePosted}</p>
          </div>
        </motion.div>

        {/* Content - Title & Description */}
        <motion.div
          className="absolute bottom-4 left-0 right-0 p-4 text-dark"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {feed?.video?.title && <h2 className=" text-lg md:text-xl font-bold mb-2 text-pretty">{feed.video.title}</h2>}
          <div className="flex gap-2 flex-wrap text-xs text-black dark:text-white/80">
            {feed?.video?.style && <span className="px-2 py-1 bg-zinc-500 text-white rounded-full">{feed.video.style}</span>}
            {feed?.video?.language && <span className="px-2 py-1 bg-zinc-500 text-white rounded-full">{feed.video.language}</span>}
            {feed?.video?.voiceCharacter && (
              <span className="px-2 py-1 bg-zinc-500 text-white rounded-full">{feed.video.voiceCharacter}</span>
            )}
          </div>
        </motion.div>

        {/* Right Side - Action Buttons */}
        <motion.div
          className="absolute right-4 bottom-40 flex flex-col gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Like Button */}
          <motion.button
            onClick={handleLike}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex flex-col items-center gap-1 group"
          >
            <motion.div
              animate={{ scale: isLiked ? 1.2 : 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className={`p-3 rounded-full transition-all ${isLiked ? "bg-[rgba(255,255,255,0.2)] dark:bg-accent/30 text-accent" : "  text-white group-hover:bg-white/20 dark:group-hover:bg-white/25 bg-[rgba(255,255,255,0.2)]"
                }`}
            >
              <Heart className="w-6 h-6" fill={isLiked ? "currentColor" : "none"} />
            </motion.div>
            <span className="text-xs text-white font-semibold">
              {likeCount > 999 ? `${(likeCount / 1000).toFixed(1)}k` : likeCount}
            </span>
          </motion.button>

          {/* Comment Button */}
          <motion.button
            onClick={() => setShowComments(!showComments)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex flex-col items-center gap-1 group"
          >
            <motion.div
              animate={{
                scale: showComments ? 1.1 : 1,
                backgroundColor: showComments ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)",
              }}
              className="p-3 rounded-full text-white group-hover:bg-white/20 dark:group-hover:bg-white/25 transition-all"
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
            <span className="text-xs text-white font-semibold">
              {feed?.comments.length > 999 ? `${(feed?.comments.length / 1000).toFixed(1)}k` : feed?.comments.length}
            </span>
          </motion.button>

          {/* Share Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              const shareText = `Check out "${feed?.video?.title || "this video"}" by @${feed?.user?.username}`
              navigator.clipboard.writeText(shareText)
              navigator.share
                ? navigator
                  .share({
                    title: feed?.video?.title || "Check out this video",
                    text: shareText,
                    url: window.location.href,
                  })
                  .catch(() => {
                    toast.success("Share link copied to clipboard!")
                  })
                : toast.success("Share link copied to clipboard!")
            }}
            className="flex flex-col items-center gap-1 group"
          >
            <motion.div className="p-3 rounded-full bg-[rgba(255,255,255,0.2)]  text-white group-hover:bg-white/20 dark:group-hover:bg-white/25 transition-all">
              <Share2 className="w-6 h-6" />
            </motion.div>
            <span className="text-xs text-white font-semibold">Share</span>
          </motion.button>


        </motion.div>

        {/* Bottom Navigation */}
        {/* <motion.div
          className="absolute bottom-0 left-0 right-0 h-20  flex items-center justify-between px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.button
            onClick={onPrev}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:block px-6 py-2 text-sm font-semibold text-white   rounded-full hover:bg-white/20 dark:hover:bg-white/25 transition-colors"
          >
            Previous
          </motion.button>
          <div className="text-black dark:text-white/80 text-xs" />
          <motion.button
            onClick={onNext}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:block px-6 py-2 text-sm font-semibold text-white bg-accent text-accent-foreground rounded-full hover:opacity-90 transition-opacity"
          >
            Next
          </motion.button>
        </motion.div> */}
      </div>

      {/* Comment Panel Sidebar */}
      {showComments && <CommentPanel feed={feed} onClose={() => setShowComments(false)} />}
    </>
  )
}
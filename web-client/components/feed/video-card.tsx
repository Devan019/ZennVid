"use client"

import { useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Heart, MessageCircle, Share2, Play, Pause } from "lucide-react"
import { CommentPanel } from "./comment"
import { User } from "@/context/UserProvider"

export interface IFeed {
  _id: string;
  video: {
    _id: string;
    videoUrl: string;
    type: string;
    title?: string;
    style?: string;
    language?: string;
    voiceCharacter?: string;
  };
  user: {
    _id: string;
    email: string;
    username: string;
  };
  likes: {
    _id: string;
    user: {
      _id: string;
      email: string;
    }
  }[];
  comments: {
    _id: string;
    user: {
      email: string;
      username: string;
    }
    content: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface VideoCardProps {
  feed: IFeed
  onNext: () => void
  onPrev: () => void
  currentUserEmail?: string
}

export function VideoCard({ feed, onNext, onPrev, currentUserEmail }: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [showComments, setShowComments] = useState(false)
  const [isLiked, setIsLiked] = useState(
    currentUserEmail ? feed?.likes?.some((like) => like?.user?.email === currentUserEmail) : false,
  )
  const [likeCount, setLikeCount] = useState(feed?.likes?.length)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
  }

  const videoDuration = "0:45"


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

  return (
    <>
      <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black/50 backdrop-blur-sm">
        {/* Video Container */}
        <div className="relative w-full h-full">
          <video
            src={feed?.video?.videoUrl}
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            loop
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />

          {/* Play Button Overlay */}
          <motion.button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ scale: isPlaying ? 0 : 1, opacity: isPlaying ? 0 : 1 }}
              className="bg-white/20 backdrop-blur-md p-4 rounded-full hover:bg-white/30 transition-colors"
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
          className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center text-white font-bold text-sm border-2 border-white/30">
              {feed?.user?.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-sm truncate">{feed?.user?.username}</h3>
              <p className="text-white/70 text-xs">{videoDuration}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-1.5 bg-accent text-accent-foreground rounded-full text-xs font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Follow
            </motion.button>
          </div>
        </motion.div>

        {/* Content - Title & Description */}
        <motion.div
          className="absolute bottom-24 left-0 right-0 p-4 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {feed?.video?.title && <h2 className="text-lg md:text-xl font-bold mb-2 text-pretty">{feed.video.title}</h2>}
          <div className="flex gap-2 flex-wrap text-xs text-white/70">
            {feed?.video?.style && <span className="px-2 py-1 bg-white/10 rounded-full">{feed.video.style}</span>}
            {feed?.video?.language && <span className="px-2 py-1 bg-white/10 rounded-full">{feed.video.language}</span>}
            {feed?.video?.voiceCharacter && (
              <span className="px-2 py-1 bg-white/10 rounded-full">{feed.video.voiceCharacter}</span>
            )}
          </div>
        </motion.div>

        {/* Right Side - Action Buttons */}
        <motion.div
          className="absolute right-4 bottom-20 flex flex-col gap-4"
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
              className={`p-3 rounded-full transition-all ${isLiked ? "bg-accent/20 text-accent" : "bg-white/10 text-white group-hover:bg-white/20"
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
              className="p-3 rounded-full text-white group-hover:bg-white/20 transition-all"
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
            }}
            className="flex flex-col items-center gap-1 group"
          >
            <motion.div className="p-3 rounded-full bg-white/10 text-white group-hover:bg-white/20 transition-all">
              <Share2 className="w-6 h-6" />
            </motion.div>
            <span className="text-xs text-white font-semibold">Share</span>
          </motion.button>


        </motion.div>

        {/* Bottom Navigation */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-between px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.button
            onClick={onPrev}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:block px-6 py-2 text-sm font-semibold text-white bg-white/10 rounded-full hover:bg-white/20 transition-colors"
          >
            Previous
          </motion.button>
          <div className="text-white/70 text-xs" />
          <motion.button
            onClick={onNext}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:block px-6 py-2 text-sm font-semibold text-white bg-accent text-accent-foreground rounded-full hover:opacity-90 transition-opacity"
          >
            Next
          </motion.button>
        </motion.div>
      </div>

      {/* Comment Panel Sidebar */}
      {showComments && <CommentPanel feed={feed} onClose={() => setShowComments(false)} />}
    </>
  )
}

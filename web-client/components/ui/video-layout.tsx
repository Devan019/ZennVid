"use client"
import { useState, useRef } from "react"
import type React from "react"

import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Download,
  Share2,
  Calendar,
  Mic,
  Globe,
  Palette,
  MoreVertical,
  Trash2,
  X,
} from "lucide-react"

export type VideoData = {
  _id: string
  user: string
  videoUrl: string
  type: string
  title: string
  style: string
  language: string
  voiceCharacter: string
  created_at: string
  thumbnail?: string
}

type VideoCard = {
  id: string
  content: VideoData
  className: string
  thumbnail: string
}

interface VideoLayoutGridProps {
  cards: VideoCard[]
  onDelete?: (id: string) => void
  onShare?: (video: VideoData) => void
  onDownload?: (video: VideoData) => void
}

export const VideoLayoutGrid = ({ cards, onDelete, onShare, onDownload }: VideoLayoutGridProps) => {
  const [selected, setSelected] = useState<VideoCard | null>(null)
  const [lastSelected, setLastSelected] = useState<VideoCard | null>(null)

  const handleClick = (card: VideoCard) => {
    setLastSelected(selected)
    setSelected(card)
  }

  const handleOutsideClick = () => {
    setLastSelected(selected)
    setSelected(null)
  }

  return (
    <div className="w-full min-h-screen p-6 md:p-10 ml-36">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Your Video Gallery</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {cards.length} video{cards.length !== 1 ? "s" : ""} in your collection
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {cards.map((card, i) => (
            <div key={card.id} className={cn(card.className, "")}>
              <motion.div
                onClick={() => handleClick(card)}
                className={cn(
                  "relative overflow-hidden cursor-pointer group",
                  selected?.id === card.id
                    ? "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-1/2 w-1/2 z-50 rounded-2xl"
                    : "rounded-xl aspect-video bg-gray-100 dark:bg-gray-800",
                )}
                layoutId={`card-${card.id}`}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {selected?.id === card.id ? (
                  <SelectedVideoCard
                    selected={selected}
                    onClose={handleOutsideClick}
                    onDelete={onDelete}
                    onShare={onShare}
                    onDownload={onDownload}
                  />
                ) : (
                  <VideoThumbnail card={card} onDelete={onDelete} onShare={onShare} onDownload={onDownload} />
                )}
              </motion.div>
            </div>
          ))}
        </div>

        {/* Backdrop */}
        <motion.div
          onClick={handleOutsideClick}
          className={cn(
            "fixed inset-0 bg-black/30 backdrop-blur-sm z-40 cursor-pointer",
            selected?.id ? "pointer-events-auto" : "pointer-events-none",
          )}
          animate={{ opacity: selected?.id ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />
      </div>
    </div>
  )
}

interface VideoThumbnailProps {
  card: VideoCard
  onDelete?: (id: string) => void
  onShare?: (video: VideoData) => void
  onDownload?: (video: VideoData) => void
}

const VideoThumbnail = ({ card, onDelete, onShare, onDownload }: VideoThumbnailProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {})
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    if (videoRef.current) {
      videoRef.current.pause()
    }
  }

  const handleMenuAction = (action: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setShowMenu(false)

    switch (action) {
      case "download":
        onDownload?.(card.content)
        break
      case "share":
        onShare?.(card.content)
        break
      case "delete":
        onDelete?.(card.content._id)
        break
    }
  }

  return (
    <div className="relative w-full h-full group" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <video ref={videoRef} className="w-full h-full object-cover" muted loop playsInline poster={card.thumbnail}>
        <source src={card.content.videoUrl} type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Menu Button */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu(!showMenu)
            }}
            className="bg-black/20 backdrop-blur-sm rounded-full p-2 hover:bg-black/40 transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-white" />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 min-w-[150px] z-10"
            >
              <button
                onClick={(e) => handleMenuAction("download", e)}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={(e) => handleMenuAction("share", e)}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button
                onClick={(e) => handleMenuAction("delete", e)}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
          <Play className="w-8 h-8 text-white fill-white" />
        </div>
      </div>

      {/* Video info */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-white font-semibold text-lg mb-1 line-clamp-2">{card.content.title}</h3>
        <div className="flex items-center gap-4 text-sm text-white/80">
          <span className="capitalize">{card.content.style}</span>
          <span>•</span>
          <span>{new Date(card.content.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  )
}

interface SelectedVideoCardProps {
  selected: VideoCard
  onClose: () => void
  onDelete?: (id: string) => void
  onShare?: (video: VideoData) => void
  onDownload?: (video: VideoData) => void
}

const SelectedVideoCard = ({ selected, onClose, onDelete, onShare, onDownload }: SelectedVideoCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleVideoClick = () => {
    togglePlay()
  }

  const handleDownload = () => {
    onDownload?.(selected.content)
  }

  const handleShare = () => {
    onShare?.(selected.content)
  }

  return (
    <div className="relative w-full h-full bg-black rounded-2xl overflow-hidden">
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        onClick={handleVideoClick}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        controls={false}
      >
        <source src={selected.content.videoUrl} type="video/mp4" />
      </video>

      {/* Close button */}
      {/* <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-2 hover:bg-black/70 transition-colors z-20 hover:cursor-pointer"
      >
        <X className="w-5 h-5 text-white" />
      </button> */}

      {/* Custom Controls */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-between p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: showControls ? 1 : 0 }}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Top bar */}
        <div className="flex justify-between items-start">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3 max-w-md">
            <h2 className="text-white text-xl font-bold mb-2">{selected.content.title}</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-white/80">
                <Palette className="w-4 h-4" />
                <span className="capitalize">{selected.content.style}</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Globe className="w-4 h-4" />
                <span className="capitalize">{selected.content.language}</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Mic className="w-4 h-4" />
                <span>{selected.content.voiceCharacter}</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Calendar className="w-4 h-4" />
                <span>{new Date(selected.content.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center play button */}
        {!isPlaying && (
          <div className="flex items-center justify-center">
            <button
              onClick={togglePlay}
              className="bg-white/20 backdrop-blur-sm rounded-full p-6 hover:bg-white/30 transition-colors"
            >
              <Play className="w-12 h-12 text-white fill-white" />
            </button>
          </div>
        )}

        {/* Bottom controls */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="bg-black/50 backdrop-blur-sm rounded-lg p-3 hover:bg-black/70 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white fill-white" />
              )}
            </button>

            <button
              onClick={toggleMute}
              className="bg-black/50 backdrop-blur-sm rounded-lg p-3 hover:bg-black/70 transition-colors"
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleDownload}
              className="bg-black/50 backdrop-blur-sm rounded-lg p-3 hover:bg-black/70 transition-colors"
            >
              <Download className="w-5 h-5 text-white" />
            </button>

            <button
              onClick={handleShare}
              className="bg-black/50 backdrop-blur-sm rounded-lg p-3 hover:bg-black/70 transition-colors"
            >
              <Share2 className="w-5 h-5 text-white" />
            </button>

            <button
              onClick={() => videoRef.current?.requestFullscreen()}
              className="bg-black/50 backdrop-blur-sm rounded-lg p-3 hover:bg-black/70 transition-colors"
            >
              <Maximize className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

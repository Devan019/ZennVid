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
  Trash,
  Upload,
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
  deletingIds?: string[]
}

import Loader from "@/components/common/Loader"

export const VideoLayoutGrid = ({ cards, onDelete, onShare, onDownload, deletingIds }: VideoLayoutGridProps) => {
  const [selected, setSelected] = useState<VideoCard | null>(null)
  const [, setLastSelected] = useState<VideoCard | null>(null)

  const handleClick = (card: VideoCard) => {
    setLastSelected(selected)
    setSelected(card)
  }

  const handleOutsideClick = () => {
    setLastSelected(selected)
    setSelected(null)
  }

  const handleVideoDelete = (id: string) => {
    setSelected(null)
    onDelete?.(id)
  }

  return (
    <div className="w-full min-h-screen p-6 md:p-10 ml-36">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900  mb-2">Your Video Gallery</h1>
          <p className="text-gray-600 ">
            {cards.length} video{cards.length !== 1 ? "s" : ""} in your collection
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {cards.map((card) => (
            <div key={card.id} className={cn(card.className, "")}>
              <motion.div
                onClick={() => handleClick(card)}
                className={cn(
                  "relative overflow-hidden cursor-pointer group",
                  selected?.id === card.id
                    ? "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-1/2 w-1/2 z-50 rounded-2xl"
                    : "rounded-xl aspect-video bg-gray-100 ",
                )}
                layoutId={`card-${card.id}`}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {selected?.id === card.id ? (
                  <SelectedVideoCard
                    selected={selected}
                    onClose={handleOutsideClick}
                    onDelete={handleVideoDelete}
                    onShare={onShare}
                    onDownload={onDownload}
                    deletingIds={deletingIds}
                  />
                ) : (
                  <VideoThumbnail card={card} onDelete={handleVideoDelete} onShare={onShare} onDownload={onDownload} deletingIds={deletingIds} />
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
  deletingIds?: string[]
}

const VideoThumbnail = ({ card, onDelete, onShare, onDownload, deletingIds }: VideoThumbnailProps) => {
  const [, setIsHovered] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => { })
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
        onDelete?.(card.id)
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
      <div
        className="
    absolute
    top-3
    right-3
    z-[9999]
    opacity-0
    transition-opacity
    group-hover:opacity-100
  "
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <div className="relative z-[9999]">
          <button
            onClick={(e) => {
              e.stopPropagation();

              setShowMenu(
                !showMenu
              );
            }}
            className="
        z-[9999]
        rounded-full
        bg-black/20
        p-2
        backdrop-blur-sm
        transition-colors
        hover:cursor-pointer
        hover:bg-black/40
      "
          >
            <MoreVertical className="h-4 w-4 text-white" />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
                y: -4,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              transition={{
                duration: 0.18,
              }}
              onClick={(e) =>
                e.stopPropagation()
              }
              className="
          absolute
          right-0
          top-full
          z-[99999]
          mt-2
          min-w-[190px]
          overflow-hidden
          rounded-2xl
          border
          border-black/10
          bg-white/95
          py-2
          shadow-2xl
          backdrop-blur-xl
        "
            >
              <button
                onClick={(e) =>
                  handleMenuAction(
                    "download",
                    e
                  )
                }
                className="
            flex
            w-full
            items-center
            gap-3
            px-4
            py-3
            text-left
            text-sm
            text-black
            transition-colors
            hover:bg-black/5
          "
              >
                <Download className="h-4 w-4" />
                Download Video
              </button>

              <button
                onClick={(e) =>
                  handleMenuAction(
                    "share",
                    e
                  )
                }
                className="
            flex
            w-full
            items-center
            gap-3
            px-4
            py-3
            text-left
            text-sm
            text-black
            transition-colors
            hover:bg-black/5
          "
              >
                <Upload className="h-4 w-4" />
                Upload to Feed
              </button>

              {(() => {
                const isDeleting =
                  deletingIds?.includes(
                    card.id
                  ) ||
                  deletingIds?.includes(
                    card.content
                      ._id as unknown as string
                  );

                if (isDeleting) {
                  return (
                    <div
                      className="
                  flex
                  w-full
                  items-center
                  gap-3
                  px-4
                  py-3
                  text-sm
                  text-gray-500
                "
                    >
                      <Loader size={18} />
                      Deleting...
                    </div>
                  );
                }

                return (
                  <button
                    onClick={(e) =>
                      handleMenuAction(
                        "delete",
                        e
                      )
                    }
                    className="
                flex
                w-full
                items-center
                gap-3
                px-4
                py-3
                text-left
                text-sm
                text-red-500
                transition-colors
                hover:bg-red-50
              "
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Video
                  </button>
                );
              })()}
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
  deletingIds?: string[]
}

const SelectedVideoCard = ({ selected, onDelete, onShare, onDownload, deletingIds }: SelectedVideoCardProps) => {
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

  const handleDelete = () => {
    onDelete?.(selected.id)
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

      {/* Close / Delete button */}
      <div className="absolute top-4 right-4 z-20">
        {(() => {
          const isDeleting = deletingIds?.includes(selected.id) || deletingIds?.includes(selected.content._id as unknown as string)
          if (isDeleting) {
            return (
              <div className="bg-black/50 backdrop-blur-sm rounded-full p-2">
                <Loader size={20} />
              </div>
            )
          }

          return (
            <button
              onClick={handleDelete}
              className="bg-black/50 backdrop-blur-sm rounded-full p-2 hover:bg-black/70 transition-colors z-20 hover:cursor-pointer"
            >
              <Trash className="w-5 h-5 text-red-500" />
            </button>
          )
        })()}
      </div>

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
              <Upload className="w-5 h-5 text-white" />
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

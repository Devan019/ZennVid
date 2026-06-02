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
  Calendar,
  Mic,
  Globe,
  Palette,
  MoreVertical,
  Trash2,
  Trash,
  Upload,
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
    <div className="w-full min-h-screen ">
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
                  "relative overflow-hidden cursor-pointer group transition-all duration-300",

                  selected?.id === card.id
                    ? `
      fixed left-1/2 top-1/2 z-50
      w-[90vw] max-w-5xl
      aspect-video
      -translate-x-1/2 -translate-y-1/2
      rounded-[32px]
      overflow-hidden
      shadow-2xl
    `
                    : selected
                      ? "rounded-xl aspect-video bg-gray-100 scale-90 opacity-40 blur-[1px]"
                      : "rounded-xl aspect-video bg-gray-100 hover:scale-[1.02]"
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

const SelectedVideoCard = ({
  selected,
  onDelete,
  onShare,
  onDownload,
  deletingIds,
  onClose,
}: SelectedVideoCardProps & {
  onClose: () => void
}) => {
  const [isPlaying, setIsPlaying] =
    useState(false)

  const [isMuted, setIsMuted] =
    useState(false)

  const [showControls, setShowControls] =
    useState(true)

  const videoRef =
    useRef<HTMLVideoElement>(null)

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

  const isDeleting =
    deletingIds?.includes(selected.id) ||
    deletingIds?.includes(
      selected.content._id as unknown as string
    )

  return (
    <div onClick={(e) => e.stopPropagation()} className="relative h-full w-full overflow-hidden rounded-[32px] bg-black">
      {/* VIDEO */}
      <video
        ref={videoRef}
        className="h-full w-full object-contain"
        onClick={handleVideoClick}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        controls={false}
      >
        <source
          src={selected.content.videoUrl}
          type="video/mp4"
        />
      </video>

      {/* OVERLAY */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-between p-6"
        initial={{ opacity: 0 }}
        animate={{
          opacity: showControls ? 1 : 0,
        }}
        onMouseEnter={() =>
          setShowControls(true)
        }
        onMouseLeave={() =>
          setShowControls(false)
        }
      >
        {/* TOP */}
        <div className="flex items-start justify-between">
          {/* INFO */}
          <div className="max-w-md rounded-2xl bg-black/40 p-4 backdrop-blur-xl">
            <h2 className="mb-3 text-2xl font-bold text-white">
              {selected.content.title}
            </h2>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-white/80">
                <Palette className="h-4 w-4" />

                <span className="capitalize">
                  {selected.content.style}
                </span>
              </div>

              <div className="flex items-center gap-2 text-white/80">
                <Globe className="h-4 w-4" />

                <span className="capitalize">
                  {selected.content.language}
                </span>
              </div>

              <div className="flex items-center gap-2 text-white/80">
                <Mic className="h-4 w-4" />

                <span>
                  {
                    selected.content
                      .voiceCharacter
                  }
                </span>
              </div>

              <div className="flex items-center gap-2 text-white/80">
                <Calendar className="h-4 w-4" />

                <span>
                  {new Date(
                    selected.content.created_at
                  ).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* CLOSE BUTTON */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
            className="
            z-[9999]
              flex h-12 w-12 items-center justify-center
              rounded-full bg-black/50 backdrop-blur-xl
              transition-all hover:scale-105 hover:bg-black/70
            "
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* CENTER PLAY */}
        {!isPlaying && (
          <div className="flex items-center justify-center">
            <button
              onClick={togglePlay}
              className="
                rounded-full bg-white/20 p-7
                backdrop-blur-xl transition-all
                hover:scale-105 hover:bg-white/30
              "
            >
              <Play className="h-14 w-14 fill-white text-white" />
            </button>
          </div>
        )}

        {/* BOTTOM */}
        <div className="flex items-end justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-3">
            {/* DELETE */}
            {isDeleting ? (
              <div className="rounded-xl bg-red-500/20 p-3 backdrop-blur-xl">
                <Loader size={20} />
              </div>
            ) : (
              <button
                onClick={handleDelete}
                className="
                  rounded-xl bg-red-500/20 p-3
                  backdrop-blur-xl transition-all
                  hover:bg-red-500/30
                "
              >
                <Trash className="h-5 w-5 text-red-400" />
              </button>
            )}

            {/* PLAY */}
            <button
              onClick={togglePlay}
              className="
                rounded-xl bg-black/50 p-3
                backdrop-blur-xl transition-all
                hover:bg-black/70
              "
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 text-white" />
              ) : (
                <Play className="h-5 w-5 fill-white text-white" />
              )}
            </button>

            {/* MUTE */}
            <button
              onClick={toggleMute}
              className="
                rounded-xl bg-black/50 p-3
                backdrop-blur-xl transition-all
                hover:bg-black/70
              "
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5 text-white" />
              ) : (
                <Volume2 className="h-5 w-5 text-white" />
              )}
            </button>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="
                rounded-xl bg-black/50 p-3
                backdrop-blur-xl transition-all
                hover:bg-black/70
              "
            >
              <Download className="h-5 w-5 text-white" />
            </button>

            <button
              onClick={handleShare}
              className="
                rounded-xl bg-black/50 p-3
                backdrop-blur-xl transition-all
                hover:bg-black/70
              "
            >
              <Upload className="h-5 w-5 text-white" />
            </button>

            <button
              onClick={() =>
                videoRef.current?.requestFullscreen()
              }
              className="
                rounded-xl bg-black/50 p-3
                backdrop-blur-xl transition-all
                hover:bg-black/70
              "
            >
              <Maximize className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

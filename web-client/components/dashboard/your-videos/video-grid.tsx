"use client"
import type React from "react"
import { useState, useRef } from "react"
import { motion } from "motion/react"
import { Play, Pause, Volume2, VolumeX, MoreVertical, Download, Share2, Trash2 } from "lucide-react"
import { VideoData } from "@/components/ui/video-layout"

interface VideoCardProps {
  video: VideoData
  onDelete?: (id: string) => void
  onShare?: (video: VideoData) => void
  onDownload?: (video: VideoData) => void
}

export const VideoCard = ({ video, onDelete, onShare, onDownload }: VideoCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [showMenu, setShowMenu] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleMenuAction = (action: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setShowMenu(false)

    switch (action) {
      case "download":
        onDownload?.(video)
        break
      case "share":
        onShare?.(video)
        break
      case "delete":
        onDelete?.(video._id)
        break
    }
  }

  return (
    <motion.div
      className="relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {/* Video Container */}
      <div className="relative aspect-video bg-gray-100 dark:bg-gray-700 overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted={isMuted}
          loop
          playsInline
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source src={video.videoUrl} type="video/mp4" />
        </video>

        {/* Video Controls Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white fill-white" />
              )}
            </button>

            <button
              onClick={toggleMute}
              className="bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-colors"
            >
              {isMuted ? <VolumeX className="w-6 h-6 text-white" /> : <Volume2 className="w-6 h-6 text-white" />}
            </button>
          </div>
        </div>

        {/* Menu Button */}
        <div className="absolute top-3 right-3">
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
      </div>

      {/* Video Info */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2">{video.title}</h3>

        <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <span className="font-medium">Style:</span>
            <span className="ml-1 capitalize">{video.style}</span>
          </div>
          <div>
            <span className="font-medium">Language:</span>
            <span className="ml-1 capitalize">{video.language}</span>
          </div>
          <div className="col-span-2">
            <span className="font-medium">Voice:</span>
            <span className="ml-1">{video.voiceCharacter}</span>
          </div>
          <div className="col-span-2">
            <span className="font-medium">Created:</span>
            <span className="ml-1">{new Date(video.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

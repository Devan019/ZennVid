"use client";

import type React from "react";
import { useState, useRef } from "react";
import { motion } from "motion/react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  MoreVertical,
  Download,
  Trash2,
  Upload
} from "lucide-react";
import { VideoData } from "@/components/ui/video-layout";

interface VideoCardProps {
  video: VideoData;

  onDelete?: (id: string) => void;

  onUpload?: (
    video: VideoData
  ) => void;

  onDownload?: (
    video: VideoData
  ) => void;
}

export const VideoCard = ({
  video,
  onDelete,
  onUpload,
  onDownload,
}: VideoCardProps) => {
  const [isPlaying, setIsPlaying] =
    useState(false);

  const [isMuted, setIsMuted] =
    useState(true);

  const [showMenu, setShowMenu] =
    useState(false);

  const videoRef =
    useRef<HTMLVideoElement>(null);

  const togglePlay = (
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }

      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    if (videoRef.current) {
      videoRef.current.muted =
        !isMuted;

      setIsMuted(!isMuted);
    }
  };

  const handleMenuAction = (
    action: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    setShowMenu(false);

    switch (action) {
      case "download":
        onDownload?.(video);
        break;

      case "upload":
        onUpload?.(video);
        break;

      case "delete":
        onDelete?.(video._id);
        break;
    }
  };

  return (
    <motion.div
      whileHover={{
        y: -4,
      }}
      transition={{
        duration: 0.25,
      }}
      className="
        group
        relative
        overflow-hidden
        rounded-[28px]
        border
        border-black/10
        bg-white/70
        shadow-none
        backdrop-blur-xl
      "
    >
      {/* VIDEO */}
      <div
        className="
          relative
          aspect-video
          overflow-hidden
          bg-black
        "
      >
        <video
          ref={videoRef}
          className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-700
            group-hover:scale-[1.03]
          "
          muted={isMuted}
          loop
          playsInline
          onPlay={() =>
            setIsPlaying(true)
          }
          onPause={() =>
            setIsPlaying(false)
          }
        >
          <source
            src={video.videoUrl}
            type="video/mp4"
          />
        </video>

        {/* OVERLAY */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/70
            via-black/10
            to-transparent
          "
        />

        {/* CONTROLS */}
        <div
          className="
            absolute
            inset-0
            flex
            items-center
            justify-center
            opacity-0
            transition-all
            duration-300
            group-hover:opacity-100
          "
        >
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-full
                border
                border-white/10
                bg-white/10
                backdrop-blur-xl
                transition-all
                hover:scale-105
              "
            >
              {isPlaying ? (
                <Pause className="h-6 w-6 text-white" />
              ) : (
                <Play className="h-6 w-6 fill-white text-white" />
              )}
            </button>

            <button
              onClick={toggleMute}
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-full
                border
                border-white/10
                bg-white/10
                backdrop-blur-xl
              "
            >
              {isMuted ? (
                <VolumeX className="h-6 w-6 text-white" />
              ) : (
                <Volume2 className="h-6 w-6 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* MENU */}
        <div className="absolute right-4 top-4 z-40">
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();

                setShowMenu(
                  !showMenu
                );
              }}
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                border
                border-white/10
                bg-black/30
                backdrop-blur-xl
              "
            >
              <MoreVertical className="h-4 w-4 text-white" />
            </button>

            {showMenu && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 8,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                className="
                  absolute
                  right-0
                  top-full
                  mt-3
                  w-[210px]
                  overflow-hidden
                  rounded-2xl
                  border
                  border-black/10
                  bg-white
                  py-2
                  shadow-2xl
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
                      "upload",
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
                    text-sm
                    text-black
                    transition-colors
                    hover:bg-black/5
                  "
                >
                  <Upload className="h-4 w-4" />
                  Upload to Feed
                </button>

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
                    text-sm
                    text-red-500
                    transition-colors
                    hover:bg-red-50
                  "
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Video
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* VIDEO TYPE */}
        <div
          className="
            absolute
            left-4
            top-4
            rounded-full
            border
            border-white/10
            bg-white/10
            px-3
            py-2
            text-[11px]
            uppercase
            tracking-[0.18em]
            text-white
            backdrop-blur-xl
          "
        >
          {video.type
            ?.replaceAll("_", " ")
            ?.replaceAll(
              "video",
              ""
            )}
        </div>

      </div>

      {/* CONTENT */}
      <div className="space-y-5 p-6">
        <div>
          <div
            className="
              mb-3
              text-[11px]
              uppercase
              tracking-[0.3em]
              text-black/40
            "
          >
            Cinematic Asset
          </div>

          <h3
            className="
              line-clamp-2
              text-2xl
              font-semibold
              leading-tight
              text-black
            "
          >
            {video.title}
          </h3>
        </div>

        {/* META */}
        <div
          className="
            grid
            grid-cols-2
            gap-4
            rounded-2xl
            border
            border-black/10
            bg-[#F8F6F1]
            p-4
          "
        >
          <div>
            <p className="text-[11px] uppercase tracking-[0.15em] text-black/40">
              Style
            </p>

            <p className="mt-1 text-sm font-medium capitalize text-black">
              {video.style}
            </p>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.15em] text-black/40">
              Language
            </p>

            <p className="mt-1 text-sm font-medium capitalize text-black">
              {video.language}
            </p>
          </div>

          <div className="col-span-2">
            <p className="text-[11px] uppercase tracking-[0.15em] text-black/40">
              Voice
            </p>

            <p className="mt-1 text-sm font-medium text-black">
              {video.voiceCharacter}
            </p>
          </div>
        </div>



        {/* FOOTER */}
        <div
          className="
            flex
            items-center
            justify-between
            border-t
            border-black/10
            pt-4
          "
        >
          <div>
            <p className="text-[11px] uppercase tracking-[0.15em] text-black/40">
              Created
            </p>

            <p className="mt-1 text-sm font-medium text-black">
              {new Date(
                video.created_at
              ).toLocaleDateString()}
            </p>
          </div>

          <button
            onClick={(e) =>
              handleMenuAction(
                "upload",
                e
              )
            }
            className="
              flex
              items-center
              gap-2
              rounded-full
              bg-black
              px-5
              py-3
              text-[11px]
              uppercase
              tracking-[0.18em]
              text-white
              transition-all
              hover:opacity-90
            "
          >
            <Upload className="h-4 w-4" />
            Upload
          </button>
        </div>
      </div>
    </motion.div>
  );
};

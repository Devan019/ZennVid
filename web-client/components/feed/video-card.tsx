"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { AnimatePresence, motion } from "framer-motion";

import {
  Heart,
  MessageCircle,
  Share2,
  Play,
  Pause,
} from "lucide-react";

import { CommentPanel } from "./comment";

import { useUser } from "@/context/UserProvider";

import { useMutation } from "@tanstack/react-query";

import { feedLikeCountUpdate } from "@/lib/apiProvider";

import { ResponseData } from "@/constants/response";

import { toast } from "sonner";

import { getTimeSince } from "@/lib/calculateTime";

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
    };

    content: string;
    createdAt: string;
    updatedAt: string;
  }[];

  createdAt: string;
  updatedAt: string;
}

interface VideoCardProps {
  feed: IFeed;
  onNext: () => void;
  onPrev: () => void;
}

export function VideoCard({
  feed,
}: VideoCardProps) {
  const [isPlaying, setIsPlaying] =
    useState(true);

  const [
    showComments,
    setShowComments,
  ] = useState(false);

  const [duration, setDuration] =
    useState("0:00");

  const { user } = useUser();

  const [isLiked, setIsLiked] =
    useState(
      feed?.likes?.some(
        (like) =>
          like?.user === user?._id
      ) || false
    );

  const [likeCount, setLikeCount] =
    useState(
      feed?.likes?.length
    );

  const [
    timeSincePosted,
    setTimeSincePosted,
  ] = useState("");

  useEffect(() => {
    setTimeSincePosted(
      getTimeSince(
        new Date(feed.createdAt)
      )
    );
  }, []);

  const likeMutation = useMutation({
    mutationKey: ["likeVideo"],

    mutationFn: async () => {
      return await feedLikeCountUpdate(
        {
          feedId: feed._id,

          userId:
            user?._id || "",
        }
      );
    },

    onSuccess: (
      data: ResponseData
    ) => {
      if (data.SUCCESS) {
        setLikeCount(
          data.DATA.likeCount
        );

        setIsLiked(
          data.DATA.isLiked
        );

        toast.success(
          data.MESSAGE
        );
      } else {
        toast.error(
          data.MESSAGE
        );
      }
    },

    onError: () => {
      toast.error(
        "An error occurred while updating like status."
      );
    },
  });

  const handleLike = () => {
    likeMutation.mutate();
  };

  const videoRef =
    useRef<HTMLVideoElement | null>(
      null
    );

  const togglePlay = () => {
    if (!videoRef.current)
      return;

    if (isPlaying) {
      videoRef.current.pause();

      setIsPlaying(false);
    } else {
      videoRef.current.play();

      setIsPlaying(true);
    }
  };

  const onLoadVideo = () => {
    if (videoRef.current) {
      const totalSeconds =
        Math.floor(
          videoRef.current.duration
        );

      const minutes =
        Math.floor(
          totalSeconds / 60
        );

      const seconds =
        totalSeconds % 60;

      setDuration(
        `${minutes}:${seconds < 10
          ? "0"
          : ""
        }${seconds}`
      );
    }
  };

  return (
    <>
      <div
        className="
          relative
          mx-auto
          flex
          h-full
          w-full
          items-center
          justify-center
          gap-5

          lg:gap-8
        "
      >
        {/* VIDEO CARD */}
        <div
          className="
            relative
            h-full
            w-full
            overflow-hidden
            rounded-[32px]
            border
            border-black/10
            bg-black
            shadow-[0_30px_120px_rgba(0,0,0,0.25)]

            md:max-w-[620px]
          "
        >
          {/* VIDEO */}
          <div
            className={`
              relative
              h-full
              w-full

              ${feed.video.type ===
                "magic_video"
                ? "scale-[1.08]"
                : ""
              }
            `}
          >
            <video
              src={
                feed?.video
                  ?.videoUrl
              }
              ref={videoRef}
              className="
                h-full
                w-full
                object-cover
              "
              autoPlay
              loop
              playsInline
              onPlay={() =>
                setIsPlaying(
                  true
                )
              }
              onPause={() =>
                setIsPlaying(
                  false
                )
              }
              onLoadedMetadata={
                onLoadVideo
              }
            />

            {/* OVERLAY */}
            <div
              className="
                absolute
                inset-0
                bg-gradient-to-b
                from-black/40
                via-transparent
                to-black/70
              "
            />

            {/* PLAY BTN */}
            <motion.button
              onClick={
                togglePlay
              }
              className="
                absolute
                inset-0
                flex
                items-center
                justify-center
              "
            >
              <motion.div
                animate={{
                  scale:
                    isPlaying
                      ? 0
                      : 1,

                  opacity:
                    isPlaying
                      ? 0
                      : 1,
                }}
                className="
                  rounded-full
                  border
                  border-white/20
                  bg-white/10
                  p-5
                  text-white
                  backdrop-blur-xl
                "
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8" />
                ) : (
                  <Play className="h-8 w-8 fill-white" />
                )}
              </motion.div>
            </motion.button>

            {/* TOP */}
            <div
              className="
                absolute
                left-0
                right-0
                top-0
                flex
                items-start
                justify-between
                p-5
              "
            >
              {/* USER */}
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/20
                    bg-white/10
                    text-sm
                    font-semibold
                    uppercase
                    text-white
                    backdrop-blur-xl
                  "
                >
                  {feed?.user?.username
                    ?.charAt(0)
                    ?.toUpperCase() ||
                    "U"}
                </div>

                <div>
                  <h3
                    className="
                      text-sm
                      font-semibold
                      text-white
                    "
                  >
                    {
                      feed?.user
                        ?.username
                    }
                  </h3>

                  <p
                    className="
                      text-xs
                      text-white/70
                    "
                  >
                    {duration}
                  </p>
                </div>
              </div>

              {/* TIME */}
              <div
                className="
                  rounded-full
                  border
                  border-white/15
                  bg-white/10
                  px-3
                  py-1.5
                  text-[11px]
                  text-white/80
                  backdrop-blur-xl
                "
              >
                {
                  timeSincePosted
                }
              </div>
            </div>

            {/* BOTTOM */}
            <div
              className="
                absolute
                bottom-0
                left-0
                right-0
                p-5
              "
            >
              {feed?.video
                ?.title && (
                  <h2
                    className="
                    max-w-[90%]
                    text-xl
                    font-bold
                    leading-tight
                    text-white

                    md:text-2xl
                  "
                  >
                    {
                      feed.video
                        .title
                    }
                  </h2>
                )}

              <div
                className="
                  mt-4
                  flex
                  flex-wrap
                  gap-2
                "
              >
                {feed?.video
                  ?.style && (
                    <span
                      className="
                      rounded-full
                      border
                      border-white/10
                      bg-white/10
                      px-3
                      py-1
                      text-xs
                      text-white
                      backdrop-blur-xl
                    "
                    >
                      {
                        feed.video
                          .style
                      }
                    </span>
                  )}

                {feed?.video
                  ?.language && (
                    <span
                      className="
                      rounded-full
                      border
                      border-white/10
                      bg-white/10
                      px-3
                      py-1
                      text-xs
                      text-white
                      backdrop-blur-xl
                    "
                    >
                      {
                        feed.video
                          .language
                      }
                    </span>
                  )}

                {feed?.video
                  ?.voiceCharacter && (
                    <span
                      className="
                      rounded-full
                      border
                      border-white/10
                      bg-white/10
                      px-3
                      py-1
                      text-xs
                      text-white
                      backdrop-blur-xl
                    "
                    >
                      {
                        feed.video
                          .voiceCharacter
                      }
                    </span>
                  )}
              </div>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div
          className="
    absolute
    bottom-24
    right-4
    z-20
    flex
    flex-col
    gap-5

    md:relative
    md:bottom-auto
    md:right-auto
    md:z-20
  "
        >
          {/* LIKE */}
          <motion.button
            onClick={
              handleLike
            }
            whileHover={{
              scale: 1.08,
            }}
            whileTap={{
              scale: 0.95,
            }}
            className="
              flex
              flex-col
              items-center
              gap-2
            "
          >
            <div
              className={`
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                border
                backdrop-blur-xl
                transition-all

                ${isLiked
                  ? `
                      border-red-500/20
                      bg-red-500
                      text-white
                    `
                  : `
                      border-black/10
                      bg-white/70
                      text-black
                    `
                }
              `}
            >
              <Heart
                className="h-6 w-6"
                fill={
                  isLiked
                    ? "currentColor"
                    : "none"
                }
              />
            </div>

            <span
              className="
                text-xs
                font-semibold
                text-black
              "
            >
              {likeCount >
                999
                ? `${(
                  likeCount /
                  1000
                ).toFixed(
                  1
                )}k`
                : likeCount}
            </span>
          </motion.button>

          {/* COMMENT */}
          <motion.button
            onClick={() =>
              setShowComments(
                !showComments
              )
            }
            whileHover={{
              scale: 1.08,
            }}
            whileTap={{
              scale: 0.95,
            }}
            className="
              flex
              flex-col
              items-center
              gap-2
            "
          >
            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                border
                border-black/10
                bg-white/70
                text-black
                backdrop-blur-xl
              "
            >
              <MessageCircle className="h-6 w-6" />
            </div>

            <span
              className="
                text-xs
                font-semibold
                text-black
              "
            >
              {feed?.comments
                .length >
                999
                ? `${(
                  feed
                    ?.comments
                    .length /
                  1000
                ).toFixed(
                  1
                )}k`
                : feed
                  ?.comments
                  .length}
            </span>
          </motion.button>

          {/* SHARE */}
          <motion.button
            whileHover={{
              scale: 1.08,
            }}
            whileTap={{
              scale: 0.95,
            }}
            onClick={() => {
              const shareText = `Check out "${feed?.video
                ?.title ||
                "this video"
                }" by @${feed?.user
                  ?.username
                }`;

              navigator.clipboard.writeText(
                shareText
              );

              navigator.share
                ? navigator
                  .share({
                    title:
                      feed
                        ?.video
                        ?.title ||
                      "Check out this video",

                    text: shareText,

                    url: window.location.href,
                  })
                  .catch(
                    () => {
                      toast.success(
                        "Share link copied!"
                      );
                    }
                  )
                : toast.success(
                  "Share link copied!"
                );
            }}
            className="
              flex
              flex-col
              items-center
              gap-2
            "
          >
            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                border
                border-black/10
                bg-white/70
                text-black
                backdrop-blur-xl
              "
            >
              <Share2 className="h-6 w-6" />
            </div>

            <span
              className="
                text-xs
                font-semibold
                text-black
              "
            >
              Share
            </span>
          </motion.button>
        </div>
      </div>

      {/* COMMENTS */}
      <AnimatePresence mode="wait">
        {showComments && (
          <CommentPanel
            feed={feed}
            onClose={() =>
              setShowComments(false)
            }
          />
        )}
      </AnimatePresence>
    </>
  );
}
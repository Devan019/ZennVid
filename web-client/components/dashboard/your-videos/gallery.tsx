/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import {
  useEffect,
  useState,
  useRef,
} from "react";

import {
  VideoIcon,
  Search,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

import {
  VideoData,
  VideoLayoutGrid,
} from "@/components/ui/video-layout";

import { useUser } from "@/context/UserProvider";

import {
  deleteVideo,
  feedCreate,
  getUserVideos,
} from "@/lib/apiProvider";

import {
  useMutation,
  useQuery,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { Input } from "@/components/ui/input";

import { FaSignsPost } from "react-icons/fa6";

import Modal from "@/components/common/Modal";

import { getCloudinaryUrl } from "@/lib/getPublicUrl";

import VideoPreviewDialog from "@/components/dashboard/magic-video/downloadVideo";

import { ProgressVideoCard } from "./progress-video-card";

import { jobStatus } from "@/constants/backend_routes";

import Loader from "@/components/common/Loader";

interface ApiVideo {
  _id: string;
  user: string;
  type: string;
  title: string;
  style?: string;
  language?: string;
  voiceCharacter?: string;
  createdAt?: string;
  created_at?: string;
  thumbnail?: string;
  videoUrl?: string;

  videoMetadata?: {
    publicId: string;
    resourceType: string;
    format: string;
  };
}

interface ProgressVideo {
  jobId: string;
  stage: string;
  progress: number;
  status: string;
}

interface VideoResponse {
  MESSAGE?: string;
  SUCCESS?: boolean;
  ERROR?: unknown;

  DATA?: {
    videos?: ApiVideo[];
    progressVideos?: ProgressVideo[];
  };
}

const getGridClassName = () => {
  return "col-span-1";
};

const VideoGallery = () => {
  interface VideoCardType {
    id: string;
    content: VideoData;
    className: string;
    thumbnail: string;
  }

  const [videoCards, setVideoCards] =
    useState<VideoCardType[]>([]);

  const [allVideos, setAllVideos] =
    useState<VideoCardType[]>([]);

  const [
    progressVideos,
    setProgressVideos,
  ] = useState<
    Map<string, ProgressVideo>
  >(new Map());

  const [query, setQuery] =
    useState("");

  const [filterType, setFilterType] =
    useState("all");

  const [
    debouncedQuery,
    setDebouncedQuery,
  ] = useState("");

  const [activeVideo, setActiveVideo] =
    useState<VideoData | null>(null);

  const [isOpen, setisOpen] =
    useState(false);

  const [
    completedVideoUrl,
    setCompletedVideoUrl,
  ] = useState("");

  const [
    showCompletionDialog,
    setShowCompletionDialog,
  ] = useState(false);

  const [deletingIds, setDeletingIds] =
    useState<string[]>([]);

  const [
    connectingJobIds,
    setConnectingJobIds,
  ] = useState<string[]>([]);

  const sseConnectionsRef = useRef(
    new Map<string, EventSource>()
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 400);

    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    const filtered =
      allVideos.filter((vid) => {
        const video = vid.content;

        const matchesSearch =
          video.title
            .toLowerCase()
            .includes(
              debouncedQuery.toLowerCase()
            );

        const matchesType =
          filterType === "all"
            ? true
            : video.type === filterType;

        return (
          matchesSearch &&
          matchesType
        );
      });

    setVideoCards(filtered);
  }, [
    debouncedQuery,
    filterType,
    allVideos,
  ]);

  const { user, resetUser } =
    useUser();

  const connectSseForProgress = (
    jobId: string
  ) => {
    if (
      sseConnectionsRef.current.has(
        jobId
      )
    ) {
      return;
    }

    setConnectingJobIds((prev) =>
      Array.from(
        new Set([...prev, jobId])
      )
    );

    const eventSource =
      new EventSource(
        `${jobStatus}/${jobId}`
      );

    eventSource.onopen = () => {
      setConnectingJobIds((prev) =>
        prev.filter(
          (id) => id !== jobId
        )
      );
    };

    eventSource.onmessage = (
      event
    ) => {
      const data = JSON.parse(
        event.data
      );

      if (data.status === "progress") {
        setProgressVideos((prev) => {
          const updated =
            new Map(prev);

          updated.set(jobId, {
            ...updated.get(jobId)!,
            progress: Number(
              data.percent ?? 0
            ),
            stage:
              data.stage ?? "",
          });

          return updated;
        });
      }

      if (data.status === "completed") {
        const videoUrl =
          data.result?.videoUrl ??
          data.videoUrl ??
          "";

        if (videoUrl) {
          setCompletedVideoUrl(
            videoUrl
          );

          setShowCompletionDialog(
            true
          );
        }

        setProgressVideos((prev) => {
          const updated =
            new Map(prev);

          updated.delete(jobId);

          return updated;
        });

        setConnectingJobIds((prev) =>
          prev.filter(
            (id) => id !== jobId
          )
        );

        resetUser();

        videoQuery.refetch();

        eventSource.close();

        sseConnectionsRef.current.delete(
          jobId
        );
      }

      if (data.status === "failed") {
        toast.error(
          data.error ??
            "Video generation failed"
        );

        setProgressVideos((prev) => {
          const updated =
            new Map(prev);

          updated.delete(jobId);

          return updated;
        });

        setConnectingJobIds((prev) =>
          prev.filter(
            (id) => id !== jobId
          )
        );

        eventSource.close();

        sseConnectionsRef.current.delete(
          jobId
        );
      }
    };

    eventSource.onerror = () => {
      setConnectingJobIds((prev) =>
        prev.filter(
          (id) => id !== jobId
        )
      );

      eventSource.close();

      sseConnectionsRef.current.delete(
        jobId
      );
    };

    sseConnectionsRef.current.set(
      jobId,
      eventSource
    );
  };

  const disconnectRemovedProgressJobs =
    (activeJobIds: Set<string>) => {
      for (const [
        jobId,
        eventSource,
      ] of sseConnectionsRef.current.entries()) {
        if (
          !activeJobIds.has(jobId)
        ) {
          eventSource.close();

          sseConnectionsRef.current.delete(
            jobId
          );
        }
      }
    };

  const videoQuery = useQuery({
    queryFn: async () => {
      return await getUserVideos();
    },

    queryKey: ["videos"],
  });

  const deleteMutation = useMutation({
    mutationKey: ["deleteVideo"],

    mutationFn: async (
      id: string
    ) => {
      return await deleteVideo({
        id,
      });
    },
  });

  const feedPostMutation = useMutation({
    mutationKey: ["feedPost"],

    mutationFn: async ({
      userId,
      videoId,
    }: {
      userId: string;
      videoId: string;
    }) => {
      return await feedCreate({
        userId,
        videoId,
      });
    },
  });

  function processVideos(
    data: VideoResponse
  ) {
    if (data.SUCCESS === false) {
      toast.error(data.MESSAGE);

      return;
    }

    const progressVids =
      data.DATA?.progressVideos || [];

    const progressMap =
      new Map<
        string,
        ProgressVideo
      >();

    const activeJobIds =
      new Set<string>();

    progressVids.forEach((pv) => {
      progressMap.set(
        pv.jobId,
        pv
      );

      activeJobIds.add(
        pv.jobId
      );

      connectSseForProgress(
        pv.jobId
      );
    });

    disconnectRemovedProgressJobs(
      activeJobIds
    );

    setProgressVideos(progressMap);

    const completedVids =
      data.DATA?.videos || [];

    const normalizedVideos: VideoData[] =
      completedVids.map((video) => ({
        ...video,

        videoUrl:
          video.videoUrl ||
          (video.videoMetadata
            ? getCloudinaryUrl(
                video.videoMetadata
              )
            : ""),

        created_at:
          video.created_at ||
          video.createdAt ||
          new Date().toISOString(),

        style:
          video.style || "default",

        language:
          video.language ||
          "unknown",

        voiceCharacter:
          video.voiceCharacter ||
          "unknown",
      }));

    const mappedVideos =
      normalizedVideos.map(
        (
          video,
          index: number
        ) => ({
          id: String(video._id),

          content: video,

          className:
            getGridClassName(),

          thumbnail:
            video.thumbnail ?? "",
        })
      );

    setVideoCards(mappedVideos);

    setAllVideos(mappedVideos);
  }

  useEffect(() => {
    return () => {
      sseConnectionsRef.current.forEach(
        (eventSource) => {
          eventSource.close();
        }
      );

      sseConnectionsRef.current.clear();

      setConnectingJobIds([]);
    };
  }, []);

  useEffect(() => {
    if (videoQuery.data) {
      void processVideos(
        videoQuery.data
      );
    }
  }, [videoQuery.data]);

  const handleVideoDelete = (
    id: string
  ) => {
    setDeletingIds((prev) =>
      Array.from(
        new Set([...prev, id])
      )
    );

    deleteMutation.mutate(id, {
      onSuccess: (data: any) => {
        if (!data.SUCCESS) {
          toast.error(
            data.MESSAGE
          );

          setDeletingIds((prev) =>
            prev.filter(
              (x) => x !== id
            )
          );

          return;
        }

        setAllVideos(
          (prevVideos) =>
            prevVideos.filter(
              (video) =>
                video?.id !== id
            )
        );

        setVideoCards((prev) =>
          prev.filter(
            (video) =>
              video?.id !== id
          )
        );

        toast.success?.(
          "Deleted video"
        );

        videoQuery.refetch();

        setDeletingIds((prev) =>
          prev.filter(
            (x) => x !== id
          )
        );
      },

      onError: () => {
        toast.error(
          "Failed to delete video"
        );

        setDeletingIds((prev) =>
          prev.filter(
            (x) => x !== id
          )
        );
      },
    });
  };

  const handleVideoShare = (
    video: VideoData
  ) => {
    setActiveVideo(video);

    setisOpen(true);
  };

  const handleVideoDownload =
    async (video: VideoData) => {
      try {
        const response =
          await fetch(
            video.videoUrl,
            {
              mode: "cors",
            }
          );

        const blob =
          await response.blob();

        const url =
          URL.createObjectURL(blob);

        const link =
          document.createElement("a");

        link.href = url;

        link.download = `${video.title}.mp4`;

        document.body.appendChild(
          link
        );

        link.click();

        document.body.removeChild(
          link
        );

        URL.revokeObjectURL(url);
      } catch (err) {
        console.error(
          "Download failed",
          err
        );
      }
    };

  const ShareModal = (
    <div className="space-y-5 text-black">
      <div>
        <h2 className="text-2xl font-semibold">
          Share Video
        </h2>

        <p className="mt-2 text-black/60">
          Publish{" "}
          <span className="font-medium text-black">
            {activeVideo?.title}
          </span>{" "}
          to community feed.
        </p>
      </div>

      <button
        onClick={() => {
          feedPostMutation.mutate(
            {
              userId:
                user?._id as string,

              videoId:
                activeVideo?._id as string,
            },

            {
              onSuccess: (
                data: any
              ) => {
                if (!data.SUCCESS) {
                  toast.error(
                    data.MESSAGE
                  );

                  return;
                }

                toast.success(
                  "Posted to feed"
                );
              },

              onError: () => {
                toast.error(
                  "Failed to post to feed"
                );
              },

              onSettled: () => {
                setisOpen(false);

                setActiveVideo(
                  null
                );
              },
            }
          );
        }}
        className="
          flex
          items-center
          gap-3
          rounded-2xl
          bg-black
          px-6
          py-4
          text-sm
          uppercase
          tracking-[0.2em]
          text-white
          transition-all
          hover:opacity-90
        "
      >
        POST TO FEED

        <FaSignsPost />
      </button>
    </div>
  );

  if (videoQuery.isLoading) {
    return (
      <div
        className="
          flex
          min-h-[70vh]
          flex-col
          items-center
          justify-center
        "
      >
        <Loader size={52} />

        <h2 className="mt-8 text-3xl font-semibold text-black">
          Loading Videos
        </h2>

        <p className="mt-2 text-black/50">
          Fetching your cinematic
          creations
        </p>
      </div>
    );
  }

  return (
    <>
      <VideoPreviewDialog
        open={
          showCompletionDialog
        }
        onClose={() =>
          setShowCompletionDialog(
            false
          )
        }
        videoUrl={
          completedVideoUrl
        }
      />

      <Modal
        isOpen={isOpen}
        onClose={() =>
          setisOpen(false)
        }
        title="Share Video"
      >
        {ShareModal}
      </Modal>

      <div
        className="
          mx-auto
          flex
          w-full
          max-w-[1700px]
          flex-col
          gap-8
        "
      >
       

        {/* FILTERS */}
        <div
          className="
            flex
            flex-col
            gap-4
            rounded-[28px]
            border
            border-black/10
            bg-white/70
            p-5
            backdrop-blur-xl

            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          {/* SEARCH */}
          <div className="relative w-full lg:max-w-xl">
            <Search
              className="
                absolute
                left-4
                top-1/2
                h-4
                w-4
                -translate-y-1/2
                text-black/40
              "
            />

            <Input
              type="text"
              placeholder="Search cinematic videos..."
              value={query}
              onChange={(e) =>
                setQuery(
                  e.target.value
                )
              }
              className="
                h-14
                rounded-2xl
                border-black/10
                bg-[#F8F6F1]
                pl-12
                text-black
                placeholder:text-black/40
                focus-visible:ring-0
              "
            />
          </div>

          {/* FILTER */}
          <div className="relative">
            <SlidersHorizontal
              className="
                pointer-events-none
                absolute
                left-4
                top-1/2
                z-10
                h-4
                w-4
                -translate-y-1/2
                text-black/40
              "
            />

            <select
              name="filter"
              title="filter"
              value={filterType}
              onChange={(e) =>
                setFilterType(
                  e.target.value
                )
              }
              className="
                h-14
                w-full
                rounded-2xl
                border
                border-black/10
                bg-[#F8F6F1]
                pl-12
                pr-10
                text-sm
                uppercase
                tracking-[0.15em]
                text-black
                outline-none

                lg:w-[240px]
              "
            >
              <option value="all">
                All Types
              </option>

              <option value="magic_video">
                Magic Video
              </option>

              <option value="sync_studio_video">
                Sync Studio
              </option>
            </select>
          </div>
        </div>

        {/* PROGRESS */}
        {progressVideos.size >
          0 && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-black" />

              <h2 className="text-2xl font-semibold text-black">
                Generating Videos
              </h2>
            </div>

            <div
              className="
                grid
                grid-cols-1
                gap-5

                md:grid-cols-2
                xl:grid-cols-3
              "
            >
              {Array.from(
                progressVideos.entries()
              ).map(
                ([
                  jobId,
                  progress,
                ]) => (
                  <ProgressVideoCard
                    key={jobId}
                    jobId={jobId}
                    progress={
                      progress.progress
                    }
                    stage={
                      progress.stage
                    }
                    isConnecting={connectingJobIds.includes(
                      jobId
                    )}
                  />
                )
              )}
            </div>
          </div>
        )}

        {/* EMPTY */}
        {!videoCards.length &&
          !progressVideos.size && (
            <div
              className="
                flex
                min-h-[420px]
                flex-col
                items-center
                justify-center
                rounded-[32px]
                border
                border-black/10
                bg-white/70
                text-center
              "
            >
              <div
                className="
                  flex
                  h-24
                  w-24
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-black/10
                  bg-[#F8F6F1]
                "
              >
                <VideoIcon className="h-10 w-10 text-black/40" />
              </div>

              <h2 className="mt-8 text-3xl font-semibold text-black">
                No Videos Yet
              </h2>

              <p className="mt-3 max-w-md text-black/50">
                Your generated videos
                will appear here once
                created.
              </p>
            </div>
          )}

        {/* VIDEOS */}
        {videoCards &&
          videoCards.length >
            0 && (
            <div className="space-y-6">
              {progressVideos.size >
                0 && (
                <h2 className="text-2xl font-semibold text-black">
                  Completed Videos
                </h2>
              )}

              <VideoLayoutGrid
                cards={videoCards}
                onDelete={
                  handleVideoDelete
                }
                onShare={
                  handleVideoShare
                }
                onDownload={
                  handleVideoDownload
                }
                deletingIds={
                  deletingIds
                }
              />
            </div>
          )}
      </div>
    </>
  );
};

export default VideoGallery;
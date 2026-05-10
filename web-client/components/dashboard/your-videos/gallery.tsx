/* eslint-disable @next/next/no-html-link-for-pages */
"use client"
import { useEffect, useState, useRef } from "react"
import { VideoIcon } from "lucide-react"
import { VideoData, VideoLayoutGrid } from "@/components/ui/video-layout"
import { useUser } from "@/context/UserProvider"
import { deleteVideo, feedCreate, getUserVideos } from "@/lib/apiProvider"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { FaSignsPost } from "react-icons/fa6"
import Modal from "@/components/common/Modal"
import { getCloudinaryUrl } from "@/lib/getPublicUrl"
import VideoPreviewDialog from "@/components/dashboard/magic-video/downloadVideo"
import { ProgressVideoCard } from "./progress-video-card"
import { jobStatus } from "@/constants/backend_routes"
import Loader from "@/components/common/Loader"

interface ApiVideo {
  _id: string
  user: string
  type: string
  title: string
  style?: string
  language?: string
  voiceCharacter?: string
  createdAt?: string
  created_at?: string
  thumbnail?: string
  videoUrl?: string
  videoMetadata?: {
    publicId: string
    resourceType: string
    format: string
  }
}

interface ProgressVideo {
  jobId: string
  stage: string
  progress: number
  status: string
}

interface VideoResponse {
  MESSAGE?: string
  SUCCESS?: boolean
  ERROR?: unknown
  DATA?: {
    videos?: ApiVideo[]
    progressVideos?: ProgressVideo[]
  }
}

const getGridClassName = (index: number) => {
  const patterns = ["col-span-1", "col-span-1", "col-span-1", "col-span-1", "col-span-1", "col-span-1"]
  return patterns[index % patterns.length]
}

const VideoGallery = () => {
  interface VideoCardType {
    id: string;
    content: VideoData;
    className: string;
    thumbnail: string;
  }

  const [videoCards, setVideoCards] = useState<VideoCardType[]>([]);
  const [allVideos, setAllVideos] = useState<VideoCardType[]>([]);
  const [progressVideos, setProgressVideos] = useState<Map<string, ProgressVideo>>(new Map())
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeVideo, setActiveVideo] = useState<VideoData | null>(null);
  const [isOpen, setisOpen] = useState(false)
  const [completedVideoUrl, setCompletedVideoUrl] = useState<string>("")
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  const [connectingJobIds, setConnectingJobIds] = useState<string[]>([]);
  // const unsubscribersRef = useRef<Map<string, () => void>>(new Map())

  const sseConnectionsRef = useRef(new Map<string, EventSource>())

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 400);
    return () => clearTimeout(handler);
  }, [query]);


  useEffect(() => {

    const filtered = allVideos.filter((vid) => {
      const video = vid.content

      const matchesSearch = video.title
        .toLowerCase()
        .includes(debouncedQuery.toLowerCase())
      const matchesType = filterType === "all" ? true : video.type === filterType
      return matchesSearch && matchesType
    })
    setVideoCards(filtered)
  }, [debouncedQuery, filterType, allVideos])


  const { user, resetUser } = useUser()

  const connectSseForProgress = (jobId: string) => {
    // 1. Check if connection already exists in the ref; return if true
    if (sseConnectionsRef.current.has(jobId)) {
      return;
    }

    setConnectingJobIds((prev) => Array.from(new Set([...prev, jobId])));

    // 2. Create a simple, native SSE connection (replace the URL with your actual endpoint)
    const eventSource = new EventSource(`${jobStatus}/${jobId}`);

    eventSource.onopen = () => {
      setConnectingJobIds((prev) => prev.filter((id) => id !== jobId));
    };

    // 3. Listen for messages from the server
    eventSource.onmessage = (event) => {
      // Parse the incoming SSE data
      const data = JSON.parse(event.data);

      if (data.status === 'progress') {
        setProgressVideos(prev => {
          const updated = new Map(prev);
          updated.set(jobId, {
            ...updated.get(jobId)!,
            progress: Number(data.percent ?? 0),
            stage: data.stage ?? ''
          });
          return updated;
        });
      }

      if (data.status === 'completed') {
        const videoUrl = data.result?.videoUrl ?? data.videoUrl ?? '';
        if (videoUrl) {
          setCompletedVideoUrl(videoUrl);
          setShowCompletionDialog(true);
        }

        setProgressVideos(prev => {
          const updated = new Map(prev);
          updated.delete(jobId);
          return updated;
        });

        setConnectingJobIds((prev) => prev.filter((id) => id !== jobId));

        resetUser();
        videoQuery.refetch();

        // Close the connection and remove from ref
        eventSource.close();
        sseConnectionsRef.current.delete(jobId);
      }

      if (data.status === 'failed') {
        toast.error(data.error ?? 'Video generation failed');

        setProgressVideos(prev => {
          const updated = new Map(prev);
          updated.delete(jobId);
          return updated;
        });

        setConnectingJobIds((prev) => prev.filter((id) => id !== jobId));

        // Close the connection and remove from ref
        eventSource.close();
        sseConnectionsRef.current.delete(jobId);
      }
    };

    // 4. Handle connection errors
    eventSource.onerror = () => {
      console.error(`SSE Error for job: ${jobId}`);
      setConnectingJobIds((prev) => prev.filter((id) => id !== jobId));
      eventSource.close();
      sseConnectionsRef.current.delete(jobId);
    };

    // 5. Store the active connection in the ref
    sseConnectionsRef.current.set(jobId, eventSource);
  };

  const disconnectRemovedProgressJobs = (activeJobIds: Set<string>) => {
    // Loop through all active connections in the ref
    for (const [jobId, eventSource] of sseConnectionsRef.current.entries()) {
      // If the server doesn't list this job as active anymore, kill the connection
      if (!activeJobIds.has(jobId)) {
        eventSource.close();
        sseConnectionsRef.current.delete(jobId);
      }
    }
  }

  const videoQuery = useQuery({
    queryFn: async () => {
      return await getUserVideos()
    },
    queryKey: ['videos']
  })

  const deleteMutation = useMutation({
    mutationKey: ['deleteVideo'],
    mutationFn: async (id: string) => {
      return await deleteVideo({ id })
    }
  })

  const feedPostMutation = useMutation({
    mutationKey: ['feedPost'],
    mutationFn: async ({ userId, videoId }: { userId: string, videoId: string }) => {
      return await feedCreate({ userId, videoId })
    }
  });

  function processVideos(data: VideoResponse) {
    console.log("Processing videos... in  process videos") // This will now log when data is actually ready

    if (data.SUCCESS === false) {
      toast.error(data.MESSAGE);
      return;
    }

    // Handle progress videos
    const progressVids = data.DATA?.progressVideos || []
    const progressMap = new Map<string, ProgressVideo>()
    const activeJobIds = new Set<string>()

    progressVids.forEach(pv => {
      progressMap.set(pv.jobId, pv)
      activeJobIds.add(pv.jobId)
      connectSseForProgress(pv.jobId)
    })

    disconnectRemovedProgressJobs(activeJobIds)
    setProgressVideos(progressMap)

    // Handle completed videos
    const completedVids = data.DATA?.videos || []
    const normalizedVideos: VideoData[] = completedVids.map((video) => ({
      ...video,
      videoUrl: video.videoUrl || (video.videoMetadata ? getCloudinaryUrl(video.videoMetadata) : ""),
      created_at: video.created_at || video.createdAt || new Date().toISOString(),
      style: video.style || "default",
      language: video.language || "unknown",
      voiceCharacter: video.voiceCharacter || "unknown",
    }))

    const mappedVideos = normalizedVideos.map((video, index: number) => ({
      id: String(video._id),
      content: video,
      className: getGridClassName(index),
      thumbnail: video.thumbnail ?? "",
    }))

    setVideoCards(mappedVideos)
    setAllVideos(mappedVideos)
  }

  // 4. Keep your SSE cleanup effect separate!
  useEffect(() => {
    return () => {
      sseConnectionsRef.current.forEach((eventSource) => {
        eventSource.close()
      })
      sseConnectionsRef.current.clear()
      setConnectingJobIds([])
    }
  }, [])

  useEffect(() => {
    if (videoQuery.data) {
      void processVideos(videoQuery.data);
    }
  }, [videoQuery.data]);


  const handleVideoDelete = (id: string) => {
    // mark as deleting
    setDeletingIds((prev) => Array.from(new Set([...prev, id])));

    deleteMutation.mutate(id, {
      onSuccess: (data: any) => {
        if (!data.SUCCESS) {
          toast.error(data.MESSAGE);
          setDeletingIds((prev) => prev.filter((x) => x !== id));
          return;
        }

        // remove from lists only after success
        setAllVideos((prevVideos) => prevVideos.filter((video) => video?.id !== id));
        setVideoCards((prev) => prev.filter((video) => video?.id !== id));
        toast.success?.("Deleted video")
        // refetch to keep consistent
        videoQuery.refetch()
        setDeletingIds((prev) => prev.filter((x) => x !== id));
      },
      onError: () => {
        toast.error("Failed to delete video")
        setDeletingIds((prev) => prev.filter((x) => x !== id));
      }
    });
  }

  const handleVideoShare = (video: VideoData) => {
    setActiveVideo(video)
    setisOpen(true)
  }

  const handleVideoDownload = async (video: VideoData) => {
    try {
      const response = await fetch(video.videoUrl, { mode: "cors" });
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${video.title}.mp4`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  const ShareModal = (
    <div>
      {activeVideo && (
        <div>
          <div>
            confirm sharing {activeVideo?.title}
          </div>
          <button
            onClick={() => {
              feedPostMutation.mutate({
                userId: user?._id as string,
                videoId: activeVideo?._id as string
              }, {
                onSuccess: (data: any) => {
                  if (!data.SUCCESS) {
                    toast.error(data.MESSAGE)
                    return
                  }

                },
                onError: () => {
                  toast.error("Failed to post to feed")
                },
                onSettled: () => {
                  setisOpen(false)
                  setActiveVideo(null)
                }
              })
            }}
            className="mt-4 bg-orange-600 text-white hover:bg-orange-400 hover:cursor-pointer p-2 rounded-lg">
            POST TO FEED <FaSignsPost className="inline-block ml-2" />
          </button>
        </div>
      )}
    </div>
  )

  if (videoQuery.isLoading) {
    return (
      <div className="flex flex-col ml-16 overflow-x-hidden">
        <div className="flex gap-4 ml-64 mt-4 w-2/3">
          <Input type="text" placeholder="🔍 Search by title..." value={query} onChange={() => { }} className="flex-1 px-3 py-2 rounded-lg border shadow-sm focus:outline-none " disabled />

          <select className="px-3 py-2 rounded-lg border shadow-sm" title="loading filter" disabled>
            <option>Loading...</option>
          </select>
        </div>
        <div className="text-center mt-12">
          <Loader size={48} />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Loading videos...</h2>
        </div>
      </div>
    )
  }

  if (!videoQuery.isLoading && !videoCards.length && !progressVideos.size) {
    return (
      <div className="flex flex-col ml-16 overflow-x-hidden">
        <div className="flex gap-4 ml-64 mt-4 w-2/3">
          {/* Search */}
          <Input
            type="text"
            placeholder="🔍 Search by title..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg border shadow-sm focus:outline-none "
          />

          {/* Filter */}
          <select
            name="filter"
            title="filter"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 rounded-lg border shadow-sm"
          >
            <option value="all">All Types</option>
            <option value="magic_video">Magic Video</option>
            <option value="sync_studio_video">Sync Studio</option>
            {/* Add more types if your data has them */}
          </select>
        </div>
        <div className="text-center">
          <VideoIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">No videos yet</h2>

        </div>
      </div>
    )
  }

  return (
    <>
      <VideoPreviewDialog
        open={showCompletionDialog}
        onClose={() => setShowCompletionDialog(false)}
        videoUrl={completedVideoUrl}
      />
      <div className="flex flex-col ml-16 overflow-x-hidden">
        <div className="flex gap-4 ml-64 mt-4 w-2/3">
          {/* Search */}
          <Input
            type="text"
            placeholder="🔍 Search by title..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg border shadow-sm focus:outline-none "
          />

          {/* Filter */}
          <select
            name="filter"
            title="filter"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 rounded-lg border shadow-sm"
          >
            <option value="all">All Types</option>
            <option value="magic_video">Magic Video</option>
            <option value="sync_studio_video">Sync Studio</option>
            {/* Add more types if your data has them */}
          </select>
        </div>
        <Modal isOpen={isOpen} onClose={() => setisOpen(false)} title="Share Video">
          {ShareModal}
        </Modal>

        {/* Progress Videos Section */}
        {progressVideos.size > 0 && (
          <div className="ml-64 mt-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Generating Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from(progressVideos.entries()).map(([jobId, progress]) => (
                <ProgressVideoCard
                  key={jobId}
                  jobId={jobId}
                  progress={progress.progress}
                  stage={progress.stage}
                  isConnecting={connectingJobIds.includes(jobId)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Completed Videos Section */}
        {videoCards && videoCards.length > 0 && (
          <>
            {progressVideos.size > 0 && (
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white ml-64 mt-8 mb-4">Completed Videos</h2>
            )}
            <VideoLayoutGrid
              cards={videoCards}
              onDelete={handleVideoDelete}
              onShare={handleVideoShare}
              onDownload={handleVideoDownload}
              deletingIds={deletingIds}
            />
          </>
        )}
      </div>
    </>
  )
}

export default VideoGallery

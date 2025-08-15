"use client"
import { useEffect, useState } from "react"
import { VideoIcon } from "lucide-react"
import { VideoData, VideoLayoutGrid } from "@/components/ui/video-layout"
import { useUser } from "@/context/UserProvider"
import { getUserVideos } from "@/lib/apiProvider"
import { useQuery } from "@tanstack/react-query"


const getGridClassName = (index: number) => {
  const patterns = ["col-span-1", "col-span-1", "col-span-1", "col-span-1", "col-span-1", "col-span-1"]
  return patterns[index % patterns.length]
}

const VideoGallery = () => {
  const [videoCards, setVideoCards] = useState([])

  const { isAuthenticated } = useUser()

  const videoQuery = useQuery({
    queryFn: async () => {
      return await getUserVideos()
    },
    queryKey: ['videos']
  })

  useEffect(() => {
    if (isAuthenticated) {
      const data: any = videoQuery.data;
      setVideoCards(() => {
        return data?.DATA.map((video: any, index: number) => ({
          id: video._id,
          content: video,
          className: getGridClassName(index),
          thumbnail: `/placeholder.svg?height=400&width=600&query=video thumbnail for ${video.title}`,
        }))
      })
    }
  }, [isAuthenticated])

  const handleVideoDelete = (id: string) => {
    console.log("Delete video:", id)
    // Implement delete functionality
  }

  const handleVideoShare = (video: VideoData) => {
    console.log("Share video:", video)
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: `Check out this video: ${video.title}`,
        url: video.videoUrl,
      })
    }
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

  if (videoCards && !videoCards.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <VideoIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">No videos yet</h2>

        </div>
      </div>
    )
  }

  return (
    (videoCards.length > 0 && <VideoLayoutGrid
      cards={videoCards}
      onDelete={handleVideoDelete}
      onShare={handleVideoShare}
      onDownload={handleVideoDownload}
    />)
  )
}

export default VideoGallery

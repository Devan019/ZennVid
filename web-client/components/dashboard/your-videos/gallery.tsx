"use client"
import { useEffect, useMemo, useState } from "react"
import { VideoIcon } from "lucide-react"
import { VideoData, VideoLayoutGrid } from "@/components/ui/video-layout"
import { useUser } from "@/context/UserProvider"
import { getUserVideos } from "@/lib/apiProvider"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"


const getGridClassName = (index: number) => {
  const patterns = ["col-span-1", "col-span-1", "col-span-1", "col-span-1", "col-span-1", "col-span-1"]
  return patterns[index % patterns.length]
}

const VideoGallery = () => {
  const [videoCards, setVideoCards] = useState([]);
  const [allVideos, setAllVideos] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 400);
    return () => clearTimeout(handler);
  }, [query]);


  useEffect(() => {
    const filtered: any = allVideos.filter((video: any) => {

      const matchesSearch = video.content.title
        .toLowerCase()
        .includes(debouncedQuery.toLowerCase())
      const matchesType = filterType === "all" ? true : video.content.type === filterType
      return matchesSearch && matchesType
    })
    setVideoCards(filtered)
  }, [debouncedQuery, filterType, allVideos])


  const { isAuthenticated } = useUser()

  const videoQuery = useQuery({
    queryFn: async () => {
      return await getUserVideos()
    },
    queryKey: ['videos']
  })

  async function main() {
    let data: any = videoQuery.data
    if (!data) {
      data = (await videoQuery.refetch()).data
    }
    if (data && !data.SUCCESS) {
      toast.error(data.MESSAGE);
      return;
    }
    data && data.MESSAGE && toast.success(data.MESSAGE);
    setVideoCards(() => {
      return data?.DATA.map((video: any, index: number) => {
        return {
          id: video._id,
          content: video,
          className: getGridClassName(index),
          // thumbnail: `/placeholder.svg?height=400&width=600&query=video thumbnail for ${video.title}`,
        }
      })
    })
    setAllVideos(() => {
      return data?.DATA.map((video: any, index: number) => {
        return {
          id: video._id,
          content: video,
          className: getGridClassName(index),
          // thumbnail: `/placeholder.svg?height=400&width=600&query=video thumbnail for ${video.title}`,
        }
      })
    })
  }

  useEffect(() => {
    if (videoCards.length === 0) {
      main()
    }
  }, [])

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
            <option value="SadTalker">Sadtalker</option>
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
    (videoCards && videoCards.length > 0 &&
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
            <option value="SadTalker">Sadtalker</option>
            {/* Add more types if your data has them */}
          </select>
        </div>
        <VideoLayoutGrid
          cards={videoCards}
          onDelete={handleVideoDelete}
          onShare={handleVideoShare}
          onDownload={handleVideoDownload}
        />
      </div>
    )
  )
}

export default VideoGallery

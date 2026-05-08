"use client"

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { syncStudio } from "./api";
import { delay } from "@/lib/delay";
import TerminalLoader from "@/components/dashboard/magic-video/progressLoader";
import VideoPreviewDialog from "@/components/dashboard/magic-video/downloadVideo";
import { toast } from "sonner";
import { jobStatus } from "@/constants/backend_routes";
import { useUser } from "@/context/UserProvider";

const VideoCreator = () => {
  const { resetUser, isAuthenticated, user } = useUser();
  const [title, setTitle] = useState("");
  const [speech, setSpeech] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [videoloading, setvideoloading] = useState(false);
  const [dialogState, setDialogState] = useState(false)
  const [isGeneratered, setisGeneratered] = useState(false)
  const [progressMeta, setProgressMeta] = useState({
    percent: 0,
    stage: '',
  });

  const steps = [
    { id: "voice_cloned", label: "Learning your unique voice magic", duration: 120 },
    { id: "caption_generated", label: "Writing words on the screen", duration: 60 },
    { id: "lip_sync_completed", label: "Teaching the face to speak perfectly in sync", duration: 150 },
    { id: "subtitles_added", label: "Adding final polish and subtitles", duration: 100 },
  ];

  const [progress, setProgress] = useState({
    voice_cloned: false,
    caption_generated: false,
    lip_sync_completed: false,
    subtitles_added: false,
  });

  const eventSourceRef = useRef<EventSource | null>(null);

  const STAGE_RANK: Record<string, number> = {
    voice_cloned: 1,
    caption_generated: 2,
    lip_sync_completed: 3,
    subtitles_added: 4,
    completed: 4,
  };

  const getProgressFromStage = (stage?: string): Record<string, boolean> | null => {
    if (!stage) {
      return null;
    }

    const rank = STAGE_RANK[stage.toLowerCase()];
    if (!rank) {
      return null;
    }

    return {
      voice_cloned: rank >= 1,
      caption_generated: rank >= 2,
      lip_sync_completed: rank >= 3,
      subtitles_added: rank >= 4,
    };
  };

  const resetGenerationState = () => {
    setProgress({
      voice_cloned: false,
      caption_generated: false,
      lip_sync_completed: false,
      subtitles_added: false,
    });
    setProgressMeta({ percent: 0, stage: '' });
    setisGeneratered(false);
    setDialogState(false);
    setVideoUrl('');
  };

  const closeEventSource = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  };

  function connectSseForUser(userId: string) {
    try {
      closeEventSource();

      const eventSource = new EventSource(`${jobStatus}/${userId}`);
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.status === "connected") {
          return;
        }

        if (data.status === "processing") {
          const percent = Number(data.percent ?? 0);
          setProgressMeta({
            percent,
            stage: data.stage ?? '',
          });

          const stageProgress = getProgressFromStage(data.stage);
          if (!stageProgress) return;

          setProgress((prev) => ({
            voice_cloned: prev.voice_cloned || stageProgress.voice_cloned,
            caption_generated: prev.caption_generated || stageProgress.caption_generated,
            lip_sync_completed: prev.lip_sync_completed || stageProgress.lip_sync_completed,
            subtitles_added: prev.subtitles_added || stageProgress.subtitles_added,
          }));
        }

        if (data.status === "completed") {
          const result = data.result ?? {};
          const resolvedVideoUrl = result.videoUrl ?? result.url ?? data.videoUrl ?? data.url ?? '';

          if (resolvedVideoUrl) {
            setVideoUrl(resolvedVideoUrl);
            setDialogState(true);
            if (isAuthenticated) {
              resetUser();
            }
          } else {
            toast.error('Video generation finished, but no video URL was returned.');
          }

          setProgressMeta({ percent: 100, stage: 'Completed' });
          setProgress({
            voice_cloned: true,
            caption_generated: true,
            lip_sync_completed: true,
            subtitles_added: true
          });
          setisGeneratered(true);
          setvideoloading(false);
          eventSource.close();
          if (eventSourceRef.current === eventSource) eventSourceRef.current = null;
        }

        if (data.status === "failed") {
          toast.error(data.error ?? 'Video generation failed');
          setvideoloading(false);
          setisGeneratered(false);
          eventSource.close();
          if (eventSourceRef.current === eventSource) eventSourceRef.current = null;
        }
      };

      eventSource.onerror = (err) => {
        setvideoloading(false);
        closeEventSource();
      };

    } catch (error) {
      setvideoloading(false);
      closeEventSource();
    }
  }

  // connect SSE for current user at page load / when user becomes available
  useEffect(() => {
    if (isAuthenticated && user && user._id) {
      const uid = user._id as string;
      connectSseForUser(uid);
    }

    return () => closeEventSource();
  }, [isAuthenticated, user?._id]);

  const syncStudioMutation = useMutation({
    mutationKey: ['syncStudio'],
    mutationFn: async ({ formData }: { formData: FormData }) => {
      resetGenerationState();
      setvideoloading(true)
      setisGeneratered(false)
      const data = await syncStudio({ formData });
      if (!data.SUCCESS) {
        return data;
      }
      return data;
    },
    onSuccess: (data) => {
      if (!data.SUCCESS) {
        toast.error(data.MESSAGE);
        setvideoloading(false);
        return;
      }
    },
    onError: (error) => {
      console.log("syncStudio error:", error);
      setvideoloading(false);
      closeEventSource();
    },
    onSettled: () => {
      // SSE will handle the final state
    }
  });

  const handleSubmit = async () => {
    if (!title || !speech || !characterName || !imageFile || !audioFile) {
      alert("Please fill all fields and upload image and audio files");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("description", speech);
      formData.append("character", characterName);
      formData.append("title", title);
      formData.append("style", "realistic");
      formData.append("language", "english");
      formData.append("image", imageFile);
      formData.append("audio", audioFile);

      const response = await syncStudioMutation.mutateAsync({ formData });

      if (response.data) {
        setVideoUrl(response.data.videoUrl);
      }
      setTitle("");
      setSpeech("");
      setCharacterName("");
      setImageFile(null);
      setAudioFile(null);
    } catch (error) {
      console.error("Error submitting:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const OnClose = () => {
    setDialogState(false);
  }


  if (videoloading) {
    return (
      <TerminalLoader
        completed={isGeneratered}
        setCompleted={setisGeneratered}
        isVideoLoading={videoloading}
        steps={steps}
        progress={progress}
        setProgress={setProgress}
        progressPercent={progressMeta.percent}
        currentStage={progressMeta.stage}
      />
    );
  }


  return (
    <div className="min-h-screen w-full p-8 transition-colors duration-300 text-gray-900 dark:text-white">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-blue-600 dark:text-blue-400">
          Create Your Video
        </h1>

        <VideoPreviewDialog
          open={dialogState}
          onClose={OnClose}
          videoUrl={videoUrl}
        />

        {/* Title Input */}
        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
            Video Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
            placeholder="Enter video title"
          />
        </div>

        {/* Speech Input */}
        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
            Video Speech (max 150 characters)
          </label>
          <textarea
            value={speech}
            onChange={(e) => e.target.value.length <= 150 && setSpeech(e.target.value)}
            className="w-full p-3 rounded-lg h-32 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
            placeholder="Enter your speech content"
          />
          <div className={`text-sm mt-1 ${speech.length === 150 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
            {speech.length}/150 characters
          </div>
        </div>

        {/* Character Name Input */}
        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
            Character Name
          </label>
          <input
            type="text"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            className="w-full p-3 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
            placeholder="Enter character name"
          />
        </div>

        {/* Image File Upload */}
        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="w-full p-3 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
          />
          {imageFile && (
            <div className="text-sm mt-1 text-gray-500 dark:text-gray-400">
              Selected: {imageFile.name}
            </div>
          )}
        </div>

        {/* Audio File Upload */}
        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
            Upload Audio
          </label>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
            className="w-full p-3 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
          />
          {audioFile && (
            <div className="text-sm mt-1 text-gray-500 dark:text-gray-400">
              Selected: {audioFile.name}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-full py-3 px-6 rounded-lg font-medium ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''} bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-all`}
        >
          {isSubmitting ? 'Creating Video...' : 'Create Video'}
        </motion.button>
      </div>
    </div>
  );
};

export default VideoCreator;

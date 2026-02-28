"use client"

import { motion } from "framer-motion";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { syncStudio } from "@/lib/apiProvider";
import { delay } from "@/lib/delay";
import TerminalLoader from "@/components/dashboard/magic-video/progressLoader";
import VideoPreviewDialog from "@/components/dashboard/magic-video/downloadVideo";
import { toast } from "sonner";

const VideoCreator = () => {
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

  const steps = [
    { id: "face_prep", label: "Polishing your chosen portrait", duration: 40 },
    { id: "voice_clone", label: "Learning your unique voice magic", duration: 120 },
    { id: "text_to_speech", label: "Turning your script into lifelike speech", duration: 90 },
    { id: "lip_sync", label: "Teaching the face to speak perfectly in sync", duration: 150 },
    { id: "render_video", label: "Blending face, voice, and motion into video", duration: 300 },
  ];

  const [progress, setProgress] = useState({
    face_prep: false,     // Portrait image preprocessing
    voice_clone: false,   // Voice cloning/training
    text_to_speech: false,// Script → speech in cloned voice
    lip_sync: false,      // Syncing lips with audio
    render_video: false,  // Final video rendering
  });



  const syncStudioMutation = useMutation({
    mutationKey: ['syncStudio'],
    mutationFn: async ({ formData }: { formData: FormData }) => {
      setvideoloading(true)
      setisGeneratered(false)
      const data = await syncStudio({ formData });
      console.log("syncStudio response:", data);
      if (!data.SUCCESS) {
        return data;
      }
      setisGeneratered(true);
      await delay(1000 * 10);
      setvideoloading(false)
      return data;
    },
    onSuccess: (data) => {
      console.log("syncStudio success:", data, data.DATA, data.DATA.url);
      if (!data.SUCCESS) {
        toast.error(data.MESSAGE);
        return;
      }
      setVideoUrl(data.DATA.url);
      toast.success(data.MESSAGE);
      setDialogState(true);
    },
    onError: (error) => {
      // Handle error
      console.log("SADTalker error:", error);
    },
    onSettled: () => {
      setvideoloading(false);
      setProgress({
        face_prep: false,
        voice_clone: false,
        text_to_speech: false,
        lip_sync: false,
        render_video: false,
      });
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

"use client"

import { motion } from "framer-motion";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { syncStudio } from "@/components/dashboard/syncstudio/api";
import { toast } from "sonner";
import Loader from "@/components/common/Loader";

type SyncStudioProps = {
  onGenerate?: (jobId: string) => void;
};

const VideoCreator = ({ onGenerate }: SyncStudioProps) => {
  const [title, setTitle] = useState("");
  const [speech, setSpeech] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videoloading, setvideoloading] = useState(false);

  const syncStudioMutation = useMutation({
    mutationKey: ['syncStudio'],
    mutationFn: async ({ formData }: { formData: FormData }) => {
      setvideoloading(true)
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
      const jobId = data?.data?.jobId ?? data?.DATA?.jobId ?? data?.jobId;
      if (!jobId) {
        toast.error('Missing job id from video generation response');
        setvideoloading(false);
        return;
      }

      setvideoloading(false);
      onGenerate?.(jobId);
    },
    onError: (error) => {
      console.log("syncStudio error:", error);
      setvideoloading(false);
    },
    onSettled: () => {
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

      await syncStudioMutation.mutateAsync({ formData });
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

  return (
    <div className="min-h-screen w-full p-8 transition-colors duration-300 text-gray-900 dark:text-white">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-blue-600 dark:text-blue-400">
          Create Your Video
        </h1>

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

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={isSubmitting || videoloading}
          className={`w-full py-3 px-6 rounded-lg font-medium ${(isSubmitting || videoloading) ? 'opacity-70 cursor-not-allowed' : ''} bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-all`}
        >
          {videoloading || isSubmitting ? 'Preparing video data...' : 'Create Video'}
        </motion.button>
      </div>

      {videoloading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-950/90 p-8 text-center shadow-2xl">
            <Loader size={52} className="mb-5" />
            <h2 className="text-2xl font-semibold text-white">Preparing video data...</h2>
            <p className="mt-2 text-sm text-slate-300">Please wait while we build your generation request.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCreator;
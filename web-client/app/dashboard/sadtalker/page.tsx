"use client"

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { sadTalker } from "@/lib/apiProvider";
import { delay } from "@/lib/delay";
import TerminalLoader from "@/components/dashboard/magic-video/progressLoader";
import VideoPreviewDialog from "@/components/dashboard/magic-video/downloadVideo";

interface FamousPerson {
  name: string;
  image: string;
  quote: string;
  backend_image?: string;
}

const VideoCreator = () => {
  const [title, setTitle] = useState("");
  const [speech, setSpeech] = useState("");
  const [selectedPerson, setSelectedPerson] = useState<FamousPerson | null>(null);
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



  const sadTalkerMutation = useMutation({
    mutationKey: ['sadTalker'],
    mutationFn: async ({ description, character, title, style, language }: { description: string; character: string; title: string; style: string; language: string }) => {
      setvideoloading(true)
      setisGeneratered(false)
      const data = await sadTalker({ description, character, title, style, language });
      setisGeneratered(true);
      await delay(1000 * 10);
      setvideoloading(false)
      setVideoUrl(data.DATA.videoUrl);
      return data.DATA;
    },
    onSuccess: ({ data }: { data: any }) => {
      setDialogState(true);
    },
    onError: (error: any) => {
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

  const famousPeople: FamousPerson[] = [
    {
      name: "Elon Musk",
      image: "/images/elon_musk.jpg",
      quote: "When something is important enough, you do it even if the odds are not in your favor.",
      backend_image : "./images/elon_musk.jpg"
    },
    {
      name: "Mark Zuckerberg",
      image: "/images/mark_zuckerberg.png",
      quote: "The biggest risk is not taking any risk.",
      backend_image : "./images/mark_zuckerberg.png"
    },
  ];

  const handleSubmit = async () => {
    if (!title || !speech || !selectedPerson) {
      alert("Please fill all fields and select a person");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await sadTalkerMutation.mutateAsync({
        description: speech,
        character: selectedPerson.name,
        title,
        style: "realistic",
        language: "english"
      });

      if (response.data) {
        setVideoUrl(response.data.videoUrl);

      }
      setTitle("");
      setSpeech("");
      setSelectedPerson(null);
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

        {/* People Selection */}
        <div className="mb-8">
          <label className="block mb-4 font-medium text-gray-700 dark:text-gray-300">
            Select a Person
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {famousPeople.map((person) => (
              <motion.div
                key={person.name}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedPerson(person)}
                className={`p-4 rounded-lg cursor-pointer transition-all bg-white dark:bg-gray-800 border-2 ${selectedPerson?.name === person.name
                  ? 'border-blue-600 dark:border-blue-500'
                  : 'border-gray-200 dark:border-gray-700'
                  }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                    <Image
                      src={person.image}
                      alt={person.name}
                      className="w-full h-full object-cover"
                      width={64}
                      height={64}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-600 dark:text-blue-300">
                      {person.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {person.quote.length > 60 ? `${person.quote.substring(0, 60)}...` : person.quote}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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

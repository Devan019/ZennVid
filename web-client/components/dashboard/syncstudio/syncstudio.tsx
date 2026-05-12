"use client";

import { motion } from "framer-motion";
import { useState } from "react";

import { useMutation } from "@tanstack/react-query";

import {
  Mic,
  Upload,
  User,
  Sparkles,
  ArrowRight,
  AudioLines,
  ImageIcon,
  Clapperboard,
} from "lucide-react";

import { syncStudio } from "@/components/dashboard/syncstudio/api";

import { toast } from "sonner";

import Loader from "@/components/common/Loader";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

type SyncStudioProps = {
  onGenerate?: (jobId: string) => void;
};

const VideoCreator = ({
  onGenerate,
}: SyncStudioProps) => {
  const [title, setTitle] = useState("");

  const [speech, setSpeech] =
    useState("");

  const [characterName, setCharacterName] =
    useState("");

  const [imageFile, setImageFile] =
    useState<File | null>(null);

  const [audioFile, setAudioFile] =
    useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [videoloading, setvideoloading] =
    useState(false);

  const syncStudioMutation = useMutation({
    mutationKey: ["syncStudio"],

    mutationFn: async ({
      formData,
    }: {
      formData: FormData;
    }) => {
      setvideoloading(true);

      const data = await syncStudio({
        formData,
      });

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

      const jobId =
        data?.data?.jobId ??
        data?.DATA?.jobId ??
        data?.jobId;

      if (!jobId) {
        toast.error(
          "Missing job id from video generation response"
        );

        setvideoloading(false);

        return;
      }

      setvideoloading(false);

      onGenerate?.(jobId);
    },

    onError: (error) => {
      console.log(
        "syncStudio error:",
        error
      );

      setvideoloading(false);
    },
  });

  const handleSubmit = async () => {
    if (
      !title ||
      !speech ||
      !characterName ||
      !imageFile ||
      !audioFile
    ) {
      alert(
        "Please fill all fields and upload image and audio files"
      );

      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append(
        "description",
        speech
      );

      formData.append(
        "character",
        characterName
      );

      formData.append(
        "title",
        title
      );

      formData.append(
        "style",
        "realistic"
      );

      formData.append(
        "language",
        "english"
      );

      formData.append(
        "image",
        imageFile
      );

      formData.append(
        "audio",
        audioFile
      );

      await syncStudioMutation.mutateAsync({
        formData,
      });

      setTitle("");
      setSpeech("");
      setCharacterName("");
      setImageFile(null);
      setAudioFile(null);
    } catch (error) {
      console.error(
        "Error submitting:",
        error
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },

    visible: {
      opacity: 1,
      y: 0,

      transition: {
        duration: 0.6,
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },

    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <div className="relative">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="
          mx-auto
          flex
          w-full
          max-w-[1600px]
          flex-col
          gap-6
        "
      >
        {/* PROMPT */}
        <motion.div variants={itemVariants}>
          <Card
            className="
              rounded-[28px]
              border
              border-black/10
              bg-white/70
              text-black
              shadow-none
              backdrop-blur-xl
            "
          >
            <CardContent className="p-6 md:p-10">
              <div className="mb-6 flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-black" />

                <div>
                  <h3 className="text-lg font-semibold">
                    Scene Prompt
                  </h3>

                  <p className="text-sm text-black/50">
                    Define your cinematic sync
                    scene
                  </p>
                </div>
              </div>

              <input
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="Cyberpunk presenter introducing futuristic AI products..."
                className="
                  h-14
                  w-full
                  rounded-2xl
                  border
                  border-black/10
                  bg-[#F7F5F0]
                  px-5
                  text-black
                  placeholder:text-black/30
                  outline-none
                  transition-all
                  focus:border-black
                  md:h-16
                "
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* MAIN GRID */}
        <div
          className="
            grid
            gap-6
            xl:grid-cols-2
          "
        >
          {/* LEFT */}
          <div className="space-y-6">
            {/* SPEECH */}
            <motion.div variants={itemVariants}>
              <Card
                className="
                  rounded-[28px]
                  border
                  border-black/10
                  bg-white/70
                  text-black
                  shadow-none
                "
              >
                <CardContent className="p-6 md:p-10">
                  <div className="mb-6 flex items-center gap-3">
                    <Mic className="h-5 w-5 text-black" />

                    <div>
                      <h3 className="text-lg font-semibold">
                        Dialogue Script
                      </h3>

                      <p className="text-sm text-black/50">
                        Add cinematic speech for
                        lip sync
                      </p>
                    </div>
                  </div>

                  <textarea
                    value={speech}
                    onChange={(e) =>
                      e.target.value.length <=
                        150 &&
                      setSpeech(
                        e.target.value
                      )
                    }
                    placeholder="Welcome to the future of cinematic AI storytelling..."
                    className="
                      min-h-[180px]
                      w-full
                      resize-none
                      rounded-3xl
                      border
                      border-black/10
                      bg-[#F7F5F0]
                      p-5
                      text-black
                      placeholder:text-black/30
                      outline-none
                      transition-all
                      focus:border-black
                    "
                  />

                  <div
                    className="
                      mt-4
                      flex
                      items-center
                      justify-between
                    "
                  >
                    <div className="text-sm text-black/40">
                      Maximum 150 characters
                    </div>

                    <div
                      className={`
                        text-sm
                        font-medium

                        ${
                          speech.length >=
                          150
                            ? "text-red-500"
                            : "text-black/50"
                        }
                      `}
                    >
                      {speech.length}/150
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* CHARACTER */}
            <motion.div variants={itemVariants}>
              <Card
                className="
                  rounded-[28px]
                  border
                  border-black/10
                  bg-white/70
                  text-black
                  shadow-none
                "
              >
                <CardContent className="p-6 md:p-10">
                  <div className="mb-6 flex items-center gap-3">
                    <User className="h-5 w-5 text-black" />

                    <div>
                      <h3 className="text-lg font-semibold">
                        Character Identity
                      </h3>

                      <p className="text-sm text-black/50">
                        Name your cinematic
                        performer
                      </p>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={characterName}
                    onChange={(e) =>
                      setCharacterName(
                        e.target.value
                      )
                    }
                    placeholder="Neo Presenter"
                    className="
                      h-14
                      w-full
                      rounded-2xl
                      border
                      border-black/10
                      bg-[#F7F5F0]
                      px-5
                      text-black
                      placeholder:text-black/30
                      outline-none
                      transition-all
                      focus:border-black
                    "
                  />
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            {/* IMAGE */}
            <motion.div variants={itemVariants}>
              <Card
                className="
                  rounded-[28px]
                  border
                  border-black/10
                  bg-black
                  text-white
                  shadow-none
                "
              >
                <CardContent className="p-6 md:p-10">
                  <div className="mb-6 flex items-center gap-3">
                    <ImageIcon className="h-5 w-5" />

                    <div>
                      <h3 className="text-lg font-semibold">
                        Character Image
                      </h3>

                      <p className="text-sm text-white/50">
                        Upload cinematic portrait
                      </p>
                    </div>
                  </div>

                  <label
                    className="
                      flex
                      min-h-[220px]
                      cursor-pointer
                      flex-col
                      items-center
                      justify-center
                      rounded-3xl
                      border
                      border-dashed
                      border-white/10
                      bg-white/[0.03]
                      p-8
                      text-center
                      transition-all
                      duration-300
                      hover:border-white/30
                      hover:bg-white/[0.05]
                    "
                  >
                    <Upload className="mb-4 h-10 w-10 text-white/70" />

                    <div className="text-lg font-medium">
                      Upload Image
                    </div>

                    <p className="mt-2 text-sm text-white/50">
                      PNG, JPG, WEBP
                    </p>

                    {imageFile && (
                      <div className="mt-6 rounded-full border border-white/10 px-4 py-2 text-sm text-white">
                        {imageFile.name}
                      </div>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        setImageFile(
                          e.target
                            .files?.[0] ||
                            null
                        )
                      }
                    />
                  </label>
                </CardContent>
              </Card>
            </motion.div>

            {/* AUDIO */}
            <motion.div variants={itemVariants}>
              <Card
                className="
                  rounded-[28px]
                  border
                  border-black/10
                  bg-white/70
                  text-black
                  shadow-none
                "
              >
                <CardContent className="p-6 md:p-10">
                  <div className="mb-6 flex items-center gap-3">
                    <AudioLines className="h-5 w-5 text-black" />

                    <div>
                      <h3 className="text-lg font-semibold">
                        Voice Audio
                      </h3>

                      <p className="text-sm text-black/50">
                        Upload voice narration
                      </p>
                    </div>
                  </div>

                  <label
                    className="
                      flex
                      min-h-[180px]
                      cursor-pointer
                      flex-col
                      items-center
                      justify-center
                      rounded-3xl
                      border
                      border-dashed
                      border-black/10
                      bg-[#F7F5F0]
                      p-8
                      text-center
                      transition-all
                      duration-300
                      hover:border-black/30
                    "
                  >
                    <Upload className="mb-4 h-10 w-10 text-black/60" />

                    <div className="text-lg font-medium">
                      Upload Audio
                    </div>

                    <p className="mt-2 text-sm text-black/40">
                      MP3, WAV
                    </p>

                    {audioFile && (
                      <div className="mt-6 rounded-full border border-black/10 px-4 py-2 text-sm">
                        {audioFile.name}
                      </div>
                    )}

                    <input
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={(e) =>
                        setAudioFile(
                          e.target
                            .files?.[0] ||
                            null
                        )
                      }
                    />
                  </label>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* CTA */}
        <motion.div variants={itemVariants}>
          <Card
            className="
              rounded-[28px]
              border
              border-black/10
              bg-white/70
              text-black
              shadow-none
            "
          >
            <CardContent
              className="
                flex
                flex-col
                gap-8
                p-6
                md:p-10
                xl:flex-row
                xl:items-center
                xl:justify-between
              "
            >
              <div className="space-y-4">
                <div
                  className="
                    text-[11px]
                    uppercase
                    tracking-[0.3em]
                    text-black/40
                  "
                >
                  Sync Studio Summary
                </div>

                <h3 className="text-2xl font-semibold">
                  Ready for Lip Sync
                </h3>

                <div className="flex flex-wrap gap-3">
                  <div
                    className="
                      rounded-full
                      border
                      border-black/10
                      bg-[#F7F5F0]
                      px-4
                      py-2
                      text-sm
                    "
                  >
                    {characterName ||
                      "Character"}
                  </div>

                  <div
                    className="
                      rounded-full
                      border
                      border-black/10
                      bg-[#F7F5F0]
                      px-4
                      py-2
                      text-sm
                    "
                  >
                    {imageFile
                      ? "Image Uploaded"
                      : "Image Missing"}
                  </div>

                  <div
                    className="
                      rounded-full
                      border
                      border-black/10
                      bg-[#F7F5F0]
                      px-4
                      py-2
                      text-sm
                    "
                  >
                    {audioFile
                      ? "Audio Uploaded"
                      : "Audio Missing"}
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                disabled={
                  isSubmitting ||
                  videoloading
                }
                onClick={handleSubmit}
                className="
                  h-14
                  min-w-[240px]
                  rounded-2xl
                  bg-black
                  px-8
                  text-sm
                  uppercase
                  tracking-[0.18em]
                  text-white
                  transition-all
                  duration-300
                  hover:bg-black/90
                "
              >
                {videoloading ||
                isSubmitting ? (
                  "Preparing..."
                ) : (
                  <div className="flex items-center gap-3">
                    <span>
                      Create Sync Video
                    </span>

                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* LOADER */}
      {videoloading && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/40
            backdrop-blur-md
            px-4
          "
        >
          <div
            className="
              w-full
              max-w-md
              rounded-[32px]
              border
              border-white/10
              bg-[#0D0D0D]
              p-10
              text-center
              shadow-2xl
            "
          >
            <Loader
              size={52}
              className="mb-6"
            />

            <h2
              className="
                text-2xl
                font-semibold
                text-white
              "
            >
              Preparing Sync Studio
            </h2>

            <p
              className="
                mt-3
                text-sm
                leading-relaxed
                text-white/60
              "
            >
              Building cinematic facial
              motion, lip sync, and voice
              alignment.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCreator;
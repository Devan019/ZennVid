"use client";

import React, { useEffect, useState } from "react";

import { motion } from "framer-motion";

import {
  Video,
  Palette,
  Languages,
  Users,
  Sparkles,
  Clock,
  ArrowRight,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import {
  VoiceBaseLanguage,
  VoiceLanguage,
} from "@/constants/languages";

import { magicVideo } from "@/lib/apiProvider";

import { useMutation } from "@tanstack/react-query";

import { toast } from "sonner";

import Loader from "@/components/common/Loader";

type MagicVideoProps = {
  onGenerate?: (jobId: string) => void;
};

const MagicVideo = ({
  onGenerate,
}: MagicVideoProps) => {
  const [videoTitle, setVideoTitle] =
    useState("");

  const [videoLength, setVideoLength] =
    useState("");

  const [selectedStyle, setSelectedStyle] =
    useState("");

  const [voiceLanguage, setVoiceLanguage] =
    useState("");

  const [voiceGender, setVoiceGender] =
    useState("");

  const [language, setLanguage] =
    useState<VoiceBaseLanguage>(
      VoiceBaseLanguage.EnglishIndia
    );

  const [videoloading, setvideoloading] =
    useState(false);

  const videoGenMutation = useMutation({
    mutationFn: async () => {
      if (
        !videoTitle ||
        !videoLength ||
        !selectedStyle ||
        !voiceLanguage ||
        !voiceGender
      ) {
        throw new Error(
          "All fields are required"
        );
      }

      setvideoloading(true);

      const data = await magicVideo({
        title: videoTitle,
        style: selectedStyle,
        voiceGender,
        voiceLanguage,
        seconds:
          videoLength === "30" ? 30 : 60,
        language,
      });

      if (!data.SUCCESS) {
        setvideoloading(false);
        return data;
      }

      return data;
    },

    onSuccess: (data) => {
      if (data && !data.SUCCESS) {
        toast.error(data.MESSAGE);

        setvideoloading(false);

        return;
      }

      if (data) {
        const jobId = data?.DATA?.jobId;

        if (!jobId) {
          toast.error(
            "Missing job id from video generation response"
          );

          setvideoloading(false);

          return;
        }

        setvideoloading(false);

        onGenerate?.(jobId);
      }
    },

    onError: () => {
      setvideoloading(false);
    },
  });

  const handleSubmit = () => {
    videoGenMutation.mutateAsync();
  };

  const styles = [
    {
      id: "realistic",
      name: "Realistic",
      emoji: "📸",
    },

    {
      id: "anime",
      name: "Anime",
      emoji: "🎌",
    },

    {
      id: "cartoon",
      name: "Cartoon",
      emoji: "🎨",
    },

    {
      id: "cyberpunk",
      name: "Cyberpunk",
      emoji: "🤖",
    },

    {
      id: "sketch",
      name: "Sketch",
      emoji: "✏️",
    },

    {
      id: "pixel-art",
      name: "Pixel Art",
      emoji: "🟦",
    },
  ];

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

  const isFormValid = () => {
    return (
      videoTitle.trim() &&
      videoLength &&
      selectedStyle &&
      voiceLanguage &&
      voiceGender
    );
  };

  useEffect(() => {
    setLanguage(
      VoiceBaseLanguage[
      voiceLanguage as keyof typeof VoiceBaseLanguage
      ] ||
      VoiceBaseLanguage.EnglishIndia
    );
  }, [voiceLanguage]);

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


        {/* PROMPT FULL WIDTH */}
        <motion.div variants={itemVariants}>
          <Card
            className="
            rounded-[28px]
            border
            border-black/10
            bg-white/70 text-black
            shadow-none
            backdrop-blur-xl
          "
          >
            <CardContent className="p-6 md:p-10">
              <div className="mb-6 flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-black" />

                <div>
                  <h3
                    className="
                    text-lg
                    font-semibold
                    text-black
                  "
                  >
                    Video Prompt
                  </h3>

                  <p
                    className="
                    text-sm
                    text-black/50
                  "
                  >
                    Describe your cinematic vision
                  </p>
                </div>
              </div>

              <Input
                type="text"
                placeholder="A futuristic samurai walking through neon Tokyo rain..."
                value={videoTitle}
                onChange={(e) =>
                  setVideoTitle(e.target.value)
                }
                className="
  h-14
  rounded-2xl
  border-black/10
  bg-[#F7F5F0]
  px-5
  text-base
  text-black
  placeholder:text-black/30
  shadow-none
  focus-visible:ring-0
  focus-visible:ring-offset-0
  md:h-16
  md:px-6
  md:text-lg
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
            {/* STYLE */}
            <motion.div variants={itemVariants}>
              <Card
                className="
                rounded-[28px]
                border
                border-black/10
                bg-white/70 text-black
                shadow-none
              "
              >
                <CardContent className="p-6 md:p-10">
                  <div className="mb-6 flex items-center gap-3">
                    <Palette className="h-5 w-5 text-black" />

                    <div>
                      <h3 className="text-lg font-semibold">
                        Visual Style
                      </h3>

                      <p
                        className="
                        text-sm
                        text-black/50
                      "
                      >
                        Choose your cinematic direction
                      </p>
                    </div>
                  </div>

                  <div
                    className="
                    grid
                    
                    gap-4
                    grid-cols-2
                    3xl:grid-cols-3
                  "
                  >
                    {styles.map((style) => (
                      <motion.div
                        key={style.id}
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() =>
                          setSelectedStyle(style.id)
                        }
                        className={`
                        cursor-pointer
                        rounded-3xl
                        border
                        p-3
                        transition-all
                        duration-300
                        3xl:p-6

                        ${selectedStyle === style.id
                            ? `
                              border-black
                              bg-black
                              text-white
                            `
                            : `
                              border-black/10
                              bg-[#F7F5F0]
                              hover:border-black/30
                            `
                          }
                      `}
                      >
                        <div className="text-3xl md:text-4xl">
                          {style.emoji}
                        </div>

                        <div
                          className="
                          mt-4
                          text-xs
                          font-medium
                          uppercase
                          tracking-[0.12em]
                          md:text-sm
                        "
                        >
                          {style.name}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* LANGUAGE */}
            <motion.div variants={itemVariants}>
              <Card
                className="
                rounded-[28px]
                border
                border-black/10
                bg-white/70 text-black
                shadow-none
              "
              >
                <CardContent className="p-6 md:p-10">
                  <div className="mb-6 flex items-center gap-3">
                    <Languages className="h-5 w-5 text-black" />

                    <div>
                      <h3 className="text-lg font-semibold">
                        Voice Language
                      </h3>

                      <p
                        className="
                        text-sm
                        text-black/50
                      "
                      >
                        Select narration language
                      </p>
                    </div>
                  </div>

                  <Select
                    value={voiceLanguage}
                    onValueChange={setVoiceLanguage}
                  >
                    <SelectTrigger
                      className="
    h-14
    rounded-2xl
    border-black/10
    bg-[#F7F5F0]
    px-5
    text-black
    shadow-none
    focus:ring-0
    data-[placeholder]:text-black/30
  "
                    >
                      <SelectValue placeholder="Choose language" />
                    </SelectTrigger>

                    <SelectContent
                      className="
    rounded-2xl
    border-black/10
    bg-white
    text-black
  "
                    >
                      {Object.entries(
                        VoiceLanguage
                      ).map((voice) => (
                        <SelectItem
                          className="
    text-black
    focus:bg-black
    focus:text-white
  "
                          key={voice[0]}
                          value={voice[0]}
                        >
                          {voice[1]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            {/* LENGTH */}
            <motion.div variants={itemVariants}>
              <Card
                className="
                rounded-[28px]
                 border
                border-black/10
                bg-white/70 text-black
                shadow-none
              "
              >
                <CardContent className="p-6 md:p-10">
                  <div className="mb-6 flex items-center gap-3">
                    <Clock className="h-5 w-5" />

                    <div>
                      <h3 className="text-lg font-semibold">
                        Video Length
                      </h3>

                      <p className="text-sm text-black/50">
                        Select generation duration
                      </p>
                    </div>
                  </div>

                  <RadioGroup
                    value={videoLength}
                    onValueChange={setVideoLength}
                    className="space-y-4"
                  >
                    {[
                      {
                        value: "30",
                        title: "30 Seconds",
                        desc: "Fast cinematic short",
                      },

                      {
                        value: "60",
                        title:
                          "60 Seconds",
                        desc:
                          "Extended cinematic storytelling",
                      },
                    ].map((item) => (
                      <motion.div
                        key={item.value}
                        whileHover={{
                          scale: 1.02,
                        }}
                        whileTap={{
                          scale: 0.98,
                        }}
                        onClick={() =>
                          setVideoLength(item.value)
                        }
                        className={`
                        cursor-pointer
                        rounded-3xl
                        border
                        p-5
                        transition-all
                        duration-300

                        ${videoLength === item.value
                            ? `
                              border-black
                              bg-black
                              text-white
                            `
                            : `
                              border-black/10
                              bg-black/[0.03]
                              
                            `
                          }
                      `}
                      >
                        <div className="flex gap-4">
                          <RadioGroupItem
                          className="
    border-white/30
    text-white
  "
                            value={item.value}
                            id={item.value}
                          />

                          <div>
                            <div className="font-medium">
                              {item.title}
                            </div>

                            <p
                              className={`
                              mt-1
                              text-sm

                              ${videoLength === item.value
                                  ? "text-white/50"
                                  : "text-black/50"
                                }
                            `}
                            >
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            </motion.div>

            {/* VOICE */}
            <motion.div variants={itemVariants}>
              <Card
                className="
                rounded-[28px]
                border
                border-black/10
                bg-white/70 text-black
                shadow-none
              "
              >
                <CardContent className="space-y-6 p-6 md:p-10">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-black" />

                    <div>
                      <h3 className="text-lg font-semibold">
                        Voice Narrator
                      </h3>

                      <p
                        className="
                        text-sm
                        text-black/50
                      "
                      >
                        Select cinematic narrator tone
                      </p>
                    </div>
                  </div>

                  <RadioGroup
                    value={voiceGender}
                    onValueChange={setVoiceGender}
                    className="grid gap-4"
                  >
                    {[
                      {
                        value: "Male",
                        emoji: "👨",
                        desc:
                          "Deep cinematic narration",
                      },

                      {
                        value: "Female",
                        emoji: "👩",
                        desc:
                          "Warm cinematic narration",
                      },
                    ].map((item) => (
                      <motion.div
                        key={item.value}
                        whileHover={{ y: -3 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() =>
                          setVoiceGender(item.value)
                        }
                        className={`
                        cursor-pointer
                        rounded-3xl
                        border
                        p-5
                        transition-all
                        duration-300

                        ${voiceGender === item.value
                            ? `
                              border-black
                              bg-black
                              text-white
                            `
                            : `
                              border-black/10
                              bg-[#F7F5F0]
                            `
                          }
                      `}
                      >
                        <div className="flex gap-4">
                          <RadioGroupItem
                            value={item.value}
                            id={item.value}
                          />

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">
                                {item.emoji}
                              </span>

                              <span className="font-medium">
                                {item.value}
                              </span>
                            </div>

                            <p
                              className={`
                              mt-1
                              text-sm

                              ${voiceGender === item.value
                                  ? "text-white/70"
                                  : "text-black/50"
                                }
                            `}
                            >
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* CTA FULL WIDTH */}
        <motion.div variants={itemVariants}>
          <Card
            className="
            rounded-[28px]
            border
            border-black/10
            bg-white/70 text-black
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
              {/* SUMMARY */}
              <div className="space-y-4">
                <div
                  className="
                  text-[11px]
                  uppercase
                  tracking-[0.3em]
                  text-black/40
                "
                >
                  Generation Summary
                </div>

                <h3
                  className="
                  text-2xl
                  font-semibold
                  text-black
                "
                >
                  Ready to Create
                </h3>

                <div
                  className="
                  flex
                  flex-wrap
                  gap-3
                "
                >
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
                    {selectedStyle || "Style"}
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
                    {videoLength
                      ? `${videoLength}s`
                      : "Duration"}
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
                    {voiceGender || "Voice"}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <Button
                size="lg"
                disabled={
                  !isFormValid() ||
                  videoloading
                }
                onClick={handleSubmit}
                className="
                h-14
                min-w-[220px]
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
                {videoloading ? (
                  "Preparing..."
                ) : (
                  <div className="flex items-center gap-3">
                    <span>Create Video</span>

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
              Generating Cinematic Video
            </h2>

            <p
              className="
              mt-3
              text-sm
              leading-relaxed
              text-white/60
            "
            >
              Preparing frames, narration,
              atmosphere, and cinematic motion.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MagicVideo;
"use client";

import React, {
  useState,
  useRef,
} from "react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import {
  Upload,
  Sparkles,
  User,
  Tv,
  ImageIcon,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { toast } from "sonner";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { animeMatching } from "@/lib/apiProvider";
import { BASE_URL } from "@/constants/backend_routes";
interface AnimeMatchResult {
  id: string;
  name: string;
  anime: string;
  genre: string;
  type: string;
  image: string;
  description: string;
}

const AnimeMatcher = () => {
  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [previewUrl, setPreviewUrl] =
    useState<string | null>(null);

  const [result, setResult] =
    useState<AnimeMatchResult | null>(
      null
    );

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const animeMatchMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData =
        new FormData();

      formData.append(
        "image",
        file
      );

      const data =
        await animeMatching({
          formData,
        });

      return data;
    },

    onSuccess: (data) => {
      if (data && !data.SUCCESS) {
        toast.error(
          data.MESSAGE ||
          "Failed to match anime character"
        );

        return;
      }

      if (data && data.DATA) {
        setResult(data.DATA);
      }
    },

    onError: (error) => {
      toast.error(
        "An error occurred while matching"
      );
    },
  });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0];

    if (file) {
      setSelectedFile(file);

      setPreviewUrl(
        URL.createObjectURL(file)
      );

      setResult(null);
    }
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>
  ) => {
    e.preventDefault();

    const file =
      e.dataTransfer.files?.[0];

    if (
      file &&
      file.type.startsWith("image/")
    ) {
      setSelectedFile(file);

      setPreviewUrl(
        URL.createObjectURL(file)
      );

      setResult(null);
    }
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
  };

  const handleSubmit = () => {
    if (selectedFile) {
      animeMatchMutation.mutate(
        selectedFile
      );
    } else {
      toast.error(
        "Please select an image first"
      );
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

  const resultVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
    },

    visible: {
      opacity: 1,
      scale: 1,

      transition: {
        type: "spring" as const,
        stiffness: 180,
        damping: 20,
      },
    },
  };

  const formatDescription = (
    desc: string
  ) => {
    return desc
      ?.split("\n")
      .map((line, idx) => (
        <p
          key={idx}
          className="mb-3 last:mb-0"
        >
          {line.startsWith("- ") ? (
            <span className="flex gap-3">
              <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-black" />

              <span
                dangerouslySetInnerHTML={{
                  __html: line
                    .slice(2)
                    .replace(
                      /\*\*(.*?)\*\*/g,
                      "<strong>$1</strong>"
                    ),
                }}
              />
            </span>
          ) : (
            line
          )}
        </p>
      ));
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


        {/* MAIN GRID */}
        <div
          className="
            grid
            gap-6
            xl:grid-cols-[0.9fr_1.1fr]
          "
        >
          {/* LEFT */}
          <motion.div variants={itemVariants}>
            <Card
              className="
                rounded-[32px]
                border
                border-black/10
                bg-white/70
                text-black
                shadow-none
                backdrop-blur-xl
              "
            >
              <CardContent className="p-6 md:p-10">
                {/* TOP */}
                <div className="mb-8">
                  <div className="flex items-center gap-3">
                    <ImageIcon className="h-5 w-5 text-black" />

                    <div>
                      <h3 className="text-lg font-semibold">
                        Upload Portrait
                      </h3>

                      <p className="text-sm text-black/50">
                        Drag & drop or select
                        an image
                      </p>
                    </div>
                  </div>
                </div>

                {/* DROPZONE */}
                <div
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  onDrop={handleDrop}
                  onDragOver={
                    handleDragOver
                  }
                  className={`
                    group
                    relative
                    flex
                    min-h-[420px]
                    cursor-pointer
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-[32px]
                    border
                    border-dashed
                    transition-all
                    duration-500

                    ${previewUrl
                      ? `
                          border-black/10
                          bg-black
                        `
                      : `
                          border-black/10
                          bg-[#F7F5F0]
                          hover:border-black/30
                        `
                    }
                  `}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={
                      handleFileChange
                    }
                    className="hidden"
                  />

                  {previewUrl ? (
                    <div className="relative h-full min-h-[420px] w-full">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        fill
                        className="
                          object-cover
                        "
                      />

                      <div
                        className="
                          absolute
                          inset-0
                          bg-gradient-to-t
                          from-black/50
                          to-transparent
                        "
                      />

                      <div
                        className="
                          absolute
                          bottom-6
                          left-6
                          rounded-full
                          border
                          border-white/10
                          bg-white/10
                          px-4
                          py-2
                          text-sm
                          text-white
                          backdrop-blur-xl
                        "
                      >
                        {
                          selectedFile?.name
                        }
                      </div>
                    </div>
                  ) : (
                    <div className="px-6 text-center">
                      <div
                        className="
                          mx-auto
                          mb-6
                          flex
                          h-20
                          w-20
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-black/10
                          bg-white
                        "
                      >
                        <Upload className="h-8 w-8 text-black/70" />
                      </div>

                      <h3 className="text-2xl font-semibold">
                        Drop Your Portrait
                      </h3>

                      <p className="mt-3 text-black/50">
                        Upload JPG, PNG, or
                        WEBP image
                      </p>

                      <Badge
                        className="
                          mt-6
                          rounded-full
                          border
                          border-black/10
                          bg-white
                          px-4
                          py-2
                          text-black
                          shadow-none
                        "
                      >
                        Cinematic AI Matching
                      </Badge>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <Button
                  onClick={handleSubmit}
                  disabled={
                    !selectedFile ||
                    animeMatchMutation.isPending
                  }
                  className="
                    mt-6
                    h-14
                    w-full
                    rounded-2xl
                    bg-black
                    text-sm
                    uppercase
                    tracking-[0.2em]
                    text-white
                    transition-all
                    duration-300
                    hover:bg-black/90
                  "
                >
                  {animeMatchMutation.isPending ? (
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-5 w-5 animate-spin" />

                      <span>
                        Matching Anime
                        Identity
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Sparkles className="h-5 w-5" />

                      <span>
                        Find Anime Twin
                      </span>

                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* RESULT */}
          <motion.div variants={itemVariants}>
            <AnimatePresence mode="wait">
              {animeMatchMutation.isPending ? (
                <motion.div
                  key="loading"
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                >
                  <Card
                    className="
                      flex
                      min-h-[700px]
                      items-center
                      justify-center
                      rounded-[32px]
                      border
                      border-black/10
                      bg-black
                      text-white
                    "
                  >
                    <CardContent className="text-center">
                      <div className="relative">
                        <div
                          className="
                            mx-auto
                            h-28
                            w-28
                            rounded-full
                            bg-white/10
                          "
                        />

                        <div
                          className="
                            absolute
                            inset-0
                            mx-auto
                            h-28
                            w-28
                            rounded-full
                            border-[3px]
                            border-transparent
                            border-t-white
                            animate-spin
                          "
                        />
                      </div>

                      <h3 className="mt-8 text-3xl font-semibold">
                        Analyzing Features
                      </h3>

                      <p className="mt-3 text-white/60">
                        AI is finding your
                        cinematic anime twin
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : result ? (
                <motion.div
                  key="result"
                  variants={
                    resultVariants
                  }
                  initial="hidden"
                  animate="visible"
                >
                  <Card
                    className="
                      overflow-hidden
                      rounded-[32px]
                      border
                      border-black/10
                      bg-white/70
                      text-black
                    "
                  >
                    {/* IMAGE */}
                    <div
                      className="
                        relative
                        flex
                        min-h-[380px]
                        items-center
                        justify-center
                        overflow-hidden
                        bg-black
                        p-8
                      "
                    >
                      <Image
                        src={`${BASE_URL}${result.image}`}
                        alt={result.name}
                        width={500}
                        height={500}
                        className="
                          max-h-[420px]
                          w-auto
                          object-contain
                        "
                        unoptimized
                      />

                      <div
                        className="
                          absolute
                          inset-0
                          bg-gradient-to-t
                          from-black/60
                          to-transparent
                        "
                      />
                    </div>

                    {/* INFO */}
                    <CardContent className="p-6 md:p-10">
                      <div
                        className="
                          mb-6
                          flex
                          flex-wrap
                          items-center
                          justify-between
                          gap-4
                        "
                      >
                        <div>
                          <div
                            className="
                              mb-2
                              text-[11px]
                              uppercase
                              tracking-[0.3em]
                              text-black/40
                            "
                          >
                            Anime Identity
                          </div>

                          <h2
                            className="
                              text-4xl
                              font-semibold
                              capitalize
                              leading-none
                            "
                          >
                            {result.name}
                          </h2>

                          <div className="mt-3 flex items-center gap-2 text-black/60">
                            <Tv className="h-4 w-4" />

                            <span>
                              {
                                result.anime
                              }
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Badge
                            className="
                              rounded-full
                              border
                              border-black/10
                              bg-black
                              px-4
                              py-2
                              text-white
                            "
                          >
                            {
                              result.genre
                            }
                          </Badge>

                          <Badge
                            className="
                              rounded-full
                              border
                              border-black/10
                              bg-white
                              px-4
                              py-2
                              text-black
                            "
                          >
                            <User className="mr-2 h-3 w-3" />

                            {result.type}
                          </Badge>
                        </div>
                      </div>

                      <div
                        className="
                          border-t
                          border-black/10
                          pt-6
                        "
                      >
                        <div
                          className="
                            mb-5
                            text-[11px]
                            uppercase
                            tracking-[0.3em]
                            text-black/40
                          "
                        >
                          Character Analysis
                        </div>

                        <div
                          className="
                            text-[15px]
                            leading-relaxed
                            text-black/70
                          "
                        >
                          {formatDescription(
                            result.description
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                >
                  <Card
                    className="
                      flex
                      min-h-[700px]
                      items-center
                      justify-center
                      rounded-[32px]
                      border
                      border-black/10
                      bg-white/70
                      text-black
                    "
                  >
                    <CardContent className="text-center">
                      <div
                        className="
                          mx-auto
                          flex
                          h-24
                          w-24
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-black/10
                          bg-[#F7F5F0]
                        "
                      >
                        <User className="h-10 w-10 text-black/50" />
                      </div>

                      <h3 className="mt-8 text-3xl font-semibold">
                        Awaiting Your Portrait
                      </h3>

                      <p
                        className="
                          mx-auto
                          mt-4
                          max-w-md
                          text-black/50
                        "
                      >
                        Upload a portrait to
                        discover your cinematic
                        anime identity powered
                        by AI.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AnimeMatcher;

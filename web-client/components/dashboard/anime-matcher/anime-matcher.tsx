"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Upload, Sparkles, User, Tv, ImageIcon, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { animeMatching } from "@/lib/apiProvider";
import { toast } from "sonner";
import Image from "next/image";
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<AnimeMatchResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const animeMatchMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file);
      const data = await animeMatching({ formData });
      return data;
    },
    onSuccess: (data) => {
      if (data && !data.SUCCESS) {
        toast.error(data.MESSAGE || "Failed to match anime character");
        return;
      }
      if (data && data.DATA) {
        console.log("Match result:", data.DATA);
        setResult(data.DATA);
        toast.success("Character matched successfully!");
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error("An error occurred while matching");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleSubmit = () => {
    if (selectedFile) {
      animeMatchMutation.mutate(selectedFile);
    } else {
      toast.error("Please select an image first");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const resultVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 20,
      },
    },
  };

  const formatDescription = (desc: string) => {
    return desc?.split("\n").map((line, idx) => (
      <p key={idx} className="mb-2 last:mb-0">
        {line.startsWith("- ") ? (
          <span className="flex items-start gap-2">
            <span className="text-purple-500 mt-1">•</span>
            <span dangerouslySetInnerHTML={{ __html: line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong class="text-purple-600 dark:text-purple-400">$1</strong>') }} />
          </span>
        ) : (
          line
        )}
      </p>
    ));
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <motion.div
        className="mx-auto w-auto desktop:max-w-5xl desktop:mr-36 lg:max-w-4xl mr-12 xlg:float-none float-right"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-pink-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Anime Character Matcher
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Upload your photo and discover which anime character you resemble!
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Upload Section */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-lg border-0 backdrop-blur-sm h-full">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-pink-500" />
                  Upload Your Photo
                </CardTitle>
                <CardDescription>
                  Drop an image or click to select from your device
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className={`
                    relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
                    transition-all duration-300 min-h-[300px] flex items-center justify-center
                    ${previewUrl
                      ? "border-pink-400 bg-pink-50/50 dark:bg-pink-950/20"
                      : "border-gray-300 dark:border-gray-700 hover:border-pink-400 hover:bg-pink-50/30 dark:hover:bg-pink-950/10"
                    }
                  `}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {previewUrl ? (
                    <div className="relative w-full h-full min-h-[250px]">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        fill
                        className="object-contain rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-16 h-16 mx-auto rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-pink-500" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                          Drag & drop your image here
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          or click to browse
                        </p>
                      </div>
                      <Badge variant="secondary" className="mt-2">
                        Supports JPG, PNG, WEBP
                      </Badge>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={!selectedFile || animeMatchMutation.isPending}
                  className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-6 text-lg"
                >
                  {animeMatchMutation.isPending ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Finding Your Match...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      Find My Anime Character
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Result Section */}
          <motion.div variants={itemVariants}>
            <AnimatePresence mode="wait">
              {animeMatchMutation.isPending ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Card className="shadow-lg border-0 backdrop-blur-sm h-full flex items-center justify-center min-h-[500px]">
                    <CardContent className="text-center py-12">
                      <div className="relative">
                        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-pink-500 to-purple-600 animate-pulse" />
                        <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full border-4 border-transparent border-t-pink-500 animate-spin" />
                      </div>
                      <p className="mt-6 text-lg font-medium text-gray-600 dark:text-gray-300">
                        Analyzing your features...
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Our AI is finding your anime twin
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : result ? (
                <motion.div
                  key="result"
                  variants={resultVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Card className="shadow-lg border-0 backdrop-blur-sm overflow-hidden">
                    <div className="relative bg-gradient-to-br from-pink-500/20 to-purple-600/20 flex items-center justify-center p-6">
                      <Image
                        src={`${BASE_URL}${result.image}`}
                        alt={result.name}
                        width={400}
                        height={400}
                        className="object-contain max-h-[320px] w-auto rounded-lg shadow-md"
                        unoptimized
                      />
                    </div>
                    <div className="bg-gradient-to-r from-pink-500/10 to-purple-600/10 px-6 py-4 border-b dark:border-gray-700">
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-white capitalize">
                        {result.name}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <Tv className="h-4 w-4 text-pink-500" />
                        <span className="text-pink-600 dark:text-pink-300">{result.anime}</span>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm px-3 py-1">
                          {result.genre}
                        </Badge>
                        <Badge variant="outline" className="border-purple-400 text-purple-600 dark:text-purple-400">
                          <User className="h-3 w-3 mr-1" />
                          {result.type}
                        </Badge>
                      </div>

                      <Separator className="my-4" />

                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                          About {result.name}
                        </h3>
                        <div className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                          {formatDescription(result.description)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Card className="shadow-lg border-0 backdrop-blur-sm h-full flex items-center justify-center min-h-[500px]">
                    <CardContent className="text-center py-12">
                      <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                        <User className="h-10 w-10 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Your Result Will Appear Here
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                        Upload a photo and click the button to discover which anime character matches your appearance!
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

"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";


const TerminalLoader = ({ completed, setCompleted, isVideoLoading, steps, progress, setProgress, progressPercent, currentStage }: {
  completed: boolean;
  setCompleted: (completed: boolean) => void;
  isVideoLoading: boolean;
  steps: {
    label: string;
    id: string;
    duration: number;
  }[];
  progress: any;
  setProgress: (progress: any) => void;
  progressPercent: number;
  currentStage: string;
}) => {
  const { resolvedTheme } = useTheme();

  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const lastStageRef = useRef<string>('');
  const completionLoggedRef = useRef(false);

  useEffect(() => {
    if (!currentStage) {
      return;
    }

    const statusLine = `$ ${currentStage} (${progressPercent}%)`;
    if (lastStageRef.current !== statusLine) {
      lastStageRef.current = statusLine;
      addTerminalLine(statusLine);
    }
  }, [currentStage, progressPercent]);

  useEffect(() => {
    if (completed && !completionLoggedRef.current) {
      completionLoggedRef.current = true;
      addTerminalLine("✔ All tasks completed successfully!");
      setCompleted(true);
    }
  }, [completed, setCompleted]);

  const addTerminalLine = (text: string) => {
    setTerminalLines(prev => [...prev, text]);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`rounded-lg overflow-hidden shadow-xl border 
          border-gray-200 bg-white text-zinc-900
          `}
      >
        {/* Terminal header */}
        <div
          className={`flex items-center px-4 py-3 bg-gray-100
            `}
        >
          <div className="flex space-x-2 mr-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="text-sm font-mono">
            generator-cli --process-video
          </div>
        </div>

        {/* Terminal body */}
        <div className="p-4 font-mono text-sm">
          <div className="mb-4">
            <div className="flex items-center">
              <span className={"text-violet-600"}>$</span>
              <span className="ml-2">Starting video generation pipeline...</span>
            </div>
            <div className={`mt-3 rounded-md border border-dashed px-3 py-2 text-xs opacity-90 border-sky-500}`}>
              <div className="flex items-center justify-between gap-3">
                <span>{currentStage || "Waiting for the first update..."}</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/10 /10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(Math.max(progressPercent, 0), 100)}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={`h-full rounded-full bg-sky-500`}
                />
              </div>
            </div>
          </div>

          {/* Progress steps */}
          <div className="space-y-6">
            {steps.map((step) => (
              <div key={step.id} className="flex items-start">
                <div className="flex-shrink-0 mt-1 mr-3">
                  {progress[step.id as keyof typeof progress] ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        className="text-emerald-400"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </motion.div>
                  ) : (
                    <motion.div
                      animate={{
                        opacity: [0.6, 1, 0.6],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className={`w-4 h-4 rounded-full bg-sky-500`}
                    />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span>{step.label}</span>
                    {!progress[step.id as keyof typeof progress] && (
                      <span className="text-xs opacity-70">
                        {`${step.duration}s`}
                      </span>
                    )}
                  </div>
                  {!progress[step.id as keyof typeof progress] && (
                    <div className={`h-1 mt-2 rounded-full bg-sky-500/40`} />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Terminal output */}
          <div
            className={`mt-6 min-h-[150px] p-3 rounded bg-gray-50`}
          >
            {terminalLines.map((line, index) => (
              <div key={index} className="mb-1">
                {line.startsWith("$") ? (
                  <>
                    <span className={"text-violet-600"}>$</span>
                    <span className="ml-2">{line.substring(2)}</span>
                  </>
                ) : line.startsWith("✓") ? (
                  <>
                    <span className="text-emerald-400">✓</span>
                    <span className="ml-2">{line.substring(2)}</span>
                  </>
                ) : (
                  line
                )}
              </div>
            ))}
            {!completed && isVideoLoading && (
              <div className="flex items-center">
                <span className={"text-violet-600"}>$</span>
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className={`ml-2 inline-block h-4 w-2 bg-zinc-800`}
                />
              </div>
            )}
          </div>

          {/* Completion message */}
          <AnimatePresence>
            {completed && !isVideoLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className={`mt-6 p-4 rounded-lg text-center bg-emerald-500 text-white`}
              >
                <div className="flex flex-col items-center justify-center">
                  <div className="flex items-center">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span className="font-bold">Video generation complete!</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default TerminalLoader;
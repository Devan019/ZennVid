"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

const TerminalLoader = ({ completed, setCompleted, isVideoLoading }: {
  completed: boolean;
  setCompleted: (completed: boolean) => void;
  isVideoLoading: boolean;
}) => {
  const { resolvedTheme } = useTheme();
  const [progress, setProgress] = useState({
    script: false,
    images: false,
    audio: false,
    captions: false,
    video: false,
  });
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [finalTime, setFinalTime] = useState<string | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const [fastSimulation, setFastSimulation] = useState(false);

  // Colors for both modes
  const colors = {
    dark: {
      background: "#1e1e1e",
      text: "#f8f8f8",
      accent: "#64ffda",
      success: "#50fa7b",
      error: "#ff5555",
      prompt: "#bd93f9",
      cursor: "#f8f8f0",
    },
    light: {
      background: "#f8f8f8",
      text: "#333333",
      accent: "#007acc",
      success: "#28a745",
      error: "#dc3545",
      prompt: "#6f42c1",
      cursor: "#333333",
    },
  };

  const currentColors = resolvedTheme === "dark" ? colors.dark : colors.light;

  const steps = [
    { id: "script", label: "Crafting your epic storyline", duration: 30 },
    { id: "images", label: "Painting vivid scenes in pixels", duration: 100 },
    { id: "audio", label: "Giving voices to your story", duration: 70 },
    { id: "captions", label: "Writing words on the screen", duration: 60 },
    { id: "video", label: "Stitching it all into a masterpiece", duration: 500 },
  ];

  const simulateFastProcess = async () => {
      const fastDurations = [500, 1000, 1500, 2000, 2500]; // Staggered durations

      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        addTerminalLine(`$ ${step.label}...`);

        await new Promise(resolve => setTimeout(resolve, fastDurations[i]));

        setProgress(prev => ({ ...prev, [step.id]: true }));
        addTerminalLine(`✓ ${step.label} completed`);
      }

      const endTime = Date.now();
      const totalSeconds = Math.floor((endTime - startTimeRef.current) / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      setFinalTime(`${minutes}m ${seconds}s`);

      setCompleted(true);
      addTerminalLine("✔ All tasks completed successfully!");
    };

  useEffect(() => {
    if (completed) {
      if (!fastSimulation) {
        setTimeout(async() => {
          await simulateFastProcess();
        }, 2000);
      }
    }
  }, [completed])


  useEffect(() => {
    const simulateProcess = async () => {
      for (const step of steps) {
        addTerminalLine(`$ ${step.label}...`);

        // Simulate the process duration
        if (!fastSimulation) {
          await new Promise(resolve => setTimeout(resolve, step.duration * 1000));
        }

        // Mark step as complete
        setProgress(prev => ({ ...prev, [step.id]: true }));
        addTerminalLine(`✓ ${step.label} completed`);
      }

      console.log("after over")

      // All steps completed
      if (!fastSimulation) {
        console.log("All steps completed", fastSimulation);
        const endTime = Date.now();
        const totalSeconds = Math.floor((endTime - startTimeRef.current) / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        setFinalTime(`${minutes}m ${seconds}s`);

        setCompleted(true);
        addTerminalLine("✔ All tasks completed successfully!");

        // Start fast simulation after 2 seconds
        setTimeout(() => {
          setFastSimulation(true);
          simulateFastProcess();
        }, 2000);
      }
    }; 

    simulateProcess();
  }, [fastSimulation]);

  const addTerminalLine = (text: string) => {
    setTerminalLines(prev => [...prev, text]);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`rounded-lg overflow-hidden shadow-xl border ${resolvedTheme === "dark" ? "border-gray-700" : "border-gray-200"
          }`}
        style={{
          backgroundColor: currentColors.background,
          color: currentColors.text,
        }}
      >
        {/* Terminal header */}
        <div
          className={`flex items-center px-4 py-3 ${resolvedTheme === "dark" ? "bg-gray-800" : "bg-gray-100"
            }`}
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
              <span style={{ color: currentColors.prompt }}>$</span>
              <span className="ml-2">Starting video generation pipeline...</span>
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
                        stroke={currentColors.success}
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
                      className="w-4 h-4 rounded-full"
                      style={{
                        backgroundColor: currentColors.accent,
                      }}
                    />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span>{step.label}</span>
                    {!progress[step.id as keyof typeof progress] && (
                      <span className="text-xs opacity-70">
                        {fastSimulation ? "..." : `${step.duration}s`}
                      </span>
                    )}
                  </div>
                  {!progress[step.id as keyof typeof progress] && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{
                        duration: fastSimulation ? 0.5 : step.duration,
                        ease: "linear",
                      }}
                      className="h-1 mt-2 rounded-full"
                      style={{
                        backgroundColor: currentColors.accent,
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Terminal output */}
          <div
            className={`mt-6 p-3 rounded ${resolvedTheme === "dark" ? "bg-gray-900" : "bg-gray-50"
              }`}
            style={{ minHeight: "150px" }}
          >
            {terminalLines.map((line, index) => (
              <div key={index} className="mb-1">
                {line.startsWith("$") ? (
                  <>
                    <span style={{ color: currentColors.prompt }}>$</span>
                    <span className="ml-2">{line.substring(2)}</span>
                  </>
                ) : line.startsWith("✓") ? (
                  <>
                    <span style={{ color: currentColors.success }}>✓</span>
                    <span className="ml-2">{line.substring(2)}</span>
                  </>
                ) : (
                  line
                )}
              </div>
            ))}
            {!completed && (
              <div className="flex items-center">
                <span style={{ color: currentColors.prompt }}>$</span>
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="ml-2"
                  style={{
                    backgroundColor: currentColors.cursor,
                    width: "8px",
                    height: "16px",
                    display: "inline-block",
                  }}
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
                className="mt-6 p-4 rounded-lg text-center"
                style={{
                  backgroundColor: currentColors.success,
                  color: resolvedTheme === "dark" ? "#000" : "#fff",
                }}
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
                  {finalTime && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="mt-2 text-sm"
                    >
                      Total processing time: {finalTime}
                    </motion.div>
                  )}
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
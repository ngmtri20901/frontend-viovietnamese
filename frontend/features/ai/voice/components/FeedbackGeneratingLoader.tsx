"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, FileText, Brain, Sparkles } from "lucide-react";
import { Progress } from "@/shared/components/ui/progress";

interface FeedbackGeneratingLoaderProps {
  isOpen: boolean;
}

const loadingStages = [
  {
    id: 1,
    message: "Analyzing conversation...",
    icon: Brain,
    progress: 0,
    targetProgress: 33,
    duration: 5000,
  },
  {
    id: 2,
    message: "Evaluating your performance...",
    icon: Sparkles,
    progress: 33,
    targetProgress: 66,
    duration: 5000,
  },
  {
    id: 3,
    message: "Generating feedback report...",
    icon: FileText,
    progress: 66,
    targetProgress: 100,
    duration: 5000,
  },
];

export function FeedbackGeneratingLoader({
  isOpen,
}: FeedbackGeneratingLoaderProps) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStageIndex(0);
      setProgress(0);
      return;
    }

    // Progress animation
    const currentStage = loadingStages[currentStageIndex];
    const progressIncrement =
      (currentStage.targetProgress - currentStage.progress) / 50;
    let currentProgress = currentStage.progress;

    const progressInterval = setInterval(() => {
      currentProgress += progressIncrement;
      if (currentProgress >= currentStage.targetProgress) {
        currentProgress = currentStage.targetProgress;
        clearInterval(progressInterval);
      }
      setProgress(currentProgress);
    }, currentStage.duration / 50);

    // Stage transition
    const stageTimer = setTimeout(() => {
      if (currentStageIndex < loadingStages.length - 1) {
        setCurrentStageIndex((prev) => prev + 1);
      }
    }, currentStage.duration);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(stageTimer);
    };
  }, [isOpen, currentStageIndex]);

  const currentStage = loadingStages[currentStageIndex];
  const Icon = currentStage.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4"
          >
            {/* Icon with spinning animation */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 blur-lg"
                />
                <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            {/* Current stage message */}
            <motion.div
              key={currentStage.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-center mb-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {currentStage.message}
              </h3>
              <p className="text-sm text-gray-500">
                This may take 10-15 seconds
              </p>
            </motion.div>

            {/* Progress bar */}
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{Math.round(progress)}%</span>
                <span>
                  Step {currentStageIndex + 1} of {loadingStages.length}
                </span>
              </div>
            </div>

            {/* Stage indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {loadingStages.map((stage, index) => (
                <div
                  key={stage.id}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index < currentStageIndex
                      ? "w-8 bg-green-500"
                      : index === currentStageIndex
                        ? "w-12 bg-blue-500"
                        : "w-8 bg-gray-200"
                  }`}
                />
              ))}
            </div>

            {/* Spinner at bottom */}
            <div className="flex justify-center mt-6">
              <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

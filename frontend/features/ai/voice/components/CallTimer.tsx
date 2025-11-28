"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface CallTimerProps {
  mode: "countdown" | "countup";
  startTime: number; // Unix timestamp in milliseconds
  maxDuration?: number; // For countdown mode (seconds)
  onComplete?: () => void; // Callback when countdown reaches zero
  className?: string;
}

export function CallTimer({
  mode,
  startTime,
  maxDuration,
  onComplete,
  className,
}: CallTimerProps) {
  const [timeDisplay, setTimeDisplay] = useState("00:00");
  const [timeStatus, setTimeStatus] = useState<
    "default" | "warning" | "danger"
  >("default");

  useEffect(() => {
    if (!startTime) return;

    const updateTimer = () => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);

      if (mode === "countup") {
        // Count-up mode: show elapsed time
        setTimeDisplay(formatTime(elapsed));
      } else if (mode === "countdown" && maxDuration) {
        // Countdown mode: show remaining time
        const remaining = Math.max(0, maxDuration - elapsed);
        setTimeDisplay(formatTime(remaining));

        // Update status based on remaining time
        if (remaining <= 30) {
          setTimeStatus("danger");
        } else if (remaining <= 120) {
          setTimeStatus("warning");
        } else {
          setTimeStatus("default");
        }

        // Trigger callback when countdown reaches zero
        if (remaining === 0 && onComplete) {
          onComplete();
        }
      }
    };

    // Update immediately
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [startTime, mode, maxDuration, onComplete]);

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, "0")}:${String(
        seconds
      ).padStart(2, "0")}`;
    }
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const getStatusColor = () => {
    if (mode === "countdown") {
      switch (timeStatus) {
        case "danger":
          return "bg-red-600";
        case "warning":
          return "bg-orange-500";
        default:
          return "bg-gray-800/70";
      }
    }
    return "bg-gray-800/70";
  };

  return (
    <div
      className={cn(
        "call-timer flex items-center gap-2",
        getStatusColor(),
        className
      )}
    >
      <Clock className="w-4 h-4" />
      <span className="font-mono">{timeDisplay}</span>
    </div>
  );
}

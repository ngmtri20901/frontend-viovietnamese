"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export interface UseCountdownOptions {
  /**
   * Initial countdown duration in seconds
   */
  initialSeconds: number;
  /**
   * Whether the countdown should start automatically
   * @default true
   */
  autoStart?: boolean;
  /**
   * Whether the user can skip/pause the countdown
   * @default false
   */
  canSkip?: boolean;
  /**
   * Callback when countdown completes
   */
  onComplete?: () => void;
  /**
   * Callback on each tick (every second)
   */
  onTick?: (secondsRemaining: number) => void;
}

export interface UseCountdownReturn {
  /**
   * Current seconds remaining
   */
  secondsRemaining: number;
  /**
   * Whether the countdown is currently running
   */
  isRunning: boolean;
  /**
   * Whether the countdown has completed
   */
  isComplete: boolean;
  /**
   * Progress percentage (0-100), increases as time elapses
   */
  progress: number;
  /**
   * Formatted time string (MM:SS)
   */
  formattedTime: string;
  /**
   * Start or resume the countdown
   */
  start: () => void;
  /**
   * Pause the countdown (only works if canSkip is true)
   */
  pause: () => void;
  /**
   * Reset the countdown to initial value
   */
  reset: () => void;
  /**
   * Skip to completion (only works if canSkip is true)
   */
  skip: () => void;
}

/**
 * Formats seconds into MM:SS format
 */
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Custom hook for countdown timer with mandatory wait feature
 *
 * @example
 * ```tsx
 * const { secondsRemaining, isComplete, formattedTime } = useCountdown({
 *   initialSeconds: 60,
 *   canSkip: false,
 *   onComplete: () => console.log('Timer finished!'),
 * });
 * ```
 */
export function useCountdown({
  initialSeconds,
  autoStart = true,
  canSkip = false,
  onComplete,
  onTick,
}: UseCountdownOptions): UseCountdownReturn {
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isComplete, setIsComplete] = useState(false);

  // Use refs for callbacks to avoid stale closures
  const onCompleteRef = useRef(onComplete);
  const onTickRef = useRef(onTick);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    onTickRef.current = onTick;
  }, [onTick]);

  // Main countdown effect
  useEffect(() => {
    if (!isRunning || isComplete) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        const next = prev - 1;

        // Call onTick callback
        if (onTickRef.current) {
          onTickRef.current(next);
        }

        // Check if complete
        if (next <= 0) {
          setIsComplete(true);
          setIsRunning(false);
          // Defer onComplete callback to avoid setState during render
          setTimeout(() => {
            if (onCompleteRef.current) {
              onCompleteRef.current();
            }
          }, 0);
          return 0;
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isComplete]);

  // Calculate progress (0-100, increases as time elapses)
  const progress =
    initialSeconds > 0
      ? ((initialSeconds - secondsRemaining) / initialSeconds) * 100
      : 100;

  // Format time for display
  const formattedTime = formatTime(secondsRemaining);

  // Control functions
  const start = useCallback(() => {
    if (!isComplete) {
      setIsRunning(true);
    }
  }, [isComplete]);

  const pause = useCallback(() => {
    if (canSkip) {
      setIsRunning(false);
    }
  }, [canSkip]);

  const reset = useCallback(() => {
    setSecondsRemaining(initialSeconds);
    setIsComplete(false);
    setIsRunning(autoStart);
  }, [initialSeconds, autoStart]);

  const skip = useCallback(() => {
    if (canSkip) {
      setSecondsRemaining(0);
      setIsComplete(true);
      setIsRunning(false);
      // Defer onComplete callback to avoid setState during render
      setTimeout(() => {
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      }, 0);
    }
  }, [canSkip]);

  return {
    secondsRemaining,
    isRunning,
    isComplete,
    progress,
    formattedTime,
    start,
    pause,
    reset,
    skip,
  };
}

/**
 * Color variant based on remaining time
 */
export type CountdownColorVariant = "default" | "warning" | "danger";

/**
 * Get color variant based on seconds remaining
 */
export function getCountdownColorVariant(
  secondsRemaining: number
): CountdownColorVariant {
  if (secondsRemaining <= 10) return "danger";
  if (secondsRemaining <= 30) return "warning";
  return "default";
}

/**
 * Get Tailwind color classes based on countdown variant
 */
export function getCountdownColorClasses(variant: CountdownColorVariant): {
  text: string;
  bg: string;
  border: string;
  progress: string;
} {
  switch (variant) {
    case "danger":
      return {
        text: "text-red-600 dark:text-red-400",
        bg: "bg-red-50 dark:bg-red-900/20",
        border: "border-red-200 dark:border-red-800",
        progress: "bg-red-500",
      };
    case "warning":
      return {
        text: "text-yellow-600 dark:text-yellow-400",
        bg: "bg-yellow-50 dark:bg-yellow-900/20",
        border: "border-yellow-200 dark:border-yellow-800",
        progress: "bg-yellow-500",
      };
    default:
      return {
        text: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-50 dark:bg-blue-900/20",
        border: "border-blue-200 dark:border-blue-800",
        progress: "bg-blue-500",
      };
  }
}

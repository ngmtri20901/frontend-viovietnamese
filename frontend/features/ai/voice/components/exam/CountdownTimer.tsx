"use client";

import { cn } from "@/shared/utils/cn";
import { Progress } from "@/shared/components/ui/progress";
import {
  useCountdown,
  getCountdownColorVariant,
  getCountdownColorClasses,
  type UseCountdownOptions,
} from "../../hooks/useCountdown";

export interface CountdownTimerProps
  extends Omit<UseCountdownOptions, "autoStart"> {
  /**
   * Additional class names for the container
   */
  className?: string;
  /**
   * Whether to show the progress bar
   * @default true
   */
  showProgress?: boolean;
  /**
   * Size variant of the timer display
   * @default "default"
   */
  size?: "sm" | "default" | "lg";
  /**
   * Label text shown above the timer
   */
  label?: string;
  /**
   * Description text shown below the timer
   */
  description?: string;
}

/**
 * Visual countdown timer component with progress bar and color coding
 *
 * @example
 * ```tsx
 * <CountdownTimer
 *   initialSeconds={60}
 *   canSkip={false}
 *   onComplete={() => setReadyToStart(true)}
 *   label="Preparation Time"
 *   description="Use this time to prepare your notes"
 * />
 * ```
 */
export function CountdownTimer({
  initialSeconds,
  canSkip = false,
  onComplete,
  onTick,
  className,
  showProgress = true,
  size = "default",
  label,
  description,
}: CountdownTimerProps) {
  const {
    secondsRemaining,
    isComplete,
    progress,
    formattedTime,
  } = useCountdown({
    initialSeconds,
    autoStart: true,
    canSkip,
    onComplete,
    onTick,
  });

  const colorVariant = getCountdownColorVariant(secondsRemaining);
  const colors = getCountdownColorClasses(colorVariant);

  // Size classes for the timer display
  const sizeClasses = {
    sm: "text-2xl",
    default: "text-4xl md:text-5xl",
    lg: "text-5xl md:text-6xl",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 p-6 rounded-xl border transition-colors duration-300",
        colors.bg,
        colors.border,
        className
      )}
    >
      {/* Label */}
      {label && (
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </p>
      )}

      {/* Timer Display */}
      <div
        className={cn(
          "font-mono font-bold tabular-nums transition-colors duration-300",
          sizeClasses[size],
          colors.text
        )}
        aria-live="polite"
        aria-atomic="true"
      >
        {formattedTime}
      </div>

      {/* Progress Bar */}
      {showProgress && (
        <div className="w-full max-w-xs">
          <Progress
            value={progress}
            className="h-2 bg-gray-200 dark:bg-gray-700"
            indicatorClassName={cn(
              "transition-all duration-1000",
              colors.progress
            )}
          />
        </div>
      )}

      {/* Description */}
      {description && !isComplete && (
        <p className="text-sm text-muted-foreground text-center max-w-sm">
          {description}
        </p>
      )}

      {/* Complete Message */}
      {isComplete && (
        <p className="text-sm font-medium text-green-600 dark:text-green-400">
          ✓ Time&apos;s up! You can start now.
        </p>
      )}

      {/* Cannot Skip Warning */}
      {!canSkip && !isComplete && (
        <p className="text-xs text-muted-foreground/70">
          Please wait for the countdown to complete
        </p>
      )}
    </div>
  );
}

/**
 * Compact version of the countdown timer for inline use
 */
export function CountdownTimerCompact({
  initialSeconds,
  canSkip = false,
  onComplete,
  onTick,
  className,
}: Omit<CountdownTimerProps, "showProgress" | "size" | "label" | "description">) {
  const { secondsRemaining, formattedTime } = useCountdown({
    initialSeconds,
    autoStart: true,
    canSkip,
    onComplete,
    onTick,
  });

  const colorVariant = getCountdownColorVariant(secondsRemaining);
  const colors = getCountdownColorClasses(colorVariant);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-1 rounded font-mono text-sm font-medium",
        colors.bg,
        colors.text,
        className
      )}
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      {formattedTime}
    </span>
  );
}

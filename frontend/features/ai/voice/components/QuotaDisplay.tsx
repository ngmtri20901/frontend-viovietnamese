"use client";

import { Progress } from "@/shared/components/ui/progress";
import { cn } from "@/shared/utils/cn";
import { formatSeconds, getQuotaPercentage } from "../core/entitlements";

interface QuotaDisplayProps {
  quota: VoiceQuota;
  subscriptionType: string;
  className?: string;
}

export function QuotaDisplay({ quota, subscriptionType, className }: QuotaDisplayProps) {
  const percentage = getQuotaPercentage(quota.usedSeconds, quota.limitSeconds);
  const isWarning = percentage >= 80 && !quota.isExceeded;
  const isDanger = quota.isExceeded;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium">Voice Time Used</span>
        <span className={cn(
          "font-mono",
          isDanger && "text-red-600 dark:text-red-400",
          isWarning && "text-yellow-600 dark:text-yellow-400",
          !isWarning && !isDanger && "text-gray-700 dark:text-gray-300"
        )}>
          {formatSeconds(quota.usedSeconds)} / {formatSeconds(quota.limitSeconds)}
        </span>
      </div>

      <Progress
        value={percentage}
        className="h-2 bg-gray-200 dark:bg-gray-700"
        indicatorClassName={cn(
          "transition-all duration-300",
          isDanger && "bg-red-500",
          isWarning && "bg-yellow-500",
          !isWarning && !isDanger && "bg-green-500"
        )}
      />

      {quota.isExceeded ? (
        <p className="text-xs text-red-600 dark:text-red-400">
          ⚠️ Quota exceeded. {quota.resetType === "monthly"
            ? `Resets on ${new Date(quota.resetDate!).toLocaleDateString()}`
            : "Upgrade to continue"}
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">
          {formatSeconds(quota.remainingSeconds)} remaining
          {quota.resetType === "monthly" && quota.resetDate &&
            ` (resets ${new Date(quota.resetDate).toLocaleDateString()})`}
        </p>
      )}
    </div>
  );
}

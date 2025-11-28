export type SubscriptionType = "FREE" | "PLUS" | "UNLIMITED";

export interface VoiceQuota {
  limitSeconds: number;
  usedSeconds: number;
  remainingSeconds: number;
  isExceeded: boolean;
  resetType: "never" | "monthly";
  resetDate?: string; // ISO date string for next reset
}

export interface VoiceEntitlements {
  maxSecondsPerPeriod: number;
  resetType: "never" | "monthly";
  displayName: string;
  description: string;
}

export const entitlementsBySubscription: Record<SubscriptionType, VoiceEntitlements> = {
  FREE: {
    maxSecondsPerPeriod: 60, // 1 minute lifetime
    resetType: "never",
    displayName: "Free Demo",
    description: "1 minute total for testing"
  },
  PLUS: {
    maxSecondsPerPeriod: 600, // 10 minutes per month
    resetType: "monthly",
    displayName: "Plus Practice",
    description: "10 minutes per month"
  },
  UNLIMITED: {
    maxSecondsPerPeriod: 3600, // 60 minutes per month
    resetType: "monthly",
    displayName: "AI Tutor",
    description: "60 minutes per month"
  }
};

/**
 * Formats seconds into MM:SS format
 */
export function formatSeconds(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Calculate quota usage percentage (0-100)
 */
export function getQuotaPercentage(used: number, limit: number): number {
  return limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
}

/**
 * Get the next monthly reset date (1st of next month)
 */
export function getNextResetDate(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 1);
}

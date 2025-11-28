"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  LANGUAGE_MODES,
  SCENARIO_TYPES,
  CONVERSATION_MODES,
  FEEDBACK_LANGUAGES,
  FEEDBACK_LANGUAGE_LABELS,
  type LanguageMode,
  type ScenarioType,
  type FeedbackLanguage,
} from "@/features/ai/voice/constants/vietnamese-voice";
import { createConversation, checkVoiceQuota } from "@/features/ai/voice/actions/voice.action";
import { QuotaDisplay } from "../QuotaDisplay";
import { useToast } from "@/shared/hooks/use-toast";
import { useUserProfile } from "@/shared/hooks/use-user-profile";

interface ScenarioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  userId: string;
}

export function ScenarioDialog({
  open,
  onOpenChange,
  userName,
  userId,
}: ScenarioDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { profile } = useUserProfile();

  const [languageMode, setLanguageMode] = useState<LanguageMode>(
    LANGUAGE_MODES.VIETNAMESE_ONLY
  );
  const [selectedScenario, setSelectedScenario] = useState<ScenarioType | null>(null);
  const [feedbackLanguage, setFeedbackLanguage] = useState<FeedbackLanguage>(
    FEEDBACK_LANGUAGES.VIETNAMESE
  );
  const [isLoading, setIsLoading] = useState(false);
  const [quota, setQuota] = useState<VoiceQuota | null>(null);
  const [isCheckingQuota, setIsCheckingQuota] = useState(true);

  // Check quota when dialog opens
  useEffect(() => {
    async function fetchQuota() {
      if (!open || !userId) return;

      setIsCheckingQuota(true);
      const result = await checkVoiceQuota(userId);
      setQuota(result.quota);
      setIsCheckingQuota(false);
    }

    fetchQuota();
  }, [open, userId]);

  const handleStart = async () => {
    if (!selectedScenario) return;

    setIsLoading(true);
    try {
      const result = await createConversation({
        topic: selectedScenario.title,
        difficultyLevel: "intermediate",
        conversationType: CONVERSATION_MODES.SCENARIO_BASED,
        prompts: [],
        feedbackLanguage,
      });

      if (result.success && result.data?.conversation) {
        const params = new URLSearchParams({
          conversationId: result.data.conversationId,
          mode: CONVERSATION_MODES.SCENARIO_BASED,
          languageMode,
          scenarioType: selectedScenario.id,
          scenarioTitle: selectedScenario.title,
          scenarioDescription: selectedScenario.context,
          userName,
          userId,
        });
        router.push(`/ai/voice/speak?${params.toString()}`);
      } else if (result.error === "voice_quota_exceeded") {
        // Show quota exceeded error
        toast({
          title: "Quota Exceeded",
          description: result.message || "You have exceeded your voice chat quota.",
          variant: "destructive"
        });
        // Refresh quota display
        const quotaCheck = await checkVoiceQuota(userId);
        setQuota(quotaCheck.quota);
      } else {
        toast({
          title: "Error",
          description: "Failed to create conversation",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error creating conversation:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Scenario Practice</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Quota Display */}
          {quota && (
            <QuotaDisplay
              quota={quota}
              subscriptionType={profile?.subscription_type || "FREE"}
              className="mb-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
            />
          )}

          {/* Language Mode */}
          <div className="space-y-3">
            <Label>Language Mode</Label>
            <RadioGroup
              value={languageMode}
              onValueChange={(value) => setLanguageMode(value as LanguageMode)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value={LANGUAGE_MODES.VIETNAMESE_ONLY}
                  id="vietnamese-only"
                />
                <Label htmlFor="vietnamese-only" className="font-normal cursor-pointer">
                  Vietnamese Only
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={LANGUAGE_MODES.BILINGUAL} id="bilingual" />
                <Label htmlFor="bilingual" className="font-normal cursor-pointer">
                  Bilingual (Vietnamese + English)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Scenario Selection */}
          <div className="space-y-3">
            <Label>Choose a Scenario</Label>
            <div className="grid grid-cols-2 gap-3">
              {SCENARIO_TYPES.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => setSelectedScenario(scenario)}
                  className={`p-4 border-2 rounded-lg text-left transition-all hover:border-blue-500 ${
                    selectedScenario?.id === scenario.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="text-3xl mb-2">{scenario.icon}</div>
                  <h3 className="font-semibold text-sm">{scenario.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{scenario.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Language */}
          <div className="space-y-2">
            <Label htmlFor="feedback-language">Feedback Language</Label>
            <Select
              value={feedbackLanguage}
              onValueChange={(value) => setFeedbackLanguage(value as FeedbackLanguage)}
            >
              <SelectTrigger id="feedback-language">
                <SelectValue placeholder="Select feedback language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={FEEDBACK_LANGUAGES.VIETNAMESE}>
                  {FEEDBACK_LANGUAGE_LABELS.vietnamese}
                </SelectItem>
                <SelectItem value={FEEDBACK_LANGUAGES.ENGLISH}>
                  {FEEDBACK_LANGUAGE_LABELS.english}
                </SelectItem>
                <SelectItem value={FEEDBACK_LANGUAGES.CHINESE}>
                  {FEEDBACK_LANGUAGE_LABELS.chinese}
                </SelectItem>
                <SelectItem value={FEEDBACK_LANGUAGES.KOREAN}>
                  {FEEDBACK_LANGUAGE_LABELS.korean}
                </SelectItem>
                <SelectItem value={FEEDBACK_LANGUAGES.JAPANESE}>
                  {FEEDBACK_LANGUAGE_LABELS.japanese}
                </SelectItem>
                <SelectItem value={FEEDBACK_LANGUAGES.FRENCH}>
                  {FEEDBACK_LANGUAGE_LABELS.french}
                </SelectItem>
                <SelectItem value={FEEDBACK_LANGUAGES.GERMAN}>
                  {FEEDBACK_LANGUAGE_LABELS.german}
                </SelectItem>
                <SelectItem value={FEEDBACK_LANGUAGES.ITALIAN}>
                  {FEEDBACK_LANGUAGE_LABELS.italian}
                </SelectItem>
                <SelectItem value={FEEDBACK_LANGUAGES.PORTUGUESE}>
                  {FEEDBACK_LANGUAGE_LABELS.portuguese}
                </SelectItem>
                <SelectItem value={FEEDBACK_LANGUAGES.RUSSIAN}>
                  {FEEDBACK_LANGUAGE_LABELS.russian}
                </SelectItem>
                <SelectItem value={FEEDBACK_LANGUAGES.SPANISH}>
                  {FEEDBACK_LANGUAGE_LABELS.spanish}
                </SelectItem>
                <SelectItem value={FEEDBACK_LANGUAGES.THAI}>
                  {FEEDBACK_LANGUAGE_LABELS.thai}
                </SelectItem>
                <SelectItem value={FEEDBACK_LANGUAGES.TURKISH}>
                  {FEEDBACK_LANGUAGE_LABELS.turkish}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {/* Upgrade prompt if quota exceeded */}
          {quota?.isExceeded && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                You&apos;ve used all your voice time.
                <Link href="/pricing" className="underline ml-1 font-medium hover:text-yellow-900 dark:hover:text-yellow-100">
                  Upgrade to get more
                </Link>
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleStart}
              disabled={!selectedScenario || isLoading || isCheckingQuota || quota?.isExceeded}
            >
              {quota?.isExceeded
                ? "Quota Exceeded"
                : isCheckingQuota
                ? "Checking quota..."
                : isLoading
                ? "Starting..."
                : "Start Practice"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

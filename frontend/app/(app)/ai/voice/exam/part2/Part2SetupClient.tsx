"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { createConversation } from "@/features/ai/voice/actions/voice.action";
import { CONVERSATION_MODES } from "@/features/ai/voice/constants/vietnamese-voice";
import { selectPart2Topic } from "@/features/ai/voice/utils/topic-randomizer";
import {
  EnvelopeSelector,
  CountdownTimer,
  PreparationNotes,
  encodeNotesForUrl,
} from "@/features/ai/voice/components/exam";

interface Part2SetupClientProps {
  userName: string;
  userId: string;
}

type Phase = "instructions" | "topic-selection" | "preparation" | "ready";

export function Part2SetupClient({ userName, userId }: Part2SetupClientProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("instructions");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Pre-select topic on component mount
  const selectedTopic = useMemo(() => selectPart2Topic(), []);

  const handleDrawTopic = () => {
    setPhase("topic-selection");
  };

  const handleTopicRevealed = () => {
    setPhase("preparation");
  };

  const handleCountdownComplete = () => {
    setPhase("ready");
  };

  const handleStart = async () => {
    setIsLoading(true);
    try {
      const result = await createConversation({
        topic: selectedTopic.title,
        conversationType: CONVERSATION_MODES.PART2_SOLUTION,
        topicSelected: {
          id: selectedTopic.id,
          title: selectedTopic.title,
          titleEn: selectedTopic.titleEn,
          description: selectedTopic.description,
          descriptionEn: selectedTopic.descriptionEn,
        },
        preparationTimeSeconds: 60,
      });

      if (result.success && result.data) {
        // Navigate to exam room with notes in query params
        const params = new URLSearchParams({
          mode: CONVERSATION_MODES.PART2_SOLUTION,
          userName,
          userId,
        });
        if (notes.trim()) {
          params.set("notes", encodeNotesForUrl(notes));
        }
        router.push(`/ai/voice/exam/${result.data.conversationId}?${params.toString()}`);
      }
    } catch (error) {
      console.error("Error creating conversation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/ai/voice"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <svg
          className="w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Voice Practice
      </Link>

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-4">
          <span className="text-3xl">💡</span>
        </div>
        <h1 className="text-3xl font-bold">Part 2: Solution Discussion</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Discuss solutions to a problem. You&apos;ll have 60 seconds to prepare,
          then discuss with the examiner for 3-5 minutes.
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center gap-2">
        {(["instructions", "topic-selection", "preparation", "ready"] as Phase[]).map(
          (p, idx) => (
            <div
              key={p}
              className={`w-3 h-3 rounded-full transition-colors ${
                phase === p
                  ? "bg-amber-500"
                  : (["instructions", "topic-selection", "preparation", "ready"] as Phase[]).indexOf(phase) > idx
                  ? "bg-amber-300"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            />
          )
        )}
      </div>

      {/* Phase 1: Instructions */}
      {phase === "instructions" && (
        <div className="space-y-6">
          {/* Test Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-amber-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Test Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-2xl font-bold text-amber-600">60s</p>
                  <p className="text-sm text-muted-foreground">Prep Time</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-2xl font-bold text-amber-600">3-5</p>
                  <p className="text-sm text-muted-foreground">Minutes <br></br>(included preparation time)</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-2xl font-bold text-amber-600">1</p>
                  <p className="text-sm text-muted-foreground">Topic</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Step
                  number={1}
                  title="Draw your topic"
                  description="Click an envelope to reveal your discussion topic"
                  color="amber"
                />
                <Step
                  number={2}
                  title="Prepare (60 seconds)"
                  description="Take notes and organize your thoughts"
                  color="amber"
                />
                <Step
                  number={3}
                  title="Discuss with examiner"
                  description="Propose solutions and answer follow-up questions"
                  color="amber"
                />
              </div>
            </CardContent>
          </Card>

          {/* Sample Topics */}
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="text-base">Sample Topics</CardTitle>
              <CardDescription>
                Topics focus on everyday problems requiring solutions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-amber-500">•</span>
                  Traffic congestion in cities
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-500">•</span>
                  Social media overuse among youth
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-500">•</span>
                  Environmental pollution
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Draw Topic Button */}
          <div className="flex justify-center pt-4">
            <Button
              size="lg"
              onClick={handleDrawTopic}
              className="px-12 py-6 text-lg bg-amber-500 hover:bg-amber-600"
            >
              Draw My Topic
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </Button>
          </div>
        </div>
      )}

      {/* Phase 2: Topic Selection (Envelope) */}
      {phase === "topic-selection" && (
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-8 pb-8">
              <EnvelopeSelector
                envelopeCount={4}
                topicTitle={selectedTopic.title}
                topicTitleEn={selectedTopic.titleEn}
                topicDescription={selectedTopic.description}
                onTopicRevealed={handleTopicRevealed}
                label="Pick an envelope to reveal your topic"
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Phase 3: Preparation */}
      {phase === "preparation" && (
        <div className="space-y-6">
          {/* Topic Display */}
          <Card className="border-amber-200 dark:border-amber-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Your Topic</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-xl font-bold mb-1">{selectedTopic.title}</h3>
              <p className="text-sm text-muted-foreground italic mb-3">
                {selectedTopic.titleEn}
              </p>
              <p className="text-sm">{selectedTopic.description}</p>
            </CardContent>
          </Card>

          {/* Countdown Timer */}
          <CountdownTimer
            initialSeconds={60}
            canSkip={false}
            onComplete={handleCountdownComplete}
            label="Preparation Time"
            description="Use this time to organize your thoughts and take notes"
            size="lg"
          />

          {/* Notes Editor */}
          <Card>
            <CardContent className="pt-6">
              <PreparationNotes
                value={notes}
                onChange={setNotes}
                maxLength={1000}
                label="Your Notes"
                placeholder="• Problem analysis:&#10;• Solution 1:&#10;• Solution 2:&#10;• Pros/Cons:"
                autoFocus
              />
            </CardContent>
          </Card>

          {/* Tips */}
          <div className="text-sm text-muted-foreground bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
            <p className="font-medium mb-2">💡 Tips for your notes:</p>
            <ul className="space-y-1 ml-4">
              <li>• Identify the main problem</li>
              <li>• Think of 2-3 possible solutions</li>
              <li>• Consider pros and cons of each solution</li>
              <li>• Prepare to explain your reasoning</li>
            </ul>
          </div>
        </div>
      )}

      {/* Phase 4: Ready */}
      {phase === "ready" && (
        <div className="space-y-6">
          {/* Topic Summary */}
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Ready to Start
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Your Topic:</p>
                  <p className="font-semibold">{selectedTopic.title}</p>
                </div>
                {notes.trim() && (
                  <div>
                    <p className="text-sm text-muted-foreground">Your Notes:</p>
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mt-1">
                      <p className="text-sm whitespace-pre-wrap font-mono">
                        {notes.length > 200 ? `${notes.slice(0, 200)}...` : notes}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Start Button */}
          <div className="flex justify-center pt-4">
            <Button
              size="lg"
              onClick={handleStart}
              disabled={isLoading}
              className="px-12 py-6 text-lg bg-green-600 hover:bg-green-700"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Starting...
                </>
              ) : (
                <>
                  Start Discussion
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </>
              )}
            </Button>
          </div>

          {/* Note about notes visibility */}
          <p className="text-center text-xs text-muted-foreground">
            Your notes will be visible during the discussion for reference.
          </p>
        </div>
      )}
    </div>
  );
}

// Helper Component
function Step({
  number,
  title,
  description,
  color = "blue",
}: {
  number: number;
  title: string;
  description: string;
  color?: "blue" | "amber" | "purple";
}) {
  const colorClasses = {
    blue: "bg-blue-500",
    amber: "bg-amber-500",
    purple: "bg-purple-500",
  };

  return (
    <div className="flex items-start gap-4">
      <div
        className={`shrink-0 w-8 h-8 rounded-full ${colorClasses[color]} text-white flex items-center justify-center font-bold text-sm`}
      >
        {number}
      </div>
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

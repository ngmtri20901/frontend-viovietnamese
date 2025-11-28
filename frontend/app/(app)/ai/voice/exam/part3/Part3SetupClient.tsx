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
import { selectPart3Topic } from "@/features/ai/voice/utils/topic-randomizer";
import {
  EnvelopeSelector,
  CountdownTimer,
  StructuredNotes,
  encodeStructuredNotesForUrl,
} from "@/features/ai/voice/components/exam";

interface Part3SetupClientProps {
  userName: string;
  userId: string;
}

type Phase = "instructions" | "topic-selection" | "preparation" | "ready";

interface StructuredNotesValue {
  introduction: string;
  mainPoints: string;
  conclusion: string;
}

export function Part3SetupClient({ userName, userId }: Part3SetupClientProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("instructions");
  const [notes, setNotes] = useState<StructuredNotesValue>({
    introduction: "",
    mainPoints: "",
    conclusion: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Pre-select a single random topic on component mount
  const selectedTopic = useMemo(() => selectPart3Topic(), []);

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
        conversationType: CONVERSATION_MODES.PART3_PRESENTATION,
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
          mode: CONVERSATION_MODES.PART3_PRESENTATION,
          userName,
          userId,
        });
        const hasNotes =
          notes.introduction.trim() ||
          notes.mainPoints.trim() ||
          notes.conclusion.trim();
        if (hasNotes) {
          params.set("notes", encodeStructuredNotesForUrl(notes));
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
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-4">
          <span className="text-3xl">🎤</span>
        </div>
        <h1 className="text-3xl font-bold">Part 3: Topic Presentation</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Present on a topic, then answer follow-up questions.
          You&apos;ll have 60 seconds to prepare your presentation.
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
                  ? "bg-purple-500"
                  : (["instructions", "topic-selection", "preparation", "ready"] as Phase[]).indexOf(phase) > idx
                  ? "bg-purple-300"
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
                  className="w-5 h-5 text-purple-500"
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
                  <p className="text-2xl font-bold text-purple-600">60s</p>
                  <p className="text-sm text-muted-foreground">Prep Time</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">~7</p>
                  <p className="text-sm text-muted-foreground">Minutes <br></br>(1 min prep + ~6 min talk)</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">2</p>
                  <p className="text-sm text-muted-foreground">Phases</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Presentation → Follow-up Q&A (1-3 questions)
              </p>
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
                  description="Click an envelope to reveal your presentation topic"
                  color="purple"
                />
                <Step
                  number={2}
                  title="Prepare (60 seconds)"
                  description="Organize your thoughts: introduction, main points, conclusion"
                  color="purple"
                />
                <Step
                  number={3}
                  title="Present & answer questions"
                  description="Present your topic, then answer 1-3 follow-up questions"
                  color="purple"
                />
              </div>
            </CardContent>
          </Card>

          {/* Sample Topics */}
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="text-base">Sample Topics</CardTitle>
              <CardDescription>
                Topics cover various aspects of life, culture, and society
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-purple-500">•</span>
                  Famous landmarks and tourist attractions
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-500">•</span>
                  Role of technology in modern life
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-500">•</span>
                  Traditional culture and customs
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Draw Topic Button */}
          <div className="flex justify-center pt-4">
            <Button
              size="lg"
              onClick={handleDrawTopic}
              className="px-12 py-6 text-lg bg-purple-500 hover:bg-purple-600"
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
          <Card className="border-purple-200 dark:border-purple-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-purple-500">🎯</span>
                Your Topic
              </CardTitle>
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
            description="Organize your presentation: introduction, main points, and conclusion"
            size="lg"
          />

          {/* Structured Notes */}
          <Card>
            <CardContent className="pt-6">
              <StructuredNotes value={notes} onChange={setNotes} />
            </CardContent>
          </Card>

          {/* Tips */}
          <div className="text-sm text-muted-foreground bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <p className="font-medium mb-2">🎤 Presentation Tips:</p>
            <ul className="space-y-1 ml-4">
              <li>• Start with a hook or interesting introduction</li>
              <li>• Present 2-3 main points with examples</li>
              <li>• End with a clear conclusion</li>
              <li>• Be ready for follow-up questions</li>
            </ul>
          </div>
        </div>
      )}

      {/* Phase 4: Ready */}
      {phase === "ready" && (
        <div className="space-y-6">
          {/* Summary */}
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
                Ready to Present
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Your Topic:</p>
                  <p className="font-semibold">{selectedTopic.title}</p>
                </div>

                {/* Notes Preview */}
                {(notes.introduction || notes.mainPoints || notes.conclusion) && (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">Your Outline:</p>
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg space-y-2 text-sm">
                      {notes.introduction && (
                        <div>
                          <span className="font-medium text-purple-600">Intro: </span>
                          <span className="text-muted-foreground">
                            {notes.introduction.slice(0, 50)}
                            {notes.introduction.length > 50 && "..."}
                          </span>
                        </div>
                      )}
                      {notes.mainPoints && (
                        <div>
                          <span className="font-medium text-purple-600">Main: </span>
                          <span className="text-muted-foreground">
                            {notes.mainPoints.slice(0, 50)}
                            {notes.mainPoints.length > 50 && "..."}
                          </span>
                        </div>
                      )}
                      {notes.conclusion && (
                        <div>
                          <span className="font-medium text-purple-600">Conclusion: </span>
                          <span className="text-muted-foreground">
                            {notes.conclusion.slice(0, 50)}
                            {notes.conclusion.length > 50 && "..."}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* What to Expect */}
                <div className="pt-2 border-t">
                  <p className="text-sm font-medium mb-2">What to Expect:</p>
                  <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
                    <li>Present your topic (main presentation)</li>
                    <li>The examiner will listen without interrupting</li>
                    <li>Answer 1-3 follow-up questions from the examiner</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Start Button */}
          <div className="flex justify-center pt-4">
            <Button
              size="lg"
              onClick={handleStart}
              disabled={isLoading}
              className="px-12 py-6 text-lg bg-purple-600 hover:bg-purple-700"
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
                  Start Presentation
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

          {/* Note */}
          <p className="text-center text-xs text-muted-foreground">
            Your notes will be visible during the presentation for reference.
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
  color = "purple",
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

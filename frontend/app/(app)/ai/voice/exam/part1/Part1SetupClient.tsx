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
import { Badge } from "@/shared/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
import { createConversation } from "@/features/ai/voice/actions/voice.action";
import { CONVERSATION_MODES } from "@/features/ai/voice/constants/vietnamese-voice";
import { selectPart1TopicsAndQuestions } from "@/features/ai/voice/utils/topic-randomizer";
import type { Part1Topic } from "@/features/ai/voice/constants/exam-questions";

interface Part1SetupClientProps {
  userName: string;
  userId: string;
}

export function Part1SetupClient({ userName, userId }: Part1SetupClientProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Pre-select topics and questions on component mount
  const { topics, questions } = useMemo(() => {
    return selectPart1TopicsAndQuestions(2, 10);
  }, []);

  const handleStart = async () => {
    setIsLoading(true);
    try {
      const result = await createConversation({
        topic: topics.map((t) => t.nameVi).join(", "),
        conversationType: CONVERSATION_MODES.PART1_SOCIAL,
        topicSelected: { topics, questions },
        preparationTimeSeconds: 0,
      });

      if (result.success && result.data) {
        // Navigate to exam room
        const params = new URLSearchParams({
          mode: CONVERSATION_MODES.PART1_SOCIAL,
          userName,
          userId,
        });
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
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
          <span className="text-3xl">👤</span>
        </div>
        <h1 className="text-3xl font-bold">Part 1: Social Communication</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Answer simple questions about personal topics. This part tests your ability
          to communicate in everyday social situations.
        </p>
      </div>

      {/* Test Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-500"
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
              <p className="text-2xl font-bold text-blue-600">2-3</p>
              <p className="text-sm text-muted-foreground">Minutes</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">3-6</p>
              <p className="text-sm text-muted-foreground">Questions</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">2</p>
              <p className="text-sm text-muted-foreground">Topics</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Topics */}
      <Card>
        <CardHeader>
          <CardTitle>Your Topics</CardTitle>
          <CardDescription>
            You will be asked questions from these two topics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {topics.map((topic) => (
              <TopicBadge key={topic.id} topic={topic} />
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            💡 Topics are randomly selected. Questions will cover both topics.
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
              title="Listen to the question"
              description="The AI examiner will ask you a question in Vietnamese"
            />
            <Step
              number={2}
              title="Answer naturally"
              description="Respond in Vietnamese with a complete answer (2-3 sentences)"
            />
            <Step
              number={3}
              title="Continue to next question"
              description="The examiner will move to the next question after your answer"
            />
          </div>
        </CardContent>
      </Card>

      {/* Rules Accordion */}
      <Accordion type="single" collapsible>
        <AccordionItem value="rules">
          <AccordionTrigger>📋 Exam Rules & Tips</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Rules:</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Speak only in Vietnamese during the test</li>
                  <li>Answer all questions to the best of your ability</li>
                  <li>The examiner will not provide corrections during the test</li>
                  <li>You cannot go back to previous questions</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Tips for Success:</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Give complete answers (avoid just &quot;yes&quot; or &quot;no&quot;)</li>
                  <li>Use examples to support your answers</li>
                  <li>Speak clearly and at a natural pace</li>
                  <li>If you don&apos;t understand, ask the examiner to repeat</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Sample Questions Preview */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base">Sample Questions Preview</CardTitle>
          <CardDescription>
            Here are a few example questions (actual questions may vary)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {questions.slice(0, 3).map((q, idx) => (
              <li key={`${q.id}-${idx}`} className="flex items-start gap-2 text-sm">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center text-xs font-medium">
                  {idx + 1}
                </span>
                <div>
                  <p className="font-medium">{q.questionVi}</p>
                  <p className="text-muted-foreground text-xs">{q.questionEn}</p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Start Button */}
      <div className="flex justify-center pt-4">
        <Button
          size="lg"
          onClick={handleStart}
          disabled={isLoading}
          className="px-12 py-6 text-lg"
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
              Start Test
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

      {/* Footer Note */}
      <p className="text-center text-xs text-muted-foreground">
        No preparation time needed. The test will start immediately.
      </p>
    </div>
  );
}

// Helper Components
function TopicBadge({ topic }: { topic: Part1Topic }) {
  return (
    <Badge variant="secondary" className="px-4 py-2 text-sm">
      <span className="mr-2">📌</span>
      {topic.nameVi}
      <span className="ml-2 text-xs text-muted-foreground">({topic.nameEn})</span>
    </Badge>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm">
        {number}
      </div>
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

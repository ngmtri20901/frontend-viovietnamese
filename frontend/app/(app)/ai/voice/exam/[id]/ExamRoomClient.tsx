"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/shared/utils/cn";
import { vapi } from "@/features/ai/voice/vapi.sdk";
import {
  getAssistantIdForMode,
  CONVERSATION_MODES,
  CONVERSATION_MODE_LABELS,
  type Part1Variables,
  type Part2Variables,
  type Part3Variables,
} from "@/features/ai/voice/constants/vietnamese-voice";
import {
  createFeedback,
  createTranscript,
  updateConversation,
} from "@/features/ai/voice/actions/voice.action";
import {
  decodeNotesFromUrl,
  decodeStructuredNotesFromUrl,
} from "@/features/ai/voice/components/exam";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { CallTimer } from "@/features/ai/voice/components/CallTimer";
import { FeedbackGeneratingLoader } from "@/features/ai/voice/components/FeedbackGeneratingLoader";
import { VoiceCallInterface } from "@/features/ai/voice/components/VoiceCallInterface";
import { CallConnectingLoader } from "@/features/ai/voice/components/CallConnectingLoader";

// =====================================================
// TYPES
// =====================================================

interface ExamRoomClientProps {
  conversationId: string;
  userName: string;
  userId: string;
  mode: "part1_social" | "part2_solution" | "part3_presentation";
  topic: string;
  topicSelected?: Record<string, unknown> | null;
  preparationNotes?: string | null;
  examQuestions?: Record<string, unknown>[] | null;
  feedbackId?: string;
}

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

interface Message {
  type: string;
  transcriptType?: string;
  role: "user" | "system" | "assistant";
  transcript: string;
}

// =====================================================
// COMPONENT
// =====================================================

export function ExamRoomClient({
  conversationId,
  userName,
  userId,
  mode,
  topic,
  topicSelected,
  preparationNotes,
  examQuestions,
  feedbackId,
}: ExamRoomClientProps) {
  const router = useRouter();

  // Call state
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStartTime, setCallStartTime] = useState<number>(0);
  const [sequenceNumber, setSequenceNumber] = useState<number>(0);

  // UI state
  const [showNotes, setShowNotes] = useState(true);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);

  // Parse preparation notes
  const parsedNotes = useMemo(() => {
    if (!preparationNotes) return null;

    // Try to parse as structured notes (Part 3)
    try {
      const structured = decodeStructuredNotesFromUrl(preparationNotes);
      if (structured.introduction || structured.mainPoints || structured.conclusion) {
        return { type: "structured" as const, data: structured };
      }
    } catch {
      // Not structured notes
    }

    // Try to parse as simple notes (Part 2)
    try {
      const simple = decodeNotesFromUrl(preparationNotes);
      if (simple) {
        return { type: "simple" as const, data: simple };
      }
    } catch {
      // Not encoded notes
    }

    // Plain text
    if (preparationNotes.trim()) {
      return { type: "simple" as const, data: preparationNotes };
    }

    return null;
  }, [preparationNotes]);

  // Get mode-specific info
  const modeInfo = useMemo(() => {
    switch (mode) {
      case CONVERSATION_MODES.PART1_SOCIAL:
        return {
          label: CONVERSATION_MODE_LABELS[mode],
          color: "blue",
          icon: "💬",
          description: "Answer questions about yourself and daily life",
          duration: "~3 minutes",
          maxDurationSeconds: 180, // 3 minutes
        };
      case CONVERSATION_MODES.PART2_SOLUTION:
        return {
          label: CONVERSATION_MODE_LABELS[mode],
          color: "green",
          icon: "💡",
          description: "Discuss the problem and propose solutions",
          duration: "3-5 minutes",
          maxDurationSeconds: 240, // 4 minutes
        };
      case CONVERSATION_MODES.PART3_PRESENTATION:
        return {
          label: CONVERSATION_MODE_LABELS[mode],
          color: "purple",
          icon: "🎤",
          description: "Present your topic, then answer follow-up questions",
          duration: "~7 minutes",
          maxDurationSeconds: 360, // 7 minutes
        };
      default:
        return {
          label: "Exam",
          color: "gray",
          icon: "📝",
          description: "Speaking test",
          duration: "5 minutes",
          maxDurationSeconds: 300, // 5 minutes
        };
    }
  }, [mode]);

  // Build VAPI variables based on mode
  const vapiVariables = useMemo((): Record<string, unknown> => {
    const baseVars = {
      userName,
      userId,
    };

    switch (mode) {
      case CONVERSATION_MODES.PART1_SOCIAL: {
        const part1Vars: Part1Variables = {
          ...baseVars,
          selectedTopics: topicSelected
            ? JSON.stringify((topicSelected as { topics?: { id: string }[] }).topics?.map(t => t.id) || [])
            : "[]",
          allQuestions: examQuestions
            ? JSON.stringify(examQuestions)
            : "[]",
        };
        return part1Vars as unknown as Record<string, unknown>;
      }

      case CONVERSATION_MODES.PART2_SOLUTION: {
        const topicData = topicSelected as {
          title?: string;
          description?: string;
        } | null;
        const part2Vars: Part2Variables = {
          ...baseVars,
          topicTitle: topicData?.title || topic,
          topicDescription: topicData?.description || "",
          preparationTime: 60,
        };
        return part2Vars as unknown as Record<string, unknown>;
      }

      case CONVERSATION_MODES.PART3_PRESENTATION: {
        const topicData = topicSelected as {
          id?: string;
          title?: string;
          description?: string;
        } | null;
        const part3Vars: Part3Variables = {
          ...baseVars,
          topicId: topicData?.id || "",
          topicTitle: topicData?.title || topic,
          topicDescription: topicData?.description || "",
          preparationTime: 60,
        };
        return part3Vars as unknown as Record<string, unknown>;
      }

      default:
        return baseVars;
    }
  }, [mode, userName, userId, topic, topicSelected, examQuestions]);

  // VAPI event handlers
  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
      setCallStartTime(Date.now());
      setSequenceNumber(0);
    };

    const onCallEnd = async () => {
      setCallStatus(CallStatus.FINISHED);

      // Update conversation on call end
      const durationSeconds = Math.floor((Date.now() - callStartTime) / 1000);
      const userMessageCount = messages.filter((m) => m.role === "user").length;

      await updateConversation({
        conversationId,
        durationSeconds,
        messageCount: messages.length,
        userMessageCount,
        status: "completed",
        isCompleted: true,
        completedAt: new Date().toISOString(),
      });
    };

    const onMessage = async (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);

        // Save transcript to database
        const currentSequence = sequenceNumber;
        setSequenceNumber((prev) => prev + 1);

        await createTranscript({
          conversationId,
          role: message.role as "user" | "assistant" | "system",
          content: message.transcript,
          timestampMs: Date.now() - callStartTime,
          sequenceNumber: currentSequence,
          vapiMessageType: message.type,
          vapiTranscriptType: message.transcriptType,
          rawVapiData: message as unknown as Record<string, unknown>,
        });
      }
    };

    const onSpeechStart = () => {
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.error("Vapi Error:", error);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, [conversationId, callStartTime, messages, sequenceNumber]);

  // Handle feedback generation when call ends (auto-generate for exam mode)
  useEffect(() => {
    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
      setIsGeneratingFeedback(true);
      console.log("Generating feedback for exam:", conversationId);

      // For exams, feedback language is always Vietnamese
      const { success, data } = await createFeedback({
        conversationId,
        transcript: messages,
        feedbackId,
        feedbackLanguage: 'vietnamese',
      });

      setIsGeneratingFeedback(false);

      if (success && data) {
        // Navigate to exam feedback page
        router.push(`/ai/voice/exam/${conversationId}/feedback`);
      } else {
        console.error("Error generating feedback");
        router.push("/ai/voice");
      }
    };

    if (callStatus === CallStatus.FINISHED && messages.length > 0) {
      handleGenerateFeedback(messages);
    }
  }, [callStatus, messages, feedbackId, conversationId, router]);

  // Start call handler
  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    const assistantId = getAssistantIdForMode(mode);

    await vapi.start(assistantId, {
      variableValues: vapiVariables,
    });
  };

  // End call handler
  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  return (
    <div className="space-y-6">
      {/* Call Timer - Fixed position in upper right (countdown mode for exam) */}
      {callStatus === CallStatus.ACTIVE && (
        <CallTimer
          mode="countdown"
          startTime={callStartTime}
          maxDuration={modeInfo.maxDurationSeconds}
          onComplete={handleDisconnect}
          className="fixed top-4 right-4"
        />
      )}

      {/* Feedback Generating Loader */}
      <FeedbackGeneratingLoader isOpen={isGeneratingFeedback} />

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
        <div
          className={cn(
            "inline-flex items-center justify-center w-16 h-16 rounded-full mb-4",
            modeInfo.color === "blue" && "bg-blue-100 dark:bg-blue-900/30",
            modeInfo.color === "green" && "bg-green-100 dark:bg-green-900/30",
            modeInfo.color === "purple" && "bg-purple-100 dark:bg-purple-900/30"
          )}
        >
          <span className="text-3xl">{modeInfo.icon}</span>
        </div>
        <h1 className="text-2xl font-bold">{modeInfo.label}</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          {modeInfo.description}
        </p>
      </div>

      {/* Topic Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <span className={cn(
              modeInfo.color === "blue" && "text-blue-500",
              modeInfo.color === "green" && "text-green-500",
              modeInfo.color === "purple" && "text-purple-500"
            )}>
              🎯
            </span>
            Your Topic
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-semibold text-lg">{topic}</p>
          {topicSelected && (topicSelected as { titleEn?: string }).titleEn && (
            <p className="text-sm text-muted-foreground italic mt-1">
              {(topicSelected as { titleEn: string }).titleEn}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Notes Panel (collapsible) */}
      {parsedNotes && (
        <Card className="border-dashed">
          <CardHeader
            className="pb-2 cursor-pointer"
            onClick={() => setShowNotes(!showNotes)}
          >
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span>📝</span>
                Your Notes
              </span>
              <motion.span
                animate={{ rotate: showNotes ? 180 : 0 }}
                transition={{ duration: 0.2 }}
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
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </motion.span>
            </CardTitle>
          </CardHeader>
          <AnimatePresence>
            {showNotes && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CardContent className="pt-0">
                  {parsedNotes.type === "structured" ? (
                    <div className="space-y-3 text-sm">
                      {parsedNotes.data.introduction && (
                        <div>
                          <span className="font-medium text-purple-600">Introduction: </span>
                          <span className="text-muted-foreground">
                            {parsedNotes.data.introduction}
                          </span>
                        </div>
                      )}
                      {parsedNotes.data.mainPoints && (
                        <div>
                          <span className="font-medium text-purple-600">Main Points: </span>
                          <span className="text-muted-foreground">
                            {parsedNotes.data.mainPoints}
                          </span>
                        </div>
                      )}
                      {parsedNotes.data.conclusion && (
                        <div>
                          <span className="font-medium text-purple-600">Conclusion: </span>
                          <span className="text-muted-foreground">
                            {parsedNotes.data.conclusion}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {parsedNotes.data}
                    </p>
                  )}
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      )}

      {/* Call Connection State */}
      {callStatus === CallStatus.CONNECTING && (
        <CallConnectingLoader isConnecting={true} />
      )}

      {/* Main Call Interface - 65/35 Layout with Transcript Toggle */}
      {callStatus === CallStatus.ACTIVE && (
        <VoiceCallInterface
          userName={userName}
          topicTitle={topic}
          isSpeaking={isSpeaking}
          isActive={callStatus === CallStatus.ACTIVE}
          messages={messages.map((m, i) => ({
            ...m,
            timestamp: callStartTime + (i * 1000)
          }))}
          isExamMode={true}
          showTranscriptToggle={true}
          callStartTime={callStartTime}
        />
      )}

      {/* Call Controls */}
      <div className="w-full flex justify-center mt-6">
        {callStatus !== CallStatus.ACTIVE ? (
          <button
            className="btn-call"
            onClick={handleCall}
            disabled={callStatus === CallStatus.CONNECTING}
          >
            {callStatus === CallStatus.INACTIVE
              ? "Start Exam"
              : callStatus === CallStatus.CONNECTING
              ? "Connecting..."
              : "Continue Exam"}
          </button>
        ) : (
          <button className="btn-disconnect" onClick={handleDisconnect}>
            End Exam
          </button>
        )}
      </div>

      {/* Status Info - Exam completed message (feedback loader handles the generation UI) */}
      {callStatus === CallStatus.FINISHED && !isGeneratingFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30">
            <svg
              className="w-8 h-8 text-green-600"
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
          </div>
          <div>
            <h3 className="text-lg font-semibold">Exam Completed!</h3>
            <p className="text-muted-foreground text-sm">
              Preparing your feedback...
            </p>
          </div>
        </motion.div>
      )}

      {/* Tips Section */}
      {callStatus === CallStatus.INACTIVE && (
        <div
          className={cn(
            "text-sm p-4 rounded-lg",
            modeInfo.color === "blue" && "bg-blue-50 dark:bg-blue-900/20",
            modeInfo.color === "green" && "bg-green-50 dark:bg-green-900/20",
            modeInfo.color === "purple" && "bg-purple-50 dark:bg-purple-900/20"
          )}
        >
          <p className="font-medium mb-2">💡 Tips for success:</p>
          <ul className="space-y-1 ml-4 text-muted-foreground">
            {mode === CONVERSATION_MODES.PART1_SOCIAL && (
              <>
                <li>• Answer naturally and expand on your answers</li>
                <li>• Include examples from your personal experience</li>
                <li>• Speak clearly and at a natural pace</li>
              </>
            )}
            {mode === CONVERSATION_MODES.PART2_SOLUTION && (
              <>
                <li>• Identify the key problem first</li>
                <li>• Present 2-3 practical solutions</li>
                <li>• Explain pros and cons of each solution</li>
              </>
            )}
            {mode === CONVERSATION_MODES.PART3_PRESENTATION && (
              <>
                <li>• Start with an engaging introduction</li>
                <li>• Present your main points with examples</li>
                <li>• Summarize your key points in the conclusion</li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

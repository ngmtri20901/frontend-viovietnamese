"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { vapi } from "@/features/ai/voice/vapi.sdk";
import {
  getAssistantIdForMode,
  type ConversationMode,
  type FreeTalkVariables,
  type ScenarioVariables,
  type Part1Variables,
  type Part2Variables,
  type Part3Variables,
} from "@/features/ai/voice/constants/vietnamese-voice";
import {
  createFeedback,
  createTranscript,
  updateConversation,
  getConversationById,
} from "@/features/ai/voice/actions/voice.action";
import type { AgentProps } from "@/features/ai/voice/types";
import { CallTimer } from "./CallTimer";
import { CallConnectingLoader } from "./CallConnectingLoader";
import { FeedbackGeneratingLoader } from "./FeedbackGeneratingLoader";
import { VoiceCallInterface } from "./VoiceCallInterface";
import { Button } from "@/shared/components/ui/button";
import { MessageSquare, X } from "lucide-react";

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

const Agent = ({
  userName,
  userId,
  conversationId,
  feedbackId,
  mode,
  topicTitle,
  prompts,
  vapiVariables,
}: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStartTime, setCallStartTime] = useState<number>(0);
  const [sequenceNumber, setSequenceNumber] = useState<number>(0);
  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
      setCallStartTime(Date.now());
      setSequenceNumber(0);
    };

    const onCallEnd = async () => {
      setCallStatus(CallStatus.FINISHED);

      // Update conversation on call end (only when conversationId exists)
      if (conversationId) {
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
      }
    };

    const onMessage = async (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);

        // Save transcript to database (only when conversationId exists)
        if (conversationId) {
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
      }
    };

    const onSpeechStart = () => {
      console.log("speech start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.log("Error:", error);
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

  useEffect(() => {
    // Show feedback prompt when call ends (practice mode only)
    if (callStatus === CallStatus.FINISHED && conversationId) {
      setShowFeedbackPrompt(true);
    }
  }, [callStatus, conversationId]);

  const handleGenerateFeedback = async () => {
    setIsGeneratingFeedback(true);
    setShowFeedbackPrompt(false);

    console.log("Generating feedback for conversation:", conversationId);

    // Retrieve conversation to get feedback language preference
    const conversation = await getConversationById(conversationId!);
    const feedbackLanguage = conversation?.feedback_language || 'vietnamese';

    const { success, data } = await createFeedback({
      conversationId: conversationId!,
      transcript: messages,
      feedbackId,
      feedbackLanguage: feedbackLanguage as 'vietnamese' | 'english' | 'chinese' | 'korean' | 'japanese' | 'french' | 'german' | 'italian' | 'portuguese' | 'russian' | 'spanish' | 'thai' | 'turkish',
    });

    setIsGeneratingFeedback(false);

    if (success && data) {
      router.push(`/ai/voice/speak/${conversationId}/feedback`);
    } else {
      console.error("Error generating feedback");
      router.push("/ai/voice");
    }
  };

  const handleEndWithoutFeedback = () => {
    setShowFeedbackPrompt(false);
    router.push("/ai/voice");
  };

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    // Get the correct assistant ID for this mode
    const assistantId = getAssistantIdForMode(mode);

    // Start Vapi call with assistant ID and variable overrides
    await vapi.start(assistantId, {
      variableValues: vapiVariables,
    });
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  return (
    <>
      {/* Call Timer - Fixed position in upper right */}
      {callStatus === CallStatus.ACTIVE && (
        <CallTimer
          mode="countup"
          startTime={callStartTime}
          className="fixed top-4 right-4 z-50"
        />
      )}

      {/* Feedback Generating Loader */}
      <FeedbackGeneratingLoader isOpen={isGeneratingFeedback} />

      {/* Call Connection State */}
      {callStatus === CallStatus.CONNECTING && (
        <CallConnectingLoader isConnecting={true} />
      )}

      {/* Main Call Interface - 65/35 Layout */}
      {callStatus === CallStatus.ACTIVE && (
        <VoiceCallInterface
          userName={userName}
          topicTitle={topicTitle}
          isSpeaking={isSpeaking}
          isActive={callStatus === CallStatus.ACTIVE}
          messages={messages.map((m, i) => ({
            ...m,
            timestamp: callStartTime + (i * 1000)
          }))}
          isExamMode={false}
          showTranscriptToggle={false}
          callStartTime={callStartTime}
        />
      )}

      {/* Call Control Buttons */}
      {callStatus !== CallStatus.FINISHED && (
        <div className="w-full flex justify-center mt-6">
          {callStatus !== CallStatus.ACTIVE ? (
            <button
              className="btn-call"
              onClick={handleCall}
              disabled={callStatus === CallStatus.CONNECTING}
            >
              {callStatus === CallStatus.CONNECTING ? "Connecting..." : "Start Call"}
            </button>
          ) : (
            <button className="btn-disconnect" onClick={handleDisconnect}>
              End Call
            </button>
          )}
        </div>
      )}

      {/* Feedback Prompt Section - Shows after call ends */}
      {showFeedbackPrompt && (
        <div className="feedback-prompt-section">
          <MessageSquare className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Call Completed!
          </h3>
          <p className="text-gray-600 mb-1">
            Great job practicing! Would you like to get feedback on your performance?
          </p>
          <p className="text-sm text-gray-500 mb-6">
            AI-powered feedback will analyze your conversation and provide personalized suggestions.
          </p>

          <div className="button-group">
            <Button
              variant="outline"
              size="lg"
              onClick={handleEndWithoutFeedback}
              className="gap-2"
            >
              <X className="w-4 h-4" />
              End Without Feedback
            </Button>
            <Button
              size="lg"
              onClick={handleGenerateFeedback}
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              <MessageSquare className="w-4 h-4" />
              Generate Feedback
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Agent;

"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { VoiceStatusIndicator } from "./VoiceStatusIndicator";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
}

interface VoiceCallInterfaceProps {
  userName: string;
  topicTitle?: string;
  isSpeaking: boolean;
  isActive: boolean;
  messages: Message[];
  isExamMode?: boolean;
  showTranscriptToggle?: boolean;
  callStartTime: number;
}

export function VoiceCallInterface({
  userName,
  topicTitle,
  isSpeaking,
  isActive,
  messages,
  isExamMode = false,
  showTranscriptToggle = false,
  callStartTime,
}: VoiceCallInterfaceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const analyserRef = useRef<AnalyserNode>();
  const [showTranscript, setShowTranscript] = useState(!isExamMode);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  // Initialize microphone visualization with Web Audio API
  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

    let mediaStream: MediaStream | null = null;
    let audioContext: AudioContext | null = null;

    const setupMicrophone = async () => {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;

        const source = audioContext.createMediaStreamSource(mediaStream);
        source.connect(analyser);
        analyserRef.current = analyser;

        // Start visualization
        drawWaveform();
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    };

    const drawWaveform = () => {
      if (!canvasRef.current || !analyserRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const analyser = analyserRef.current;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        animationFrameRef.current = requestAnimationFrame(draw);

        analyser.getByteFrequencyData(dataArray);

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          barHeight = (dataArray[i] / 255) * canvas.height;

          // Gradient from blue to lighter blue
          const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
          gradient.addColorStop(0, "rgb(59, 130, 246)");
          gradient.addColorStop(1, "rgb(147, 197, 253)");

          ctx.fillStyle = gradient;
          ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

          x += barWidth + 2;
        }
      };

      draw();
    };

    setupMicrophone();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [isActive]);

  // Auto-scroll transcript
  useEffect(() => {
    if (isAutoScrolling && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isAutoScrolling]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    setIsAutoScrolling(isAtBottom);
  };

  const scrollToBottom = () => {
    setIsAutoScrolling(true);
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const formatRelativeTime = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 10) return "just now";
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="flex gap-6 w-full h-[calc(100vh-280px)] min-h-[500px] max-h-[600px]">
      {/* Left Panel - 65% - AI Chat Section */}
      <div className="flex-[0.65] bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 flex flex-col">
        {/* AI Avatar and Info */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <div className="avatar mb-3">
              <Image
                src="/ai-avatar.png"
                alt="AI Tutor"
                width={80}
                height={80}
                className="object-cover rounded-full"
              />
              {isSpeaking && <span className="animate-speak" />}
            </div>
          </div>

          <VoiceStatusIndicator isActive={isActive} isSpeaking={isSpeaking} />

          <h3 className="text-lg font-semibold mt-3">
            {isExamMode ? "AI Examiner" : "AI Tutor"}
          </h3>
          {topicTitle && (
            <p className="text-sm text-gray-500 mt-1">{topicTitle}</p>
          )}
        </div>

        {/* Waveform Visualization */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Voice Activity
            </span>
            {isActive && (
              <span className="flex items-center gap-2 text-xs text-green-600">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Live
              </span>
            )}
          </div>
          <canvas
            ref={canvasRef}
            width={800}
            height={80}
            className="w-full h-20 rounded-lg bg-gray-100 dark:bg-gray-900"
          />
        </div>

        {/* User Info */}
        <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center gap-3">
            <Image
              src="/user-avatar.png"
              alt={userName}
              width={48}
              height={48}
              className="rounded-full object-cover"
            />
            <div>
              <p className="font-medium text-sm">{userName}</p>
              <p className="text-xs text-gray-500">Participant</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - 35% - Transcript Section */}
      <div className="flex-[0.35] bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Header with Toggle */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="font-semibold text-sm">Chat Section</h3>
          {showTranscriptToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTranscript(!showTranscript)}
              className="gap-2 h-8 text-xs"
            >
              {showTranscript ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  Hide
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  Show
                </>
              )}
            </Button>
          )}
        </div>

        {/* Transcript Content */}
        {showTranscript ? (
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-4 space-y-3"
          >
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                Conversation will appear here...
              </div>
            ) : (
              messages.map((message, idx) => (
                <div
                  key={idx}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                      message.role === "user"
                        ? "bg-blue-500 text-white rounded-br-sm"
                        : message.role === "assistant"
                          ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-sm"
                          : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-100"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {formatRelativeTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              ))
            )}

            {/* Scroll to bottom button */}
            {!isAutoScrolling && messages.length > 0 && (
              <button
                onClick={scrollToBottom}
                className="sticky bottom-4 left-full ml-auto bg-blue-500 text-white rounded-full p-2 shadow-lg hover:bg-blue-600 transition-colors"
              >
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
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </button>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
            <div className="text-center">
              <EyeOff className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Transcript hidden</p>
              <p className="text-xs mt-1">Click "Show" to view conversation</p>
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-xs text-gray-500">
            {isExamMode
              ? "At the end of your conversation we will automatically generate feedback/notes from your conversation"
              : "Real-time transcript"}
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { Button } from "@/shared/components/ui/button";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
}

interface TranscriptPanelProps {
  messages: Message[];
  showPartial?: boolean;
  isExamMode?: boolean;
}

export function TranscriptPanel({
  messages,
  showPartial = false,
  isExamMode = false,
}: TranscriptPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (isAutoScrolling && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isAutoScrolling]);

  // Handle scroll to detect if user scrolled up
  const handleScroll = () => {
    if (!scrollRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;

    setShowScrollButton(!isNearBottom);
    setIsAutoScrolling(isNearBottom);
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      setIsAutoScrolling(true);
      setShowScrollButton(false);
    }
  };

  const formatRelativeTime = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600)
      return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  // Don't show transcript in exam mode
  if (isExamMode) {
    return null;
  }

  if (messages.length === 0) {
    return (
      <div className="transcript-panel flex items-center justify-center text-gray-500 text-sm">
        No messages yet. Start speaking to see the conversation transcript...
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="transcript-panel"
        onScroll={handleScroll}
      >
        {messages.map((message, index) => (
          <div
            key={`${message.timestamp}-${index}`}
            className={cn(
              "transcript-message",
              message.role === "user" && "user"
            )}
          >
            <div
              className={cn(
                "transcript-bubble",
                message.role === "user" ? "user" : "assistant"
              )}
            >
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-semibold text-xs">
                  {message.role === "user" ? "You" : "AI Assistant"}
                </span>
                <span className="text-xs opacity-70">
                  {formatRelativeTime(message.timestamp)}
                </span>
              </div>
              <p>{message.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <Button
          size="sm"
          variant="secondary"
          className="absolute bottom-4 right-4 rounded-full shadow-lg"
          onClick={scrollToBottom}
        >
          <ArrowDown className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}

"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/shared/utils/cn";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";

export interface EnvelopeSelectorProps {
  /**
   * Number of envelopes to display
   * @default 4
   */
  envelopeCount?: number;
  /**
   * Callback when topic is revealed (after envelope selection)
   */
  onTopicRevealed: () => void;
  /**
   * The topic title to reveal (Vietnamese)
   */
  topicTitle: string;
  /**
   * The topic title in English (optional)
   */
  topicTitleEn?: string;
  /**
   * The topic description to reveal
   */
  topicDescription: string;
  /**
   * Additional class names
   */
  className?: string;
  /**
   * Label text shown above envelopes
   * @default "Choose an envelope"
   */
  label?: string;
}

// Envelope colors for variety
const ENVELOPE_COLORS = [
  { bg: "from-amber-400 to-orange-500", shadow: "shadow-orange-200" },
  { bg: "from-rose-400 to-pink-500", shadow: "shadow-pink-200" },
  { bg: "from-violet-400 to-purple-500", shadow: "shadow-purple-200" },
  { bg: "from-emerald-400 to-green-500", shadow: "shadow-green-200" },
  { bg: "from-sky-400 to-blue-500", shadow: "shadow-blue-200" },
];

interface EnvelopeProps {
  index: number;
  isSelected: boolean;
  hasSelection: boolean;
  onClick: () => void;
  color: typeof ENVELOPE_COLORS[number];
}

function Envelope({
  index,
  isSelected,
  hasSelection,
  onClick,
  color,
}: EnvelopeProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={hasSelection}
      className={cn(
        "relative w-24 h-16 md:w-32 md:h-20 rounded-lg cursor-pointer transition-all",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        hasSelection && !isSelected && "opacity-50 cursor-not-allowed",
        !hasSelection && "hover:scale-105 hover:-translate-y-1"
      )}
      initial={{ scale: 0, rotate: -10 }}
      animate={{
        scale: isSelected ? 1.1 : 1,
        rotate: isSelected ? 0 : 0,
        opacity: hasSelection && !isSelected ? 0.5 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: index * 0.1,
      }}
      whileHover={!hasSelection ? { scale: 1.05, y: -4 } : {}}
      whileTap={!hasSelection ? { scale: 0.95 } : {}}
    >
      {/* Envelope Body */}
      <div
        className={cn(
          "absolute inset-0 rounded-lg bg-gradient-to-br shadow-lg",
          color.bg,
          color.shadow
        )}
      >
        {/* Envelope Flap (Top Triangle) */}
        <div
          className={cn(
            "absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0",
            "border-l-[48px] border-l-transparent md:border-l-[64px]",
            "border-r-[48px] border-r-transparent md:border-r-[64px]",
            "border-t-[24px] md:border-t-[32px]",
            "border-t-white/30"
          )}
          style={{
            transform: `translateX(-50%) ${isSelected ? "rotateX(180deg)" : "rotateX(0deg)"}`,
            transformOrigin: "top center",
            transition: "transform 0.5s ease-in-out",
          }}
        />

        {/* Envelope Lines (decoration) */}
        <div className="absolute inset-2 flex flex-col justify-end gap-1 opacity-30">
          <div className="h-1 bg-white rounded" />
          <div className="h-1 bg-white rounded w-3/4" />
          <div className="h-1 bg-white rounded w-1/2" />
        </div>

        {/* Envelope Number */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="text-white/80 font-bold text-lg md:text-xl">
            {index + 1}
          </span>
        </div>
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <motion.div
          className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>
      )}
    </motion.button>
  );
}

/**
 * Animated envelope selector for topic reveal
 *
 * All envelopes contain the same pre-selected topic (gamification element).
 * Provides a fun, engaging way to "draw" a topic.
 *
 * @example
 * ```tsx
 * <EnvelopeSelector
 *   topicTitle="Ùn tắc giao thông"
 *   topicTitleEn="Traffic Congestion"
 *   topicDescription="Thảo luận về vấn đề ùn tắc..."
 *   onTopicRevealed={() => setPhase("preparation")}
 * />
 * ```
 */
export function EnvelopeSelector({
  envelopeCount = 4,
  onTopicRevealed,
  topicTitle,
  topicTitleEn,
  topicDescription,
  className,
  label = "Choose an envelope",
}: EnvelopeSelectorProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const handleEnvelopeClick = useCallback(
    (index: number) => {
      if (selectedIndex !== null) return;

      setSelectedIndex(index);

      // Reveal topic after animation delay
      setTimeout(() => {
        setIsRevealed(true);
        // Call callback after reveal animation
        setTimeout(() => {
          onTopicRevealed();
        }, 500);
      }, 800);
    },
    [selectedIndex, onTopicRevealed]
  );

  // Get colors for envelopes (cycle through available colors)
  const envelopeColors = Array.from({ length: envelopeCount }, (_, i) => 
    ENVELOPE_COLORS[i % ENVELOPE_COLORS.length]
  );

  return (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      {/* Label */}
      {!isRevealed && (
        <motion.p
          className="text-lg font-medium text-muted-foreground"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {label}
        </motion.p>
      )}

      {/* Envelopes */}
      <AnimatePresence mode="wait">
        {!isRevealed ? (
          <motion.div
            key="envelopes"
            className="flex flex-wrap justify-center gap-4 md:gap-6"
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
          >
            {Array.from({ length: envelopeCount }).map((_, index) => (
              <Envelope
                key={index}
                index={index}
                isSelected={selectedIndex === index}
                hasSelection={selectedIndex !== null}
                onClick={() => handleEnvelopeClick(index)}
                color={envelopeColors[index]}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="topic-card"
            initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
            className="w-full max-w-md"
          >
            <Card className="border-2 border-primary/20 shadow-lg">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-2 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <CardTitle className="text-xl">{topicTitle}</CardTitle>
                {topicTitleEn && (
                  <p className="text-sm text-muted-foreground italic">
                    {topicTitleEn}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base leading-relaxed">
                  {topicDescription}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      {!isRevealed && selectedIndex === null && (
        <motion.p
          className="text-sm text-muted-foreground/70 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Click any envelope to reveal your topic
        </motion.p>
      )}
    </div>
  );
}

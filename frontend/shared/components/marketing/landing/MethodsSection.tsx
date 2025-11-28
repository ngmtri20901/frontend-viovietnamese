"use client"

import type React from "react"
import { useState } from "react"
import { LearningMethod } from "./LearningMethod"
import { FlashcardComponent } from "@/features/flashcards/components/core/flashcard-component"
import { WordsMatching } from "@/features/learn/components/exercises/WordsMatching/words-matching"
import { Mic, MicOff } from "lucide-react"
import { Button } from "@/shared/components/ui/button"

export const MethodsSection: React.FC = () => {
  const [flashcardFlipped, setFlashcardFlipped] = useState(false)
  const [micActive, setMicActive] = useState(false)

  // Static flashcard data
  const sampleFlashcard = {
    id: "sample-1",
    vietnamese: "Xin chào",
    english: ["Hello", "Hi", "Greetings"],
    type: ["phrase"],
    vietnamese_sentence: "Xin chào! Bạn khỏe không?",
    english_sentence: "Hello! How are you?",
    image_url: "/images/brand/landing/method.webp",
    audio_url: null,
    common_meaning: "Hello",
    is_multimeaning: false,
    is_common: true,
    pronunciation: "sin t͡ɕàːw",
    flashcard_type: "APP" as const
  }

  // Static word matching data
  const sampleWordPairs = [
    { id: 1, english: "Hello", vietnamese: "Xin chào" },
    { id: 2, english: "Thank you", vietnamese: "Cảm ơn" },
    { id: 3, english: "Goodbye", vietnamese: "Tạm biệt" },
    { id: 4, english: "Yes", vietnamese: "Vâng" },
    { id: 5, english: "No", vietnamese: "Không" }
  ]

  return (
    <>
      <section className="text-center mb-20">
        <h2 className="font-display text-ds-primary text-5xl font-bold mb-6 max-md:text-[40px] max-sm:text-[32px]">
          Our Methods of Learning
        </h2>
        <p className="font-body text-ds-text-light text-2xl max-w-[866px] mx-auto leading-relaxed max-md:text-xl max-sm:text-lg">
          We combine theory, practice, and interaction to make learning Vietnamese easy and engaging. Master Vietnamese
          with our proven methods!
        </p>
      </section>

      <section className="flex flex-col gap-20">
        <LearningMethod
          altText="Vocabulary learning"
          title="Learn Vocabulary"
          description={
            <>
              Boost your vocabulary with our interactive flashcards featuring vivid images. Science proves that{" "}
              <span className="underline font-semibold">learning with visuals</span> enhances memory and recall better than
              traditional methods!
            </>
          }
        >
          <div className="w-full">
            <FlashcardComponent
              data={sampleFlashcard}
              saved={false}
              onSave={() => {}}
              isFlipped={flashcardFlipped}
              onFlip={() => setFlashcardFlipped(!flashcardFlipped)}
              animationDuration={500}
            />
          </div>
        </LearningMethod>

        <LearningMethod
          altText="Practice exercises"
          title="Learn through practice"
          description="The best way to learn is by doing! Our exercises, quizzes, and real-life scenarios help you reinforce what you've learned and apply it with confidence."
        >
          <div className="w-full max-w-2xl">
            <WordsMatching pairs={sampleWordPairs} readOnly={false} />
          </div>
        </LearningMethod>

        <LearningMethod
          altText="Learning with AI Tutor"
          title="Learn with AI Tutor"
          description="Practice speaking with our AI tutor! Get real-time feedback on pronunciation, fluency, and grammar. Your personal Vietnamese teacher available 24/7."
        >
          <div className="w-full max-w-md mx-auto bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 border-2 border-dashed border-ds-primary/30">
            <div className="flex flex-col items-center gap-6">
              {/* AI Avatar with speech bubble */}
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-ds-secondary to-ds-primary rounded-full flex items-center justify-center shadow-lg">
                  <div className="text-6xl">🤖</div>
                </div>

                {/* Floating speech bubble */}
                <div className="absolute -top-2 -right-2 animate-bounce">
                  <div className="relative bg-white rounded-2xl p-4 shadow-lg border-2 border-ds-accent">
                    <p className="font-body text-sm text-ds-text font-medium whitespace-nowrap">
                      {micActive ? "I'm listening..." : "Click to start!"}
                    </p>
                    {/* Speech bubble tail */}
                    <div className="absolute -bottom-2 left-8 w-4 h-4 bg-white border-r-2 border-b-2 border-ds-accent transform rotate-45"></div>
                  </div>
                </div>
              </div>

              {/* Mic button */}
              <Button
                variant={micActive ? "destructive" : "default"}
                size="icon"
                className="w-20 h-20 rounded-full shadow-xl"
                onClick={() => setMicActive(!micActive)}
              >
                {micActive ? (
                  <MicOff className="w-10 h-10" />
                ) : (
                  <Mic className="w-10 h-10" />
                )}
              </Button>

              <p className="font-body text-center text-ds-text-light text-sm">
                {micActive ? "Microphone is active" : "Tap to speak with AI"}
              </p>
            </div>
          </div>
        </LearningMethod>
      </section>
    </>
  )
}

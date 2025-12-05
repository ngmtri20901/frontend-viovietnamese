import type React from "react"
import { 
  Milestone,
  ListChecks,
  Sparkles,
  Images,
  Bot,
  Coins
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card"
import { cn } from "@/shared/utils/cn"

interface Reason {
  title: string
  description: string
  icon: React.ReactNode
  iconColor?: "primary" | "secondary" | "accent"
}

interface FeatureProps {
  heading?: string
  subheading?: string
  reasons?: Reason[]
}

const Feature = ({
  heading = "Why Learn With Us?",
  subheading = "Discover what makes VioVietnamese more effective, structured, and enjoyable than traditional language apps.",
  reasons = [
    {
      title: "Structured Learning Path",
      description: "Learn through a clear, step-by-step curriculum — no random lessons.",
      icon: <Milestone className="size-6" />,
      iconColor: "primary" as const,
    },
    {
      title: "Exercises Every Lesson",
      description: "Reinforce each lesson with interactive exercises — including multiple-choice, translation, dialogue practice, and more.",
      icon: <ListChecks className="size-6" />,
      iconColor: "primary" as const,
    },
    {
      title: "Free Start, More Later",
      description: "Study Vietnamese freely at your own pace, with optional upgrades for advanced features.",
      icon: <Sparkles className="size-6" />,
      iconColor: "primary" as const,
    },
    {
      title: "Smart Visual Flashcards",
      description: "Learn vocabulary faster with topic-based flashcards featuring images, audio, and example sentences.",
      icon: <Images className="size-6" />,
      iconColor: "primary" as const,
    },
    {
      title: "AI Conversation Tutors",
      description: "Practice speaking naturally with an AI tutor that follows your chosen scenario and provides instant, helpful feedback.",
      icon: <Bot className="size-6" />,
      iconColor: "primary" as const,
    },
    {
      title: "Learn & Earns",
      description: "Earn coins as you complete lessons and redeem them for helpful rewards that support your learning journey.",
      icon: <Coins className="size-6" />,
      iconColor: "primary" as const,
    },
  ],
}: FeatureProps) => {
  const getIconBgColor = (color?: "primary" | "secondary" | "accent") => {
    switch (color) {
      case "primary":
        return "bg-ds-primary-light"
      case "secondary":
        return "bg-ds-secondary-light"
      case "accent":
        return "bg-ds-accent-light"
      default:
        return "bg-ds-accent-light"
    }
  }

  const getIconTextColor = (color?: "primary" | "secondary" | "accent") => {
    switch (color) {
      case "primary":
        return "text-white"
      case "secondary":
        return "text-ds-secondary"
      case "accent":
        return "text-ds-accent-foreground"
      default:
        return "text-ds-accent-foreground"
    }
  }

  return (
    <section className="py-32">
      <div className="container">
        <div className="mb-10 md:mb-20">
          <h2 className="font-display text-ds-primary text-center text-5xl font-bold mb-2 max-md:text-[40px] max-sm:text-[32px]">
            {heading}
          </h2>
          {subheading && (
            <p className="font-body text-gray-500 text-center text-2xl max-w-[866px] mx-auto px-2 leading-relaxed max-md:text-xl max-sm:text-lg">
              {subheading}
            </p>
          )}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, i) => (
            <Card key={i} variant="interactive" className="h-full">
              <CardContent className="flex flex-col pt-6">
                <div
                  className={cn(
                    "mb-5 flex size-16 items-center justify-center rounded-full transition-transform hover:scale-110",
                    getIconBgColor(reason.iconColor),
                    getIconTextColor(reason.iconColor)
                  )}
                >
                  {reason.icon}
                </div>
                <h3 className="font-title text-xl font-semibold text-neutral-600 mb-2">
                  {reason.title}
                </h3>
                <p className="font-body text-base text-neutral-500 leading-relaxed">
                  {reason.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export { Feature }

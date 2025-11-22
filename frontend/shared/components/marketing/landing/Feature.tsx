import type React from "react"
import { BatteryCharging, GitPullRequest, Layers, RadioTower, SquareKanban, WandSparkles } from "lucide-react"

interface Reason {
  title: string
  description: string
  icon: React.ReactNode
}

interface FeatureProps {
  heading?: string
  reasons?: Reason[]
}

const Feature = ({
  heading = "Why Learn With Us?",
  reasons = [
    {
      title: "Interactive Learning",
      description: "Our interactive lessons keep you engaged and motivated throughout your learning journey.",
      icon: <GitPullRequest className="size-6" />,
    },
    {
      title: "Native Speakers",
      description: "Learn from native Vietnamese speakers who provide authentic pronunciation and cultural insights.",
      icon: <SquareKanban className="size-6" />,
    },
    {
      title: "24/7 Support",
      description: "Get help whenever you need it with our dedicated support team available around the clock.",
      icon: <RadioTower className="size-6" />,
    },
    {
      title: "Innovative Methods",
      description: "Our innovative teaching methods are designed to make learning Vietnamese easy and enjoyable.",
      icon: <WandSparkles className="size-6" />,
    },
    {
      title: "Proven Results",
      description: "Thousands of students have successfully learned Vietnamese using our platform.",
      icon: <Layers className="size-6" />,
    },
    {
      title: "Efficient Learning",
      description: "Our structured curriculum ensures you learn Vietnamese efficiently without wasting time.",
      icon: <BatteryCharging className="size-6" />,
    },
  ],
}: FeatureProps) => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="mb-10 md:mb-20">
          <h2 className="mb-2 text-center text-3xl font-semibold lg:text-5xl">{heading}</h2>
        </div>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, i) => (
            <div key={i} className="flex flex-col">
              <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-accent">{reason.icon}</div>
              <h3 className="mb-2 text-xl font-semibold">{reason.title}</h3>
              <p className="text-muted-foreground">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export { Feature }

"use client"

import { useEffect, useRef, useState } from "react"
import { XCircle, Users, Zap } from "lucide-react"

export default function Gamification() {
  const [activeFeature, setActiveFeature] = useState(0)
  const featureRefs = useRef<(HTMLDivElement | null)[]>([])
  const sectionRef = useRef<HTMLDivElement>(null)

  const features = [
    {
      id: 1,
      number: "01",
      title: "Interactive Flashcards",
      description:
        "Master vocabulary with our interactive flashcards featuring images, audio, and spaced repetition to optimize your learning.",
      icon: XCircle,
    },
    {
      id: 2,
      number: "02",
      title: "Community Learning",
      description:
        "Connect with fellow learners, practice conversations, and participate in language exchange with native speakers.",
      icon: Users,
    },
    {
      id: 3,
      number: "03",
      title: "Gamified Progress",
      description:
        "Earn points, unlock achievements, and track your progress with our gamified learning system that keeps you motivated.",
      icon: Zap,
    },
  ]

  useEffect(() => {
    const observers = featureRefs.current.map((ref, index) => {
      if (!ref) return null

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveFeature(index)
            }
          })
        },
        {
          root: null,
          rootMargin: "-50% 0px -50% 0px",
          threshold: 0,
        },
      )

      observer.observe(ref)
      return observer
    })

    return () => {
      observers.forEach((observer) => observer?.disconnect())
    }
  }, [])

  return (
    <div ref={sectionRef} className="relative flex flex-col lg:flex-row min-h-screen">
      {/* Left fixed content */}
      <div className="lg:sticky lg:top-0 lg:h-screen lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center">
        <div className="max-w-md">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Learn Vietnamese{" "}
            <span className="relative">
              faster
              <span className="absolute -top-4 -right-4 text-yellow-400">+</span>
            </span>
            <br />
            with our innovative
            <br />
            approach
          </h2>
          <p className="text-gray-600 text-lg">
            Our platform combines traditional learning methods with modern technology to make learning Vietnamese fun
            and effective.
          </p>
        </div>
      </div>

      {/* Right scrollable content */}
      <div className="lg:w-1/2 p-8 lg:p-16 space-y-32 py-32">
        {features.map((feature, index) => (
          <div
            key={feature.id}
            ref={(el) => (featureRefs.current[index] = el)}
            className={`bg-gray-50 p-8 rounded-lg transition-all duration-300 ${
              activeFeature === index ? "scale-100 opacity-100" : "scale-95 opacity-70"
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <feature.icon className="h-10 w-10" />
              <span className="text-3xl font-bold">{feature.number}</span>
            </div>
            <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

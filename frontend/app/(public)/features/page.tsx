import { Check } from "lucide-react"
import { Navbar } from "@/shared/components/layout/public/navbar"
import { Footer } from "@/shared/components/layout/public/footer"

// ISR Configuration - Static generation with no revalidation
export const revalidate = false
export const dynamic = 'force-static'

export default function FeaturesPage() {
  return (
    <>
      <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Features</span>
              <span className="block text-[#067BC2]">Everything you need to learn Vietnamese</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Our comprehensive platform is designed to help you master Vietnamese through interactive lessons, cultural
              immersion, and personalized learning.
            </p>
          </div>

          {/* Feature Sections */}
          <div className="mt-16">
            {/* Feature 1 */}
            <div className="lg:flex lg:items-center lg:justify-between mb-20">
              <div className="lg:w-1/2 lg:pr-12">
                <h2 className="text-3xl font-extrabold text-gray-900">Interactive Lessons</h2>
                <p className="mt-3 text-lg text-gray-500">
                  Our interactive lessons are designed by language experts and native speakers to provide an immersive
                  learning experience.
                </p>
                <div className="mt-6 space-y-4">
                  {[
                    "Progressive difficulty levels",
                    "Audio pronunciations by native speakers",
                    "Interactive exercises and quizzes",
                    "Real-life conversation scenarios",
                  ].map((item, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="ml-3 text-base text-gray-500">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-10 lg:mt-0 lg:w-1/2">
                <img
                  className="rounded-lg shadow-lg"
                  src="/placeholder.svg?height=400&width=600"
                  alt="Interactive lessons screenshot"
                />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="lg:flex lg:items-center lg:justify-between mb-20 flex-row-reverse">
              <div className="lg:w-1/2 lg:pl-12">
                <h2 className="text-3xl font-extrabold text-gray-900">Pronunciation Practice</h2>
                <p className="mt-3 text-lg text-gray-500">
                  Master the six tones of Vietnamese with our specialized pronunciation exercises and feedback system.
                </p>
                <div className="mt-6 space-y-4">
                  {[
                    "Visual tone guides",
                    "Audio comparison tools",
                    "Pronunciation feedback",
                    "Tone recognition exercises",
                  ].map((item, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="ml-3 text-base text-gray-500">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-10 lg:mt-0 lg:w-1/2">
                <img
                  className="rounded-lg shadow-lg"
                  src="/placeholder.svg?height=400&width=600"
                  alt="Pronunciation practice screenshot"
                />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="lg:flex lg:items-center lg:justify-between mb-20">
              <div className="lg:w-1/2 lg:pr-12">
                <h2 className="text-3xl font-extrabold text-gray-900">Cultural Context</h2>
                <p className="mt-3 text-lg text-gray-500">
                  Learn the language in its cultural context to understand nuances, expressions, and customs.
                </p>
                <div className="mt-6 space-y-4">
                  {[
                    "Cultural notes and explanations",
                    "Traditional stories and folklore",
                    "Holiday and celebration guides",
                    "Etiquette and social customs",
                  ].map((item, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="ml-3 text-base text-gray-500">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-10 lg:mt-0 lg:w-1/2">
                <img
                  className="rounded-lg shadow-lg"
                  src="/placeholder.svg?height=400&width=600"
                  alt="Cultural context screenshot"
                />
              </div>
            </div>

            {/* Feature 4 */}
            <div className="lg:flex lg:items-center lg:justify-between flex-row-reverse">
              <div className="lg:w-1/2 lg:pl-12">
                <h2 className="text-3xl font-extrabold text-gray-900">Progress Tracking</h2>
                <p className="mt-3 text-lg text-gray-500">
                  Track your progress and receive personalized recommendations for improvement.
                </p>
                <div className="mt-6 space-y-4">
                  {[
                    "Detailed progress statistics",
                    "Personalized learning paths",
                    "Spaced repetition system",
                    "Achievement badges and rewards",
                  ].map((item, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="ml-3 text-base text-gray-500">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-10 lg:mt-0 lg:w-1/2">
                <img
                  className="rounded-lg shadow-lg"
                  src="/placeholder.svg?height=400&width=600"
                  alt="Progress tracking screenshot"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>

  )
}

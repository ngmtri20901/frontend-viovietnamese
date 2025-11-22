import { Users, BookOpen, Globe, Award } from "lucide-react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

// ISR Configuration - Static generation with no revalidation
export const revalidate = false
export const dynamic = 'force-static'

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8">About VietnameseNext</h1>
            
            <div className="prose prose-lg mx-auto">
              <p className="text-xl text-gray-600 mb-8 text-center">
                Your comprehensive platform for learning Vietnamese language and culture.
              </p>
              
              <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                <p>
                  VietnameseNext is dedicated to making Vietnamese language learning accessible, 
                  engaging, and effective for learners worldwide. We combine modern technology 
                  with proven language learning methodologies to create an immersive learning experience.
                </p>
              </section>
              
              <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Interactive exercises and quizzes</li>
                  <li>Comprehensive flashcard system</li>
                  <li>Cultural insights and context</li>
                  <li>Progress tracking and achievements</li>
                  <li>Community features and support</li>
                </ul>
              </section>
              
              <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">Our Approach</h2>
                <p>
                  We believe in learning through practice, repetition, and cultural immersion. 
                  Our platform adapts to your learning style and pace, ensuring you build 
                  confidence while mastering the Vietnamese language.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

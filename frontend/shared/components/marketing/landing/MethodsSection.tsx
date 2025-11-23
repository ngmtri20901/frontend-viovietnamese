import type React from "react"
import { LearningMethod } from "./LearningMethod"

export const MethodsSection: React.FC = () => {
  return (
    <>
      <section className="text-center mb-20">
        <h2 className="text-[#FF3737] text-5xl mb-6 max-md:text-[40px] max-sm:text-[32px]">Our Methods of Learning</h2>
        <p className="text-[#666] text-2xl max-w-[866px] mx-auto max-md:text-xl max-sm:text-lg">
          We combine theory, practice, and interaction to make learning Vietnamese easy and engaging. Master Vietnamese
          with our proven methods!
        </p>
      </section>

      <section className="flex flex-col gap-20">
        <LearningMethod
          image="/placeholder.svg?height=400&width=600"
          altText="Vocabulary learning"
          title="Learn Vocabulary"
          description={
            <>
              Boost your vocabulary with our interactive flashcards featuring vivid images. Science proves that{" "}
              <span className="underline">learning with visuals</span> enhances memory and recall better than
              traditional methods!
            </>
          }
        />

        <LearningMethod
          image="/placeholder.svg?height=400&width=600"
          altText="Practice exercises"
          title="Learn through practice"
          description="The best way to learn is by doing! Our exercises, quizzes, and real-life scenarios help you reinforce what you've learned and apply it with confidence."
        />

        <LearningMethod
          image="/placeholder.svg?height=400&width=600"
          altText="Learning from mistakes"
          title="Learn from mistakes"
          description="Mistakes are valuable learning opportunities! Research indicates that addressing errors with high confidence can lead to significant learning gains."
        />
      </section>
    </>
  )
}

import type React from "react"
import { Button } from "@/shared/components/ui/button"
import Link from "next/link"

export const Hero: React.FC = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between gap-10 py-20">
      {/* Left side: Text and buttons */}
      <div className="flex flex-col max-w-[520px]">
        <h1 className="font-display text-ds-primary text-[54px] leading-[1.2] tracking-tight font-bold mb-6 max-md:text-[44px] max-sm:text-4xl">
          The Smartest Way to Learn Vietnamese – Try It Now!
        </h1>
        <p className="font-body text-ds-text-light text-[22px] leading-relaxed mb-10 max-md:text-xl max-sm:text-lg">
          Discover an effective way to learn Vietnamese with flashcards, interactive exercises, and cultural insights.
          Learn anytime, anywhere!
        </p>
        <div className="flex gap-4 max-sm:flex-col">
          <Link href="/auth/sign-up">
            <Button size="lg" className="text-lg">
              Get Started
            </Button>
          </Link>
          <Link href="/features">
            <Button variant="outline" size="lg" className="text-base">
              <span>Explore</span>
              <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M6.98953 15.75L10.4843 19.25M10.4843 19.25L13.9791 15.75M10.4843 19.25V1.75"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          </Link>
        </div>
      </div>

      {/* Right side: Image */}
      <div className="flex-shrink-0">
        <img
          src="/images/brand/landing/hero.webp"
          alt="Person learning Vietnamese with flags"
          className="w-[500px] h-auto rounded-[10px] object-cover"
        />
      </div>
    </section>
  )
}

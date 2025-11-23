import { createClient } from "@/shared/lib/supabase/server"
import { redirect } from "next/navigation"
import { Hero } from "@/shared/components/marketing/landing/Hero"
import { MethodsSection } from "@/shared/components/marketing/landing/MethodsSection"
import { Feature } from "@/shared/components/marketing/landing/Feature"
import Gamification from "@/shared/components/marketing/landing/Gamification"
import BlogSection from "@/shared/components/marketing/landing/BlogSection"
import PricingSection from "@/shared/components/marketing/landing/PricingSection"
import { CTASection } from "@/shared/components/marketing/landing/CTASection"
import { Footer } from "@/shared/components/layout/public/footer"
import { Navbar } from "@/shared/components/layout/public/navbar"

export default async function Home() {
  // Check if user is authenticated
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If user is logged in, redirect to learn page
  if (session) {
    redirect("/learn")
  }

  return (
    <>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Hero />
          <MethodsSection />
          <Feature />
          <Gamification />
          <PricingSection />
          <BlogSection />
          <CTASection heading="Ready to get started?" description="Sign up now and start learning Vietnamese today!" />
        </div>
      </div>
    </>
  )
}

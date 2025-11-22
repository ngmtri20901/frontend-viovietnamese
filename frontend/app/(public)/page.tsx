import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Hero } from "./(static)/(home)/components/Hero"
import { MethodsSection } from "./(static)/(home)/components/MethodsSection"
import { Feature } from "./(static)/(home)/components/Feature"
import Gamification from "./(static)/(home)/components/Gamification"
import BlogSection from "./(static)/(home)/components/BlogSection"
import PricingSection from "./(static)/(home)/components/PricingSection"
import { CTASection } from "./(static)/(home)/components/CTASection"
import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"

export default async function Home() {
  // Check if user is authenticated
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If user is logged in, redirect to dashboard
  if (session) {
    redirect("/dashboard")
  }

  return (
    <>
      <Navbar />
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
      <Footer />
    </>
  )
}

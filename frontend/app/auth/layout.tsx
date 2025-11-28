'use client'

import type React from "react"
import { Navbar } from "@/shared/components/layout/public/navbar"
import { Footer } from "@/shared/components/layout/public/footer"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main className="flex min-h-svh w-full flex-col items-center justify-center bg-gray-50 px-4 py-8">
        {children}
      </main>
      <Footer />
    </>
  )
}



'use client'

import type React from "react"
import { Navbar } from "@/shared/components/layout/public/navbar"
import { Footer } from "@/shared/components/layout/public/footer"
import { useState, useEffect } from "react"

export default function StaticLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  )
}
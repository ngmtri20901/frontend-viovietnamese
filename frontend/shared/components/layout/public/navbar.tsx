"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { AppLogo } from "@/shared/components/marketing/others/app-logo"
import { createClient, isSupabaseConfigured } from "@/shared/lib/supabase/client"

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/features" },
  { name: "Plans", href: "/plans" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
]

export function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up')
  const lastScrollY = useRef(0)
  const supabase = createClient()

  const isAuthPage = pathname?.startsWith("/auth")

  useEffect(() => {
    // Only check authentication if Supabase is configured
    if (!isSupabaseConfigured) {
      setIsLoggedIn(false)
      return
    }

    // Check if user is logged in
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession()
      setIsLoggedIn(!!data.session)
    }

    checkUser()
  }, [supabase])

  // Auto-hide navbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Only hide/show if scrolled more than 10px
      if (Math.abs(currentScrollY - lastScrollY.current) < 10) {
        return
      }

      // Scrolling down
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setScrollDirection('down')
        setIsVisible(false)
      }
      // Scrolling up
      else if (currentScrollY < lastScrollY.current) {
        setScrollDirection('up')
        setIsVisible(true)
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Don't show navbar on auth pages


  return (
    <header
      className={`fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <AppLogo size="small" className="w-20" />
            <nav className="hidden md:ml-8 md:flex md:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium font-ui ${
                    pathname === link.href
                      ? "text-ds-primary border-b-2 border-ds-primary"
                      : "text-ds-text-light hover:text-ds-text hover:border-b-2 hover:border-ds-border"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <Link href="/learn">
                <Button>Learn</Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="outline">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`block pl-3 pr-4 py-2 text-base font-medium font-ui ${
                  pathname === link.href
                    ? "text-ds-primary border-l-4 border-ds-primary bg-ds-primary-light/10"
                    : "text-ds-text-light hover:text-ds-text hover:bg-gray-50 hover:border-l-4 hover:border-ds-border"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-ds-border">
            <div className="flex items-center px-4 space-x-3">
              {isLoggedIn ? (
                <Link
                  href="/learn"
                  className="block text-base font-medium font-ui text-ds-primary hover:text-ds-primary-hover"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Learn
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="block text-base font-medium font-ui text-ds-text-light hover:text-ds-text"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/sign-up"
                    className="block text-base font-medium font-ui text-ds-primary hover:text-ds-primary-hover"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

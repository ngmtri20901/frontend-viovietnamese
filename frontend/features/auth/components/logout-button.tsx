'use client'

import { createClient } from '@/shared/lib/supabase/client'
import { Button } from '@/shared/components/ui/button'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

export function LogoutButton() {
  const queryClient = useQueryClient()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const logout = async () => {
    setIsLoggingOut(true)

    try {
      /**
       * ✅ CRITICAL FIX: Proper logout flow
       *
       * Steps to ensure complete logout:
       * 1. Call server-side logout endpoint (clears cookies)
       * 2. Sign out on client (clears localStorage)
       * 3. Clear ALL TanStack Query cache
       * 4. Force router to refresh server components
       * 5. Navigate to login page
       *
       * Without server-side logout, middleware resurrects the session!
       */

      // 1. Call server logout endpoint FIRST
      const response = await fetch('/auth/signout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response.ok) {
        console.error('Server logout failed:', await response.text())
        // Continue anyway - better to clear client state than get stuck
      }

      // 2. Sign out on client (clear local storage)
      const supabase = createClient()
      await supabase.auth.signOut({ scope: 'global' })

      // 3. Clear ALL TanStack Query cache
      queryClient.clear()

      // 4. Navigate to login (no refresh needed - we're leaving this page anyway)
      // Using window.location for hard redirect to avoid race conditions
      window.location.href = '/auth/login'
    } catch (error) {
      console.error('Logout error:', error)
      // Still redirect even on error - user clicked logout, honor that
      window.location.href = '/auth/login'
    } finally {
      // Don't set isLoggingOut to false - we're navigating away
    }
  }

  return (
    <Button onClick={logout} disabled={isLoggingOut}>
      {isLoggingOut ? 'Logging out...' : 'Logout'}
    </Button>
  )
}

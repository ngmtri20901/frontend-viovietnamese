import { createClient } from '@/shared/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

/**
 * Server-side logout endpoint
 *
 * This endpoint properly clears both server-side and client-side authentication state:
 * 1. Signs out from Supabase (invalidates session in database)
 * 2. Explicitly deletes authentication cookies
 * 3. Revalidates all layouts to clear server component cache
 *
 * Critical for preventing:
 * - Session hijacking after logout
 * - Race conditions between client/server state
 * - Middleware resurrecting dead sessions
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Sign out from Supabase (invalidates session in DB)
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Supabase signOut error:', error)
      // Continue anyway - we'll still clear cookies
    }

    // Create response
    const response = NextResponse.json({ success: true })

    // Explicitly delete cookies (force deletion)
    // This prevents middleware from refreshing cookies during logout navigation
    response.cookies.delete('sb-access-token', { path: '/' })
    response.cookies.delete('sb-refresh-token', { path: '/' })

    // Revalidate all layouts (clears server component cache)
    // This ensures the next request fetches fresh auth state
    revalidatePath('/', 'layout')

    return response
  } catch (error) {
    console.error('Server logout error:', error)

    // Still delete cookies even if Supabase call fails
    // Better to clear everything than leave stale state
    const response = NextResponse.json({
      success: false,
      error: 'Logout failed'
    }, { status: 500 })

    response.cookies.delete('sb-access-token', { path: '/' })
    response.cookies.delete('sb-refresh-token', { path: '/' })

    return response
  }
}

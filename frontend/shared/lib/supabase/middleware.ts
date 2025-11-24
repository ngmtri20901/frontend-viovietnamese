import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Check if Supabase environment variables are available
export const isSupabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0

const IS_DEV = process.env.NODE_ENV === 'development'

export async function updateSession(request: NextRequest) {
  // If Supabase is not configured, just continue without auth
  if (!isSupabaseConfigured) {
    if (IS_DEV) {
      console.log('⚠️ [Middleware] Supabase not configured, skipping auth')
    }
    return NextResponse.next()
  }

  const pathname = request.nextUrl.pathname

  // Log incoming request (dev only)
  if (IS_DEV) {
    const hasCookies = request.cookies.has('sb-access-token')
    console.log(`🔍 [Middleware] ${request.method} ${pathname} - Auth cookie: ${hasCookies ? '✓' : '✗'}`)
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            supabaseResponse = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            cookiesToSet.forEach(({ name, value, options }) => {
              supabaseResponse.cookies.set(name, value, options)

              // Log cookie operations (dev only)
              if (IS_DEV && (name === 'sb-access-token' || name === 'sb-refresh-token')) {
                console.log(`🍪 [Middleware] Setting cookie: ${name}`)
              }
            })
          },
        },
      }
    )

    /**
     * ✅ CRITICAL: DO NOT REMOVE auth.getUser()
     *
     * This call:
     * 1. Validates the current session
     * 2. Refreshes expired access tokens using the refresh token
     * 3. Stores the new tokens in cookies via the setAll callback above
     *
     * Without this, sessions expire after 1 hour and users are logged out
     */
    const { data: { user }, error } = await supabase.auth.getUser()

    // Log session state (dev only)
    if (IS_DEV) {
      if (error) {
        // "Auth session missing!" is expected for anonymous/public requests
        // Only log as error for actual auth failures (expired token, invalid signature, etc.)
        if (error.message === 'Auth session missing!') {
          console.log(`👤 [Middleware] Anonymous request on ${pathname}`)
        } else {
          console.log(`❌ [Middleware] Auth error on ${pathname}:`, error.message)
        }
      } else if (user) {
        console.log(`✅ [Middleware] Authenticated: ${user.email} (${user.id.slice(0, 8)}...)`)
      } else {
        console.log(`👤 [Middleware] Anonymous request on ${pathname}`)
      }
    }
  } catch (error) {
    // If there's an error refreshing the session, log it but continue
    console.error('❌ [Middleware] Error updating session:', error)
    // Return the response even if session refresh failed
  }

  return supabaseResponse
}

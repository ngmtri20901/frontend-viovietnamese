import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/shared/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get('next') ?? '/'
  if (!next.startsWith('/')) {
    // if "next" is not a relative URL, use the default
    next = '/'
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      /**
       * ✅ CRITICAL FIX: Invalidate server cache after OAuth login
       *
       * After exchanging code for session, we must:
       * 1. Revalidate the entire app (forces Next.js to re-render with new session)
       * 2. Redirect to destination with fresh server state
       *
       * Without this, protected pages show cached "logged out" state until manual refresh
       */
      // Revalidate all paths to ensure fresh data
      revalidatePath('/', 'layout')
      revalidatePath('/learn', 'page')

      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      let redirectUrl: string
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        redirectUrl = `${origin}${next}`
      } else if (forwardedHost) {
        redirectUrl = `https://${forwardedHost}${next}`
      } else {
        redirectUrl = `${origin}${next}`
      }
      
      // Use 303 See Other to ensure browser makes a GET request and doesn't cache the redirect
      const response = NextResponse.redirect(redirectUrl, { status: 303 })
      
      // Add cache control headers to prevent caching of auth-related redirects
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
      response.headers.set('Pragma', 'no-cache')
      response.headers.set('Expires', '0')
      
      return response
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/error`)
}

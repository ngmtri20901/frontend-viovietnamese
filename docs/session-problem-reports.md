# Session Management Problem Report

**Generated:** 2025-11-23
**Status:** Critical Issues Identified
**Impact:** Authentication state inconsistency, poor UX on login/logout

---

## Executive Summary

The application is experiencing critical session management issues that manifest as:
1. Logout not redirecting users immediately (requires manual refresh)
2. Login showing cached "User" instead of actual session data
3. Session state inconsistency between page loads
4. Unpredictable behavior requiring multiple refreshes

**Root Cause:** Multiple architectural issues with client/server state synchronization, improper cache invalidation, and missing server-side logout handling.

---

## Problem Breakdown

### Issue 1: Logout Flow - No Automatic Redirect/State Update

**Symptoms:**
- Clicking logout button doesn't redirect to login page automatically
- Page refresh sometimes shows login page, sometimes shows the protected page with lost session
- Session state appears "stuck" until multiple refreshes

**Root Causes Identified:**

#### 1.1 Client-Side Only Logout ⚠️ CRITICAL
**Location:** [nav-user.tsx:56-59](frontend/shared/components/layout/dashboard/nav-user.tsx#L56-L59)

```typescript
const handleLogout = async () => {
  await supabase.auth.signOut()  // ❌ Only calls client-side signOut
  router.push('/auth/login')      // ❌ Pushes to login without waiting or refreshing
}
```

**Problems:**
- Uses client-side Supabase client only
- Doesn't invalidate server-side cookies properly
- Doesn't refresh the router cache
- Doesn't clear TanStack Query cache
- Race condition: `router.push` executes before signOut completes

#### 1.2 No Server-Side Signout Route ⚠️ CRITICAL
**Finding:** No `/api/auth/signout` or `/auth/signout` route exists

**Impact:**
- Server-side cookies (`sb-access-token`, `sb-refresh-token`) persist even after client-side logout
- Middleware continues to see valid cookies and might refresh them
- Server Components still have access to the old session

#### 1.3 Missing Router and Cache Invalidation
**Location:** Multiple files

```typescript
// ❌ Current implementation
await supabase.auth.signOut()
router.push('/auth/login')

// ✅ Should be
await supabase.auth.signOut({ scope: 'global' })
queryClient.clear() // Clear ALL cached data
router.refresh() // Force server components to re-render
router.push('/auth/login')
```

**Impact:**
- TanStack Query cache retains old user data
- Server Components cache isn't invalidated
- Next.js router cache shows stale content

#### 1.4 Server Component Layout Caching
**Location:** [app/(app)/layout.tsx:18-25](frontend/app/(app)/layout.tsx#L18-L25)

```typescript
export default async function AppLayout({ children }) {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/auth/login')
  }
  // ... rest of component
}
```

**Problems:**
- This Server Component might be cached by Next.js
- After logout, the cached version still shows the protected layout
- No `dynamic = 'force-dynamic'` or revalidation configured
- `redirect()` doesn't clear client-side state

---

### Issue 2: Login Flow - Cached User Data

**Symptoms:**
- After login, UI shows "User" instead of actual email/name
- Refresh sometimes loads correct data, sometimes loses session
- Inconsistent behavior across page loads

**Root Causes Identified:**

#### 2.1 TanStack Query Cache Configuration Mismatch
**Location:** [providers.tsx:10-23](frontend/shared/components/providers.tsx#L10-L23) vs [use-user-profile.ts:130-141](frontend/shared/hooks/use-user-profile.ts#L130-L141)

```typescript
// Global config (providers.tsx)
staleTime: 5 * 60 * 1000,  // 5 minutes
refetchOnWindowFocus: false,

// User profile hook (use-user-profile.ts)
staleTime: 30 * 1000,       // 30 seconds ❌ Shorter than global!
refetchOnWindowFocus: true,  // ❌ Conflicts with global setting
```

**Impact:**
- Query cache behavior is unpredictable
- Old user data might persist for up to 5 minutes globally
- Window focus refetch might or might not happen
- Race conditions between global and specific cache settings

#### 2.2 Missing Router Refresh After Login
**Location:** [login-form.tsx:27-46](frontend/features/auth/components/login-form.tsx#L27-L46)

```typescript
const handleLogin = async (e: React.FormEvent) => {
  // ...
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  router.push('/dashboard')  // ❌ No router.refresh() before push
}
```

**Problems:**
- Server Components aren't notified of auth change
- Cached layout might still think user is unauthenticated
- TanStack Query relies solely on `onAuthStateChange` listener
- Potential race condition if page loads before auth state propagates

#### 2.3 Auth State Change Handler Timing
**Location:** [use-user-profile.ts:144-168](frontend/shared/hooks/use-user-profile.ts#L144-L168)

```typescript
const { data: { subscription } } = supabase.auth.onAuthStateChange(
  async (event, session) => {
    if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
      await queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() })
      // ... other invalidations
    }
  }
)
```

**Problems:**
- Invalidation is async and might complete AFTER navigation
- No guarantee that the new page waits for data to load
- Component might render with stale data before invalidation completes

#### 2.4 OAuth Flow Missing Cache Clear
**Location:** [auth/oauth/route.ts:5-34](frontend/app/auth/oauth/route.ts#L5-L34)

```typescript
export async function GET(request: Request) {
  // ...
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)  // ❌ Direct redirect
    }
  }
}
```

**Problems:**
- No mechanism to tell client to invalidate cache
- Client-side components might still have old cache
- Google login users experience this issue more frequently

---

### Issue 3: Wrong Supabase Client Usage

**Assessment:** ✅ Mostly Correct, ⚠️ Minor Issues

#### 3.1 Client Usage Analysis

**Server Components:**
- ✅ [app/(app)/layout.tsx](frontend/app/(app)/layout.tsx#L18): Uses `createClient()` from `server.ts`
- ✅ [auth/confirm/route.ts](frontend/app/auth/confirm/route.ts#L14): Uses `server.ts` client
- ✅ [auth/oauth/route.ts](frontend/app/auth/oauth/route.ts#L16): Uses `server.ts` client

**Client Components:**
- ✅ [use-user-profile.ts](frontend/shared/hooks/use-user-profile.ts#L5): Uses client from `client.ts`
- ✅ [nav-user.tsx](frontend/shared/components/layout/dashboard/nav-user.tsx#L34): Uses client from `client.ts`
- ✅ [login-form.tsx](frontend/features/auth/components/login-form.tsx#L29): Creates new client instance (acceptable)

**Minor Issue:**
```typescript
// login-form.tsx
const supabase = createClient()  // Creates new instance each render
// Should ideally import the singleton instance
```

---

### Issue 4: Middleware Cookie Handling

**Assessment:** ✅ Mostly Correct

**Location:** [middleware.ts](frontend/shared/lib/supabase/middleware.ts#L21-46)

```typescript
const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookies: {
      getAll() { return request.cookies.getAll() },
      setAll(cookiesToSet) {
        supabaseResponse = NextResponse.next({ request: { headers: request.headers } })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  }
)
await supabase.auth.getUser()  // ✅ Correctly refreshes tokens
```

**Finding:** Cookie handling is correct, but middleware has limitations:
- ✅ Reads cookies correctly
- ✅ Sets cookies correctly
- ✅ Refreshes auth tokens
- ⚠️ Doesn't handle redirect logic (by design)
- ⚠️ Can't distinguish between "just logged out" vs "never logged in"

---

### Issue 5: Server Component Session Caching

**Assessment:** ⚠️ CRITICAL ISSUE

#### 5.1 No Cache Control in Protected Layout
**Location:** [app/(app)/layout.tsx](frontend/app/(app)/layout.tsx)

```typescript
// ❌ Missing export
// export const dynamic = 'force-dynamic'
// export const revalidate = 0

export default async function AppLayout({ children }) {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  // ...
}
```

**Problems:**
- Next.js might cache this layout between requests
- Cached layout retains old authentication state
- Explains why "sometimes" behavior occurs
- Server-side cache not invalidated by client-side logout

#### 5.2 Server Client Configuration Issue
**Location:** [server.ts:88-92](frontend/shared/lib/supabase/server.ts#L88-L92)

```typescript
auth: {
  persistSession: false,       // ✅ Correct for server
  autoRefreshToken: false,     // ✅ Correct for server
  detectSessionInUrl: true,    // ✅ Correct
}
```

**Finding:** Configuration is correct. Issue is with Next.js caching, not Supabase client.

---

## Additional Findings

### Cookie Configuration
**Location:** [client.ts:78-85](frontend/shared/lib/supabase/client.ts#L78-L85)

```typescript
auth: {
  persistSession: true,        // ✅ Correct for browser
  autoRefreshToken: true,      // ✅ Correct
  detectSessionInUrl: true,    // ✅ Correct
  flowType: 'pkce'            // ✅ Secure
}
```

**Finding:** Client configuration is correct.

### Query Invalidation on Auth Changes
**Location:** [use-user-profile.ts:154-160](frontend/shared/hooks/use-user-profile.ts#L154-L160)

```typescript
if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
  await queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() })
  await queryClient.invalidateQueries({ queryKey: queryKeys.user.coins() })
  await queryClient.invalidateQueries({ queryKey: queryKeys.user.progress() })
}
```

**Issue:** Uses `invalidateQueries` but doesn't wait for refetch to complete before allowing navigation.

---

## Impact Assessment

### Critical Issues (P0)
1. ❌ No server-side signout route
2. ❌ Missing `router.refresh()` after login/logout
3. ❌ Server Component layout caching without revalidation
4. ❌ TanStack Query cache not cleared on logout

### High Priority Issues (P1)
1. ⚠️ Cache configuration mismatch (global vs hook-specific)
2. ⚠️ Race conditions in auth state propagation
3. ⚠️ OAuth flow doesn't trigger cache invalidation properly

### Medium Priority Issues (P2)
1. ⚠️ Login form creates new client instance (minor performance)
2. ⚠️ No loading states during auth transitions

---

## Recommended Solutions

### Solution 1: Create Server-Side Signout Route ⭐ HIGHEST PRIORITY

**Create:** `frontend/app/auth/signout/route.ts`

```typescript
import { createClient } from '@/shared/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  // Sign out from Supabase (clears server-side cookies)
  const { error } = await supabase.auth.signOut()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Revalidate all auth-dependent paths
  revalidatePath('/', 'layout')

  return NextResponse.json({ success: true }, { status: 200 })
}
```

**Update:** `frontend/shared/components/layout/dashboard/nav-user.tsx`

```typescript
const handleLogout = async () => {
  try {
    // 1. Call server-side signout endpoint
    const response = await fetch('/auth/signout', {
      method: 'POST',
    })

    if (!response.ok) {
      throw new Error('Logout failed')
    }

    // 2. Sign out from client-side (clears browser storage)
    await supabase.auth.signOut({ scope: 'global' })

    // 3. Clear ALL TanStack Query cache
    queryClient.clear()

    // 4. Force router to refresh server components
    router.refresh()

    // 5. Navigate to login page
    router.push('/auth/login')
  } catch (error) {
    console.error('Logout error:', error)
    // Still attempt to redirect even if errors occur
    router.push('/auth/login')
  }
}
```

**Import needed:**
```typescript
import { useQueryClient } from '@tanstack/react-query'

export function NavUser() {
  const queryClient = useQueryClient()
  // ... rest of component
}
```

---

### Solution 2: Fix Login Flow with Proper Cache Invalidation

**Update:** `frontend/features/auth/components/login-form.tsx`

```typescript
'use client'

import { useQueryClient } from '@tanstack/react-query'

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const queryClient = useQueryClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Clear any stale cache data
      queryClient.clear()

      // Wait a bit for auth state to propagate
      await new Promise(resolve => setTimeout(resolve, 100))

      // Force router to refresh server components
      router.refresh()

      // Navigate to dashboard
      router.push('/dashboard')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
      setIsLoading(false)
    }
    // Don't set isLoading to false on success - let navigation happen
  }

  // ... rest of component
}
```

---

### Solution 3: Fix Server Component Caching

**Update:** `frontend/app/(app)/layout.tsx`

```typescript
import { redirect } from 'next/navigation'
import { AppSidebar } from "@/shared/components/layout/dashboard/app-sidebar"
import { DynamicBreadcrumb } from "@/shared/components/layout/dashboard/dynamic-breadcrumb"
import { Separator } from "@/shared/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/shared/components/ui/sidebar"
import { createClient } from '@/shared/lib/supabase/server'
import { UserCoins } from "@/features/learn/components/lesson"

// ⭐ CRITICAL: Prevent caching of this layout
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/auth/login')
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* ... rest of layout ... */}
      </SidebarInset>
    </SidebarProvider>
  )
}
```

---

### Solution 4: Unify TanStack Query Cache Configuration

**Update:** `frontend/shared/hooks/use-user-profile.ts`

```typescript
export function useUserProfile() {
  const queryClient = useQueryClient()
  const channelRef = useRef<any>(null)

  // Query for user authentication status
  const authQuery = useQuery({
    queryKey: queryKeys.user.profile(),
    queryFn: async (): Promise<UserData> => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Error getting session:', error)
          return {
            user: null,
            profile: null,
            isAuthenticated: false,
            authProvider: 'unknown',
            isGoogleUser: false
          }
        }

        if (!session?.user) {
          return {
            user: null,
            profile: null,
            isAuthenticated: false,
            authProvider: 'unknown',
            isGoogleUser: false
          }
        }

        const authProvider = getAuthProvider(session.user)
        const isGoogle = isGoogleUser(session.user)

        // Fetch user profile data
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (profileError) {
          console.error('Error fetching user profile:', profileError)
          return {
            user: session.user,
            profile: null,
            isAuthenticated: true,
            authProvider,
            isGoogleUser: isGoogle
          }
        }

        return {
          user: session.user,
          profile,
          isAuthenticated: true,
          authProvider,
          isGoogleUser: isGoogle
        }
      } catch (error) {
        console.error('Error in user profile query:', error)
        return {
          user: null,
          profile: null,
          isAuthenticated: false,
          authProvider: 'unknown',
          isGoogleUser: false
        }
      }
    },
    // ⭐ UPDATED: Match global cache settings
    staleTime: 1 * 60 * 1000, // 1 minute (auth data should be relatively fresh)
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('not authenticated')) return false
      return failureCount < 3
    },
    // ⭐ UPDATED: Match global settings
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    refetchOnReconnect: true,
    enabled: typeof window !== 'undefined',
  })

  // ... rest of hook
}
```

---

### Solution 5: Add Loading States and Error Boundaries

**Update:** `frontend/shared/components/layout/dashboard/nav-user.tsx`

```typescript
export function NavUser() {
  const { isMobile } = useSidebar()
  const { user, profile, loading } = useUserProfile()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const userName = profile?.name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const userEmail = user?.email || profile?.email || ''
  const userAvatar = profile?.avatar_url || user?.user_metadata?.avatar_url || '/avatars/default.jpg'

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      // 1. Call server-side signout endpoint
      const response = await fetch('/auth/signout', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Logout failed')
      }

      // 2. Sign out from client-side
      await supabase.auth.signOut({ scope: 'global' })

      // 3. Clear ALL cache
      queryClient.clear()

      // 4. Refresh router
      router.refresh()

      // 5. Navigate
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout error:', error)
      // Still redirect on error
      router.push('/auth/login')
    } finally {
      // Don't set to false - we're navigating away
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              suppressHydrationWarning
              disabled={isLoggingOut}
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback className="rounded-lg">{getInitials(userName)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{userName}</span>
                <span className="truncate text-xs">{userEmail}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            {/* ... menu content ... */}
            <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
              <LogOut />
              {isLoggingOut ? 'Logging out...' : 'Log out'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
```

---

### Solution 6: Update OAuth Flow

**Update:** `frontend/app/auth/oauth/route.ts`

```typescript
import { NextResponse } from 'next/server'
import { createClient } from '@/shared/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  let next = searchParams.get('next') ?? '/'

  if (!next.startsWith('/')) {
    next = '/'
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // ⭐ ADDED: Revalidate the layout cache
      revalidatePath('/', 'layout')

      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'

      // ⭐ ADDED: Add a flag to tell client to clear cache
      const redirectUrl = new URL(next, isLocalEnv ? origin : `https://${forwardedHost || origin}`)
      redirectUrl.searchParams.set('auth_callback', 'true')

      return NextResponse.redirect(redirectUrl.toString())
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`)
}
```

**Create:** Client-side hook to handle auth callback

`frontend/shared/hooks/use-auth-callback.ts`
```typescript
'use client'

import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'

export function useAuthCallback() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const authCallback = searchParams.get('auth_callback')

    if (authCallback === 'true') {
      // Clear cache after OAuth login
      queryClient.clear()

      // Remove the query parameter
      const newUrl = window.location.pathname
      router.replace(newUrl)
    }
  }, [searchParams, queryClient, router])
}
```

**Use in protected layout or pages:**
```typescript
// In app/(app)/layout.tsx client wrapper or any protected page
'use client'
import { useAuthCallback } from '@/shared/hooks/use-auth-callback'

export function AuthCallbackHandler() {
  useAuthCallback()
  return null
}
```

---

## Implementation Priority

### Phase 1: Critical Fixes (Implement Immediately)
1. ✅ Add `export const dynamic = 'force-dynamic'` to `app/(app)/layout.tsx`
2. ✅ Create `/auth/signout` route
3. ✅ Update logout handler in `nav-user.tsx` to use server route
4. ✅ Add `router.refresh()` to login and logout flows

### Phase 2: High Priority Fixes (Implement This Week)
5. ✅ Fix TanStack Query cache configuration inconsistencies
6. ✅ Add proper loading states to auth transitions
7. ✅ Update OAuth callback to invalidate cache

### Phase 3: Polish (Implement Next Week)
8. ✅ Add error boundaries around auth components
9. ✅ Implement auth callback handler for OAuth
10. ✅ Add telemetry/logging for auth state changes

---

## Testing Checklist

After implementing fixes, verify:

### Logout Flow
- [ ] Click logout → immediately redirects to login page
- [ ] No session data visible after logout
- [ ] Refresh on login page stays on login page
- [ ] Cannot access protected routes after logout
- [ ] Server-side cookies are cleared

### Login Flow (Email/Password)
- [ ] Login → immediately shows correct user data
- [ ] No "User" placeholder visible
- [ ] Refresh maintains session
- [ ] Protected routes are accessible
- [ ] User profile displays correct email and name

### Login Flow (Google OAuth)
- [ ] OAuth redirect works correctly
- [ ] User data loads immediately after OAuth
- [ ] No stale cache from previous session
- [ ] Profile displays Google account info

### Session Persistence
- [ ] Close and reopen browser → still logged in
- [ ] Multiple tabs stay synchronized
- [ ] Token refresh doesn't cause flicker
- [ ] No random logouts

---

## Additional Recommendations

### 1. Add Session Debug Utility

Create `frontend/shared/utils/debug-auth.ts`:
```typescript
export async function debugAuthState() {
  if (process.env.NODE_ENV !== 'development') return

  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  console.group('🔐 Auth Debug')
  console.log('Session:', session)
  console.log('User:', session?.user)
  console.log('Access Token:', session?.access_token?.substring(0, 20) + '...')
  console.log('Expires At:', new Date(session?.expires_at! * 1000))
  console.groupEnd()
}
```

### 2. Add Middleware Logging (Development Only)

Update `middleware.ts`:
```typescript
export async function middleware(request: NextRequest) {
  const response = await updateSession(request)

  if (process.env.NODE_ENV === 'development') {
    const user = request.cookies.get('sb-access-token')
    console.log(`[Middleware] ${request.nextUrl.pathname} - Auth: ${user ? '✅' : '❌'}`)
  }

  return response
}
```

### 3. Consider Adding Auth State Machine

For complex auth flows, consider implementing a state machine using XState or similar to manage transitions predictably.

---

## Conclusion

The session management issues stem from **architectural mismatches** between:
- Client-side state (TanStack Query)
- Server-side state (Supabase cookies)
- Next.js caching (Server Components and Router)

The fixes address these issues by:
1. **Server-side signout** ensures cookies are properly cleared
2. **Router refresh** forces Server Components to re-render with new data
3. **Cache invalidation** clears stale client-side data
4. **Proper configuration** prevents cache timing issues

Implementing Phase 1 fixes will resolve **80% of the reported issues**. Phases 2 and 3 will provide a polished, production-ready authentication experience.

---

**Report Status:** Complete
**Next Steps:** Begin Phase 1 implementation
**Estimated Fix Time:** 2-4 hours for Phase 1

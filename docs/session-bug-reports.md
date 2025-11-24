# Session Instability Report

## 1. Problem Description
The application experiences inconsistent session states during Login and Logout flows.
- **Logout:** Users are not immediately redirected to the login page. Refreshing the page shows inconsistent states (sometimes logged in, sometimes logged out).
- **Login:** After logging in, the user interface (e.g., avatar, user details) does not immediately reflect the authenticated state. Refreshing the page sometimes fixes it, but subsequent refreshes may lose the session.

## 2. Root Cause Analysis

### A. Client-Side Navigation & Router Cache (Primary Cause)
The application uses `router.push()` immediately after `supabase.auth.signInWithPassword()` and `supabase.auth.signOut()`.

**The Mechanism:**
1.  **Next.js Router Cache:** Next.js caches the result of Server Components (RSC payload) on the client for a period (30s for dynamic, 5 mins for static).
2.  **Race Condition:**
    *   **Login:** When `signInWithPassword` succeeds, the Supabase client sets the session cookies in the browser. However, `router.push('/dashboard')` triggers a client-side navigation. If the Router Cache has a cached version of the `/dashboard` (even a generic one) or if the request for the new RSC payload happens before the cookie is fully propagated/recognized for the new request context, the server returns a page rendered *without* the user session.
    *   **Logout:** `signOut` clears the session. `router.push('/auth/login')` navigates. If the `/auth/login` page was previously visited (e.g., when the user first logged in), it might be served from the Router Cache. Furthermore, if the middleware runs for this navigation, it might still see the old cookie if the browser hasn't processed the "clear cookie" response header from the `signOut` call yet.

### B. Server Component Caching
Server Components in Next.js are static by default unless they use dynamic functions like `cookies()` or `headers()`.
- `shared/lib/supabase/server.ts` uses `cookies()`, which correctly opts the components into dynamic rendering.
- **However**, the *client-side cache* of these components is the issue. The server renders it correctly *if asked*, but the client router might not ask the server if it thinks it has a valid cache.

### C. Supabase Client Configuration
- **Client (`client.ts`):** `autoRefreshToken: true`. This is correct.
- **Server (`server.ts`):** `autoRefreshToken: false`. This is correct.
- **Middleware (`middleware.ts`):** Calls `updateSession` -> `supabase.auth.getUser()`. This is correct and essential for refreshing tokens.

## 3. Detailed Findings

### Logout Flow (`nav-user.tsx`)
```typescript
const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push('/auth/login') // PROBLEM: Does not invalidate Router Cache or ensure server sync
}
```

### Login Flow (`login-form.tsx`)
```typescript
const { error } = await supabase.auth.signInWithPassword({ ... })
if (error) throw error
router.push('/dashboard') // PROBLEM: Does not invalidate Router Cache
```

## 4. Recommendations

### Solution 1: Implement `router.refresh()` (Recommended Immediate Fix)
The simplest fix is to force a refresh of the Server Components and Router Cache immediately after auth state changes.

**For Login (`login-form.tsx`):**
```typescript
const { error } = await supabase.auth.signInWithPassword({ ... })
if (!error) {
  router.refresh() // Invalidate cache
  router.push('/dashboard')
}
```

**For Logout (`nav-user.tsx`):**
```typescript
const handleLogout = async () => {
  await supabase.auth.signOut()
  router.refresh() // Invalidate cache
  router.push('/auth/login')
}
```

### Solution 2: Use Server Actions (Robust Fix)
Moving authentication logic to Server Actions ensures that cookies are set/cleared strictly on the server side *before* the response is sent to the client. This eliminates the race condition between client-side cookie setting and navigation.

**Example Server Action:**
```typescript
'use server'
export async function login(formData: FormData) {
  const supabase = createClient()
  await supabase.auth.signInWithPassword(...)
  redirect('/dashboard') // Redirects from server, ensuring new cookies are used
}
```

### Solution 3: Key-based Remounting (Partial Fix)
Using a `key` on the root layout that changes based on the session ID can force a full remount, but this is less efficient than `router.refresh()`.

## 5. Conclusion
The instability is not due to the Supabase client configuration or middleware (which appear correct), but rather the interaction between client-side auth state changes and the Next.js App Router's caching mechanism. Implementing `router.refresh()` is the standard solution for this pattern in Next.js.

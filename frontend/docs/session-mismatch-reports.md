# Session Mismatch Investigation – 2025-11-23

## Reported symptoms
- Clicking **Log out** inside `shared/components/layout/dashboard/nav-user.tsx` does not navigate away; the dashboard keeps rendering even though the sidebar avatar/text fall back to the anonymous "User" state.
- After a manual refresh the app only *sometimes* redirects to `/auth/login`; other times it keeps the protected layout but behaves as if no session exists (no email/avatar, API calls fail).
- Logging back in from `/auth/login` shows the same instability: the dashboard may render without user metadata until the page is refreshed once or twice, after which it can randomly lose the session again.

## Findings

### 1. Auth query never refreshes when Supabase hydrates an existing cookie
`shared/hooks/use-user-profile.ts` uses TanStack Query with `staleTime: 30_000` and only invalidates the cache when the Supabase client emits `SIGNED_IN`, `SIGNED_OUT`, or `TOKEN_REFRESHED`:
```ts
if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
  await queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() })
  ...
}
```
When the browser loads a page with a valid `sb-access-token` cookie, Supabase fires the `INITIAL_SESSION` event rather than `SIGNED_IN`. Because the hook ignores that event (and also `USER_UPDATED`), the cached anonymous result produced during the very first render remains "fresh" for the full 30 seconds and never refetches. That matches the behaviour where the dashboard shows `User` until the page is hard-reloaded or enough time passes for the query to become stale.

### 2. Logout never clears the server-side cookie path, so middleware immediately re-creates the session
Both logout entry points (`shared/components/layout/dashboard/nav-user.tsx` and `features/auth/components/logout-button.tsx`) simply call the browser client and push a route:
```ts
const supabase = createClient()
await supabase.auth.signOut()
router.push('/auth/login')
```
No server route ever invokes `createServerClient(...).auth.signOut()`. At the same time, the middleware (`shared/lib/supabase/middleware.ts`) eagerly calls `supabase.auth.getUser()` on every request, which refreshes the cookie pair whenever it still finds `sb-access-token`/`sb-refresh-token`. Because `signOut()` clears the cookies asynchronously on the client, the follow-up navigation request races the cookie deletion; the middleware often sees the old cookies, refreshes them, and keeps the server session alive even though the client has already nulled its local state. This is exactly why refreshing after logout sometimes leaves you in the protected layout.

### 3. Session cache shared across every request for 10 seconds
`features/ai/chat/services/cached-queries.ts` wraps `supabase.auth.getUser()` in `unstable_cache` with a hard-coded cache key:
```ts
return unstable_cache(async () => {
  const { data } = await supabase.auth.getUser()
  return data.user
}, ['session'], { revalidate: 10 })()
```
Because the cache key does not include anything derived from the incoming cookies, whichever user hits the endpoint first is returned to every other request for 10 seconds. After a logout/login sequence, API routes (e.g. `app/api/history/route.ts`) therefore continue to operate on the stale cached user and disagree with the client-side state until the cache expires.

### 4. Server loaders execute the browser Supabase client with no request cookies
`features/flashcards/services/flashcardSyncService.ts` imports `createClient` from the **browser** helper and immediately runs RLS-protected queries. The server-only loader `features/flashcards/data/saved-flashcards-loader.ts` then calls `checkSyncStatus()` during `Promise.all(...)` while already holding a proper `createServerClient()` instance for every other query. On the server this browser client has no access to the request cookies (see `@supabase/ssr`'s `createBrowserClient` implementation), so the call runs unauthenticated, triggers PostgREST errors, and the loader silently falls back to default values. The end result is that data derived from those helpers frequently differs between the initial SSR render and the client re-fetch, reinforcing the "refresh to fix" pattern that was reported.

### 5. Logout handler swallows Supabase errors
Neither logout handler wraps `supabase.auth.signOut()` in a try/catch block. The call rejects whenever the local refresh token has already expired (common after the server refreshes it via middleware), which aborts the function before `router.push('/auth/login')` runs. The UI therefore stays on the dashboard even though `useUserProfile` has already invalidated its cache and collapsed into the anonymous state.

## Recommendations
1. **Handle Supabase's `INITIAL_SESSION` (and `USER_UPDATED`) events** in `useUserProfile` and immediately invalidate `queryKeys.user.profile()` when they fire. Alternatively, include the session user id inside the query key (`['user','profile', session?.user?.id ?? 'anonymous']`) and set `staleTime` to `0` so the hook refetches on every mount.
2. **Add a dedicated server action or route** (e.g. `app/auth/logout/route.ts`) that calls `const supabase = await createClient(); await supabase.auth.signOut();` and clears the cookie pair. The client-side buttons should hit this endpoint (and still fall back to `router.push` in a `finally` block) to ensure the middleware cannot resurrect the session cookies.
3. **Remove the global `unstable_cache` around sessions** or, if caching is required, key it by something derived from the request cookies (for example `['session', requestHeaders.get('cookie')]`) so each request sees its own user. For most auth-dependent endpoints the safest fix is to drop the cache entirely.
4. **Stop using the browser helper on the server.** Refactor helpers such as `checkSyncStatus` so they accept a Supabase client instance or live in a module that imports `@/shared/lib/supabase/server`. This guarantees that SSR data fetching uses the same authenticated context as the client and removes the inconsistent "needs refresh" behaviour.
5. **Harden the logout UI flow:** wrap `supabase.auth.signOut()` in `try/catch`, log/report the error to the user, and always push `/auth/login` in `finally`. Consider disabling the menu button while the promise is pending so users cannot spam it and end up stuck mid-transition.

## Suggested verification steps
- After implementing the fixes above, add Cypress/Playwright coverage that logs in, navigates to a protected page, logs out, and asserts that the redirect happens without manual refresh.
- Hit `app/api/history` (or any route that currently uses `getCachedSession`) from two different accounts in quick succession and confirm that the responses no longer leak the previous session.
- Exercise the Saved Flashcards page on a cold load and ensure the server-rendered data already contains the sync status (no fallback placeholders).

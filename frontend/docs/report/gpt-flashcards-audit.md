# Flashcards Module Audit Report (GPT)

## 1. Executive Summary

**Date:** February 14, 2025  
**Auditor:** GitHub Copilot (GPT-5.1-Codex)  
**Scope:** `/app/(app)/flashcards/{review, statistics, create}` and supporting services/hooks

Key observations:
- Each server route is only a `Suspense` shell (`app/(app)/flashcards/*/page.tsx`) that defers every meaningful fetch to a giant client component. When Supabase's browser session disagrees with the cookie-backed server session, the client component never resolves its first `useEffect`, so the user stays inside `PageWithLoading` forever.
- Both `ReviewClient.tsx` and `StatisticsClient.tsx` call `supabase.auth.getUser()` and several PostgREST/RPC queries after hydration (see `features/flashcards/components/review/ReviewClient.tsx`, `.../statistics/StatisticsClient.tsx`). These calls rely on `localStorage` tokens, which explains why clearing site data temporarily unblocks the pages.
- `PageWithLoading` + `LoadingState` (`shared/components/ui/PageWithLoading.tsx`, `.../LoadingState.tsx`) wraps the full viewport; if an async call never resolves or `supabase.auth.getUser()` rejects before `stopLoading`, the overlay cannot be dismissed.
- The create page does fetch the user on the server, but `FlashcardsPageClient.tsx` immediately instantiates a new browser Supabase client and repeats data loading manually, so it still inherits the same session fragility.

## 2. Architecture Overview

- **Layout guard:** `app/(app)/layout.tsx` enforces auth with the server Supabase client (cookies) and sets `dynamic = "force-dynamic"` to avoid cache issues.
- **Page shells:** `review/page.tsx`, `statistics/page.tsx`, and `create/page.tsx` render `<Suspense fallback>` + client components. Only `create/page.tsx` performs any real server work (redirect unauthenticated, pass `user.id`).
- **Client-side monoliths:** `ReviewClient`, `StatisticsClient`, and `FlashcardsPageClient` orchestrate auth checks, profile fetches, RPC calls, API calls, caching, and UI state inside `useEffect`. No data is streamed during SSR, so hydration must finish before useful content appears.
- **Data sources:**
  - Supabase PostgREST tables (`user_profiles`, `flashcard_statistics`, `flashcard_srs_records`, `custom_flashcards`).
  - Supabase RPC functions (`record_practice_session`, `get_user_detailed_stats`).
  - FastAPI backend via `flashcardService.ts` for flashcard content/topics.
  - LocalStorage caches (`features/flashcards/utils/daily-cache.ts`).

## 3. Pages Review

### `/flashcards/review`
- Server file: `app/(app)/flashcards/review/page.tsx` (empty shell).
- Client file: `features/flashcards/components/review/ReviewClient.tsx` (~700 lines) handles auth, profile creation fallback, topic fetches, statistics, practice session management, and custom session orchestration in a single `useEffect` guarded by `mounted` + `withLoading`.
- Failure mode: if `supabase.auth.getUser()` or any subsequent query never resolves (stale refresh token, quota drop), `withLoading` never calls `stopLoading`, so `LoadingState` blocks the viewport indefinitely.

### `/flashcards/statistics`
- Server file: `app/(app)/flashcards/statistics/page.tsx` (shell only).
- Client file: `features/flashcards/components/statistics/StatisticsClient.tsx` fetches auth, user profile, and statistics entirely on the client. It maintains a cascading state machine (`mounted -> userDataLoaded -> fetchStatistics`) that always begins with a browser `getUser()`.
- Failure mode: any auth error sets `error`, but the page still sits behind `PageWithLoading` until hydration completes. Switching tabs triggers new client-only RPC calls, compounding latency.

### `/flashcards/create`
- Server file: `app/(app)/flashcards/create/page.tsx` fetches the user server-side and redirects when absent. Good start.
- Client file: `features/flashcards/components/create/FlashcardsPageClient.tsx` rebuilds a browser Supabase client and queries `custom_flashcards` inside `useEffect`. If the browser client cannot hydrate the session, the spinner stays forever even though the server already authenticated the request.

## 4. Component Audit

- **`ReviewClient`** (`features/flashcards/components/review/ReviewClient.tsx`):
  - Runs a mega `withLoading` block that mixes auth, profile creation, topic fetches (`flashcardAPI.getAllTopics()`), stats queries, and card loading (`flashcardAPI.getRandomFlashcards`).
  - Relies on `saveDailyFlashcards` / `loadDailyFlashcards` (localStorage). When cached data is corrupt, the loader clears it but still resolves; however, the preceding Supabase calls must succeed first.
  - Uses `PageWithLoading` plus a manual 33s safety timeout (now 10s inside `useLoading.ts`). This is a symptom of unresolved promises.

- **`StatisticsClient`** (`features/flashcards/components/statistics/StatisticsClient.tsx`):
  - Calls `supabase.auth.getUser()` every time the component mounts and for every export (see `statisticsService.ts`), duplicating work already done in `layout.tsx`.
  - The TanStack Query pattern is not used; manual `setIsLoadingStats` + `withLoading` controls make it easy to end up in a "loading true" state if a promise rejects before `finally`.
  - Uses memoized aggregations/charts that cannot run until data is present, so Suspense fallback never reflects real loading progress.

- **`FlashcardsPageClient`** (`features/flashcards/components/create/FlashcardsPageClient.tsx`):
  - Immediately creates a browser client with `createClient()` and runs `supabase.from('custom_flashcards')...` on mount. If the client cannot hydrate the session (expired local storage token), queries fail silently and loading spinner persists.
  - Manual `useState`/`useEffect` control with `Loader2` spinner duplicates `PageWithLoading`, adding more states to sync.

- **Infrastructure helpers:**
  - `shared/hooks/use-loading.ts` starts a timeout-backed overlay but assumes the wrapped promise always settles. A hung `supabase.auth.getUser()` (waiting for refresh) breaks that assumption.
  - `shared/components/ui/PageWithLoading.tsx` + `LoadingState.tsx` render a full-screen overlay, hiding all fallback content and making the Suspense skeleton useless.

## 5. API & Data Flow Analysis

- **Server vs Client Supabase clients:** `shared/lib/supabase/server.ts` uses cookies and disables `autoRefreshToken`, while `shared/lib/supabase/client.ts` **enables** `persistSession` and `autoRefreshToken`. When cookies and local storage diverge (e.g., logout in another tab), the server still sees a valid session but the browser client loops refreshing, leading to the observed hang.
- **Statistics service:** Every helper in `features/flashcards/services/statisticsService.ts` calls `supabase.auth.getUser()` internally. When `StatisticsClient` already fetched the user, this is redundant and serializes extra auth calls before every RPC/CSV export.
- **Flashcard service:** `features/flashcards/services/flashcardService.ts` hits the FastAPI backend directly from the browser. These requests are launched only after client auth resolves, increasing the waterfall and exposure to network variance.
- **Caching:** `statisticsService` caches results in-memory per tab, while `daily-cache.ts` uses localStorage. Neither cache invalidates when the Supabase session changes, so stale or unauthenticated states linger until storage is cleared—matching the user symptom.

## 6. Performance Audit

- **Waterfall latency:** Render skeleton -> load 600+ KB of client JS -> hydrate -> client Supabase handshake -> profile query -> stats/flashcard fetch -> UI render. No server-provided data short-circuits this path.
- **Blocked rendering:** `LoadingState` hides content with `position: fixed; inset: 0`. Even when Suspense fallback renders skeletons under it, the user sees only the overlay until the entire cascade finishes.
- **Bundle size:** `ReviewClient.tsx` and `StatisticsClient.tsx` import dozens of icons/components. Because they are gated by Suspense, the user downloads this bundle regardless of whether data eventually arrives.
- **Redundant fetches:** `StatisticsClient` triggers `getUserDetailedStats` on every time-range change, and the service itself re-fetches the user, multiplying network cost.

## 7. Security & Session Notes

- RLS relies on the JWT carried by the browser client. When that token expires but the server cookie still validates, server-side guards pass but client-side queries fail silently ("Infinite Loading" perceived as a security hang).
- Because mutations (e.g., `recordPracticeSession` in `statisticsService.ts`, `sessionAPI` usage in `ReviewClient`) happen in the browser, a user with tampered local storage could replay requests without server verification of current session state.
- Lack of error boundaries means unexpected auth errors surface only as console logs plus frozen overlays; there is no pathway to force refresh the token or redirect to login.

## 8. Recommendations

1. **Move critical data fetching to the server components.** Fetch the authenticated user (already done in layout), user profile, and initial flashcard/stats payload in `page.tsx` (use `createClient` + server-side RPC calls). Pass results via props to smaller client components.
2. **Stop re-validating auth on the client.** Update `ReviewClient` and `StatisticsClient` to accept `user`/`userId` props and trust the layout guard. Remove `supabase.auth.getUser()` from client hooks and services; instead, inject the user context once.
3. **Replace manual loading overlays with deterministic states.** Adopt TanStack Query (already used elsewhere, e.g., `/flashcards` list page) or server actions that return `pending/error/success` booleans. Retire `PageWithLoading` for these routes.
4. **Leverage Suspense correctly.** If data must remain client-side, convert the fetches to React cache resources (or Next.js `use`/`useQuery`) so Suspense can actually wait for data instead of just code.
5. **Consolidate Supabase access.** Expose a single provider that shares the session across client components, handles token refresh centrally, and emits explicit errors when the browser token is invalid so you can redirect instead of spinning.
6. **Instrument and cap loading.** Add error boundaries and retry buttons; log Supabase auth errors to a telemetry channel so session divergence is visible without user reports.

## 9. Priority Action Plan

1. **Immediate (Stop infinite spinners):**
   - Pass `userId` (and optionally minimal profile) from `review/page.tsx` and `statistics/page.tsx` just like `create/page.tsx` already does. Early-return with `<Redirect />` when absent.
   - Remove `PageWithLoading` overlay from these pages; rely on skeletons that already exist in the Suspense fallback.

2. **Short term (Stabilize data flow):**
   - Create server utilities to fetch topics, daily stats, and initial flashcards using the cookie-backed client, then hydrate client components with those props to avoid fetch-on-mount.
   - Refactor `statisticsService` so RPC helpers accept `userId` instead of calling `supabase.auth.getUser()` internally.

3. **Medium term (Modernize):**
   - Adopt React Query or Next.js Server Actions for flashcard/statistics mutations to reduce client bundle size and guarantee atomic operations.
   - Split `ReviewClient` into focused components (session config, deck viewer, progress sidebar) to reduce hydration cost and isolate failures.

4. **Long term (Observability & UX):**
   - Track Supabase auth latency/error metrics and surface a "Session expired, please sign in again" dialog when local and server sessions diverge.
   - Rework caching (localStorage + in-memory) to key off `userId` and clear automatically on sign-out.

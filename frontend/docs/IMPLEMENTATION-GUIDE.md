# Implementation Guide: Client Component Auth Refactoring

**Status:** Ready to implement
**Estimated Time:** 1-2 hours

---

## Summary of Changes Made

### ✅ Phase 1: Pages Converted to Client Components
- [frontend/app/(app)/flashcards/review/page.tsx](../app/(app)/flashcards/review/page.tsx)
- [frontend/app/(app)/flashcards/statistics/page.tsx](../app/(app)/flashcards/statistics/page.tsx)
- [frontend/app/(app)/flashcards/create/page.tsx](../app/(app)/flashcards/create/page.tsx)

All pages now use `'use client'` directive and render client components directly.

### ✅ Phase 3: Security Components Created
- [frontend/shared/lib/apiClient.ts](../shared/lib/apiClient.ts) - Timeout protection
- [frontend/shared/components/error-boundary.tsx](../shared/components/error-boundary.tsx) - Error boundaries
- [frontend/features/flashcards/services/validation.ts](../features/flashcards/services/validation.ts) - Input validation
- [frontend/docs/security-rls-policies.md](./security-rls-policies.md) - RLS documentation

---

## Remaining Work: Phase 2 - Remove Duplicate Auth

### Component 1: ReviewClient.tsx

**File:** `frontend/features/flashcards/components/review/ReviewClient.tsx`

#### Changes Needed:

**1. Add import at top:**
```typescript
import { useUserProfile } from '@/shared/hooks/use-user-profile'
```

**2. Replace lines 107-116 (state declarations):**
```typescript
// BEFORE
const [mounted, setMounted] = useState(false);
const [user, setUser] = useState<User | null>(null);

// AFTER
const [mounted, setMounted] = useState(false);
const { user, profile: userProfile, loading: authLoading } = useUserProfile()
```

**3. Remove lines 176-178 (mounted useEffect):**
```typescript
// DELETE THIS
useEffect(() => {
  setMounted(true);
}, []);
```

**4. Replace lines 194-278 (main data fetching useEffect):**
```typescript
// BEFORE: Lines 194-278 (entire useEffect with auth check)
useEffect(() => {
  const fetchData = async () => {
    if (!mounted) return;

    await withLoading(async () => {
      try {
        // Get current user
        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser();
        if (authError || !authUser) {
          toast.error("Please log in to continue");
          router.push("/auth/login");
          return;
        }

        // Get user profile
        const { data: userProfile, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", authUser.id)
          .maybeSingle();

        if (profileError || !userProfile) {
          // ... profile creation code ...
        } else {
          setUser(userProfile);
        }

        // Get flashcard topics
        const topicsData = await flashcardAPI.getAllTopics();
        setTopics(...);

        // Get today's statistics
        await fetchTodaysStats(authUser.id);

        // Load sample practice cards
        await loadPracticeCards(authUser.id);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load review data");
      }
    });
  };

  fetchData();
}, [mounted, router, withLoading]);

// AFTER: Simplified without duplicate auth
useEffect(() => {
  const fetchData = async () => {
    // Early return if auth still loading or no user
    if (authLoading || !user) return;

    await withLoading(async () => {
      try {
        // Parallel data fetching (Phase 4 optimization)
        const [topicsData] = await Promise.all([
          flashcardAPI.getAllTopics(),
          fetchTodaysStats(user.id),
          loadPracticeCards(user.id)
        ]);

        setTopics(
          topicsData.map((topic) => ({
            id: topic.id,
            name: topic.title,
            description: topic.description,
            icon: "📚",
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load review data");
      }
    });
  };

  fetchData();
}, [user, authLoading, withLoading]);
```

**5. Update fetchTodaysStats function (line 287):**
```typescript
// No changes needed - already takes userId parameter
```

**6. Remove setMounted(true) line:**
```typescript
// DELETE any remaining setMounted(true) calls
```

**7. Update early return condition (line 596):**
```typescript
// BEFORE
if (!mounted) {
  return null;
}

// AFTER
if (authLoading) {
  return <PageWithLoading isLoading={true} />;
}

if (!user) {
  // Layout should redirect, but handle edge case
  return null;
}
```

---

### Component 2: StatisticsClient.tsx

**File:** `frontend/features/flashcards/components/statistics/StatisticsClient.tsx`

#### Changes Needed:

**1. Add import at top:**
```typescript
import { useUserProfile } from '@/shared/hooks/use-user-profile'
```

**2. Replace lines 68-76 (state declarations):**
```typescript
// BEFORE
const [mounted, setMounted] = useState(false)
const [user, setUser] = useState<User | null>(null)
const [userDataLoaded, setUserDataLoaded] = useState(false)

// AFTER
const [mounted, setMounted] = useState(false)
const { user, profile: userProfile, loading: authLoading } = useUserProfile()
```

**3. Replace lines 79-82 (mounted useEffect):**
```typescript
// BEFORE
useEffect(() => {
  setMounted(true)
}, [])

// AFTER - Keep for other mounted checks, but simplify
useEffect(() => {
  setMounted(true)
}, [])
```

**4. REMOVE lines 135-223 (fetchUserData useEffect):**
```typescript
// DELETE ENTIRE useEffect that fetches user data
// This is now handled by useUserProfile hook
```

**5. Update lines 226-259 (fetchStatisticsData useEffect):**
```typescript
// BEFORE
useEffect(() => {
  const fetchStatisticsData = async () => {
    if (!mounted || !userDataLoaded || isLoadingStats) return;
    // ... rest of function
  }

  fetchStatisticsData()
}, [timeRange, mounted, userDataLoaded])

// AFTER
useEffect(() => {
  const fetchStatisticsData = async () => {
    if (!mounted || authLoading || !user || isLoadingStats) return;

    setIsLoadingStats(true)
    await withLoading(async () => {
      try {
        const result = await fetchStatisticsWithFallback(timeRange)
        setDataFetchResult(result)
        setStatistics(result.data)

        if (result.fallbackUsed && result.message) {
          toast.info(result.message, { duration: 5000 })
        }
      } catch (statsError) {
        console.error("Statistics fetch failed:", statsError)
        setDataFetchResult({
          data: [],
          actualTimeRange: "all",
          requestedTimeRange: timeRange,
          fallbackUsed: false,
          message: "Failed to load statistics. Please try again later."
        })
        setStatistics([])
      } finally {
        setIsLoadingStats(false)
      }
    })
  }

  fetchStatisticsData()
}, [timeRange, mounted, user, authLoading, withLoading])
```

**6. Update early return condition (line 349):**
```typescript
// BEFORE
if (!mounted) {
  return null
}

// AFTER
if (!mounted || authLoading) {
  return <PageWithLoading isLoading={true} />
}

if (!user) {
  // Layout should redirect, but handle edge case
  return null
}
```

**7. Update aggregateStats calculation (line 262):**
```typescript
// BEFORE
currentStreak: user?.streak_days || 0

// AFTER
currentStreak: userProfile?.streak_count || 0
```

---

### Component 3: FlashcardsPageClient.tsx

**File:** `frontend/features/flashcards/components/create/FlashcardsPageClient.tsx`

#### Changes Needed:

**1. Add import at top:**
```typescript
import { useUserProfile } from '@/shared/hooks/use-user-profile'
```

**2. Update component signature (line 22):**
```typescript
// BEFORE
export default function FlashcardsPageClient({ userId }: { userId: string }) {

// AFTER
export default function FlashcardsPageClient() {
  const { user, loading: authLoading } = useUserProfile()
  const userId = user?.id
```

**3. Add early return for auth check (after userId declaration):**
```typescript
if (authLoading) {
  return (
    <div className="flex items-center justify-center py-12 min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  )
}

if (!userId) {
  // Layout should redirect, but handle edge case
  return null
}
```

**4. No other changes needed** - rest of component uses userId parameter correctly

---

## Phase 4: Performance Optimizations

### Parallel Data Fetching

**Already implemented in ReviewClient above** - using `Promise.all()` to fetch topics, stats, and cards in parallel.

### StatisticsClient Parallel Fetching

The statistics fetching is already optimal since it's a single RPC call. No changes needed.

---

## Testing Checklist

After implementing these changes:

### Functional Testing
- [ ] Navigate to `/flashcards/review` - should load without infinite spinner
- [ ] Navigate to `/flashcards/statistics` - should load without infinite spinner
- [ ] Navigate to `/flashcards/create` - should load without infinite spinner
- [ ] Test session expiry: Wait 1 hour, refresh page - should redirect to login
- [ ] Test with cleared browser data: Should still work on first load
- [ ] Create a custom session - should work end-to-end
- [ ] View statistics with different time ranges - should load quickly

### Error Testing
- [ ] Disconnect network, try to load page - should show timeout error
- [ ] Simulate API error - should show error boundary
- [ ] Try to access without login (manually clear cookies) - should redirect

### Performance Testing
- [ ] Open DevTools Network tab
- [ ] Navigate to `/flashcards/review`
- [ ] Verify requests happen in parallel (not waterfall)
- [ ] Check total load time < 2 seconds
- [ ] No infinite loading spinners

---

## Rollback Instructions

If issues occur:

```bash
# Revert all changes
git checkout HEAD -- frontend/app/(app)/flashcards/review/page.tsx
git checkout HEAD -- frontend/app/(app)/flashcards/statistics/page.tsx
git checkout HEAD -- frontend/app/(app)/flashcards/create/page.tsx
git checkout HEAD -- frontend/features/flashcards/components/review/ReviewClient.tsx
git checkout HEAD -- frontend/features/flashcards/components/statistics/StatisticsClient.tsx
git checkout HEAD -- frontend/features/flashcards/components/create/FlashcardsPageClient.tsx

# Or revert specific commit
git revert <commit-hash>
```

---

## Next Steps After Implementation

1. **Deploy to staging** and test thoroughly
2. **Monitor error rates** in production (Sentry, LogRocket)
3. **Verify RLS policies** using the checklist in [security-rls-policies.md](./security-rls-policies.md)
4. **Add integration tests** for these critical flows
5. **Document any edge cases** discovered during testing

---

## Questions or Issues?

- Review the [claude-flashcards-audit.md](./claude-flashcards-audit.md) for detailed analysis
- Check [security-rls-policies.md](./security-rls-policies.md) for RLS verification steps
- Test error boundaries with the ErrorBoundary component
- Use apiClient.ts for all API calls to ensure timeout protection

---

**Status:** Ready to implement Phase 2 changes
**Priority:** CRITICAL - Fixes infinite loading issue
**Estimated Time:** 1-2 hours

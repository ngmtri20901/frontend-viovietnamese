# Supabase Row-Level Security (RLS) Policies

**Last Updated:** 2025-11-24
**Status:** Critical - Must be verified in Supabase dashboard

---

## Overview

Row-Level Security (RLS) is the **primary security mechanism** that protects user data in Supabase/PostgreSQL. Even though client-side code can be bypassed, RLS policies at the database level ensure that users can only access their own data.

### Why RLS is Critical

1. **Last Line of Defense**: Even if client auth is bypassed, RLS prevents unauthorized data access
2. **Database-Level Security**: Enforced by PostgreSQL, not JavaScript
3. **Zero Trust**: Assumes all client code can be malicious
4. **Compliance**: Required for GDPR, SOC 2, and other security standards

---

## Required RLS Policies

### 1. `user_profiles` Table

**Purpose**: Store user profile information

**Required Policies**:

#### ✅ SELECT Policy
```sql
CREATE POLICY "Users can view own profile"
ON user_profiles
FOR SELECT
USING (auth.uid() = id);
```

#### ✅ INSERT Policy
```sql
CREATE POLICY "Users can create own profile"
ON user_profiles
FOR INSERT
WITH CHECK (auth.uid() = id);
```

#### ✅ UPDATE Policy
```sql
CREATE POLICY "Users can update own profile"
ON user_profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
```

**Test Cases**:
- [ ] User A can read their own profile
- [ ] User A cannot read User B's profile
- [ ] User A can update their own profile
- [ ] User A cannot update User B's profile

---

### 2. `flashcard_statistics` Table

**Purpose**: Store daily learning statistics per user

**Required Policies**:

#### ✅ SELECT Policy
```sql
CREATE POLICY "Users can view own statistics"
ON flashcard_statistics
FOR SELECT
USING (auth.uid() = user_id);
```

#### ✅ INSERT Policy
```sql
CREATE POLICY "Users can create own statistics"
ON flashcard_statistics
FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

#### ✅ UPDATE Policy
```sql
CREATE POLICY "Users can update own statistics"
ON flashcard_statistics
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

**Test Cases**:
- [ ] User A can read their own statistics
- [ ] User A cannot read User B's statistics
- [ ] User A can insert statistics for themselves
- [ ] User A cannot insert statistics for User B
- [ ] User A can update their own statistics
- [ ] User A cannot update User B's statistics

---

### 3. `custom_flashcards` Table

**Purpose**: User-created custom flashcards

**Required Policies**:

#### ✅ SELECT Policy
```sql
CREATE POLICY "Users can view own flashcards"
ON custom_flashcards
FOR SELECT
USING (auth.uid() = user_id);
```

#### ✅ INSERT Policy
```sql
CREATE POLICY "Users can create own flashcards"
ON custom_flashcards
FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

#### ✅ UPDATE Policy
```sql
CREATE POLICY "Users can update own flashcards"
ON custom_flashcards
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

#### ✅ DELETE Policy
```sql
CREATE POLICY "Users can delete own flashcards"
ON custom_flashcards
FOR DELETE
USING (auth.uid() = user_id);
```

**Test Cases**:
- [ ] User A can CRUD their own flashcards
- [ ] User A cannot CRUD User B's flashcards
- [ ] Anonymous users cannot access any flashcards

---

### 4. `review_sessions` Table

**Purpose**: Track flashcard review sessions

**Required Policies**:

#### ✅ SELECT Policy
```sql
CREATE POLICY "Users can view own sessions"
ON review_sessions
FOR SELECT
USING (auth.uid() = user_id);
```

#### ✅ INSERT Policy
```sql
CREATE POLICY "Users can create own sessions"
ON review_sessions
FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

#### ✅ UPDATE Policy
```sql
CREATE POLICY "Users can update own sessions"
ON review_sessions
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

**Test Cases**:
- [ ] User A can create/read/update their sessions
- [ ] User A cannot access User B's sessions

---

### 5. `review_session_cards` Table

**Purpose**: Map flashcards to review sessions

**Required Policies**:

#### ✅ SELECT Policy (Complex)
```sql
CREATE POLICY "Users can view cards for own sessions"
ON review_session_cards
FOR SELECT
USING (
  session_id IN (
    SELECT id FROM review_sessions WHERE user_id = auth.uid()
  )
);
```

#### ✅ INSERT Policy
```sql
CREATE POLICY "Users can insert cards for own sessions"
ON review_session_cards
FOR INSERT
WITH CHECK (
  session_id IN (
    SELECT id FROM review_sessions WHERE user_id = auth.uid()
  )
);
```

#### ✅ UPDATE Policy
```sql
CREATE POLICY "Users can update cards for own sessions"
ON review_session_cards
FOR UPDATE
USING (
  session_id IN (
    SELECT id FROM review_sessions WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  session_id IN (
    SELECT id FROM review_sessions WHERE user_id = auth.uid()
  )
);
```

**Test Cases**:
- [ ] User A can access session cards for their sessions
- [ ] User A cannot access session cards for User B's sessions
- [ ] Verify subquery performance (add index on review_sessions.user_id)

---

### 6. `flashcard_srs_records` Table (if exists)

**Purpose**: Spaced Repetition System records

**Required Policies**:

#### ✅ SELECT Policy
```sql
CREATE POLICY "Users can view own SRS records"
ON flashcard_srs_records
FOR SELECT
USING (auth.uid() = user_id);
```

#### ✅ INSERT/UPDATE Policies
```sql
CREATE POLICY "Users can manage own SRS records"
ON flashcard_srs_records
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

---

## Verification Checklist

### Step 1: Enable RLS on All Tables
```sql
-- Run in Supabase SQL Editor
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcard_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_session_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcard_srs_records ENABLE ROW LEVEL SECURITY;
```

### Step 2: Verify Policies Exist
- [ ] Navigate to Supabase Dashboard → Authentication → Policies
- [ ] Check each table has the policies listed above
- [ ] Verify policy definitions match exactly

### Step 3: Test with Different Users
1. Create two test accounts (User A, User B)
2. Have User A create data (profile, flashcards, sessions)
3. Attempt to access User A's data from User B
4. **Expected**: All queries should return empty or error
5. **If not**: RLS policy is missing or incorrect

### Step 4: Test Anonymous Access
- [ ] Log out completely (clear localStorage)
- [ ] Attempt to query tables from browser console
- [ ] **Expected**: All queries should fail with "auth.uid() is null" or return empty

### Step 5: Performance Testing
RLS policies add a WHERE clause to every query. Ensure indexes exist:

```sql
-- Recommended indexes for RLS performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_id ON user_profiles(id);
CREATE INDEX IF NOT EXISTS idx_flashcard_statistics_user_id ON flashcard_statistics(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_flashcards_user_id ON custom_flashcards(user_id);
CREATE INDEX IF NOT EXISTS idx_review_sessions_user_id ON review_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_flashcard_srs_records_user_id ON flashcard_srs_records(user_id);
```

---

## Common RLS Pitfalls

### ❌ Pitfall 1: Service Role Key Bypasses RLS
**Issue**: Using `service_role` key in client code bypasses all RLS policies.
**Fix**: NEVER expose service_role key. Use anon/authenticated keys only.

### ❌ Pitfall 2: Missing `WITH CHECK` Clause
**Issue**: Users can insert data for other users if `WITH CHECK` is missing.
**Fix**: Always include `WITH CHECK (auth.uid() = user_id)` on INSERT/UPDATE policies.

### ❌ Pitfall 3: Disabled RLS
**Issue**: Table created without RLS enabled.
**Fix**: Run `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`

### ❌ Pitfall 4: Overly Permissive Policies
**Issue**: Policy uses `USING (true)` allowing access to all rows.
**Fix**: Always filter by `auth.uid() = user_id`

---

## Security Testing Script

Use this script in Supabase SQL Editor to test RLS:

```sql
-- Test as User A (replace USER_A_ID with actual UUID)
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claim.sub = 'USER_A_ID';

-- Should return User A's data only
SELECT * FROM user_profiles;
SELECT * FROM custom_flashcards;
SELECT * FROM review_sessions;

-- Test as User B
SET LOCAL request.jwt.claim.sub = 'USER_B_ID';

-- Should return User B's data only (different from above)
SELECT * FROM user_profiles;
SELECT * FROM custom_flashcards;
SELECT * FROM review_sessions;

-- Test as anonymous (no auth)
RESET ROLE;

-- Should return nothing or error
SELECT * FROM user_profiles;
SELECT * FROM custom_flashcards;
```

---

## Action Items

### Immediate (Week 1)
- [ ] Verify RLS is enabled on all user data tables
- [ ] Confirm all policies exist in Supabase dashboard
- [ ] Run manual tests with 2+ test accounts

### Short-term (Week 2-3)
- [ ] Add automated RLS tests to CI/CD pipeline
- [ ] Document any custom RLS policies
- [ ] Add performance indexes for RLS queries

### Long-term (Month 2+)
- [ ] Periodic RLS audits (quarterly)
- [ ] Monitor query performance with RLS
- [ ] Review and update policies as schema changes

---

## Additional Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS Policies](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [RLS Performance Best Practices](https://supabase.com/docs/guides/database/postgres/row-level-security)

---

**⚠️ CRITICAL REMINDER**: RLS is the last line of defense. All user data MUST be protected by RLS policies. Never trust client-side code for security.

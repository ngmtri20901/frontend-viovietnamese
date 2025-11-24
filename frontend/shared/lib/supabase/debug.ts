/**
 * Auth debugging utilities
 * Only active in development mode for troubleshooting session issues
 */

import type { SupabaseClient } from '@supabase/supabase-js'

const IS_DEV = process.env.NODE_ENV === 'development'

/**
 * Log auth state changes with detailed context
 */
export function logAuthStateChange(
  event: string,
  userId: string | undefined,
  context: string = ''
) {
  if (!IS_DEV) return

  const timestamp = new Date().toISOString()
  const contextStr = context ? ` [${context}]` : ''

  console.log(
    `🔐 [Auth${contextStr}] ${timestamp} - Event: ${event}, User: ${userId || 'anonymous'}`
  )
}

/**
 * Log session details for debugging
 */
export async function debugSession(
  supabase: SupabaseClient,
  context: string = ''
) {
  if (!IS_DEV) return

  try {
    const { data: { session }, error } = await supabase.auth.getSession()

    const contextStr = context ? ` [${context}]` : ''
    console.log(`🔍 [Session Debug${contextStr}]`, {
      hasSession: !!session,
      userId: session?.user?.id,
      email: session?.user?.email,
      provider: session?.user?.app_metadata?.provider,
      expiresAt: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : null,
      error: error?.message,
    })
  } catch (err) {
    console.error('❌ [Session Debug] Failed to get session:', err)
  }
}

/**
 * Log cache invalidation events
 */
export function logCacheInvalidation(
  queryKeys: string[],
  context: string = ''
) {
  if (!IS_DEV) return

  const contextStr = context ? ` [${context}]` : ''
  console.log(
    `🗑️ [Cache Invalidation${contextStr}]`,
    'Clearing keys:',
    queryKeys
  )
}

/**
 * Log router cache revalidation
 */
export function logRouterRevalidation(
  path: string,
  type: 'layout' | 'page' = 'page',
  context: string = ''
) {
  if (!IS_DEV) return

  const contextStr = context ? ` [${context}]` : ''
  console.log(
    `🔄 [Router Revalidation${contextStr}]`,
    `Revalidating ${type}:`,
    path
  )
}

/**
 * Log cookie operations
 */
export function logCookieOperation(
  operation: 'set' | 'delete' | 'read',
  cookieName: string,
  context: string = ''
) {
  if (!IS_DEV) return

  const contextStr = context ? ` [${context}]` : ''
  const emoji = operation === 'delete' ? '🗑️' : operation === 'set' ? '✍️' : '👀'

  console.log(
    `${emoji} [Cookie ${operation}${contextStr}]`,
    cookieName
  )
}

/**
 * Comprehensive auth flow debug logger
 * Use this at critical auth checkpoints
 */
export async function debugAuthFlow(
  supabase: SupabaseClient,
  checkpoint: string,
  additionalData?: Record<string, unknown>
) {
  if (!IS_DEV) return

  console.group(`🔐 [Auth Flow: ${checkpoint}]`)

  try {
    // Session state
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    console.log('Session:', {
      exists: !!session,
      userId: session?.user?.id,
      email: session?.user?.email,
      provider: session?.user?.app_metadata?.provider,
      expiresIn: session?.expires_at
        ? Math.round((session.expires_at * 1000 - Date.now()) / 1000 / 60) + ' minutes'
        : null,
      error: sessionError?.message,
    })

    // Additional context
    if (additionalData) {
      console.log('Additional data:', additionalData)
    }

    // Browser state (client-only)
    if (typeof window !== 'undefined') {
      const cookies = document.cookie.split(';').map(c => c.trim().split('=')[0])
      console.log('Browser cookies:', cookies)
      console.log('LocalStorage keys:', Object.keys(localStorage))
    }
  } catch (err) {
    console.error('❌ Debug failed:', err)
  } finally {
    console.groupEnd()
  }
}

/**
 * Monitor auth state changes with automatic logging
 * Call this once in your root layout or provider
 */
export function setupAuthDebugger(supabase: SupabaseClient) {
  if (!IS_DEV) return

  console.log('🔐 [Auth Debugger] Monitoring auth state changes...')

  supabase.auth.onAuthStateChange((event, session) => {
    console.log(`🔐 [Auth Event: ${event}]`, {
      userId: session?.user?.id,
      email: session?.user?.email,
      provider: session?.user?.app_metadata?.provider,
      timestamp: new Date().toISOString(),
    })
  })
}

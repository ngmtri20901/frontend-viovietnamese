'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'
import { Toaster } from '@/shared/components/ui/sonner'

export function Providers({ children }: { children: React.ReactNode }) {
  // Create a QueryClient instance that persists across re-renders
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            /**
             * ✅ UPDATED: Balanced cache configuration
             *
             * - staleTime: 1min for general data (down from 5min to be more responsive)
             * - gcTime: 5min (down from 10min to free memory faster)
             * - refetchOnWindowFocus: true (security - refresh data when user returns)
             * - retry: 1 (keep low for fast failure feedback)
             *
             * Note: Auth queries override these in use-user-profile.ts:
             * - Auth staleTime: 30s (more frequent updates for security)
             * - Auth refetchOnWindowFocus: true (always check session on focus)
             */
            staleTime: 60 * 1000, // 1 minute - balanced for responsiveness
            gcTime: 5 * 60 * 1000, // 5 minutes - reasonable memory management
            retry: 1, // Fast fail for better UX
            refetchOnWindowFocus: true, // Refresh when user returns to tab (security)
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster />
    </QueryClientProvider>
  )
}


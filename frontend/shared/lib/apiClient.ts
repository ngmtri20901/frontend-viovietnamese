/**
 * API Client with Timeout Protection
 *
 * Provides a wrapper around fetch with:
 * - Request timeout (prevents infinite loading)
 * - Request cancellation on component unmount
 * - Structured error handling
 */

export class APIError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: any
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export interface FetchOptions extends RequestInit {
  timeoutMs?: number
}

/**
 * Fetch with automatic timeout protection
 *
 * @param url - The URL to fetch
 * @param options - Fetch options including custom timeoutMs
 * @param timeoutMs - Timeout in milliseconds (default: 10000ms / 10s)
 * @returns Promise resolving to parsed JSON response
 * @throws APIError on timeout, network error, or HTTP error
 */
export async function fetchWithTimeout<T = any>(
  url: string,
  options: FetchOptions = {},
  timeoutMs: number = 10000
): Promise<T> {
  const controller = new AbortController()
  const { timeoutMs: customTimeout, ...fetchOptions } = options
  const actualTimeout = customTimeout ?? timeoutMs

  const timeoutId = setTimeout(() => controller.abort(), actualTimeout)

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new APIError(
        response.status,
        errorData?.message || `HTTP ${response.status}: ${response.statusText}`,
        errorData
      )
    }

    return await response.json()
  } catch (error) {
    clearTimeout(timeoutId)

    if (error instanceof APIError) {
      throw error
    }

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new APIError(
          0,
          `Request timeout after ${actualTimeout}ms - please try again`
        )
      }
      throw new APIError(0, `Network error: ${error.message}`)
    }

    throw new APIError(0, 'Unknown error occurred')
  }
}

/**
 * Create a cancellable fetch request
 * Returns both the promise and the abort controller
 *
 * Usage:
 * ```ts
 * const { promise, abort } = cancellableFetch(url, options)
 *
 * // In cleanup
 * useEffect(() => {
 *   return () => abort()
 * }, [])
 * ```
 */
export function cancellableFetch<T = any>(
  url: string,
  options: FetchOptions = {},
  timeoutMs: number = 10000
): { promise: Promise<T>; abort: () => void } {
  const controller = new AbortController()

  const promise = fetchWithTimeout<T>(url, {
    ...options,
    signal: controller.signal,
  }, timeoutMs)

  return {
    promise,
    abort: () => controller.abort(),
  }
}

/**
 * Retry wrapper for fetchWithTimeout
 *
 * @param url - The URL to fetch
 * @param options - Fetch options
 * @param retries - Number of retry attempts (default: 3)
 * @param retryDelay - Delay between retries in ms (default: 1000)
 */
export async function fetchWithRetry<T = any>(
  url: string,
  options: FetchOptions = {},
  retries: number = 3,
  retryDelay: number = 1000
): Promise<T> {
  let lastError: Error

  for (let i = 0; i <= retries; i++) {
    try {
      return await fetchWithTimeout<T>(url, options)
    } catch (error) {
      lastError = error as Error

      // Don't retry on 4xx errors (client errors)
      if (error instanceof APIError && error.status >= 400 && error.status < 500) {
        throw error
      }

      if (i < retries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * (i + 1)))
      }
    }
  }

  throw lastError!
}

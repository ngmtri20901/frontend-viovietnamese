/**
 * API client utility for making requests to the FastAPI backend
 * Implements automatic fallback to secondary API URL if primary fails
 */

import { APIError } from '../types/flashcard.types'

// Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
export const API_FALLBACK_URL = process.env.NEXT_PUBLIC_API_FALLBACK_URL || null
export const API_PREFIX = "/api/v1"

/**
 * Determines if an error should trigger fallback to secondary URL
 */
function shouldUseFallback(error: unknown, response?: Response): boolean {
  // Network errors, timeouts, or connection failures
  if (error instanceof TypeError || error instanceof DOMException) {
    return true
  }
  
  // 5xx server errors
  if (response && response.status >= 500 && response.status < 600) {
    return true
  }
  
  // Abort errors (timeouts)
  if (error instanceof Error && error.name === 'AbortError') {
    return true
  }
  
  return false
}

/**
 * Makes a fetch request to a specific base URL
 */
async function fetchWithBaseUrl<T>(
  baseUrl: string,
  endpoint: string,
  options?: RequestInit,
  isFallback = false
): Promise<{ data: T; usedFallback: boolean }> {
  const url = `${baseUrl}${API_PREFIX}${endpoint}`
  const urlType = isFallback ? 'fallback' : 'primary'
  
  console.log(`🌐 [API Client] Attempting ${urlType} URL: ${url}`)
  
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    cache: 'no-store', // Prevent browser and Next.js caching for fresh data
    ...options,
  })

  if (!response.ok) {
    // For 5xx errors, throw to trigger fallback
    if (response.status >= 500 && response.status < 600) {
      throw new APIError(response.status, `API request failed: ${response.statusText}`)
    }
    // For 4xx errors, don't fallback (client errors)
    throw new APIError(response.status, `API request failed: ${response.statusText}`)
  }

  const data = await response.json()
  console.log(`✅ [API Client] Successfully fetched from ${urlType} URL`)
  
  return { data, usedFallback: isFallback }
}

/**
 * Helper function to handle API responses with automatic fallback
 * Tries primary URL first, falls back to secondary URL if primary fails
 */
export async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  let lastError: unknown = null
  
  // Try primary URL first
  try {
    const result = await fetchWithBaseUrl<T>(API_BASE_URL, endpoint, options, false)
    return result.data
  } catch (error) {
    lastError = error
    
    // Check if we should use fallback
    if (!shouldUseFallback(error, error instanceof APIError ? undefined : undefined)) {
      // Don't fallback for 4xx errors (client errors)
      if (error instanceof APIError && error.status >= 400 && error.status < 500) {
        throw error
      }
    }
    
    // If fallback URL is configured, try it
    if (API_FALLBACK_URL) {
      console.warn(`⚠️ [API Client] Primary URL failed, attempting fallback URL...`)
      
      try {
        const result = await fetchWithBaseUrl<T>(API_FALLBACK_URL, endpoint, options, true)
        console.log(`✅ [API Client] Fallback URL succeeded`)
        return result.data
      } catch (fallbackError) {
        console.error(`❌ [API Client] Both primary and fallback URLs failed`)
        // Throw the original error if fallback also fails
        throw lastError instanceof APIError ? lastError : new APIError(
          0,
          `Both API URLs failed. Primary: ${error instanceof Error ? error.message : "Unknown error"}, Fallback: ${fallbackError instanceof Error ? fallbackError.message : "Unknown error"}`
        )
      }
    } else {
      // No fallback configured, throw original error
      if (error instanceof APIError) {
        throw error
      }
      throw new APIError(0, `Network error: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }
}

/**
 * Direct fetch helper with fallback support (for cases where you need more control)
 * Returns the base URL that succeeded
 */
export async function fetchWithFallback(
  endpoint: string,
  options?: RequestInit
): Promise<{ response: Response; usedFallback: boolean }> {
  let lastError: unknown = null
  
  // Try primary URL first
  try {
    const url = `${API_BASE_URL}${API_PREFIX}${endpoint}`
    console.log(`🌐 [API Client] Attempting primary URL: ${url}`)
    
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      cache: 'no-store',
      ...options,
    })
    
    if (!response.ok) {
      if (response.status >= 500 && response.status < 600) {
        throw new APIError(response.status, `API request failed: ${response.statusText}`)
      }
      throw new APIError(response.status, `API request failed: ${response.statusText}`)
    }
    
    console.log(`✅ [API Client] Successfully fetched from primary URL`)
    return { response, usedFallback: false }
  } catch (error) {
    lastError = error
    
    if (!shouldUseFallback(error)) {
      if (error instanceof APIError && error.status >= 400 && error.status < 500) {
        throw error
      }
    }
    
    // Try fallback if configured
    if (API_FALLBACK_URL) {
      console.warn(`⚠️ [API Client] Primary URL failed, attempting fallback URL...`)
      
      try {
        const url = `${API_FALLBACK_URL}${API_PREFIX}${endpoint}`
        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            ...options?.headers,
          },
          cache: 'no-store',
          ...options,
        })
        
        if (!response.ok) {
          throw new APIError(response.status, `Fallback API request failed: ${response.statusText}`)
        }
        
        console.log(`✅ [API Client] Successfully fetched from fallback URL`)
        return { response, usedFallback: true }
      } catch (fallbackError) {
        console.error(`❌ [API Client] Both primary and fallback URLs failed`)
        throw lastError instanceof APIError ? lastError : new APIError(
          0,
          `Both API URLs failed. Primary: ${error instanceof Error ? error.message : "Unknown error"}, Fallback: ${fallbackError instanceof Error ? fallbackError.message : "Unknown error"}`
        )
      }
    } else {
      if (error instanceof APIError) {
        throw error
      }
      throw new APIError(0, `Network error: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }
}


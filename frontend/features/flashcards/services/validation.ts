import { z } from 'zod'

/**
 * Input Validation Schemas for Flashcard Features
 *
 * Using Zod for runtime type validation to prevent:
 * - Malicious input
 * - XSS attacks via image URLs
 * - Data integrity issues
 * - API abuse (e.g., requesting too many cards)
 */

/**
 * Session Configuration Schema
 * Validates user input for custom review sessions
 */
export const SessionConfigSchema = z.object({
  topic: z.string().max(100).optional(),
  complexity: z.enum(['All', 'Simple', 'Complex']),
  includeSavedCards: z.boolean(),
  numberOfCards: z.number().int().min(1).max(100), // Prevent abuse with max limit
  onlyCommonWords: z.boolean(),
})

export type SessionConfig = z.infer<typeof SessionConfigSchema>

/**
 * Custom Flashcard Schema
 * Validates user-created flashcards
 */
export const CustomFlashcardSchema = z.object({
  vietnamese_text: z.string().min(1, 'Vietnamese text is required').max(500, 'Vietnamese text too long'),
  english_text: z.string().min(1, 'English text is required').max(500, 'English text too long'),
  ipa_pronunciation: z.string().max(200).optional(),
  image_url: z
    .string()
    .url('Must be a valid URL')
    .refine(
      (url) => !url || url.startsWith('https://'),
      { message: 'Image URL must use HTTPS for security' }
    )
    .optional()
    .nullable(),
  topic: z.string().max(100).optional().nullable(),
  word_type: z.string().max(50).optional().nullable(),
  source_type: z.string().max(50).optional().nullable(),
})

export type CustomFlashcard = z.infer<typeof CustomFlashcardSchema>

/**
 * Flashcard Update Schema
 * For updating existing custom flashcards
 */
export const CustomFlashcardUpdateSchema = CustomFlashcardSchema.partial().extend({
  id: z.string().uuid('Invalid flashcard ID'),
})

export type CustomFlashcardUpdate = z.infer<typeof CustomFlashcardUpdateSchema>

/**
 * Review Session Result Schema
 * Validates data submitted after completing a review session
 */
export const ReviewSessionResultSchema = z.object({
  session_id: z.string().uuid('Invalid session ID'),
  completed_cards: z.number().int().min(0).max(200),
  correct_answers: z.number().int().min(0).max(200),
  total_time_seconds: z.number().int().min(0).max(86400), // Max 24 hours
  accuracy_rate: z.number().min(0).max(100),
})

export type ReviewSessionResult = z.infer<typeof ReviewSessionResultSchema>

/**
 * Statistics Query Schema
 * Validates parameters for fetching statistics
 */
export const StatisticsQuerySchema = z.object({
  days_back: z.number().int().min(1).max(365), // Max 1 year
  time_range: z.enum(['week', 'month', 'all']).optional(),
})

export type StatisticsQuery = z.infer<typeof StatisticsQuerySchema>

/**
 * Helper function to validate session config
 * Throws detailed error if validation fails
 */
export function validateSessionConfig(config: unknown): SessionConfig {
  try {
    return SessionConfigSchema.parse(config)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      throw new Error(`Invalid session configuration: ${messages}`)
    }
    throw error
  }
}

/**
 * Helper function to validate custom flashcard
 * Throws detailed error if validation fails
 */
export function validateCustomFlashcard(flashcard: unknown): CustomFlashcard {
  try {
    return CustomFlashcardSchema.parse(flashcard)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      throw new Error(`Invalid flashcard data: ${messages}`)
    }
    throw error
  }
}

/**
 * Safe URL validator
 * Ensures URLs are safe for rendering (no javascript:, data:, etc.)
 */
export function validateImageUrl(url: string | null | undefined): string | null {
  if (!url) return null

  try {
    const parsed = new URL(url)

    // Only allow HTTP(S) protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      console.warn(`Blocked unsafe URL protocol: ${parsed.protocol}`)
      return null
    }

    // Ensure HTTPS for security
    if (parsed.protocol !== 'https:') {
      console.warn(`Non-HTTPS URL detected: ${url}`)
    }

    return url
  } catch (error) {
    console.error(`Invalid URL: ${url}`, error)
    return null
  }
}

/**
 * Sanitize user input text
 * Removes potentially dangerous characters
 */
export function sanitizeText(text: string): string {
  return text
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove <script> tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove inline event handlers
}

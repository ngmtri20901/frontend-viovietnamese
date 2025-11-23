/**
 * Server-side data loader for Saved Flashcards page
 * Fetches all initial data needed for the page on the server
 */

import { createClient } from '@/shared/lib/supabase/server'
import { checkSyncStatus } from '@/features/flashcards/services/flashcardSyncService'
import { isValidVocabKey } from '@/features/flashcards/utils/vocab-key'

interface SavedFlashcard {
  id: string
  UserID: string
  flashcard_id: string
  flashcard_type: 'APP' | 'CUSTOM'
  topic?: string | null
  saved_at: string
  is_favorite: boolean
  review_count: number
  last_reviewed?: string | null
  tags: string[]
  notes?: string | null
}

interface AppFlashcardDetail {
  id: string
  vietnamese?: string
  english?: string[]
  image_url?: string
  type?: string
  word_type?: string
  audio_url?: string
  pronunciation?: string
}

interface CustomFlashcardDetail {
  id: string
  vocab_key?: string | null
  vietnamese_text: string
  english_text: string
  image_url?: string | null
  topic?: string | null
  ipa_pronunciation?: string | null
  audio_url?: string | null
  source_type?: string | null
}

export interface SavedFlashcardDetails {
  id: string
  flashcard_id: string
  flashcard_type: 'APP' | 'CUSTOM'
  topic?: string | null
  saved_at: string
  is_favorite: boolean
  review_count: number
  last_reviewed?: string | null
  tags: string[]
  notes?: string | null
  // App flashcard data
  vietnamese?: string
  english?: string[]
  image_url?: string
  word_type?: string
  audio_url?: string | null
  pronunciation?: string
  // Custom flashcard data
  vietnamese_text?: string
  english_text?: string
  ipa_pronunciation?: string | null
  source_type?: string | null
}

interface FlashcardTopic {
  id: string
  name: string
  description?: string | null
  icon?: string | null
  sort_order?: number | null
}

interface UserStats {
  appFlashcards: number
  customFlashcards: number
  subscription_type: 'FREE' | 'PLUS' | 'UNLIMITED'
}

interface SyncStatus {
  needsSync: boolean
  unsyncedCount: number
}

export interface SavedFlashcardsData {
  savedFlashcards: SavedFlashcardDetails[]
  userStats: UserStats
  topics: FlashcardTopic[]
  syncStatus: SyncStatus | null
  userId: string
}

/**
 * Fetch APP flashcard details from FastAPI
 */
async function getAppFlashcardDetails(flashcardIds: string[]): Promise<AppFlashcardDetail[]> {
  if (flashcardIds.length === 0) return []

  try {
    console.log('🌐 [Server] Fetching APP flashcard details from FastAPI for', flashcardIds.length, 'flashcards')

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    const response = await fetch(`${API_BASE_URL}/api/v1/flashcards/by-ids`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(flashcardIds), // Send array directly, not { ids: ... }
      // Add timeout for server
      signal: AbortSignal.timeout(8000),
    })

    if (!response.ok) {
      throw new Error(`FastAPI request failed: ${response.statusText}`)
    }

    const data = await response.json()
    console.log('✅ [Server] Successfully fetched APP flashcard details:', Array.isArray(data) ? data.length : 'not array')

    // Ensure we return an array
    if (!Array.isArray(data)) {
      console.warn('⚠️ [Server] API response is not an array, wrapping:', data)
      return [data].filter(Boolean)
    }

    return data
  } catch (error) {
    console.error('❌ [Server] Error fetching APP flashcard details:', error)
    return [] // Return empty array to continue with placeholder data
  }
}

/**
 * Fetch custom flashcard details from Supabase by UUID
 */
async function getCustomFlashcardDetails(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  flashcardIds: string[]
): Promise<CustomFlashcardDetail[]> {
  if (flashcardIds.length === 0) return []

  try {
    // Build query step by step to avoid TypeScript issues
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabaseAny = supabase as any
    const { data, error } = await supabaseAny
      .from('custom_flashcards')
      .select('id, vocab_key, vietnamese_text, english_text, image_url, topic, ipa_pronunciation, audio_url, source_type')
      .eq('user_id', userId)
      .eq('status', 'ACTIVE')
      .in('id', flashcardIds)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('❌ [Server] Error fetching custom flashcard details by ID:', error)
    return []
  }
}

/**
 * Fetch custom flashcard details from Supabase by vocab_key
 */
async function getCustomFlashcardDetailsByVocabKey(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  vocabKeys: string[]
): Promise<CustomFlashcardDetail[]> {
  if (vocabKeys.length === 0) return []

  try {
    // Build query step by step to avoid TypeScript issues
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabaseAny = supabase as any
    const { data, error } = await supabaseAny
      .from('custom_flashcards')
      .select('id, vocab_key, vietnamese_text, english_text, image_url, topic, ipa_pronunciation, audio_url, source_type')
      .eq('user_id', userId)
      .eq('status', 'ACTIVE')
      .in('vocab_key', vocabKeys)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('❌ [Server] Error fetching custom flashcard details by vocab_key:', error)
    return []
  }
}

/**
 * Fetch user statistics
 */
async function getUserStats(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<UserStats> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabaseAny = supabase as any
    
    // Fetch flashcard counts
    const { data, error } = await supabaseAny
      .from('saved_flashcards')
      .select('flashcard_type')
      .eq('UserID', userId)

    if (error) throw error

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appFlashcards = (data || []).filter((card: any) => card.flashcard_type === 'APP').length
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customFlashcards = (data || []).filter((card: any) => card.flashcard_type === 'CUSTOM').length

    // Fetch subscription type from user_profiles
    const { data: profileData, error: profileError } = await supabaseAny
      .from('user_profiles')
      .select('subscription_type')
      .eq('id', userId)
      .single()

    if (profileError) {
      console.warn('⚠️ [Server] Could not fetch subscription type:', profileError)
    }

    const subscription_type = profileData?.subscription_type || 'FREE'

    return {
      appFlashcards,
      customFlashcards,
      subscription_type: subscription_type as 'FREE' | 'PLUS' | 'UNLIMITED',
    }
  } catch (error) {
    console.error('❌ [Server] Error fetching user stats:', error)
    return {
      appFlashcards: 0,
      customFlashcards: 0,
      subscription_type: 'FREE',
    }
  }
}

/**
 * Fetch topics from custom flashcards
 */
async function getTopics(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<FlashcardTopic[]> {
  try {
    console.log('🔍 [Server] Fetching topics for user:', userId)

    // Get unique topics from custom_flashcards for this user
    // Note: custom_flashcards uses 'user_id' (lowercase), not 'UserID'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabaseAny = supabase as any
    const { data, error } = await supabaseAny
      .from('custom_flashcards')
      .select('topic')
      .eq('user_id', userId)
      .eq('status', 'ACTIVE')
      .not('topic', 'is', null)

    if (error) {
      console.error('❌ [Server] Supabase error fetching topics:', error)
      throw error
    }

    console.log('📊 [Server] Topics data from Supabase:', data)

    if (!data || data.length === 0) {
      console.log('ℹ️ [Server] No topics found for user')
      return []
    }

    // Extract unique topics and format them
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const uniqueTopics = [...new Set(data.map((item: any) => item.topic).filter(Boolean))] as string[]
    console.log('✅ [Server] Unique topics extracted:', uniqueTopics)

    return uniqueTopics.map((topic: string, index: number) => ({
      id: topic,
      name: topic,
      description: null,
      icon: null,
      sort_order: index,
    }))
  } catch (error) {
    console.error('❌ [Server] Error fetching topics:', error)
    return []
  }
}

/**
 * Fetch saved flashcards with all details
 */
async function getSavedFlashcardsWithDetails(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<SavedFlashcardDetails[]> {
  try {
    // Step 1: Get all saved flashcards from Supabase
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabaseAny = supabase as any
    const { data: savedCards, error } = await supabaseAny
      .from('saved_flashcards')
      .select('*')
      .eq('UserID', userId)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .order('saved_at', { ascending: false } as any)
      .limit(100) // Initial load limit

    if (error) throw error
    if (!savedCards || savedCards.length === 0) return []

    console.log('📊 [Server] Fetched saved flashcards:', savedCards.length)

    // Step 2: Separate APP and CUSTOM flashcard IDs
    const appFlashcardIds = savedCards
      .filter((card: SavedFlashcard) => card.flashcard_type === 'APP')
      .map((card: SavedFlashcard) => card.flashcard_id)

    // Handle CUSTOM flashcards: support both vocab_key format and old custom_{uuid} format
    const customFlashcardIds: string[] = []
    const customVocabKeys: string[] = []
    
    savedCards
      .filter((card: SavedFlashcard) => card.flashcard_type === 'CUSTOM')
      .forEach((card: SavedFlashcard) => {
        const flashcardId = card.flashcard_id
        
        // Check if it's a vocab_key format (t{id}-l{id}-{slug})
        if (isValidVocabKey(flashcardId)) {
          customVocabKeys.push(flashcardId)
        } else {
          // Old format: custom_{uuid} - extract UUID
          const uuid = flashcardId.replace('custom_', '')
          if (uuid) {
            customFlashcardIds.push(uuid)
          }
        }
      })

    console.log('🔍 [Server] APP flashcard IDs:', appFlashcardIds.length)
    console.log('🔍 [Server] CUSTOM flashcard IDs (UUID):', customFlashcardIds.length)
    console.log('🔍 [Server] CUSTOM flashcard IDs (vocab_key):', customVocabKeys.length)

    // Step 3: Fetch details in parallel
    // For vocab_key format, query by vocab_key; for UUID format, query by id
    const [appFlashcardDetails, customFlashcardDetailsById, customFlashcardDetailsByVocabKey] = await Promise.all([
      getAppFlashcardDetails(appFlashcardIds),
      customFlashcardIds.length > 0 ? getCustomFlashcardDetails(supabase, userId, customFlashcardIds) : Promise.resolve([]),
      customVocabKeys.length > 0 ? getCustomFlashcardDetailsByVocabKey(supabase, userId, customVocabKeys) : Promise.resolve([]),
    ])
    
    // Combine both custom flashcard details
    const customFlashcardDetails = [...customFlashcardDetailsById, ...customFlashcardDetailsByVocabKey]

    // Step 4: Merge saved flashcards with their details
    const savedFlashcardsWithDetails: SavedFlashcardDetails[] = savedCards.map((savedCard: SavedFlashcard) => {
      if (savedCard.flashcard_type === 'APP') {
        const detail = appFlashcardDetails.find(d => d.id === savedCard.flashcard_id)

        return {
          ...savedCard,
          vietnamese: detail?.vietnamese || `App Card ${savedCard.flashcard_id?.slice(-4) || 'N/A'}`,
          english: Array.isArray(detail?.english)
            ? detail.english
            : (detail?.english ? [detail.english] : ['No translation available']),
          image_url: detail?.image_url || '/placeholder.svg',
          word_type: detail?.type || detail?.word_type || 'word',
          audio_url: detail?.audio_url || undefined,
          pronunciation: detail?.pronunciation || undefined,
        }
      } else {
        // CUSTOM flashcard - handle both vocab_key and UUID formats
        const flashcardId = savedCard.flashcard_id
        let customDetail: CustomFlashcardDetail | undefined
        
        if (isValidVocabKey(flashcardId)) {
          // Lookup by vocab_key
          customDetail = customFlashcardDetails.find(d => d.vocab_key === flashcardId)
        } else {
          // Old format: lookup by UUID (remove 'custom_' prefix)
          const cleanCustomId = flashcardId.replace('custom_', '')
          customDetail = customFlashcardDetails.find(d => d.id === cleanCustomId)
        }

        // Handle image URLs for custom flashcards
        let imageUrl = '/placeholder.svg'
        if (customDetail?.image_url) {
          if (customDetail.image_url.startsWith('http')) {
            imageUrl = customDetail.image_url
          } else {
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
            const bucketName = 'images'
            const cleanPath = customDetail.image_url.startsWith('/')
              ? customDetail.image_url.slice(1)
              : customDetail.image_url

            imageUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${cleanPath}`
          }
        }

        // Generate fallback ID for display
        const fallbackId = customDetail?.id || flashcardId.slice(-4)

        return {
          ...savedCard,
          vietnamese_text: customDetail?.vietnamese_text || `Custom Card ${fallbackId}`,
          english_text: customDetail?.english_text || 'No translation available',
          image_url: imageUrl,
          topic: customDetail?.topic || savedCard.topic,
          ipa_pronunciation: customDetail?.ipa_pronunciation || null,
          source_type: customDetail?.source_type || 'user',
          audio_url: customDetail?.audio_url || null,
        }
      }
    })

    console.log('✅ [Server] Processed saved flashcards with details:', savedFlashcardsWithDetails.length)
    return savedFlashcardsWithDetails
  } catch (error) {
    console.error('❌ [Server] Error fetching saved flashcards:', error)
    throw error
  }
}

/**
 * Main loader function - fetches all data needed for Saved Flashcards page
 */
export async function loadSavedFlashcardsData(): Promise<SavedFlashcardsData | null> {
  try {
    console.log('🚀 [Server] Starting loadSavedFlashcardsData...')

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('❌ [Server] User not authenticated:', authError)
      return null
    }

    console.log('👤 [Server] User authenticated:', user.id)

    // Fetch all data in parallel
    const [savedFlashcards, userStats, topics, syncStatus] = await Promise.all([
      getSavedFlashcardsWithDetails(supabase, user.id),
      getUserStats(supabase, user.id),
      getTopics(supabase, user.id),
      checkSyncStatus(user.id).catch(err => {
        console.error('❌ [Server] Error checking sync status:', err)
        return null
      }),
    ])

    console.log('✅ [Server] All data fetched successfully')
    console.log('📊 [Server] Stats:', {
      flashcards: savedFlashcards.length,
      appCards: userStats.appFlashcards,
      customCards: userStats.customFlashcards,
      topics: topics.length,
      syncNeeded: syncStatus?.needsSync,
    })

    return {
      savedFlashcards,
      userStats,
      topics,
      syncStatus,
      userId: user.id,
    }
  } catch (error) {
    console.error('❌ [Server] Error in loadSavedFlashcardsData:', error)
    throw error
  }
}

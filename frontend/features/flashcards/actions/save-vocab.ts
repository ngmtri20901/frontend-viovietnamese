'use server'

import { createClient, isSupabaseConfigured } from '@/shared/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { generateVocabKey } from '../utils/vocab-key'

export interface SaveVocabularyInput {
  topicId: number
  lessonId: number
  vietnameseText: string
  englishText: string
  ipa?: string | null
  audioPath?: string | null
  pos?: string | null
}

export interface SaveVocabularyResult {
  success: boolean
  vocab_key?: string
  error?: string
}

/**
 * Server action to save vocabulary from a lesson
 * Creates or updates custom_flashcard and saved_flashcard entries
 */
export async function saveVocabularyFromLesson(
  input: SaveVocabularyInput
): Promise<SaveVocabularyResult> {
  try {
    // Early return if Supabase is not configured
    if (!isSupabaseConfigured) {
      return {
        success: false,
        error: 'Supabase is not configured'
      }
    }

    // Get server-side Supabase client
    const supabase = await createClient()

    // Verify user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return {
        success: false,
        error: 'Not authenticated - please log in first'
      }
    }

    // Generate deterministic vocab_key
    const vocabKey = generateVocabKey(
      input.topicId,
      input.lessonId,
      input.vietnameseText
    )

    // Cast to any to work around TypeScript union type issue with dummy client
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabaseAny = supabase as any

    // Step 1: Upsert into custom_flashcards
    // Check if vocab_key + user_id already exists
    const { data: existingCard } = await supabaseAny
      .from('custom_flashcards')
      .select('id')
      .eq('vocab_key', vocabKey)
      .eq('user_id', user.id)
      .maybeSingle()

    let customFlashcardId: string

    if (existingCard) {
      // Already exists, use existing ID
      customFlashcardId = existingCard.id
      console.log('✅ Vocabulary already exists in custom_flashcards:', vocabKey)
    } else {
      // Insert new custom flashcard
      const insertData = {
        user_id: user.id,
        vocab_key: vocabKey,
        vietnamese_text: input.vietnameseText.trim(),
        english_text: input.englishText.trim(),
        ipa_pronunciation: input.ipa?.trim() || null,
        audio_url: input.audioPath || null,
        topic_id: input.topicId,
        lesson_id: input.lessonId,
        topic: null, // Keep topic field null for lesson vocabulary (use topic_id instead)
        notes: null,
        status: 'ACTIVE' as const,
        source_type: 'lesson' as const
      }

      const { data: flashcardData, error: insertError } = await supabaseAny
        .from('custom_flashcards')
        .insert(insertData)
        .select('id')
        .single()

      if (insertError) {
        console.error('❌ Database insert error:', insertError)
        return {
          success: false,
          error: insertError.message || 'Failed to create flashcard'
        }
      }

      if (!flashcardData) {
        return {
          success: false,
          error: 'Failed to create flashcard - no data returned'
        }
      }

      customFlashcardId = flashcardData.id
      console.log('✅ Created new custom flashcard:', vocabKey)
    }

    // Step 2: Insert into saved_flashcards (idempotent - check if exists first)
    const { data: existingSaved } = await supabaseAny
      .from('saved_flashcards')
      .select('id')
      .eq('flashcard_id', vocabKey)
      .eq('UserID', user.id)
      .maybeSingle()

    if (!existingSaved) {
      const savedFlashcardData = {
        UserID: user.id,
        flashcard_id: vocabKey, // Use vocab_key instead of custom_{uuid}
        flashcard_type: 'CUSTOM' as const,
        topic_id: input.topicId,
        lesson_id: input.lessonId,
        topic: null, // Keep topic field null (use topic_id instead)
        is_favorite: false,
        review_count: 0,
        tags: [input.topicId.toString(), input.lessonId.toString()] // Store as strings for backward compat
      }

      const { error: savedInsertError } = await supabaseAny
        .from('saved_flashcards')
        .insert(savedFlashcardData)

      if (savedInsertError) {
        console.error('⚠️ Failed to sync flashcard to saved_flashcards:', savedInsertError)
        // Don't fail the whole operation - the flashcard was created successfully
      } else {
        console.log('✅ Flashcard synced to saved_flashcards')
      }
    } else {
      console.log('✅ Flashcard already in saved_flashcards')
    }

    // Revalidate relevant paths
    revalidatePath('/flashcards/saved')
    revalidatePath(`/learn/[topicSlug]/[lessonSlug]`, 'layout')

    return {
      success: true,
      vocab_key: vocabKey
    }
  } catch (error) {
    console.error('❌ Error saving vocabulary:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save vocabulary'
    }
  }
}


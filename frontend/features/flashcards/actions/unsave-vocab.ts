'use server'

import { createClient, isSupabaseConfigured } from '@/shared/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface UnsaveVocabularyResult {
  success: boolean
  error?: string
}

/**
 * Server action to unsave vocabulary from a lesson
 * Removes from saved_flashcards (keeps custom_flashcard for history)
 */
export async function unsaveVocabularyFromLesson(
  vocabKey: string
): Promise<UnsaveVocabularyResult> {
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

    // Cast to any to work around TypeScript union type issue with dummy client
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabaseAny = supabase as any

    // Delete from saved_flashcards
    const { error: deleteError } = await supabaseAny
      .from('saved_flashcards')
      .delete()
      .eq('flashcard_id', vocabKey)
      .eq('UserID', user.id)

    if (deleteError) {
      console.error('❌ Error deleting from saved_flashcards:', deleteError)
      return {
        success: false,
        error: deleteError.message || 'Failed to unsave vocabulary'
      }
    }

    // Note: We keep the custom_flashcard entry for history/analytics
    // If you want to delete it too, uncomment below:
    // const { error: deleteCustomError } = await supabaseAny
    //   .from('custom_flashcards')
    //   .delete()
    //   .eq('vocab_key', vocabKey)
    //   .eq('user_id', user.id)

    // Revalidate relevant paths
    revalidatePath('/flashcards/saved')
    revalidatePath(`/learn/[topicSlug]/[lessonSlug]`, 'layout')

    console.log('✅ Vocabulary unsaved:', vocabKey)
    return {
      success: true
    }
  } catch (error) {
    console.error('❌ Error unsaving vocabulary:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to unsave vocabulary'
    }
  }
}


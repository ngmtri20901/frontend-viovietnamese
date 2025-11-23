'use server'

import { createClient, isSupabaseConfigured } from '@/shared/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface UpdateCustomFlashcardInput {
  id: string
  vietnamese_text?: string
  english_text?: string
  ipa_pronunciation?: string | null
  image_url?: string | null
  topic?: string | null
  notes?: string | null
}

export interface UpdateCustomFlashcardResult {
  success: boolean
  error?: string
}

/**
 * Server action to update a custom flashcard
 */
export async function updateCustomFlashcard(
  input: UpdateCustomFlashcardInput
): Promise<UpdateCustomFlashcardResult> {
  try {
    if (!isSupabaseConfigured) {
      return {
        success: false,
        error: 'Supabase is not configured'
      }
    }

    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return {
        success: false,
        error: 'Not authenticated - please log in first'
      }
    }

    // Build update data object (only include fields that are provided)
    const updateData: any = {}
    if (input.vietnamese_text !== undefined) {
      updateData.vietnamese_text = input.vietnamese_text.trim()
    }
    if (input.english_text !== undefined) {
      updateData.english_text = input.english_text.trim()
    }
    if (input.ipa_pronunciation !== undefined) {
      updateData.ipa_pronunciation = input.ipa_pronunciation?.trim() || null
    }
    if (input.image_url !== undefined) {
      updateData.image_url = input.image_url || null
    }
    if (input.topic !== undefined) {
      updateData.topic = input.topic?.trim() || null
    }
    if (input.notes !== undefined) {
      updateData.notes = input.notes || null
    }
    updateData.updated_at = new Date().toISOString()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabaseAny = supabase as any
    const { error: updateError } = await supabaseAny
      .from('custom_flashcards')
      .update(updateData)
      .eq('id', input.id)
      .eq('user_id', user.id) // Ensure user owns this flashcard

    if (updateError) {
      console.error('❌ Database update error:', updateError)
      return {
        success: false,
        error: updateError.message || 'Failed to update flashcard'
      }
    }

    // Revalidate relevant paths
    revalidatePath('/flashcards/saved')
    revalidatePath('/flashcards/create')

    return {
      success: true
    }
  } catch (error) {
    console.error('❌ Error updating flashcard:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update flashcard'
    }
  }
}

export interface DeleteCustomFlashcardResult {
  success: boolean
  error?: string
}

/**
 * Server action to delete a custom flashcard
 * Also removes it from saved_flashcards if it exists there
 */
export async function deleteCustomFlashcard(
  flashcardId: string
): Promise<DeleteCustomFlashcardResult> {
  try {
    if (!isSupabaseConfigured) {
      return {
        success: false,
        error: 'Supabase is not configured'
      }
    }

    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return {
        success: false,
        error: 'Not authenticated - please log in first'
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabaseAny = supabase as any

    // First, get the flashcard to check if it has a vocab_key
    const { data: flashcard } = await supabaseAny
      .from('custom_flashcards')
      .select('id, vocab_key')
      .eq('id', flashcardId)
      .eq('user_id', user.id)
      .maybeSingle()

    if (!flashcard) {
      return {
        success: false,
        error: 'Flashcard not found or you do not have permission to delete it'
      }
    }

    // Delete from saved_flashcards first (if exists)
    // Handle both vocab_key format and custom_{uuid} format
    if (flashcard.vocab_key) {
      // Delete by vocab_key
      await supabaseAny
        .from('saved_flashcards')
        .delete()
        .eq('flashcard_id', flashcard.vocab_key)
        .eq('UserID', user.id)
    }
    
    // Also try deleting by custom_{uuid} format for backward compatibility
    await supabaseAny
      .from('saved_flashcards')
      .delete()
      .eq('flashcard_id', `custom_${flashcardId}`)
      .eq('UserID', user.id)

    // Delete from custom_flashcards
    const { error: deleteError } = await supabaseAny
      .from('custom_flashcards')
      .delete()
      .eq('id', flashcardId)
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('❌ Database delete error:', deleteError)
      return {
        success: false,
        error: deleteError.message || 'Failed to delete flashcard'
      }
    }

    // Revalidate relevant paths
    revalidatePath('/flashcards/saved')
    revalidatePath('/flashcards/create')

    return {
      success: true
    }
  } catch (error) {
    console.error('❌ Error deleting flashcard:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete flashcard'
    }
  }
}

/**
 * Server action to upload image for custom flashcard
 * Reuses the existing upload logic from create.ts
 */
export async function uploadCustomFlashcardImage(
  file: File,
  userId: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    if (!isSupabaseConfigured) {
      return {
        success: false,
        error: 'Supabase is not configured'
      }
    }

    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user || user.id !== userId) {
      return {
        success: false,
        error: 'Not authenticated or user mismatch'
      }
    }

    // Convert File to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `flashcard_${userId}_${Date.now()}.${fileExt}`
    const filePath = `flashcards/${fileName}`

    // Upload file to Supabase Storage
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const storageBucket: any = supabase.storage.from('images')
    const { error: uploadError } = await storageBucket.upload(filePath, buffer, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type
    })

    if (uploadError) {
      console.error('❌ Image upload error:', uploadError)
      return {
        success: false,
        error: uploadError.message || 'Failed to upload image'
      }
    }

    // Return relative path instead of full URL
    return {
      success: true,
      url: filePath
    }
  } catch (error) {
    console.error('❌ Error uploading image:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload image'
    }
  }
}


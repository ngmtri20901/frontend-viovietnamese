'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/shared/lib/supabase/client'
import { useUserProfile } from '@/shared/hooks/use-user-profile'
import { toast } from 'sonner'
import CreateFlashcardForm from './CreateFlashcardForm'
import CustomFlashcardsManager from './CustomFlashcardsManager'
import { Loader2 } from 'lucide-react'

interface CustomFlashcard {
  id: string
  vietnamese_text: string
  english_text: string
  ipa_pronunciation?: string | null
  image_url?: string | null
  topic?: string | null
  source_type?: string | null
  word_type?: string | null
  created_at: string
}

export default function FlashcardsPageClient() {
  const { user, loading: authLoading } = useUserProfile()
  const userId = user?.id

  const [flashcards, setFlashcards] = useState<CustomFlashcard[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFlashcard, setSelectedFlashcard] = useState<CustomFlashcard | null>(null)

  // Early return for auth loading
  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-12 min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Early return if no user (layout should redirect, but handle edge case)
  if (!userId) {
    return null
  }

  const fetchFlashcards = useCallback(async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const supabaseAny = supabase as any
      const { data, error } = await supabaseAny
        .from('custom_flashcards')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'ACTIVE')
        .order('created_at', { ascending: false })

      if (error) throw error
      setFlashcards(data || [])
    } catch (error) {
      console.error('Error fetching flashcards:', error)
      toast.error('Failed to load flashcards')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchFlashcards()
  }, [fetchFlashcards])

  const handleSelectFlashcard = (flashcard: CustomFlashcard) => {
    setSelectedFlashcard(flashcard)
    // Scroll to top to show form
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleClearSelection = () => {
    setSelectedFlashcard(null)
  }

  const handleSuccess = () => {
    fetchFlashcards()
    setSelectedFlashcard(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-8">
        <CreateFlashcardForm 
          userId={userId} 
          initialData={selectedFlashcard}
          onCancelEdit={handleClearSelection}
          onSuccess={handleSuccess}
        />
        
        <div className="border-t pt-8">
          <CustomFlashcardsManager 
            flashcards={flashcards}
            selectedId={selectedFlashcard?.id || null}
            onSelect={handleSelectFlashcard}
            onRefresh={fetchFlashcards}
          />
        </div>
      </div>
    </div>
  )
}


'use client'

import { Card } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Loader2, Trash2, Check } from 'lucide-react'
import { toast } from 'sonner'
import { deleteCustomFlashcard } from '@/features/flashcards/actions/manage'
import { useState } from 'react'
import { cn } from '@/shared/utils/cn'

interface CustomFlashcard {
  id: string
  vietnamese_text: string
  english_text: string
  ipa_pronunciation?: string | null
  image_url?: string | null
  topic?: string | null
  source_type?: string | null
  created_at: string
}

interface CustomFlashcardsManagerProps {
  flashcards: CustomFlashcard[]
  selectedId: string | null
  onSelect: (flashcard: CustomFlashcard) => void
  onRefresh: () => void
}

export default function CustomFlashcardsManager({ 
  flashcards,
  selectedId,
  onSelect,
  onRefresh
}: CustomFlashcardsManagerProps) {
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (e: React.MouseEvent, flashcardId: string) => {
    e.stopPropagation() // Prevent selecting the card when clicking delete
    
    if (!confirm('Are you sure you want to delete this flashcard? This action cannot be undone.')) {
      return
    }

    try {
      setDeleting(flashcardId)
      const result = await deleteCustomFlashcard(flashcardId)

      if (result.success) {
        toast.success('Flashcard deleted successfully')
        onRefresh()
      } else {
        toast.error(result.error || 'Failed to delete flashcard')
      }
    } catch (error) {
      console.error('Error deleting flashcard:', error)
      toast.error('Failed to delete flashcard')
    } finally {
      setDeleting(null)
    }
  }

  if (flashcards.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No flashcards created yet. Create your first flashcard above!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Your Flashcards</h2>
        <Badge variant="secondary">{flashcards.length} {flashcards.length === 1 ? 'flashcard' : 'flashcards'}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {flashcards.map((flashcard) => {
          const isSelected = selectedId === flashcard.id
          
          return (
            <Card 
              key={flashcard.id} 
              className={cn(
                "relative cursor-pointer transition-all hover:shadow-md",
                isSelected 
                  ? "ring-2 ring-primary border-primary/50 bg-primary/5" 
                  : "hover:border-primary/30"
              )}
              onClick={() => onSelect(flashcard)}
            >
              {isSelected && (
                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1 shadow-sm z-10">
                  <Check className="w-3 h-3" />
                </div>
              )}
              
              <div className="p-4 flex flex-col h-full">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h3 className="font-bold text-lg truncate" title={flashcard.vietnamese_text}>
                    {flashcard.vietnamese_text}
                  </h3>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={(e) => handleDelete(e, flashcard.id)}
                      disabled={deleting === flashcard.id}
                      title="Delete flashcard"
                    >
                      {deleting === flashcard.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {flashcard.ipa_pronunciation && (
                  <p className="text-xs text-muted-foreground font-mono mb-2">
                    /{flashcard.ipa_pronunciation}/
                  </p>
                )}

                <p className="text-sm text-muted-foreground line-clamp-2 mb-auto">
                  {flashcard.english_text}
                </p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {flashcard.topic && (
                    <Badge variant="outline" className="text-[10px] h-5">
                      {flashcard.topic.replace('-', ' ')}
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-[10px] h-5">
                    {flashcard.source_type === 'lesson' ? 'From Lesson' : 'Manual'}
                  </Badge>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

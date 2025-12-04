'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Label } from '@/shared/components/ui/label'
import { ImagePlus, Volume2, RotateCcw, Plus, RefreshCw, X, Sparkles, Save } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { FlashcardPreviewClient } from './FlashcardPreviewClient'
import { createFlashcard, uploadFlashcardImage } from '@/features/flashcards/actions/create'
import { updateCustomFlashcard } from '@/features/flashcards/actions/manage'
import { createClient } from '@/shared/lib/supabase/client'
import { fetchWithFallback } from '@/features/flashcards/utils/apiClient'

interface FlashcardData {
  vietnamese: string
  english: string
  pronunciation: string
  wordType: string
  topic: string
  imageFile: File | null
  imageUrl?: string | null
}

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

interface CreateFlashcardFormProps {
  userId: string
  initialData?: CustomFlashcard | null
  onCancelEdit?: () => void
  onSuccess?: () => void
}

export default function CreateFlashcardForm({ 
  userId, 
  initialData, 
  onCancelEdit,
  onSuccess 
}: CreateFlashcardFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFetchingIPA, setIsFetchingIPA] = useState(false)

  const [flashcardData, setFlashcardData] = useState<FlashcardData>({
    vietnamese: '',
    english: '',
    pronunciation: '',
    wordType: '',
    topic: '',
    imageFile: null,
    imageUrl: null
  })

  const [isFlipped, setIsFlipped] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>('')

  // Populate form when initialData changes (Edit Mode)
  useEffect(() => {
    if (initialData) {
      setFlashcardData({
        vietnamese: initialData.vietnamese_text || '',
        english: initialData.english_text || '',
        pronunciation: initialData.ipa_pronunciation || '',
        wordType: '', // wordType is not currently in DB schema for custom cards but kept in UI
        topic: initialData.topic || '',
        imageFile: null,
        imageUrl: initialData.image_url || null
      })

      if (initialData.image_url) {
        // Construct public URL for preview
        const supabase = createClient()
        const { data } = supabase.storage.from('images').getPublicUrl(initialData.image_url)
        if (data?.publicUrl) {
          setImagePreview(data.publicUrl)
        }
      } else {
        setImagePreview('')
      }
    } else {
      // Reset if no initial data (Create Mode)
      resetForm()
    }
  }, [initialData])

  const wordTypes = ["Noun", "Verb", "Adjective", "Adverb", "Pronoun", "Preposition", "Conjunction", "Interjection"]

  const topics = [
    "Food & Drink",
    "Family",
    "Travel",
    "Work",
    "Education",
    "Health",
    "Sports",
    "Technology",
    "Nature",
    "Culture",
  ]

  const truncateFilename = (filename: string, maxLength: number = 20): string => {
    if (filename.length <= maxLength) return filename
    const extension = filename.split('.').pop() || ''
    const nameWithoutExt = filename.slice(0, filename.lastIndexOf('.'))
    const truncatedName = nameWithoutExt.slice(0, 3) + '...'
    return `${truncatedName}${extension ? '.' + extension : ''}`
  }

  const updateFlashcard = (field: keyof FlashcardData, value: string) => {
    setFlashcardData(prev => ({ ...prev, [field]: value }))
  }

  const MAX_IMAGE_SIZE = 3 * 1024 * 1024 // 3MB in bytes

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file size (3MB limit)
      if (file.size > MAX_IMAGE_SIZE) {
        toast.error(`Image size exceeds 3MB limit. Please choose a smaller image. (Current: ${(file.size / 1024 / 1024).toFixed(2)}MB)`)
        // Reset file input
        event.target.value = ''
        return
      }

      setFlashcardData(prev => ({ ...prev, imageFile: file }))
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setFlashcardData(prev => ({ ...prev, imageFile: null, imageUrl: null }))
    setImagePreview('')
    // Reset file input
    const fileInput = document.getElementById('image-upload') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  const resetForm = () => {
    setFlashcardData({
      vietnamese: '',
      english: '',
      pronunciation: '',
      wordType: '',
      topic: '',
      imageFile: null,
      imageUrl: null
    })
    setImagePreview('')
    setIsFlipped(false)
  }

  const handleCancel = () => {
    resetForm()
    onCancelEdit?.()
  }

  const handleFetchIPA = async () => {
    if (!flashcardData.vietnamese.trim()) {
      toast.error('Please enter Vietnamese text first')
      return
    }

    setIsFetchingIPA(true)
    console.log('🔊 Fetching IPA pronunciation...')

    try {
      const { response, usedFallback } = await fetchWithFallback('/phoneme/ipa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: flashcardData.vietnamese.trim()
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch IPA: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log('✅ IPA pronunciation received:', data)
      if (usedFallback) {
        console.log('⚠️ IPA fetched from fallback URL')
      }

      const ipa = data.ipa || data.pronunciation || data.text || ''
      
      if (ipa) {
        setFlashcardData(prev => ({ ...prev, pronunciation: ipa }))
        toast.success('IPA pronunciation generated successfully!')
      } else {
        toast.error('No IPA pronunciation returned from API')
      }
    } catch (error) {
      console.error('❌ Error fetching IPA:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch IPA pronunciation'
      toast.error(errorMessage)
    } finally {
      setIsFetchingIPA(false)
    }
  }

  const handleSubmit = async () => {
    if (!flashcardData.vietnamese.trim() || !flashcardData.english.trim()) {
      toast.error('Please enter both Vietnamese text and English translation')
      return
    }

    setIsSubmitting(true)
    
    try {
      // Step 1: Upload new image if provided
      let uploadedImageUrl = flashcardData.imageUrl
      if (flashcardData.imageFile) {
        console.log('🖼️ Uploading image...')
        const uploadResult = await uploadFlashcardImage(flashcardData.imageFile, userId)
        
        if (!uploadResult.success) {
          throw new Error(uploadResult.error || 'Failed to upload image')
        }
        uploadedImageUrl = uploadResult.url || null
      }

      if (initialData) {
        // Update Mode
        console.log('📝 Updating flashcard...')
        const result = await updateCustomFlashcard({
          id: initialData.id,
          vietnamese_text: flashcardData.vietnamese.trim(),
          english_text: flashcardData.english.trim(),
          ipa_pronunciation: flashcardData.pronunciation.trim() || null,
          image_url: uploadedImageUrl,
          topic: flashcardData.topic.trim() || null,
          notes: null
        })

        if (!result.success) {
          throw new Error(result.error || 'Failed to update flashcard')
        }
        toast.success('Flashcard updated successfully')
      } else {
        // Create Mode
        console.log('💾 Creating flashcard...')
        const result = await createFlashcard({
          vietnamese_text: flashcardData.vietnamese.trim(),
          english_text: flashcardData.english.trim(),
          ipa_pronunciation: flashcardData.pronunciation.trim() || null,
          image_url: uploadedImageUrl,
          topic: flashcardData.topic.trim() || null,
          notes: null
        })

        if (!result.success) {
          throw new Error(result.error || 'Failed to create flashcard')
        }
        toast.success('Flashcard created successfully')
      }

      // Reset and refresh
      if (!initialData) {
        resetForm()
      }
      onSuccess?.()
      router.refresh()

    } catch (error) {
      console.error('❌ Error saving flashcard:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to save flashcard'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Form - Left Side */}
      <Card className="h-fit border-2">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <span>{initialData ? 'Edit Flashcard' : 'Create New Flashcard'}</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {initialData ? 'Update the details below' : 'Fill in the information to create your flashcard'}
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Main Content Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {/* Vietnamese Text */}
              <div className="space-y-2">
                <Label htmlFor="vietnamese" className="text-sm font-semibold text-foreground">
                  Vietnamese Text *
                </Label>
                <Textarea
                  id="vietnamese"
                  placeholder="Enter Vietnamese word or phrase..."
                  value={flashcardData.vietnamese}
                  onChange={(e) => updateFlashcard("vietnamese", e.target.value)}
                  className="min-h-[70px] resize-none border-2 focus:border-primary/50 transition-colors"
                />
              </div>

              {/* Translation Text */}
              <div className="space-y-2">
                <Label htmlFor="english" className="text-sm font-semibold text-foreground">
                  Translation *
                </Label>
                <Textarea
                  id="english"
                  placeholder="Enter translation..."
                  value={flashcardData.english}
                  onChange={(e) => updateFlashcard("english", e.target.value)}
                  className="min-h-[70px] resize-none border-2 focus:border-primary/50 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Additional Details Section */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold text-foreground mb-3">Additional Details</h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Word Type */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Word Type</Label>
                <Select value={flashcardData.wordType} onValueChange={(value) => updateFlashcard("wordType", value)}>
                  <SelectTrigger className="border-2 focus:border-primary/50 transition-colors">
                    <SelectValue placeholder="Select type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {wordTypes.map((type) => (
                      <SelectItem key={type} value={type.toLowerCase()}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Topic */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Topic</Label>
                <Select value={flashcardData.topic} onValueChange={(value) => updateFlashcard("topic", value)}>
                  <SelectTrigger className="border-2 focus:border-primary/50 transition-colors">
                    <SelectValue placeholder="Select topic..." />
                  </SelectTrigger>
                  <SelectContent>
                    {topics.map((topic) => (
                      <SelectItem key={topic} value={topic.toLowerCase().replace(/\s+/g, "-")}>
                        {topic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <ImagePlus className="w-4 h-4 text-muted-foreground" />
                  Add Image
                  <span className="text-xs text-muted-foreground font-normal">(Max 3MB)</span>
                </Label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      id="image-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-2 focus:border-primary/50 transition-colors h-10 text-sm bg-transparent pointer-events-none"
                      asChild
                    >
                      <label htmlFor="image-upload" className="cursor-pointer flex items-center justify-center gap-2 pointer-events-auto">
                        <ImagePlus className="w-4 h-4" />
                        {flashcardData.imageFile ? truncateFilename(flashcardData.imageFile.name) : "Choose file"}
                      </label>
                    </Button>
                  </div>
                  {(flashcardData.imageFile || flashcardData.imageUrl) && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={handleRemoveImage}
                      className="h-10 w-10 text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Label
                htmlFor="pronunciation"
                className="text-sm font-medium text-foreground flex items-center gap-2"
              >
                <Volume2 className="w-4 h-4 text-muted-foreground" />
                Pronunciation (IPA)
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="pronunciation"
                  placeholder="e.g., /ˈvjɛt.nɑm/"
                  value={flashcardData.pronunciation}
                  onChange={(e) => updateFlashcard("pronunciation", e.target.value)}
                  className="border-2 focus:border-primary/50 transition-colors font-mono flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleFetchIPA}
                  disabled={isFetchingIPA || !flashcardData.vietnamese.trim()}
                  className="h-10 w-10 flex-shrink-0"
                  title="Generate IPA pronunciation"
                >
                  <Sparkles className={`w-4 h-4 ${isFetchingIPA ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t pt-5">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="flex-1 h-11 font-medium"
              >
                {initialData ? <X className="w-4 h-4 mr-2" /> : <RotateCcw className="w-4 h-4 mr-2" />}
                {initialData ? 'Cancel Edit' : 'Reset'}
              </Button>

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !flashcardData.vietnamese || !flashcardData.english}
                className="flex-1 h-11 font-medium"
              >
                {initialData ? <Save className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                {isSubmitting 
                  ? (initialData ? 'Updating...' : 'Creating...') 
                  : (initialData ? 'Update Flashcard' : 'Create & Add More')
                }
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Preview - Right Side */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Live Preview</h2>
          <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFlipped(!isFlipped)}
              className="flex items-center gap-2 transition-transform duration-300"
            >
            <RefreshCw
              className={`w-4 h-4 transition-transform duration-500 ${
                isFlipped ? "[transform:rotateY(180deg)]" : ""
              }`}
            />  Flip
            </Button>
        </div>

        {/* Flashcard Preview */}
        <div className="relative">
          <FlashcardPreviewClient
            vietnamese={flashcardData.vietnamese}
            english={flashcardData.english}
            pronunciation={flashcardData.pronunciation}
            wordType={flashcardData.wordType}
            topic={flashcardData.topic}
            imagePreview={imagePreview}
            isFlipped={isFlipped}
            onFlip={() => setIsFlipped(!isFlipped)}
          />
        </div>

        {/* Preview Info */}
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <h3 className="font-medium mb-2">Card Information</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div>Vietnamese: {flashcardData.vietnamese || "Not set"}</div>
              <div>Translation: {flashcardData.english || "Not set"}</div>
              <div>Pronunciation: {flashcardData.pronunciation || "Not set"}</div>
              <div>Type: {flashcardData.wordType || "Not set"}</div>
              <div>Topic: {flashcardData.topic ? flashcardData.topic.replace("-", " ") : "Not set"}</div>
              <div>Image: {flashcardData.imageFile ? truncateFilename(flashcardData.imageFile.name) : (flashcardData.imageUrl ? "Set (Existing)" : "Not set")}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

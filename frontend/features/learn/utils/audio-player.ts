/**
 * Audio playback utility for vocabulary pronunciation
 */

/**
 * Plays vocabulary audio from Supabase storage
 * @param audioPath - Storage path to audio file (e.g., "audio/vocabulary/topic_19/lesson_12/bac_si.mp3")
 * @param supabaseClient - Supabase client instance
 * @returns Promise resolving to Audio element
 */
export async function playVocabAudio(
  audioPath: string,
  supabaseClient: any
): Promise<HTMLAudioElement> {
  if (!audioPath) {
    throw new Error('Audio path is required')
  }

  // Get public URL from Supabase storage
  const { data } = supabaseClient.storage
    .from('lesson-materials')
    .getPublicUrl(audioPath)

  const publicUrl = data.publicUrl

  if (!publicUrl) {
    throw new Error('Failed to get public URL for audio file')
  }

  // Create and play audio
  const audio = new Audio(publicUrl)
  
  // Return promise that resolves when audio starts playing
  return new Promise((resolve, reject) => {
    audio.oncanplaythrough = () => {
      audio.play().then(() => {
        resolve(audio)
      }).catch((error) => {
        reject(new Error(`Failed to play audio: ${error.message}`))
      })
    }

    audio.onerror = (error) => {
      reject(new Error(`Audio loading error: ${error}`))
    }

    // Start loading
    audio.load()
  })
}

/**
 * Stops currently playing audio
 * @param audio - Audio element to stop
 */
export function stopAudio(audio: HTMLAudioElement | null): void {
  if (audio) {
    audio.pause()
    audio.currentTime = 0
  }
}


"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, Bookmark, Loader2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/cn";
import { saveVocabularyFromLesson } from "@/features/flashcards/actions/save-vocab";
import { unsaveVocabularyFromLesson } from "@/features/flashcards/actions/unsave-vocab";
import { playVocabAudio, stopAudio } from "@/features/learn/utils/audio-player";
import { createClient } from "@/shared/lib/supabase/client";
import { useRouter } from "next/navigation";

export interface EnrichedVocabItem {
  vi: string;
  en: string;
  ipa?: string;
  audio?: string;
  pos?: string;
  vocabKey: string;
  isSaved: boolean;
}

interface VocabHoverPopupProps {
  vocabulary: EnrichedVocabItem;
  topicId: number;
  lessonId: number;
  children: React.ReactNode;
}

export function VocabHoverPopup({
  vocabulary,
  topicId,
  lessonId,
  children,
}: VocabHoverPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(vocabulary.isSaved);
  const [isSaving, setIsSaving] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        stopAudio(audioRef.current);
      }
    };
  }, []);

  const handlePlayAudio = async () => {
    if (!vocabulary.audio) return;

    try {
      setIsPlaying(true);
      const supabase = createClient();
      const audio = await playVocabAudio(vocabulary.audio, supabase);
      audioRef.current = audio;

      // Reset playing state when audio ends
      audio.onended = () => {
        setIsPlaying(false);
        audioRef.current = null;
      };

      audio.onerror = () => {
        setIsPlaying(false);
        audioRef.current = null;
      };
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsPlaying(false);
    }
  };

  const handleSave = async () => {
    if (isSaving) return;

    try {
      setIsSaving(true);
      const result = await saveVocabularyFromLesson({
        topicId,
        lessonId,
        vietnameseText: vocabulary.vi,
        englishText: vocabulary.en,
        ipa: vocabulary.ipa || null,
        audioPath: vocabulary.audio || null,
        pos: vocabulary.pos || null,
      });

      if (result.success) {
        setIsSaved(true);
        router.refresh();
      } else {
        console.error("Failed to save vocabulary:", result.error);
      }
    } catch (error) {
      console.error("Error saving vocabulary:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUnsave = async () => {
    if (isSaving) return;

    try {
      setIsSaving(true);
      const result = await unsaveVocabularyFromLesson(vocabulary.vocabKey);

      if (result.success) {
        setIsSaved(false);
        router.refresh();
      } else {
        console.error("Failed to unsave vocabulary:", result.error);
      }
    } catch (error) {
      console.error("Error unsaving vocabulary:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <span
          className={cn(
            "cursor-pointer transition-all",
            isOpen && "underline decoration-dashed",
            isSaved && "text-indigo-600"
          )}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          {children}
        </span>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-2"
        side="top"
        align="start"
        sideOffset={8}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="flex items-center gap-2">
          {/* IPA Pronunciation */}
          {vocabulary.ipa && (
            <span className="text-sm font-mono text-slate-700">
              /{vocabulary.ipa}/
            </span>
          )}

          {/* Audio Play Button */}
          {vocabulary.audio && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePlayAudio}
              disabled={isPlaying}
              className="h-7 w-7"
              title="Play pronunciation"
            >
              {isPlaying ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Volume2 className="h-3.5 w-3.5" />
              )}
            </Button>
          )}

          {/* Save/Unsave Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={isSaved ? handleUnsave : handleSave}
            disabled={isSaving}
            className={cn(
              "h-7 w-7",
              isSaved && "text-primary"
            )}
            title={isSaved ? "Unsave vocabulary" : "Save vocabulary"}
          >
            {isSaving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Bookmark className={cn(
                "h-3.5 w-3.5",
                isSaved && "fill-current"
              )} />
            )}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}


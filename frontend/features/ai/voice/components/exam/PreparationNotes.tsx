"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { cn } from "@/shared/utils/cn";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";

export interface PreparationNotesProps {
  /**
   * Current notes value
   */
  value: string;
  /**
   * Callback when notes change
   */
  onChange: (value: string) => void;
  /**
   * Maximum character limit
   * @default 1000
   */
  maxLength?: number;
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Whether the notes are read-only
   * @default false
   */
  readOnly?: boolean;
  /**
   * Additional class names
   */
  className?: string;
  /**
   * Label text
   * @default "Your Notes"
   */
  label?: string;
  /**
   * Whether to show formatting buttons
   * @default true
   */
  showFormatting?: boolean;
  /**
   * Whether to autofocus the textarea
   * @default false
   */
  autoFocus?: boolean;
}

/**
 * Simple notes editor for exam preparation
 *
 * Uses a basic textarea with character counting.
 * Notes are stored client-side only and passed via query params.
 *
 * @example
 * ```tsx
 * const [notes, setNotes] = useState("");
 *
 * <PreparationNotes
 *   value={notes}
 *   onChange={setNotes}
 *   maxLength={1000}
 *   label="Preparation Notes"
 *   placeholder="Write your key points here..."
 * />
 * ```
 */
export function PreparationNotes({
  value,
  onChange,
  maxLength = 1000,
  placeholder = "Write your key points, ideas, or outline here...",
  readOnly = false,
  className,
  label = "Your Notes",
  showFormatting = true,
  autoFocus = false,
}: PreparationNotesProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [charCount, setCharCount] = useState(value.length);

  // Update char count when value changes
  useEffect(() => {
    setCharCount(value.length);
  }, [value]);

  // Handle text change
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      if (newValue.length <= maxLength) {
        onChange(newValue);
      }
    },
    [onChange, maxLength]
  );

  // Insert text at cursor position
  const insertText = useCallback(
    (prefix: string, suffix: string = "") => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = value.substring(start, end);
      const newText =
        value.substring(0, start) +
        prefix +
        selectedText +
        suffix +
        value.substring(end);

      if (newText.length <= maxLength) {
        onChange(newText);
        // Set cursor position after insertion
        setTimeout(() => {
          textarea.selectionStart = start + prefix.length;
          textarea.selectionEnd = start + prefix.length + selectedText.length;
          textarea.focus();
        }, 0);
      }
    },
    [value, onChange, maxLength]
  );

  // Formatting helpers
  const addBulletPoint = () => insertText("• ");
  const addNumberedPoint = () => {
    // Find the last number in the text and increment
    const lines = value.split("\n");
    const lastNumberedLine = lines
      .reverse()
      .find((line) => /^\d+\.\s/.test(line));
    const nextNumber = lastNumberedLine
      ? parseInt(lastNumberedLine.match(/^(\d+)/)?.[1] || "0") + 1
      : 1;
    insertText(`${nextNumber}. `);
  };
  const addHeading = () => insertText("## ");
  const addNewLine = () => insertText("\n");

  // Calculate progress for character limit
  const charProgress = (charCount / maxLength) * 100;
  const isNearLimit = charProgress > 80;
  const isAtLimit = charProgress >= 100;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Header with label and char count */}
      <div className="flex items-center justify-between">
        <Label htmlFor="preparation-notes" className="text-sm font-medium">
          {label}
        </Label>
        <span
          className={cn(
            "text-xs tabular-nums",
            isAtLimit
              ? "text-red-500 font-medium"
              : isNearLimit
              ? "text-yellow-600 dark:text-yellow-400"
              : "text-muted-foreground"
          )}
        >
          {charCount}/{maxLength}
        </span>
      </div>

      {/* Formatting toolbar */}
      {showFormatting && !readOnly && (
        <div className="flex flex-wrap gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addBulletPoint}
            className="h-7 px-2 text-xs"
            title="Add bullet point"
          >
            • List
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addNumberedPoint}
            className="h-7 px-2 text-xs"
            title="Add numbered point"
          >
            1. Number
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addHeading}
            className="h-7 px-2 text-xs"
            title="Add heading"
          >
            ## Heading
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addNewLine}
            className="h-7 px-2 text-xs"
            title="Add new line"
          >
            ↵ Line
          </Button>
        </div>
      )}

      {/* Textarea */}
      <Textarea
        ref={textareaRef}
        id="preparation-notes"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        readOnly={readOnly}
        autoFocus={autoFocus}
        className={cn(
          "min-h-[200px] resize-none font-mono text-sm leading-relaxed",
          readOnly && "bg-muted cursor-default"
        )}
        aria-describedby="notes-description"
      />

      {/* Helper text */}
      <p
        id="notes-description"
        className="text-xs text-muted-foreground"
      >
        {readOnly
          ? "These are your preparation notes"
          : "Use this space to organize your thoughts. Notes will be visible during the exam."}
      </p>

      {/* Character limit warning */}
      {isNearLimit && !readOnly && (
        <p className="text-xs text-yellow-600 dark:text-yellow-400">
          {isAtLimit
            ? "Character limit reached"
            : `${maxLength - charCount} characters remaining`}
        </p>
      )}
    </div>
  );
}

/**
 * Structured notes component for Part 3 (Presentation)
 * Provides separate fields for Intro, Main Points, and Conclusion
 */
export interface StructuredNotesProps {
  /**
   * Current notes object
   */
  value: {
    introduction: string;
    mainPoints: string;
    conclusion: string;
  };
  /**
   * Callback when notes change
   */
  onChange: (value: StructuredNotesProps["value"]) => void;
  /**
   * Whether the notes are read-only
   * @default false
   */
  readOnly?: boolean;
  /**
   * Additional class names
   */
  className?: string;
}

export function StructuredNotes({
  value,
  onChange,
  readOnly = false,
  className,
}: StructuredNotesProps) {
  const handleFieldChange = useCallback(
    (field: keyof StructuredNotesProps["value"], newValue: string) => {
      onChange({
        ...value,
        [field]: newValue,
      });
    },
    [value, onChange]
  );

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Introduction */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="notes-intro" className="text-sm font-medium">
          Introduction
          <span className="ml-2 text-xs text-muted-foreground font-normal">
            (Hook, thesis statement)
          </span>
        </Label>
        <Textarea
          id="notes-intro"
          value={value.introduction}
          onChange={(e) => handleFieldChange("introduction", e.target.value)}
          placeholder="Start with a hook or interesting fact..."
          readOnly={readOnly}
          className="min-h-[80px] resize-none text-sm"
          maxLength={300}
        />
      </div>

      {/* Main Points */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="notes-main" className="text-sm font-medium">
          Main Points
          <span className="ml-2 text-xs text-muted-foreground font-normal">
            (2-3 key arguments)
          </span>
        </Label>
        <Textarea
          id="notes-main"
          value={value.mainPoints}
          onChange={(e) => handleFieldChange("mainPoints", e.target.value)}
          placeholder="• Point 1: ...&#10;• Point 2: ...&#10;• Point 3: ..."
          readOnly={readOnly}
          className="min-h-[120px] resize-none text-sm font-mono"
          maxLength={500}
        />
      </div>

      {/* Conclusion */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="notes-conclusion" className="text-sm font-medium">
          Conclusion
          <span className="ml-2 text-xs text-muted-foreground font-normal">
            (Summary, final thought)
          </span>
        </Label>
        <Textarea
          id="notes-conclusion"
          value={value.conclusion}
          onChange={(e) => handleFieldChange("conclusion", e.target.value)}
          placeholder="Summarize your main points and end with a memorable statement..."
          readOnly={readOnly}
          className="min-h-[80px] resize-none text-sm"
          maxLength={200}
        />
      </div>

      {/* Helper text */}
      <p className="text-xs text-muted-foreground">
        {readOnly
          ? "Your structured outline for the presentation"
          : "Organize your presentation with a clear structure. These notes will be visible during your presentation."}
      </p>
    </div>
  );
}

/**
 * Encode notes for URL query params
 */
export function encodeNotesForUrl(notes: string): string {
  return encodeURIComponent(notes);
}

/**
 * Decode notes from URL query params
 */
export function decodeNotesFromUrl(encoded: string): string {
  try {
    return decodeURIComponent(encoded);
  } catch {
    return "";
  }
}

/**
 * Encode structured notes for URL query params
 */
export function encodeStructuredNotesForUrl(
  notes: StructuredNotesProps["value"]
): string {
  return encodeURIComponent(JSON.stringify(notes));
}

/**
 * Decode structured notes from URL query params
 */
export function decodeStructuredNotesFromUrl(
  encoded: string
): StructuredNotesProps["value"] {
  try {
    return JSON.parse(decodeURIComponent(encoded));
  } catch {
    return {
      introduction: "",
      mainPoints: "",
      conclusion: "",
    };
  }
}

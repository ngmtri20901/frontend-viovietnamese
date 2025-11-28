/**
 * Exam Components
 *
 * UI components for the Vietnamese Speaking Test Exam feature.
 * These components handle countdown timers, topic selection, and note-taking.
 */

// Countdown Timer
export {
  CountdownTimer,
  CountdownTimerCompact,
  type CountdownTimerProps,
} from "./CountdownTimer";

// Envelope Selector
export {
  EnvelopeSelector,
  type EnvelopeSelectorProps,
} from "./EnvelopeSelector";

// Preparation Notes
export {
  PreparationNotes,
  StructuredNotes,
  encodeNotesForUrl,
  decodeNotesFromUrl,
  encodeStructuredNotesForUrl,
  decodeStructuredNotesFromUrl,
  type PreparationNotesProps,
  type StructuredNotesProps,
} from "./PreparationNotes";

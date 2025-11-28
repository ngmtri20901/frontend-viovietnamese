import type {
  ConversationMode,
  FreeTalkVariables,
  ScenarioVariables,
  Part1Variables,
  Part2Variables,
  Part3Variables,
} from "../constants/vietnamese-voice";
import type { Part1Topic, Part1Question } from "../constants/exam-questions";

// =====================================================
// VAPI VARIABLES TYPES
// =====================================================

// Union type for all possible variable types
export type VapiVariables =
  | FreeTalkVariables
  | ScenarioVariables
  | Part1Variables
  | Part2Variables
  | Part3Variables;

// Agent component props
export interface AgentProps {
  userName: string;
  userId: string;
  conversationId?: string;
  feedbackId?: string;
  mode: ConversationMode;
  topicTitle?: string;
  prompts?: string[];
  vapiVariables: Record<string, unknown>;
}

// =====================================================
// EXAM TYPES
// =====================================================

/**
 * Data structure for Part 1 exam topic selection
 * Stored in conversation.topic_selected JSONB field
 */
export interface Part1TopicSelection {
  topics: Part1Topic[];
  questions: Part1Question[];
}

/**
 * Data structure for Part 2 exam topic selection
 */
export interface Part2TopicSelection {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
}

/**
 * Data structure for Part 3 exam topic selection
 */
export interface Part3TopicSelection {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
}

/**
 * Preparation notes for Part 2 and Part 3
 */
export interface ExamPreparationNotes {
  content: string;
  timestamp: number;
}

/**
 * Extended Part 1 Variables with questions data
 */
export interface Part1ExamVariables extends Part1Variables {
  selectedTopics: string; // JSON stringified topic IDs
  allQuestions: string; // JSON stringified questions array
}

/**
 * Extended Part 2 Variables with topic details
 */
export interface Part2ExamVariables extends Part2Variables {
  topicId: string;
  topicTitleEn: string;
  topicDescriptionEn: string;
}

/**
 * Extended Part 3 Variables with topic details
 */
export interface Part3ExamVariables extends Part3Variables {
  topicTitleEn: string;
  topicDescriptionEn: string;
}

// =====================================================
// RE-EXPORT EXAM QUESTION TYPES
// =====================================================

export type { Part1Topic, Part1Question };

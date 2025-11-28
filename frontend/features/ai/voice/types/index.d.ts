// =====================================================
// VOICE CHAT TYPES - Vietnamese Learning App
// Updated for Supabase schema
// =====================================================

// Database types matching Supabase schema
interface VoiceTopic {
  id: string;
  title: string;
  description: string | null;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  icon_name: string | null;
  cover_image_url: string | null;
  sample_prompts: string[];
  vocabulary_focus: string[];
  grammar_focus: string[];
  vapi_assistant_config: Record<string, any> | null;
  is_active: boolean;
  display_order: number;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

interface VoiceConversation {
  id: string;
  user_id: string;
  topic_id: string | null;
  topic: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  conversation_type: 'free_talk' | 'scenario_based' | 'vocabulary_practice' | 'pronunciation_drill' | 'part1_social' | 'part2_solution' | 'part3_presentation';
  prompts: string[];
  vapi_call_id: string | null;
  duration_seconds: number;
  message_count: number;
  user_message_count: number;
  status: 'active' | 'completed' | 'abandoned';
  is_completed: boolean;
  has_feedback: boolean;
  topic_selected: Record<string, any> | null; // JSONB for exam topic data
  preparation_time_seconds: number | null; // Preparation time for exams
  feedback_language: 'vietnamese' | 'english' | 'chinese' | 'korean' | 'japanese' | 'french' | 'german' | 'italian' | 'portuguese' | 'russian' | 'spanish' | 'thai' | 'turkish' | null; // Feedback language preference
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

interface VoiceTranscript {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp_ms: number;
  sequence_number: number;
  vapi_message_type: string | null;
  vapi_transcript_type: string | null;
  raw_vapi_data: Record<string, any> | null;
  created_at: string;
}

interface CategoryScore {
  name: string;
  score: number;
  comment: string;
}

interface VocabularySuggestion {
  word: string;
  meaning: string;
  example: string;
}

interface VoiceFeedback {
  id: string;
  conversation_id: string;
  user_id: string;
  total_score: number;
  category_scores: CategoryScore[];
  strengths: string[];
  areas_for_improvement: string[];
  final_assessment: string;
  vocabulary_suggestions: VocabularySuggestion[];
  grammar_notes: string[];
  pronunciation_tips: string[];
  ai_model: string | null;
  ai_processing_time_ms: number | null;
  created_at: string;
  updated_at: string;
}

interface UserVoiceStats {
  id: string;
  user_id: string;
  total_conversation_time: number;
  total_conversation_count: number;
  completed_conversation_count: number;
  average_total_score: number | null;
  average_pronunciation_score: number | null;
  average_grammar_score: number | null;
  average_vocabulary_score: number | null;
  average_communication_score: number | null;
  average_fluency_score: number | null;
  current_level: 'beginner' | 'intermediate' | 'advanced';
  current_streak_days: number;
  longest_streak_days: number;
  last_conversation_date: string | null;
  created_at: string;
  updated_at: string;
}

// =====================================================
// Action Parameters
// =====================================================

interface CreateConversationParams {
  topicId?: string | null;
  topic: string;
  difficultyLevel?: 'beginner' | 'intermediate' | 'advanced';
  conversationType: 'free_talk' | 'scenario_based' | 'vocabulary_practice' | 'pronunciation_drill' | 'part1_social' | 'part2_solution' | 'part3_presentation';
  prompts?: string[];
  topicSelected?: Record<string, any>; // For exam modes - stores topic/question data
  preparationTimeSeconds?: number; // For exam modes - 0, 60, or 120
  feedbackLanguage?: 'vietnamese' | 'english' | 'chinese' | 'korean' | 'japanese' | 'french' | 'german' | 'italian' | 'portuguese' | 'russian' | 'spanish' | 'thai' | 'turkish'; // Feedback language preference (only for free_talk and scenario_based)
}

interface UpdateConversationParams {
  conversationId: string;
  vapiCallId?: string;
  durationSeconds?: number;
  messageCount?: number;
  userMessageCount?: number;
  status?: 'active' | 'completed' | 'abandoned';
  isCompleted?: boolean;
  completedAt?: string;
}

interface CreateTranscriptParams {
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestampMs: number;
  sequenceNumber: number;
  vapiMessageType?: string;
  vapiTranscriptType?: string;
  rawVapiData?: Record<string, any>;
}

interface CreateFeedbackParams {
  conversationId: string;
  transcript: { role: string; content: string }[];
  feedbackId?: string;
  feedbackLanguage?: 'vietnamese' | 'english' | 'chinese' | 'korean' | 'japanese' | 'french' | 'german' | 'italian' | 'portuguese' | 'russian' | 'spanish' | 'thai' | 'turkish';
}

interface GetConversationsByUserParams {
  userId: string;
  limit?: number;
  status?: 'active' | 'completed' | 'abandoned';
}

interface GetFeedbackByConversationParams {
  conversationId: string;
  userId: string;
}

// =====================================================
// Component Props
// =====================================================

interface AgentProps {
  userName: string;
  userId: string;
  conversationId?: string;
  feedbackId?: string;
  type: 'practice' | 'conversation';
  topicTitle?: string;
  prompts?: string[];
}

interface ConversationCardProps {
  conversation: VoiceConversation;
  onClick?: () => void;
}

interface TopicCardProps {
  topic: VoiceTopic;
  onClick?: () => void;
  isSelected?: boolean;
}

interface FeedbackDisplayProps {
  feedback: VoiceFeedback;
  conversation: VoiceConversation;
}

interface TranscriptDisplayProps {
  transcripts: VoiceTranscript[];
  isLoading?: boolean;
}

// =====================================================
// Route Params (Next.js 15)
// =====================================================

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}


// =====================================================
// Utility Types
// =====================================================

type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
type ConversationType = 'free_talk' | 'scenario_based' | 'vocabulary_practice' | 'pronunciation_drill' | 'part1_social' | 'part2_solution' | 'part3_presentation';
type ConversationStatus = 'active' | 'completed' | 'abandoned';
type TranscriptRole = 'user' | 'assistant' | 'system';

// =====================================================
// API Response Types
// =====================================================

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface CreateConversationResponse extends ApiResponse {
  data?: {
    conversationId: string;
    conversation: VoiceConversation | null;
    quota?: VoiceQuota | null;
  };
}

interface CreateFeedbackResponse extends ApiResponse {
  data?: {
    feedbackId: string;
    feedback: VoiceFeedback;
  };
}

// =====================================================
// Vapi Integration Types (existing)
// =====================================================

interface SavedMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// =====================================================
// Quota and Entitlements Types
// =====================================================

interface VoiceQuota {
  limitSeconds: number;
  usedSeconds: number;
  remainingSeconds: number;
  isExceeded: boolean;
  resetType: "never" | "monthly";
  resetDate?: string;
}

interface QuotaCheckResult {
  canCreate: boolean;
  quota: VoiceQuota | null;
  error?: string;
}

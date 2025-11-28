"use server";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { createClient } from "@/shared/lib/supabase/server";
import {
  entitlementsBySubscription,
  getNextResetDate,
  type SubscriptionType
} from "../core/entitlements";

// =====================================================
// VOICE TOPICS
// =====================================================

export async function getAllTopics(): Promise<VoiceTopic[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("voice_topics")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching topics:", error);
    return [];
  }

  return data as VoiceTopic[];
}

export async function getTopicById(topicId: string): Promise<VoiceTopic | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("voice_topics")
    .select("*")
    .eq("id", topicId)
    .eq("is_active", true)
    .single();

  if (error) {
    console.error("Error fetching topic:", error);
    return null;
  }

  return data as VoiceTopic;
}

export async function getTopicsByDifficulty(
  difficultyLevel: DifficultyLevel
): Promise<VoiceTopic[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("voice_topics")
    .select("*")
    .eq("is_active", true)
    .eq("difficulty_level", difficultyLevel)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching topics by difficulty:", error);
    return [];
  }

  return data as VoiceTopic[];
}

// =====================================================
// VOICE QUOTA MANAGEMENT
// =====================================================

export async function checkVoiceQuota(userId: string): Promise<QuotaCheckResult> {
  "use server";

  const supabase = await createClient();

  // Get user profile with subscription type
  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("subscription_type")
    .eq("id", userId)
    .single();

  if (profileError || !profile) {
    return {
      canCreate: false,
      quota: null,
      error: "Failed to fetch user profile"
    };
  }

  const subscriptionType = (profile.subscription_type || "FREE") as SubscriptionType;

  // Call database function to get quota usage
  const { data: quotaData, error: quotaError } = await supabase
    .rpc("get_user_voice_quota_usage", {
      p_user_id: userId,
      p_subscription_type: subscriptionType
    })
    .single();

  if (quotaError) {
    console.error("Error checking quota:", quotaError);
    return {
      canCreate: false,
      quota: null,
      error: "Failed to check quota"
    };
  }

  const entitlements = entitlementsBySubscription[subscriptionType];

  const quota: VoiceQuota = {
    limitSeconds: quotaData.limit_seconds,
    usedSeconds: quotaData.used_seconds,
    remainingSeconds: quotaData.remaining_seconds,
    isExceeded: quotaData.is_exceeded,
    resetType: entitlements.resetType,
    resetDate: entitlements.resetType === "monthly"
      ? getNextResetDate().toISOString()
      : undefined
  };

  return {
    canCreate: !quotaData.is_exceeded,
    quota
  };
}

// =====================================================
// VOICE CONVERSATIONS
// =====================================================

export async function createConversation(
  params: CreateConversationParams
): Promise<CreateConversationResponse> {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "Unauthorized: Please login to continue",
    };
  }

  // CHECK QUOTA FIRST - enforce usage limits
  const quotaCheck = await checkVoiceQuota(user.id);

  if (!quotaCheck.canCreate) {
    return {
      success: false,
      error: "voice_quota_exceeded",
      message: "You have exceeded your voice chat quota. Please upgrade or wait for reset.",
      data: {
        conversationId: "",
        conversation: null,
        quota: quotaCheck.quota
      }
    };
  }

  const { data, error } = await supabase
    .from("voice_conversations")
    .insert({
      user_id: user.id,
      topic_id: params.topicId || null,
      topic: params.topic,
      difficulty_level: params.difficultyLevel || "intermediate",
      conversation_type: params.conversationType,
      prompts: params.prompts || [],
      topic_selected: params.topicSelected || null,
      preparation_time_seconds: params.preparationTimeSeconds || null,
      feedback_language: params.feedbackLanguage || null,
      status: "active",
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating conversation:", error);
    return {
      success: false,
      error: "Failed to create conversation",
    };
  }

  return {
    success: true,
    data: {
      conversationId: data.id,
      conversation: data as VoiceConversation,
    },
  };
}

export async function getConversationById(
  conversationId: string
): Promise<VoiceConversation | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("voice_conversations")
    .select("*")
    .eq("id", conversationId)
    .single();

  if (error) {
    console.error("Error fetching conversation:", error);
    return null;
  }

  return data as VoiceConversation;
}

export async function updateConversation(
  params: UpdateConversationParams
): Promise<ApiResponse> {
  const supabase = await createClient();

  const updateData: any = {};

  if (params.vapiCallId !== undefined) updateData.vapi_call_id = params.vapiCallId;
  if (params.durationSeconds !== undefined)
    updateData.duration_seconds = params.durationSeconds;
  if (params.messageCount !== undefined) updateData.message_count = params.messageCount;
  if (params.userMessageCount !== undefined)
    updateData.user_message_count = params.userMessageCount;
  if (params.status !== undefined) updateData.status = params.status;
  if (params.isCompleted !== undefined) updateData.is_completed = params.isCompleted;
  if (params.completedAt !== undefined) updateData.completed_at = params.completedAt;

  const { error } = await supabase
    .from("voice_conversations")
    .update(updateData)
    .eq("id", params.conversationId);

  if (error) {
    console.error("Error updating conversation:", error);
    return {
      success: false,
      error: "Failed to update conversation",
    };
  }

  return { success: true };
}

export async function getConversationsByUser(
  params: GetConversationsByUserParams
): Promise<VoiceConversation[]> {
  const supabase = await createClient();

  let query = supabase
    .from("voice_conversations")
    .select("*")
    .eq("user_id", params.userId)
    .order("created_at", { ascending: false });

  if (params.status) {
    query = query.eq("status", params.status);
  }

  if (params.limit) {
    query = query.limit(params.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }

  return data as VoiceConversation[];
}

// =====================================================
// VOICE TRANSCRIPTS
// =====================================================

export async function createTranscript(
  params: CreateTranscriptParams
): Promise<ApiResponse> {
  const supabase = await createClient();

  const { error } = await supabase.from("voice_transcripts").insert({
    conversation_id: params.conversationId,
    role: params.role,
    content: params.content,
    timestamp_ms: params.timestampMs,
    sequence_number: params.sequenceNumber,
    vapi_message_type: params.vapiMessageType || null,
    vapi_transcript_type: params.vapiTranscriptType || null,
    raw_vapi_data: params.rawVapiData || null,
  });

  if (error) {
    console.error("Error creating transcript:", error);
    return {
      success: false,
      error: "Failed to save transcript",
    };
  }

  return { success: true };
}

export async function getTranscriptsByConversation(
  conversationId: string
): Promise<VoiceTranscript[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("voice_transcripts")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("sequence_number", { ascending: true });

  if (error) {
    console.error("Error fetching transcripts:", error);
    return [];
  }

  return data as VoiceTranscript[];
}

// =====================================================
// VOICE FEEDBACK - with Gemini AI
// =====================================================

// Feedback schema for Gemini AI
const feedbackSchema = z.object({
  totalScore: z.number().min(0).max(100).describe("Overall score from 0-100"),
  categoryScores: z
    .array(
      z.object({
        name: z.string().describe("Skill name"),
        score: z.number().min(0).max(100).describe("Overall score from 0-100"),
        comment: z.string().describe("Detailed comments"),
      })
    )
    .describe("Detailed scores for each skill"),
  strengths: z
    .array(z.string())
    .describe("Learner Strengths (Vietnamese)"),
  areasForImprovement: z
    .array(z.string())
    .describe("Points for improvement (Vietnamese)"),
  finalAssessment: z.string().describe("Overall rating"),
  vocabularySuggestions: z
    .array(
      z.object({
        word: z.string().describe("Vietnamese word"),
        meaning: z.string().describe("English meaning"),
        example: z.string().describe("Vietnamese example sentence"),
      })
    )
    .describe("List of vocabulary to learn"),
  grammarNotes: z
    .array(z.string())
    .describe("Grammar notes (Vietnamese)"),
  pronunciationTips: z
    .array(z.string())
    .describe("Suggestions for improving pronunciation (Vietnamese)"),
});

export async function createFeedback(
  params: CreateFeedbackParams
): Promise<CreateFeedbackResponse> {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  try {
    const startTime = Date.now();

    // Format transcript for AI
    const formattedTranscript = params.transcript
      .map((msg) => `- ${msg.role === "user" ? "Student" : "AI"}: ${msg.content}`)
      .join("\n");

    // Determine feedback language (default to Vietnamese for exams)
    const feedbackLanguage = params.feedbackLanguage || 'vietnamese';

    // Language-specific instructions
    const languageInstructions: Record<string, string> = {
      vietnamese: "Use Vietnamese for all comments, strengths, areas for improvement, grammar notes, and pronunciation tips.",
      english: "Use English for all comments, strengths, areas for improvement, grammar notes, and pronunciation tips.",
      chinese: "Use Chinese (Simplified Chinese) for all comments, strengths, areas for improvement, grammar notes, and pronunciation tips.",
      korean: "Use Korean for all comments, strengths, areas for improvement, grammar notes, and pronunciation tips.",
      japanese: "Use Japanese for all comments, strengths, areas for improvement, grammar notes, and pronunciation tips.",
      french: "Use French for all comments, strengths, areas for improvement, grammar notes, and pronunciation tips.",
      german: "Use German for all comments, strengths, areas for improvement, grammar notes, and pronunciation tips.",
      italian: "Use Italian for all comments, strengths, areas for improvement, grammar notes, and pronunciation tips.",
      portuguese: "Use Portuguese for all comments, strengths, areas for improvement, grammar notes, and pronunciation tips.",
      russian: "Use Russian for all comments, strengths, areas for improvement, grammar notes, and pronunciation tips.",
      spanish: "Use Spanish for all comments, strengths, areas for improvement, grammar notes, and pronunciation tips.",
      thai: "Use Thai for all comments, strengths, areas for improvement, grammar notes, and pronunciation tips.",
      turkish: "Use Turkish for all comments, strengths, areas for improvement, grammar notes, and pronunciation tips.",
    };

    // Generate feedback using Gemini AI
    const { object } = await generateObject({
      model: google("gemini-2.5-flash", {
        structuredOutputs: false,
      }),
      schema: feedbackSchema,
      prompt: `
You are a professional Vietnamese teacher. Your task is to assess your students' Vietnamese skills based on the following conversation.

**Conversation:**
        ${formattedTranscript}
**Assessment requirements:**

1. Score from 0-100 for the following skills (CORRECT NAME):
- **Pronunciation**: Accuracy of pronunciation, tone
- **Grammar**: Sentence structure, Vietnamese grammar
- **Vocabulary**: Richness and accuracy of vocabulary
- **Communication**: Ability to convey ideas
- **Fluency**: Naturalness and coherence when speaking

2. List 3-5 strengths of the student

3. List 3-5 areas for improvement

4. Give an overall assessment (2-3 sentences)

5. Suggest 5-8 useful vocabulary related to the conversation (Vietnamese word with meaning in the feedback language and examples)

6. Give 2-4 important grammar notes

7. Give 2-4 Suggestions for improving pronunciation

**Important notes:**
- Be fair, don't be too lenient
- ${languageInstructions[feedbackLanguage]}
- Be specific, with examples from conversations
- Encourage but also point out obvious errors
- For vocabulary suggestions, the 'word' field should be in Vietnamese, the 'meaning' field should be in ${feedbackLanguage}, and the 'example' field should be a Vietnamese sentence
`,
      system: "You are an experienced Vietnamese teacher, specializing in assessing the language skills of foreign learners."
    });

    const processingTime = Date.now() - startTime;

    // Prepare feedback data
    const feedbackData = {
      conversation_id: params.conversationId,
      user_id: user.id,
      total_score: object.totalScore,
      category_scores: object.categoryScores,
      strengths: object.strengths,
      areas_for_improvement: object.areasForImprovement,
      final_assessment: object.finalAssessment,
      vocabulary_suggestions: object.vocabularySuggestions,
      grammar_notes: object.grammarNotes,
      pronunciation_tips: object.pronunciationTips,
      ai_model: "gemini-2.0-flash-001",
      ai_processing_time_ms: processingTime,
    };

    // Upsert feedback (update if exists, insert if not)
    const { data, error } = await supabase
      .from("voice_feedback")
      .upsert(feedbackData, {
        onConflict: "conversation_id,user_id",
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving feedback:", error);
      return {
        success: false,
        error: "Failed to save feedback",
      };
    }

    return {
      success: true,
      data: {
        feedbackId: data.id,
        feedback: data as VoiceFeedback,
      },
    };
  } catch (error) {
    console.error("Error generating feedback:", error);
    return {
      success: false,
      error: "Failed to generate feedback",
    };
  }
}

export async function getFeedbackByConversation(
  params: GetFeedbackByConversationParams
): Promise<VoiceFeedback | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("voice_feedback")
    .select("*")
    .eq("conversation_id", params.conversationId)
    .eq("user_id", params.userId)
    .single();

  if (error) {
    // Not found is not an error, just return null
    if (error.code === "PGRST116") return null;

    console.error("Error fetching feedback:", error);
    return null;
  }

  return data as VoiceFeedback;
}

// =====================================================
// USER VOICE STATS
// =====================================================

export async function getUserStats(userId: string): Promise<UserVoiceStats | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_voice_stats")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    // Not found is not an error - user hasn't had any conversations yet
    if (error.code === "PGRST116") {
      return {
        id: "",
        user_id: userId,
        total_conversation_time: 0,
        total_conversation_count: 0,
        completed_conversation_count: 0,
        average_total_score: null,
        average_pronunciation_score: null,
        average_grammar_score: null,
        average_vocabulary_score: null,
        average_communication_score: null,
        average_fluency_score: null,
        current_level: "beginner",
        current_streak_days: 0,
        longest_streak_days: 0,
        last_conversation_date: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    console.error("Error fetching user stats:", error);
    return null;
  }

  return data as UserVoiceStats;
}

export async function initializeUserStats(userId: string): Promise<ApiResponse> {
  const supabase = await createClient();

  const { error } = await supabase.from("user_voice_stats").insert({
    user_id: userId,
    current_level: "beginner",
  });

  if (error) {
    // Already exists is OK
    if (error.code === "23505") {
      return { success: true };
    }

    console.error("Error initializing user stats:", error);
    return {
      success: false,
      error: "Failed to initialize user stats",
    };
  }

  return { success: true };
}

// =====================================================
// DELETE CONVERSATION
// =====================================================

export async function deleteConversation(
  conversationId: string
): Promise<ApiResponse> {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "Unauthorized: Please login to continue",
    };
  }

  // Delete related transcripts first (if exists)
  await supabase
    .from("voice_transcripts")
    .delete()
    .eq("conversation_id", conversationId);

  // Delete related feedback (if exists)
  await supabase
    .from("voice_feedback")
    .delete()
    .eq("conversation_id", conversationId);

  // Delete the conversation
  const { error } = await supabase
    .from("voice_conversations")
    .delete()
    .eq("id", conversationId)
    .eq("user_id", user.id); // Ensure user owns the conversation

  if (error) {
    console.error("Error deleting conversation:", error);
    return {
      success: false,
      error: "Failed to delete conversation",
    };
  }

  return { success: true };
}

// TODO: Implement updateUserStats() function
// This should be called after completing a conversation to recalculate averages
// Will be implemented in a future update

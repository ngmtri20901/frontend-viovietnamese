import { redirect } from "next/navigation";

import { createClient } from "@/shared/lib/supabase/server";
import {
  getConversationById,
  getFeedbackByConversation,
} from "@/features/ai/voice/actions/voice.action";
import { CONVERSATION_MODES } from "@/features/ai/voice/constants/vietnamese-voice";
import { ExamRoomClient } from "./ExamRoomClient";

interface ExamRoomPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    mode?: string;
    userName?: string;
    userId?: string;
    notes?: string;
  }>;
}

export default async function ExamRoomPage({
  params,
  searchParams,
}: ExamRoomPageProps) {
  const { id } = await params;
  const { mode, userName: queryUserName, userId: queryUserId, notes } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // Get user profile
  let userName = queryUserName || "";
  if (!userName) {
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("name")
      .eq("id", user.id)
      .single();
    userName = profile?.name || user.email?.split("@")[0] || "User";
  }

  // Get conversation details
  const conversation = await getConversationById(id);
  if (!conversation) redirect("/ai/voice");

  // Verify the conversation type is an exam type
  const examModes = [
    CONVERSATION_MODES.PART1_SOCIAL,
    CONVERSATION_MODES.PART2_SOLUTION,
    CONVERSATION_MODES.PART3_PRESENTATION,
  ];

  const conversationMode = mode || conversation.conversation_type;

  if (!examModes.includes(conversationMode as typeof examModes[number])) {
    // Redirect non-exam conversations to the regular speak page
    redirect(`/ai/voice/speak/${id}`);
  }

  // Check if feedback already exists
  const feedback = await getFeedbackByConversation({
    conversationId: id,
    userId: user.id,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <ExamRoomClient
          conversationId={id}
          userName={userName}
          userId={queryUserId || user.id}
          mode={conversationMode as typeof examModes[number]}
          topic={conversation.topic}
          topicSelected={conversation.topic_selected}
          preparationNotes={notes || conversation.preparation_notes}
          examQuestions={conversation.exam_questions}
          feedbackId={feedback?.id}
        />
      </div>
    </div>
  );
}

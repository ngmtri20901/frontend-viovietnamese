import { redirect } from "next/navigation";
import { createClient } from "@/shared/lib/supabase/server";
import Agent from "@/features/ai/voice/components/Agent";
import {
  CONVERSATION_MODES,
  type ConversationMode,
  type FreeTalkVariables,
  type ScenarioVariables,
} from "@/features/ai/voice/constants/vietnamese-voice";
import { getConversationById } from "@/features/ai/voice/actions/voice.action";

interface PageProps {
  searchParams: {
    conversationId?: string;
    mode?: string;
    languageMode?: string;
    difficultyLevel?: string;
    topic?: string;
    scenarioType?: string;
    scenarioTitle?: string;
    scenarioDescription?: string;
  };
}

export default async function SpeakPage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("name")
    .eq("id", user.id)
    .single();

  const userName = profile?.name || user.email?.split("@")[0] || "User";
  const userId = user.id;

  const conversationId = searchParams.conversationId;
  const mode = (searchParams.mode || CONVERSATION_MODES.FREE_TALK) as ConversationMode;

  // Build vapi variables based on mode
  let vapiVariables: Record<string, unknown> = {};

  if (mode === CONVERSATION_MODES.FREE_TALK) {
    vapiVariables = {
      userName,
      userId,
      conversationMode: mode,
      languageMode: searchParams.languageMode || "vietnamese_only",
      topic: searchParams.topic || "",
      difficultyLevel: searchParams.difficultyLevel || "beginner",
      assistantRole: "a friendly Vietnamese tutor",
    } as FreeTalkVariables;
  } else if (mode === CONVERSATION_MODES.SCENARIO_BASED) {
    vapiVariables = {
      userName,
      userId,
      conversationMode: mode,
      languageMode: searchParams.languageMode || "vietnamese_only",
      scenarioType: searchParams.scenarioTitle || "General scenario",
      scenarioDescription: searchParams.scenarioDescription || "",
      difficultyLevel: searchParams.difficultyLevel || "intermediate",
      assistantRole: "playing a role in this scenario",
    } as ScenarioVariables;
  }

  // Get conversation data if conversationId provided
  let topicTitle = searchParams.topic || "";
  if (conversationId) {
    const conversation = await getConversationById(conversationId);
    if (conversation) {
      topicTitle = conversation.topic;
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Agent
          userName={userName}
          userId={userId}
          conversationId={conversationId}
          mode={mode}
          topicTitle={topicTitle}
          vapiVariables={vapiVariables}
        />
      </div>
    </div>
  );
}

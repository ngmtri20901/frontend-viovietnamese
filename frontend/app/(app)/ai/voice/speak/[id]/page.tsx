import Image from "next/image";
import { redirect } from "next/navigation";

import Agent from "@/features/ai/voice/components/Agent";
import { getRandomConversationCover } from "@/shared/utils/voice";
import { createClient } from "@/shared/lib/supabase/server";
import {
  getFeedbackByConversation,
  getConversationById,
} from "@/features/ai/voice/actions/voice.action";
import {
  getDifficultyBadgeColor,
  getConversationTypeLabel,
} from "@/shared/utils/voice";

const ConversationDetails = async ({ params }: RouteParams) => {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // Get user profile
  let userName = "";
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("name")
    .eq("id", user.id)
    .single();
  userName = profile?.name || user.email?.split("@")[0] || "";

  const conversation = await getConversationById(id);
  if (!conversation) redirect("/ai/voice");

  const feedback = await getFeedbackByConversation({
    conversationId: id,
    userId: user.id,
  });

  return (
    <>
      <div className="flex flex-row gap-4 justify-between">
        <div className="flex flex-row gap-4 items-center max-sm:flex-col">
          <div className="flex flex-row gap-4 items-center">
            <Image
              src={getRandomConversationCover()}
              alt="conversation-cover"
              width={40}
              height={40}
              className="rounded-full object-cover size-[40px]"
            />
            <h3 className="capitalize">{conversation.topic}</h3>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-sm ${getDifficultyBadgeColor(
                conversation.difficulty_level
              )}`}
            >
              {conversation.difficulty_level}
            </span>
          </div>
        </div>

        <p className="bg-dark-200 px-4 py-2 rounded-lg h-fit capitalize">
          {getConversationTypeLabel(conversation.conversation_type)}
        </p>
      </div>

      <Agent
        userName={userName}
        userId={user.id}
        conversationId={id}
        type="conversation"
        topicTitle={conversation.topic}
        prompts={conversation.prompts}
        feedbackId={feedback?.id}
      />
    </>
  );
};

export default ConversationDetails;

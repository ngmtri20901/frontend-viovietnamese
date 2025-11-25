import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/cn";
import {
  getRandomConversationCover,
  getDifficultyBadgeColor,
  getConversationTypeLabel,
} from "@/shared/utils/voice";
import { getFeedbackByConversation } from "@/features/ai/voice/actions/voice.action";

interface ConversationCardProps {
  conversation: VoiceConversation;
  userId: string;
  onClick?: () => void;
}

const ConversationCard = async ({
  conversation,
  userId,
  onClick,
}: ConversationCardProps) => {
  const feedback = userId
    ? await getFeedbackByConversation({
        conversationId: conversation.id,
        userId,
      })
    : null;

  const badgeColor = getDifficultyBadgeColor(conversation.difficulty_level);
  const formattedDate = dayjs(
    feedback?.created_at || conversation.created_at || Date.now()
  ).format("MMM D, YYYY");

  return (
    <div className="card-border w-[360px] max-sm:w-full min-h-96">
      <div className="card-interview">
        <div>
          {/* Difficulty Badge */}
          <div
            className={cn(
              "absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg",
              badgeColor
            )}
          >
            <p className="badge-text capitalize">{conversation.difficulty_level}</p>
          </div>

          {/* Cover Image */}
          <Image
            src={getRandomConversationCover()}
            alt="conversation-cover"
            width={90}
            height={90}
            className="rounded-full object-fit size-[90px]"
          />

          {/* Topic Title */}
          <h3 className="mt-5 capitalize">{conversation.topic}</h3>

          {/* Conversation Type */}
          <p className="text-sm text-gray-500 mt-1">
            {getConversationTypeLabel(conversation.conversation_type)}
          </p>

          {/* Date & Score */}
          <div className="flex flex-row gap-5 mt-3">
            <div className="flex flex-row gap-2">
              <Image
                src="/calendar.svg"
                width={22}
                height={22}
                alt="calendar"
              />
              <p>{formattedDate}</p>
            </div>

            {feedback && (
              <div className="flex flex-row gap-2 items-center">
                <Image src="/star.svg" width={22} height={22} alt="star" />
                <p>{feedback.total_score || "---"}/100</p>
              </div>
            )}
          </div>

          {/* Feedback or Placeholder Text */}
          <p className="line-clamp-2 mt-5">
            {feedback?.final_assessment ||
              "You haven't completed this conversation yet. Start practicing to improve your Vietnamese skills."}
          </p>
        </div>

        <div className="flex flex-row justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {getConversationTypeLabel(conversation.conversation_type)}
            </span>
          </div>

          <Button className="btn-primary" onClick={onClick}>
            <Link
              href={
                feedback
                  ? `/ai/voice/speak/${conversation.id}/feedback`
                  : `/ai/voice/speak/${conversation.id}`
              }
            >
              {feedback ? "View Feedback" : "Start Conversation"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConversationCard;


import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

import {
  getFeedbackByConversation,
  getConversationById,
} from "@/features/ai/voice/actions/voice.action";
import { Button } from "@/shared/components/ui/button";
import { createClient } from "@/shared/lib/supabase/server";

const Feedback = async ({ params }: RouteParams) => {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const conversation = await getConversationById(id);
  if (!conversation) redirect("/ai/voice");

  const feedback = await getFeedbackByConversation({
    conversationId: id,
    userId: user.id,
  });

  if (!feedback) {
    redirect(`/ai/voice/speak/${id}`);
  }

  return (
    <section className="section-feedback">
      <div className="flex flex-row justify-center">
        <h1 className="text-4xl font-semibold">
          Feedback on Vietnamese Conversation -{" "}
          <span className="capitalize">{conversation.topic}</span>
        </h1>
      </div>

      <div className="flex flex-row justify-center ">
        <div className="flex flex-row gap-5">
          {/* Overall Score */}
          <div className="flex flex-row gap-2 items-center">
            <Image src="/star.svg" width={22} height={22} alt="star" />
            <p>
              Overall Score:{" "}
              <span className="text-primary-200 font-bold">
                {feedback.total_score}
              </span>
              /100
            </p>
          </div>

          {/* Date */}
          <div className="flex flex-row gap-2">
            <Image src="/calendar.svg" width={22} height={22} alt="calendar" />
            <p>
              {feedback.created_at
                ? dayjs(feedback.created_at).format("MMM D, YYYY h:mm A")
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <hr />

      <p>{feedback.final_assessment}</p>

      {/* Category Breakdown */}
      <div className="flex flex-col gap-4">
        <h2>Skill Breakdown:</h2>
        {feedback.category_scores?.map((category, index) => (
          <div key={index}>
            <p className="font-bold">
              {index + 1}. {category.name} ({category.score}/100)
            </p>
            <p>{category.comment}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <h3>Strengths</h3>
        <ul>
          {feedback.strengths?.map((strength, index) => (
            <li key={index}>{strength}</li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3">
        <h3>Areas for Improvement</h3>
        <ul>
          {feedback.areas_for_improvement?.map((area, index) => (
            <li key={index}>{area}</li>
          ))}
        </ul>
      </div>

      {/* Vocabulary Suggestions */}
      {feedback.vocabulary_suggestions &&
        feedback.vocabulary_suggestions.length > 0 && (
          <div className="flex flex-col gap-3">
            <h3>Vocabulary Suggestions</h3>
            <ul>
              {feedback.vocabulary_suggestions.map((vocab, index) => (
                <li key={index}>
                  <strong>{vocab.word}</strong> - {vocab.meaning}
                  <br />
                  <em className="text-sm text-gray-600">{vocab.example}</em>
                </li>
              ))}
            </ul>
          </div>
        )}

      {/* Grammar Notes */}
      {feedback.grammar_notes && feedback.grammar_notes.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3>Grammar Notes</h3>
          <ul>
            {feedback.grammar_notes.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Pronunciation Tips */}
      {feedback.pronunciation_tips &&
        feedback.pronunciation_tips.length > 0 && (
          <div className="flex flex-col gap-3">
            <h3>Pronunciation Tips</h3>
            <ul>
              {feedback.pronunciation_tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

      <div className="buttons">
        <Button className="btn-secondary flex-1">
          <Link href="/ai/voice" className="flex w-full justify-center">
            <p className="text-sm font-semibold text-primary-200 text-center">
              Back to Voice Chat
            </p>
          </Link>
        </Button>

        <Button className="btn-primary flex-1">
          <Link
            href={`/ai/voice/speak/${id}`}
            className="flex w-full justify-center"
          >
            <p className="text-sm font-semibold text-black text-center">
              Practice Again
            </p>
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default Feedback;

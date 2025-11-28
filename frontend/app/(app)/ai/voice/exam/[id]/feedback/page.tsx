import dayjs from "dayjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Trophy,
  TrendingUp,
  BookOpen,
  Mic,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  Target,
} from "lucide-react";

import {
  getFeedbackByConversation,
  getConversationById,
  getTranscriptsByConversation,
} from "@/features/ai/voice/actions/voice.action";
import { Button } from "@/shared/components/ui/button";
import { createClient } from "@/shared/lib/supabase/server";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
import {
  CONVERSATION_MODE_LABELS,
  CONVERSATION_MODES,
} from "@/features/ai/voice/constants/vietnamese-voice";

interface ExamFeedbackPageProps {
  params: Promise<{ id: string }>;
}

export default async function ExamFeedbackPage({
  params,
}: ExamFeedbackPageProps) {
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
    redirect(`/ai/voice/exam/${id}`);
  }

  // Get conversation transcripts
  const transcripts = await getTranscriptsByConversation(id);

  // Helper functions
  const formatDuration = (seconds: number) => {
    if (!seconds || seconds === 0) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs} second${secs !== 1 ? "s" : ""}`;
    if (secs === 0) return `${mins} minute${mins !== 1 ? "s" : ""}`;
    return `${mins} minute${mins !== 1 ? "s" : ""} ${secs} second${
      secs !== 1 ? "s" : ""
    }`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 75) return "Good";
    if (score >= 60) return "Average";
    return "Needs Improvement";
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 75) return "bg-blue-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Get exam-specific colors and labels
  const getExamTypeStyle = (type: string) => {
    switch (type) {
      case CONVERSATION_MODES.PART1_SOCIAL:
        return {
          color: "blue",
          bgLight: "from-blue-50 via-white to-indigo-50",
          border: "border-blue-200",
          badge: "border-blue-500 text-blue-700",
          icon: "💬",
        };
      case CONVERSATION_MODES.PART2_SOLUTION:
        return {
          color: "green",
          bgLight: "from-green-50 via-white to-teal-50",
          border: "border-green-200",
          badge: "border-green-500 text-green-700",
          icon: "💡",
        };
      case CONVERSATION_MODES.PART3_PRESENTATION:
        return {
          color: "purple",
          bgLight: "from-purple-50 via-white to-pink-50",
          border: "border-purple-200",
          badge: "border-purple-500 text-purple-700",
          icon: "🎤",
        };
      default:
        return {
          color: "gray",
          bgLight: "from-gray-50 via-white to-slate-50",
          border: "border-gray-200",
          badge: "border-gray-500 text-gray-700",
          icon: "📝",
        };
    }
  };

  const examStyle = getExamTypeStyle(conversation.conversation_type);

  // Get topic info if available
  const topicSelected = conversation.topic_selected as {
    title?: string;
    titleEn?: string;
    description?: string;
  } | null;

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${examStyle.bgLight} py-8 px-4`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/ai/voice"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Voice Chat</span>
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{examStyle.icon}</span>
                <h1 className="text-4xl font-bold text-gray-900">
                  Exam Feedback
                </h1>
              </div>
              <p className="text-xl text-gray-600 capitalize">
                {conversation.topic}
              </p>
              {topicSelected?.titleEn && (
                <p className="text-sm text-gray-500 italic mt-1">
                  {topicSelected.titleEn}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 text-gray-500">
              <Calendar className="w-5 h-5" />
              <span className="text-sm">
                {feedback.created_at
                  ? dayjs(feedback.created_at).format("MMM D, YYYY h:mm A")
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Exam Type Badge */}
        <div className="mb-6">
          <Badge variant="outline" className={`px-4 py-2 ${examStyle.badge}`}>
            {CONVERSATION_MODE_LABELS[conversation.conversation_type] ||
              conversation.conversation_type}
          </Badge>
        </div>

        {/* Overall Score Card */}
        <Card className={`mb-8 border-2 ${examStyle.border} shadow-lg`}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-full">
                  <Trophy className="w-8 h-8 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Overall Score</p>
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`text-5xl font-bold ${getScoreColor(
                        feedback.total_score
                      )}`}
                    >
                      {feedback.total_score}
                    </span>
                    <span className="text-2xl text-gray-400">/100</span>
                  </div>
                </div>
              </div>

              <Badge
                variant="outline"
                className={`px-4 py-2 text-lg ${
                  feedback.total_score >= 90
                    ? "border-green-500 text-green-700"
                    : feedback.total_score >= 75
                    ? "border-blue-500 text-blue-700"
                    : feedback.total_score >= 60
                    ? "border-yellow-500 text-yellow-700"
                    : "border-red-500 text-red-700"
                }`}
              >
                {getScoreLabel(feedback.total_score)}
              </Badge>
            </div>

            {feedback.final_assessment && (
              <div
                className={`mt-6 p-4 rounded-lg border ${
                  examStyle.color === "blue"
                    ? "bg-blue-50 border-blue-100"
                    : examStyle.color === "green"
                    ? "bg-green-50 border-green-100"
                    : examStyle.color === "purple"
                    ? "bg-purple-50 border-purple-100"
                    : "bg-gray-50 border-gray-100"
                }`}
              >
                <p className="text-gray-700 leading-relaxed">
                  {feedback.final_assessment}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Topic Details (for exams) */}
        {topicSelected?.description && (
          <Card className="mb-8 border-dashed">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="w-5 h-5 text-gray-500" />
                Exam Topic
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{topicSelected.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Conversation Details */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Duration */}
          <Card className="border-indigo-200">
            <CardHeader className="bg-indigo-50">
              <CardTitle className="flex items-center gap-2 text-indigo-800">
                <Clock className="w-5 h-5" />
                Duration
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <Clock className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatDuration(conversation.duration_seconds)}
                  </p>
                  <p className="text-sm text-gray-500">Total exam time</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-indigo-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Messages exchanged:</span>
                  <span className="font-semibold text-gray-900">
                    {conversation.message_count || 0}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-600">Your responses:</span>
                  <span className="font-semibold text-gray-900">
                    {conversation.user_message_count || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exam Info */}
          <Card className="border-teal-200">
            <CardHeader className="bg-teal-50">
              <CardTitle className="flex items-center gap-2 text-teal-800">
                <FileText className="w-5 h-5" />
                Exam Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Exam Type:</span>
                  <Badge variant="outline" className={examStyle.badge}>
                    {CONVERSATION_MODE_LABELS[conversation.conversation_type]
                      ?.replace("Part ", "")
                      .replace(":", " -") || conversation.conversation_type}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Difficulty:</span>
                  <Badge
                    variant="outline"
                    className={`capitalize ${
                      conversation.difficulty_level === "advanced"
                        ? "border-red-500 text-red-700"
                        : conversation.difficulty_level === "intermediate"
                        ? "border-yellow-500 text-yellow-700"
                        : "border-green-500 text-green-700"
                    }`}
                  >
                    {conversation.difficulty_level}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <Badge
                    variant="outline"
                    className={`capitalize ${
                      conversation.status === "completed"
                        ? "border-green-500 text-green-700"
                        : conversation.status === "active"
                        ? "border-blue-500 text-blue-700"
                        : "border-gray-500 text-gray-700"
                    }`}
                  >
                    {conversation.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Feedback - Accordion Style */}
        <Accordion type="multiple" className="mb-8 space-y-4">
          {/* Skill Breakdown */}
          <AccordionItem
            value="skill-breakdown"
            className="border rounded-lg bg-white shadow-sm"
          >
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">Skill Breakdown</span>
                <Badge variant="secondary" className="ml-2">
                  {feedback.category_scores?.length || 0} skills
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4">
              <div className="space-y-6">
                {feedback.category_scores?.map((category: { name: string; score: number; comment: string }, index: number) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">
                        {category.name}
                      </h3>
                      <span
                        className={`font-bold ${getScoreColor(category.score)}`}
                      >
                        {category.score}/100
                      </span>
                    </div>
                    <Progress
                      value={category.score}
                      className="h-2"
                      indicatorClassName={getProgressColor(category.score)}
                    />
                    <p className="text-sm text-gray-600">{category.comment}</p>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Strengths & Areas for Improvement */}
          <AccordionItem
            value="strengths-improvements"
            className="border rounded-lg bg-white shadow-sm"
          >
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-semibold">
                  Strengths & Areas for Improvement
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Strengths */}
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Strengths
                  </h3>
                  <ul className="space-y-2">
                    {feedback.strengths?.map((strength: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        <span className="text-gray-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Areas for Improvement */}
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h3 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Areas for Improvement
                  </h3>
                  <ul className="space-y-2">
                    {feedback.areas_for_improvement?.map((area: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                        <span className="text-gray-700">{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Vocabulary Suggestions */}
          {feedback.vocabulary_suggestions &&
            feedback.vocabulary_suggestions.length > 0 && (
              <AccordionItem
                value="vocabulary"
                className="border rounded-lg bg-white shadow-sm"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold">Vocabulary Suggestions</span>
                    <Badge variant="secondary" className="ml-2">
                      {feedback.vocabulary_suggestions.length} words
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    {feedback.vocabulary_suggestions.map((vocab: { word: string; meaning: string; example: string }, index: number) => (
                      <div
                        key={index}
                        className="p-4 bg-purple-50 rounded-lg border border-purple-100"
                      >
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="font-bold text-purple-900">
                            {vocab.word}
                          </span>
                          <span className="text-sm text-gray-600">
                            - {vocab.meaning}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 italic">
                          {vocab.example}
                        </p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

          {/* Grammar Notes */}
          {feedback.grammar_notes && feedback.grammar_notes.length > 0 && (
            <AccordionItem
              value="grammar"
              className="border rounded-lg bg-white shadow-sm"
            >
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold">Grammar Notes</span>
                  <Badge variant="secondary" className="ml-2">
                    {feedback.grammar_notes.length} notes
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <ul className="space-y-3">
                  {feedback.grammar_notes.map((note: string, index: number) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg"
                    >
                      <span className="shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{note}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Pronunciation Tips */}
          {feedback.pronunciation_tips &&
            feedback.pronunciation_tips.length > 0 && (
              <AccordionItem
                value="pronunciation"
                className="border rounded-lg bg-white shadow-sm"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Mic className="w-5 h-5 text-pink-600" />
                    <span className="font-semibold">Pronunciation Tips</span>
                    <Badge variant="secondary" className="ml-2">
                      {feedback.pronunciation_tips.length} tips
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <ul className="space-y-3">
                    {feedback.pronunciation_tips.map((tip: string, index: number) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 p-3 bg-pink-50 rounded-lg"
                      >
                        <Mic className="w-5 h-5 text-pink-500 mt-0.5 shrink-0" />
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            )}

          {/* Full Transcript */}
          {transcripts && transcripts.length > 0 && (
            <AccordionItem
              value="transcript"
              className="border rounded-lg bg-white shadow-sm"
            >
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-slate-600" />
                  <span className="font-semibold">Full Transcript</span>
                  <Badge variant="secondary" className="ml-2">
                    {transcripts.length} messages
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {transcripts.map((transcript) => (
                    <div
                      key={transcript.id}
                      className={`flex gap-3 p-4 rounded-lg ${
                        transcript.role === "user"
                          ? "bg-blue-50 border border-blue-100"
                          : transcript.role === "assistant"
                          ? "bg-gray-50 border border-gray-100"
                          : "bg-yellow-50 border border-yellow-100"
                      }`}
                    >
                      <div className="shrink-0">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            transcript.role === "user"
                              ? "bg-blue-500 text-white"
                              : transcript.role === "assistant"
                              ? "bg-gray-500 text-white"
                              : "bg-yellow-500 text-white"
                          }`}
                        >
                          {transcript.role === "user"
                            ? "You"
                            : transcript.role === "assistant"
                            ? "AI"
                            : "SYS"}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-gray-700 capitalize">
                            {transcript.role === "user"
                              ? "You"
                              : transcript.role === "assistant"
                              ? "Examiner"
                              : "System"}
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            {dayjs(transcript.created_at).format("HH:mm:ss")}
                          </span>
                        </div>
                        <p className="text-gray-800 leading-relaxed">
                          {transcript.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button variant="outline" className="flex-1" asChild>
            <Link
              href="/ai/voice"
              className="flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Voice Chat
            </Link>
          </Button>

          <Button
            className={`flex-1 ${
              examStyle.color === "blue"
                ? "bg-blue-600 hover:bg-blue-700"
                : examStyle.color === "green"
                ? "bg-green-600 hover:bg-green-700"
                : examStyle.color === "purple"
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-gray-600 hover:bg-gray-700"
            }`}
            asChild
          >
            <Link
              href={`/ai/voice/exam/${
                conversation.conversation_type === CONVERSATION_MODES.PART1_SOCIAL
                  ? "part1"
                  : conversation.conversation_type ===
                    CONVERSATION_MODES.PART2_SOLUTION
                  ? "part2"
                  : "part3"
              }`}
              className="flex items-center justify-center gap-2"
            >
              Try Again
              <TrendingUp className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

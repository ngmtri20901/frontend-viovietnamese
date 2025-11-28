"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { CONVERSATION_MODE_LABELS } from "@/features/ai/voice/constants/vietnamese-voice";
import { deleteConversation } from "@/features/ai/voice/actions/voice.action";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";

interface Conversation {
  id: string;
  topic: string;
  conversation_type: string;
  has_feedback: boolean;
  created_at: string;
  duration_seconds: number;
}

interface ConversationsListProps {
  conversations: Conversation[];
}

export function ConversationsList({ conversations }: ConversationsListProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const hasPastConversations = conversations && conversations.length > 0;

  const handleDeleteClick = (e: React.MouseEvent, conversationId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setConversationToDelete(conversationId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!conversationToDelete) return;

    setIsDeleting(true);
    try {
      const result = await deleteConversation(conversationToDelete);
      if (result.success) {
        setDeleteDialogOpen(false);
        setConversationToDelete(null);
        // Refresh the page to show updated list
        router.refresh();
      } else {
        console.error("Failed to delete conversation:", result.error);
        alert("Failed to delete conversation. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Recent Conversations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hasPastConversations ? (
            conversations.slice(0, 9).map((conversation) => (
              <ConversationCard
                key={conversation.id}
                conversation={conversation}
                onDelete={handleDeleteClick}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">
                You haven&apos;t had any conversations yet.
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Start practicing to see your progress here!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this conversation? This action
              cannot be undone. All transcripts and feedback associated with
              this conversation will also be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Conversation Card Component
function ConversationCard({
  conversation,
  onDelete,
}: {
  conversation: Conversation;
  onDelete: (e: React.MouseEvent, conversationId: string) => void;
}) {
  const getGradientIcon = (index: number) => {
    const gradients = [
      "bg-gradient-to-br from-purple-400 to-blue-500",
      "bg-gradient-to-br from-orange-400 to-purple-500",
      "bg-gradient-to-br from-green-400 to-teal-500",
      "bg-gradient-to-br from-red-400 via-orange-400 to-purple-500",
      "bg-gradient-to-br from-blue-400 to-purple-500",
      "bg-gradient-to-br from-pink-400 to-rose-500",
    ];
    return gradients[index % gradients.length];
  };

  const getConversationTypeLabel = (type: string) => {
    return CONVERSATION_MODE_LABELS[type] || type;
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 60) {
      return diffInMinutes <= 1 ? "a minute ago" : `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return diffInHours === 1 ? "an hour ago" : `${diffInHours} hours ago`;
    } else if (diffInDays === 1) {
      return "a day ago";
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <Link
      href={`/ai/voice/speak/${conversation.id}/feedback`}
      className="group relative bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-300 transition-all duration-200"
    >
      {/* Delete Button */}
      <button
        onClick={(e) => onDelete(e, conversation.id)}
        className="absolute top-3 right-3 p-1.5 rounded-full bg-white hover:bg-red-50 border border-gray-200 hover:border-red-300 opacity-0 group-hover:opacity-100 transition-all z-10"
        title="Delete conversation"
      >
        <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-600" />
      </button>

      {/* Feedback Badge */}
      {conversation.has_feedback && (
        <div className="absolute top-3 right-12">
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Reviewed
          </span>
        </div>
      )}

      {/* Icon */}
      <div
        className={`w-14 h-14 rounded-full ${getGradientIcon(
          conversation.id.charCodeAt(0) % 6
        )} flex items-center justify-center text-white font-bold text-xl mb-4 shadow-md`}
      >
        {conversation.topic.charAt(0).toUpperCase()}
      </div>

      {/* Content */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {conversation.topic}
        </h3>

        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md font-medium">
            {getConversationTypeLabel(conversation.conversation_type)}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <span>{formatTimeAgo(conversation.created_at)}</span>
          {conversation.duration_seconds > 0 && (
            <span className="font-medium">
              ⏱️ {formatDuration(conversation.duration_seconds)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

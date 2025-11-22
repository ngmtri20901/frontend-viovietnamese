'use client';

import { useState, useEffect, FormEvent, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { ThumbsUp, MessageSquare, Edit3, Trash2, SendHorizonal } from 'lucide-react';
import { type CommentType, type SanityAuthor } from '@/types/blog'; // Assuming CommentType is in types/blog now
import { useToast } from "@/components/ui/use-toast"
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const ITEMS_PER_PAGE = 5;
const EDIT_WINDOW_MINUTES = 5;

// Helper to get initials for Avatar Fallback
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

// Add Zod schemas for validation
const commentFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z0-9\s\-']+$/, 'Name can only contain letters, numbers, spaces, hyphens, and apostrophes'),
  email: z.string()
    .email('Please enter a valid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(100, 'Email must be less than 100 characters'),
  commentText: z.string()
    .min(10, 'Comment must be at least 10 characters')
    .max(1000, 'Comment must be less than 1000 characters')
    .regex(/^[^<>]*$/, 'HTML tags are not allowed'),
});

type CommentFormData = z.infer<typeof commentFormSchema>;

// --- CommentForm Component (Wrapped with reCAPTCHA logic) ---
type CommentFormProps = {
  postId: string;
  parentId?: string | null;
  onCommentSubmitted: (newComment: CommentType) => void;
  onCancelReply?: () => void;
};

function CommentFormInternal({ postId, parentId = null, onCommentSubmitted, onCancelReply }: CommentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields },
    trigger,
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      name: '',
      email: '',
      commentText: '',
    },
    mode: 'onBlur', // Enable validation on blur
  });

  // Function to show alert message for a field
  const showFieldAlert = (fieldName: keyof CommentFormData) => {
    if (errors[fieldName]) {
      toast({
        title: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} Error`,
        description: errors[fieldName]?.message,
        variant: "destructive",
      });
    }
  };

  const handleRecaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha) {
      console.log('Execute recaptcha not yet available');
      toast({ title: "CAPTCHA not ready", description: "Please try again in a moment.", variant: "destructive" });
      return null;
    }
    try {
      const token = await executeRecaptcha('submit_comment');
      return token;
    } catch (e) {
      console.error("reCAPTCHA execution error:", e);
      toast({ 
        title: "Error", 
        description: "CAPTCHA execution failed. Please refresh and try again.",
        variant: "destructive" 
      });
      return null;
    }
  }, [executeRecaptcha, toast]);

  const onSubmit = async (data: CommentFormData) => {
    setIsLoading(true);

    const captchaToken = await handleRecaptchaVerify();
    if (!captchaToken) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          ...data,
          parentId,
          captchaToken,
        }),
      });

      if (!response.ok) {
        let serverError = `Server error: ${response.status} ${response.statusText}`;
        try {
          const errorResult = await response.json();
          if (errorResult && errorResult.error) {
            serverError = errorResult.error;
          }
        } catch (jsonError) {
          const responseText = await response.text();
          console.error("Server returned non-JSON response:", responseText);
          toast({
            title: "Submission Error",
            description: `Server error (Status: ${response.status}). Check console for details.`,
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        throw new Error(serverError);
      }

      const result = await response.json();
      
      toast({
        title: parentId ? "Reply submitted" : "Comment submitted",
        description: "Your message is awaiting approval.",
      });

      const tempNewComment: CommentType = {
        _id: result.commentId || `temp-${Date.now()}`,
        name: data.name,
        commentText: data.commentText,
        createdAt: new Date().toISOString(),
        likes: 0,
        replies: [],
      };
      onCommentSubmitted(tempNewComment);
      reset();
      if (parentId && onCancelReply) onCancelReply();

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      console.error("Error during comment submission:", err);
      toast({
        title: "Submission Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`mt-6 ${parentId ? 'ml-8 border-l-2 border-blue-500 pl-4' : ''}`}>
      <CardHeader>
        <CardTitle>{parentId ? 'Reply to Comment' : 'Leave a Comment'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Input 
              placeholder="Name (required)" 
              {...register('name', {
                onBlur: () => {
                  trigger('name');
                  showFieldAlert('name');
                }
              })}
              disabled={isLoading}
              aria-invalid={errors.name ? "true" : "false"}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Input 
              type="email" 
              placeholder="Email (required, will not be published)" 
              {...register('email', {
                onBlur: () => {
                  trigger('email');
                  showFieldAlert('email');
                }
              })}
              disabled={isLoading}
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Textarea 
              placeholder="Your comment (required)" 
              {...register('commentText', {
                onBlur: () => {
                  trigger('commentText');
                  showFieldAlert('commentText');
                }
              })}
              rows={4} 
              disabled={isLoading}
              aria-invalid={errors.commentText ? "true" : "false"}
            />
            {errors.commentText && (
              <p className="text-sm text-red-500">{errors.commentText.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            {parentId && onCancelReply && (
              <Button type="button" variant="outline" onClick={onCancelReply} disabled={isLoading}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isLoading} className="gap-2">
              {isLoading ? 'Submitting...' : (parentId ? 'Post Reply' : 'Post Comment')} <SendHorizonal size={16}/>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// --- CommentItem Component ---
type CommentItemProps = {
  comment: CommentType;
  postId: string;
  onReply: (commentId: string) => void;
  onCommentUpdated: (updatedComment: CommentType) => void;
  onCommentDeleted: (commentId: string, parentId?: string | null) => void;
  activeReplyId: string | null;
};

function CommentItem({ comment, postId, onReply, onCommentUpdated, onCommentDeleted, activeReplyId }: CommentItemProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.commentText);

  // Rudimentary check for edit/delete eligibility
  // In a real app, this token would come from a secure source (e.g., auth context)
  const userOwnsComment = () => {
    const storedCommentId = localStorage.getItem(`comment_token_${comment._id}`);
    return storedCommentId === comment._id; // Simple check for this example
  };

  const canEditOrDelete = () => {
    if (!userOwnsComment()) return false;
    const now = new Date();
    const commentDate = new Date(comment.createdAt);
    const diffMinutes = (now.getTime() - commentDate.getTime()) / (1000 * 60);
    return diffMinutes <= EDIT_WINDOW_MINUTES;
  };

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/comments/${comment._id}/like`, { method: 'PUT' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to like comment');
      onCommentUpdated({ ...comment, likes: result.likes });
      toast({ title: "Comment Liked!" });
    } catch (err) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" });
    }
  };

  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editedText.trim()) return;
    try {
      const response = await fetch(`/api/comments/${comment._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentText: editedText, userToken: comment._id }), // Sending comment._id as userToken for this example
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to update comment');
      onCommentUpdated(result.comment);
      setIsEditing(false);
      toast({ title: "Comment Updated!" });
    } catch (err) {
      toast({ title: "Error updating", description: (err as Error).message, variant: "destructive" });
    }
  };
  
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      const response = await fetch(`/api/comments/${comment._id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }, // Required if sending userToken in body
        body: JSON.stringify({ userToken: comment._id }) // Sending comment._id as userToken for this example
      });
      if (!response.ok) {
        const result = await response.json().catch(() => ({ error: 'Failed to delete comment' }));
        throw new Error(result.error || 'Failed to delete comment');
      }
      onCommentDeleted(comment._id, comment.parentComment?._id);
      toast({ title: "Comment Deleted!" });
    } catch (err) {
      toast({ title: "Error deleting", description: (err as Error).message, variant: "destructive" });
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-start justify-between p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{getInitials(comment.name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm">{comment.name}</p>
            <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
          </div>
        </div>
        {canEditOrDelete() && (
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} className="h-7 w-7">
              <Edit3 size={14} />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDelete} className="h-7 w-7 text-red-500 hover:text-red-600">
              <Trash2 size={14} />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {isEditing ? (
          <form onSubmit={handleEditSubmit} className="space-y-2">
            <Textarea value={editedText} onChange={(e) => setEditedText(e.target.value)} rows={3} />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button type="submit" size="sm">Save Changes</Button>
            </div>
          </form>
        ) : (
          <p className="text-gray-700 text-sm whitespace-pre-wrap">{comment.commentText}</p>
        )}
      </CardContent>
      {!isEditing && (
        <CardFooter className="p-4 pt-0 flex justify-start gap-4">
          <Button variant="ghost" size="sm" onClick={handleLike} className="flex items-center gap-1 text-gray-600 hover:text-blue-600">
            <ThumbsUp size={16} /> <span className="text-xs">({comment.likes})</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onReply(comment._id)} className="flex items-center gap-1 text-gray-600 hover:text-green-600">
            <MessageSquare size={16} /> <span className="text-xs">Reply</span>
          </Button>
        </CardFooter>
      )}

      {/* Render Reply Form if this comment is being replied to */}
      {activeReplyId === comment._id && !isEditing && (
        <div className="p-4">
            <CommentFormInternal // Use the internal form component
                postId={postId} 
                parentId={comment._id} 
                onCommentSubmitted={(newReply) => {
                    // Logic to optimistically update parent comment's replies
                    const updatedParentComment = { 
                        ...comment, 
                        replies: [...(comment.replies || []), newReply]
                    };
                    onCommentUpdated(updatedParentComment);
                    onReply(''); // Close reply form
                }}
                onCancelReply={() => onReply('')} // Close reply form
            />
        </div>
      )}

      {/* Render Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-8 pl-4 border-l border-gray-200 py-2">
          {comment.replies.map(reply => (
            <CommentItem 
                key={reply._id} 
                comment={reply} 
                postId={postId} 
                onReply={onReply} // Replies to replies are not supported in this design (one level)
                onCommentUpdated={onCommentUpdated} // This needs to correctly update the nested reply
                onCommentDeleted={onCommentDeleted} 
                activeReplyId={activeReplyId} 
            />
          ))}
        </div>
      )}
    </Card>
  );
}


// --- CommentList Component (Handles pagination and rendering items) ---
type CommentListProps = {
  comments: CommentType[];
  postId: string;
  onReply: (commentId: string) => void;
  onCommentUpdated: (updatedComment: CommentType) => void;
  onCommentDeleted: (commentId: string, parentId?: string | null) => void;
  activeReplyId: string | null;
};

function CommentList({ comments, postId, onReply, onCommentUpdated, onCommentDeleted, activeReplyId }: CommentListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(comments.length / ITEMS_PER_PAGE);

  const currentComments = comments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  if (comments.length === 0) {
    return <p className="text-gray-500 mt-6 text-center">No comments yet. Be the first to comment!</p>;
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Comments ({comments.length})</h3>
      {currentComments.map(comment => (
        <CommentItem 
            key={comment._id} 
            comment={comment} 
            postId={postId} 
            onReply={onReply}
            onCommentUpdated={onCommentUpdated}
            onCommentDeleted={onCommentDeleted}
            activeReplyId={activeReplyId}
        />
      ))}

      {totalPages > 1 && (
         <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }} aria-disabled={currentPage === 1} />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              // Basic pagination display, can be enhanced with ellipsis
              if (totalPages <= 5 || 
                  (pageNum === 1 || pageNum === totalPages) || 
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                return (
                    <PaginationItem key={pageNum}>
                        <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(pageNum); }} isActive={currentPage === pageNum}>
                        {pageNum}
                        </PaginationLink>
                    </PaginationItem>
                );
              } else if ((pageNum === currentPage - 2 && currentPage > 3) || (pageNum === currentPage + 2 && currentPage < totalPages - 2)) {
                return <PaginationEllipsis key={`ellipsis-${pageNum}`} />;
              }
              return null;
            })}
            <PaginationItem>
              <PaginationNext href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }} aria-disabled={currentPage === totalPages} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

// --- Main CommentSection Component ---
interface CommentSectionProps {
  postId: string;
  initialComments: CommentType[];
}

export function CommentSection({ postId, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentType[]>(initialComments);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_GOOGLE_reCAPTCHAv3_SITEKEY;

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const storeCommentToken = (commentId: string) => {
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem(`comment_token_${commentId}`, commentId);
        } catch (e) { console.error("localStorage not available or error storing token"); }
    }
  };

  const handleCommentSubmitted = (newComment: CommentType) => {
    // If it's a reply, add to parent. Otherwise, add to main list.
    if (newComment.parentComment && newComment.parentComment._id) {
        setComments(prevComments => 
            prevComments.map(c => 
                c._id === newComment.parentComment?._id 
                ? { ...c, replies: [...(c.replies || []), newComment] } 
                : c
            )
        );
    } else {
        setComments(prevComments => [newComment, ...prevComments]);
    }
    if (!newComment._id.startsWith('temp-')) { // Only store token for non-temp (successfully submitted) IDs
        storeCommentToken(newComment._id);
    }
    setActiveReplyId(null); // Close reply form
  };

  const handleToggleReply = (commentId: string) => {
    setActiveReplyId(prevId => (prevId === commentId ? null : commentId));
  };

  const handleCommentUpdated = (updatedComment: CommentType) => {
    setComments(prevComments =>
      prevComments.map(c => {
        if (c._id === updatedComment._id) return updatedComment;
        if (c.replies) {
          return {
            ...c,
            replies: c.replies.map(r => r._id === updatedComment._id ? updatedComment : r)
          };
        }
        return c;
      })
    );
    // If a reply was updated, ensure activeReplyId is cleared if it was for this comment
    if (updatedComment.parentComment && activeReplyId === updatedComment.parentComment._id) {
        // setActiveReplyId(null); // Might not be necessary, form closes on submit
    }
  };

 const handleCommentDeleted = (commentId: string, parentId?: string | null) => {
    setComments(prevComments => {
      if (parentId) {
        return prevComments.map(c => 
          c._id === parentId 
          ? { ...c, replies: (c.replies || []).filter(r => r._id !== commentId) } 
          : c
        );
      } else {
        return prevComments.filter(c => c._id !== commentId);
      }
    });
    try {
        localStorage.removeItem(`comment_token_${commentId}`);
    } catch (e) { console.error("localStorage not available or error removing token"); }
  };

  if (!siteKey) {
    console.error("GOOGLE_reCAPTCHAv3_SITEKEY is not defined. reCAPTCHA will not work.");
    // Optionally, render a message or a degraded version of the comment section
    return (
        <section aria-labelledby="comment-section-title" className="mt-10">
            <h2 id="comment-section-title" className="text-2xl font-semibold mb-6">Community Discussion</h2>
            <Card><CardContent className="p-4 text-red-500">Comment section is temporarily unavailable due to a configuration issue.</CardContent></Card>
        </section>
    );
  }

  return (
    <GoogleReCaptchaProvider reCaptchaKey={siteKey}>
      <section aria-labelledby="comment-section-title" className="mt-10">
        <h2 id="comment-section-title" className="text-2xl font-semibold mb-6">Community Discussion</h2>
        <CommentFormInternal postId={postId} onCommentSubmitted={handleCommentSubmitted} />
        <CommentList 
          comments={comments} 
          postId={postId} 
          onReply={handleToggleReply} 
          onCommentUpdated={handleCommentUpdated}
          onCommentDeleted={handleCommentDeleted}
          activeReplyId={activeReplyId}
        />
      </section>
    </GoogleReCaptchaProvider>
  );
} 
/**
 * Comments Section Component
 *
 * Displays blog post comments with a form for adding new comments.
 * Uses Convex preloaded queries for server-side rendering and real-time updates.
 *
 * @remarks
 * Data Flow:
 * 1. Comments preloaded on server (SSR) via preloadAuthQuery
 * 2. Client hydrates with usePreloadedQuery (instant display, no loading)
 * 3. New comments trigger real-time updates via Convex subscriptions
 *
 * Form Handling:
 * - React Hook Form for form state management
 * - Zod schema validation via zodResolver
 * - useTransition for non-blocking submit
 *
 * @see {@link commentSchema} - Validation schema for comment form
 */

"use client";

import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "next/navigation";

import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { toast } from "sonner";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loading03Icon, Message01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { commentSchema } from "@/app/schemas/comment";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";

/**
 * Props for the comments section component.
 *
 * @remarks
 * preloadedComments is a Convex Preloaded type that contains
 * serialized query results from server-side rendering.
 * This enables instant display without client-side loading states.
 */
interface CommentsSectionProps {
  preloadedComments: Preloaded<typeof api.comments.getCommentsByPostId>;
}

/**
 * Comment section with form and list display.
 *
 * @param preloadedComments - Server-preloaded comments for instant hydration
 *
 * @remarks
 * Form Submission Flow:
 * 1. Validate against commentSchema
 * 2. Execute createComment mutation via Convex
 * 3. Reset form on success, show toast
 * 4. Convex automatically updates UI (real-time subscription)
 */
export const CommentsSection = ({
  preloadedComments,
}: CommentsSectionProps) => {
  const { postId } = useParams<{ postId: Id<"posts"> }>();

  const [isPending, startTransition] = useTransition();

  const comments = usePreloadedQuery(preloadedComments);

  const createComment = useMutation(api.comments.createComment);

  const form = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      body: "",
      postId,
    },
  });

  const onSubmit = async (values: z.infer<typeof commentSchema>) => {
    startTransition(async () => {
      try {
        await createComment(values);
        form.reset();
        toast.success("Comment posted successfully");
      } catch {
        toast.error("Failed to post comment");
      }
    });
  };

  // Loading state while hydrating preloaded data
  if (comments === undefined) {
    return (
      <Card>
        <CardHeader className="flex flex-row gap-2 items-center border-b">
          <HugeiconsIcon icon={Message01Icon} className="size-5" />
          <h2 className="text-xl font-bold">Comments</h2>
        </CardHeader>
        <CardContent className="space-y-8">
          <p>Loading comments...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row gap-2 items-center border-b">
        <HugeiconsIcon icon={Message01Icon} className="size-5" />
        <h2 className="text-xl font-bold">{comments.length} Comments</h2>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Comment submission form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="body"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Comment</FieldLabel>
                <Textarea
                  aria-invalid={fieldState.invalid}
                  placeholder="Share your thoughts..."
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <HugeiconsIcon
                  icon={Loading03Icon}
                  strokeWidth={2}
                  className="animate-spin size-4"
                />
                <span>Posting...</span>
              </>
            ) : (
              <span>Post Comment</span>
            )}
          </Button>
        </form>

        {comments.length > 0 && <Separator />}

        {/* Comments list with avatar and metadata */}
        <section className="space-y-6">
          {comments.map((comment) => (
            <div key={comment._id} className="flex gap-4">
              <Avatar className="size-10 shrink-0">
                <AvatarImage
                  src={`https://avatar.vercel.sh/${comment.authorName}`}
                  alt={comment.authorName}
                />
                <AvatarFallback>
                  {comment.authorName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold">{comment.authorName}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(comment._creationTime).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
                  {comment.body}
                </p>
              </div>
            </div>
          ))}
        </section>
      </CardContent>
    </Card>
  );
};

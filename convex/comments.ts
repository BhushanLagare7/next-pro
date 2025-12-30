/**
 * Comments Queries and Mutations
 *
 * Convex backend functions for blog post comment operations.
 * Queries are public; mutations require authentication.
 *
 * @remarks
 * Data Model:
 * Comments are linked to posts via postId foreign key.
 * Author name is denormalized (stored with comment) for display performance.
 *
 * Real-Time:
 * All queries are automatically reactive - UI updates instantly when
 * comments are added/modified without manual refetching.
 *
 * @see {@link ./schema.ts} - Comments table definition
 */

import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

/**
 * Fetches all comments for a specific blog post.
 *
 * @param args.postId - ID of the post to get comments for
 * @returns Array of comments, newest first
 *
 * @remarks
 * Public query - no authentication required for reading.
 * Returns comments in reverse chronological order (newest first).
 * Results are reactive and update automatically when comments change.
 */
export const getCommentsByPostId = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .filter((q) => q.eq(q.field("postId"), args.postId))
      .order("desc")
      .collect();

    return comments;
  },
});

/**
 * Creates a new comment on a blog post.
 *
 * @param args.postId - ID of the post to comment on
 * @param args.body - Comment text content
 * @returns ID of the newly created comment
 * @throws ConvexError if user is not authenticated
 *
 * @remarks
 * Authorization:
 * - Requires valid authenticated user
 * - authorId and authorName automatically set from auth context
 *
 * Denormalization Strategy:
 * Author name is stored with each comment (not just authorId) to avoid
 * expensive joins when rendering comment lists. Trade-off: if user changes
 * name, old comments retain previous name.
 */
export const createComment = mutation({
  args: {
    postId: v.id("posts"),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to create a comment",
      });
    }

    const newComment = await ctx.db.insert("comments", {
      postId: args.postId,
      body: args.body,
      authorId: user._id,
      authorName: user.name,
    });

    return newComment;
  },
});

/**
 * Posts Queries and Mutations
 *
 * Convex backend functions for blog post CRUD operations.
 * All mutations require authentication; queries are public.
 *
 * @remarks
 * Convex Function Types:
 * - query: Read-only database access, automatically reactive/real-time
 * - mutation: Write operations (create, update, delete)
 *
 * Authentication Pattern:
 * Uses authComponent.safeGetAuthUser() to verify logged-in user.
 * Returns null if unauthenticated (safe), throws error if required.
 *
 * Image Handling:
 * - Upload: Generate signed URL -> client uploads directly -> store ID in post
 * - Retrieve: Convert storage ID to public URL via ctx.storage.getUrl()
 */

import { ConvexError, v } from "convex/values";

import { Doc } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

/**
 * Creates a new blog post.
 *
 * @param args.title - Post title
 * @param args.body - Post content
 * @param args.imageStorageId - Storage ID of uploaded image (from generateImageUploadUrl)
 * @returns ID of newly created post
 * @throws ConvexError if user not authenticated
 *
 * @remarks
 * Authorization:
 * - Requires valid authenticated user
 * - authorId automatically set from auth context
 * - Prevents unauthenticated post creation
 *
 * Image Flow:
 * User must first call generateImageUploadUrl, upload file, then create post.
 * This separates file upload (large, slow) from database write (fast).
 */
export const createPost = mutation({
  args: {
    title: v.string(),
    body: v.string(),
    imageStorageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to create a post",
      });
    }

    const newPost = await ctx.db.insert("posts", {
      title: args.title,
      body: args.body,
      authorId: user._id,
      imageStorageId: args.imageStorageId,
    });

    return newPost;
  },
});

/**
 * Fetches all blog posts in reverse chronological order.
 *
 * @returns Array of posts with resolved image URLs
 *
 * @remarks
 * Public query (no authentication required).
 *
 * Image URL Resolution:
 * Storage IDs are converted to public URLs via ctx.storage.getUrl().
 * This generates signed URLs that expire after a time period.
 * Resolution happens per-request (not cached in DB) for security.
 *
 * Performance:
 * Uses Promise.all for parallel URL resolution (faster than sequential).
 * For large datasets, consider pagination instead of collect().
 */
export const getPosts = query({
  args: {},
  handler: async (ctx) => {
    // Fetch posts newest-first
    const posts = await ctx.db.query("posts").order("desc").collect();

    // Parallel image URL resolution for all posts
    return await Promise.all(
      posts.map(async (post) => {
        const resolvedImageUrl =
          post.imageStorageId !== undefined
            ? await ctx.storage.getUrl(post.imageStorageId)
            : null;

        return {
          ...post,
          imageUrl: resolvedImageUrl,
        };
      })
    );
  },
});

/**
 * Generates a signed URL for direct image upload to Convex storage.
 *
 * @returns Signed upload URL (expires after short time)
 * @throws ConvexError if user not authenticated
 *
 * @remarks
 * Upload Pattern:
 * 1. Client calls this mutation to get signed URL
 * 2. Client POSTs image file directly to signed URL
 * 3. Convex returns storageId in response
 * 4. Client calls createPost with storageId
 *
 * Why Signed URLs:
 * - Large file uploads don't go through mutation functions (performance)
 * - Direct upload to storage is faster
 * - Signed URLs expire, preventing unauthorized uploads
 * - Upload progress can be tracked client-side
 */
export const generateImageUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to upload an image",
      });
    }

    return await ctx.storage.generateUploadUrl();
  },
});

/**
 * Fetches a single post by ID.
 *
 * @param args.postId - ID of post to retrieve
 * @returns Post with resolved image URL
 * @throws ConvexError if post not found
 *
 * @remarks
 * Used for post detail pages and metadata generation.
 * Public query (no authentication required for reading).
 */
export const getPostById = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);

    if (!post) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Post not found",
      });
    }

    // Resolve image storage ID to public URL
    const resolvedImageUrl = post.imageStorageId
      ? await ctx.storage.getUrl(post.imageStorageId)
      : null;

    return {
      ...post,
      imageUrl: resolvedImageUrl,
    };
  },
});

/**
 * Type for search results (subset of post fields for performance).
 * Only returns fields needed for search results display.
 */
interface searchPostResultType {
  _id: string;
  title: string;
  body: string;
}

/**
 * Searches posts by title and body content.
 *
 * @param args.query - Search query string
 * @param args.limit - Maximum number of results to return
 * @returns Array of matching posts (title matches first, then body matches)
 *
 * @remarks
 * Search Algorithm:
 * 1. Search title index for matches (priority results)
 * 2. If under limit, search body index for additional matches
 * 3. Deduplicate results (post appears once even if matches both)
 * 4. Return up to limit results
 *
 * Performance Considerations:
 * - Returns minimal fields (not full post objects)
 * - Deduplication via Set prevents duplicate entries
 * - Early exit when limit reached
 * - Title matches prioritized (better relevance)
 *
 * Full-Text Search:
 * Uses Convex's built-in search indexes (defined in schema).
 * Supports fuzzy matching, stemming, and relevance ranking.
 */
export const searchPost = query({
  args: {
    query: v.string(),
    limit: v.number(),
  },
  handler: async (ctx, args) => {
    const limit = args.limit;

    const result: Array<searchPostResultType> = [];

    // Track seen post IDs to prevent duplicates
    const seen = new Set<string>();

    /**
     * Helper to add documents to results with deduplication.
     * Stops adding when limit reached.
     */
    const pushDocs = async (docs: Array<Doc<"posts">>) => {
      for (const doc of docs) {
        if (seen.has(doc._id)) {
          continue; // Skip duplicates
        }
        seen.add(doc._id);
        result.push({
          _id: doc._id,
          title: doc.title,
          body: doc.body,
        });

        if (result.length >= limit) {
          break; // Early exit when limit reached
        }
      }
    };

    // Phase 1: Search titles (higher relevance)
    const titleMatches = await ctx.db
      .query("posts")
      .withSearchIndex("search_title", (q) => q.search("title", args.query))
      .take(limit);

    await pushDocs(titleMatches);

    // Phase 2: Search body content if still under limit
    if (result.length < limit) {
      const bodyMatches = await ctx.db
        .query("posts")
        .withSearchIndex("search_body", (q) => q.search("body", args.query))
        .take(limit);

      await pushDocs(bodyMatches);
    }

    return result;
  },
});

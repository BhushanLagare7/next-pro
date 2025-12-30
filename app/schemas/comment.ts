/**
 * Comment Schema
 *
 * Validation schema for blog post comments.
 * Uses Convex-specific branded types for database ID validation.
 *
 * @remarks
 * Branded Types Pattern:
 * The postId field uses z.custom<Id<"posts">>() instead of z.string() because
 * Convex uses branded types for database IDs. A branded type is a primitive
 * (string) with additional type information (the table name "posts").
 *
 * Why not z.string()?
 * - Type safety: prevents passing wrong table IDs (e.g., user ID as post ID)
 * - IDE autocomplete: shows which table the ID belongs to
 * - Runtime safety: Convex validates ID format and table match
 *
 * Comment Length Minimum (3 chars):
 * - Prevents spam (single-character comments)
 * - Ensures meaningful contributions
 * - No maximum: allows detailed responses
 */

import * as z from "zod";

import { Id } from "@/convex/_generated/dataModel";

export const commentSchema = z.object({
  body: z.string().min(3, "Comment must be at least 3 characters long"),
  postId: z.custom<Id<"posts">>(), // Branded type for type-safe database IDs
});

/**
 * Blog Post Schema
 *
 * Validation schema for blog post creation form.
 * Enforces content quality standards and resource limits.
 *
 * @remarks
 * Validation Rules Rationale:
 *
 * Title Constraints (3-50 chars):
 * - Minimum 3: prevents empty/meaningless titles
 * - Maximum 50: ensures readable titles in listings, prevents layout breaks
 * - Good for SEO: concise titles perform better in search results
 *
 * Content Minimum (10 chars):
 * - Prevents spam/low-quality posts
 * - No maximum: allows long-form content
 * - Actual length limited by user attention span, not code
 *
 * Image Size Limit (1MB):
 * - Balances quality with upload/storage costs
 * - Prevents abuse (users uploading huge files)
 * - 1MB sufficient for web-optimized images
 * - Next.js Image component further optimizes on serve
 * - Convex storage has file size limits, this prevents exceeding them
 */

import * as z from "zod";

export const postSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(50, "Title must be at most 50 characters long"),
  content: z.string().min(10, "Content must be at least 10 characters long"),
  // File validation: type check + size constraint
  image: z.instanceof(File).refine((file) => file.size <= 1024 * 1024, {
    message: "File size must be less than 1MB",
  }),
});

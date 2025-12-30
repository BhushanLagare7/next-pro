/**
 * Convex Database Schema
 *
 * Defines the structure and relationships of database tables.
 * Convex is a real-time database with automatic TypeScript type generation.
 *
 * @remarks
 * Schema Features:
 * - Type-safe table definitions with validator functions
 * - Automatic TypeScript type generation (_generated/dataModel.ts)
 * - Real-time subscriptions built-in
 * - Full-text search indexes
 * - Automatic ID generation
 *
 * Table Relationships:
 * - posts.authorId -> auth users table (managed by Better Auth)
 * - posts.imageStorageId -> Convex file storage
 * - comments.postId -> posts._id
 * - comments.authorId -> auth users table
 *
 * @see {@link https://docs.convex.dev/database/schemas} - Convex Schema Docs
 */

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  /**
   * Posts table for blog articles.
   *
   * @remarks
   * Search Indexes:
   * - search_title: Full-text search on post titles
   * - search_body: Full-text search on post content
   *
   * These indexes enable fast, fuzzy text search without external
   * search services. Convex automatically maintains indexes on writes.
   *
   * imageStorageId:
   * References Convex's built-in file storage (_storage table).
   * Use ctx.storage.getUrl() to convert ID to accessible URL.
   */
  posts: defineTable({
    title: v.string(),
    body: v.string(),
    authorId: v.string(), // User ID from Better Auth
    imageStorageId: v.id("_storage"), // Reference to uploaded image
  })
    .searchIndex("search_title", {
      searchField: "title", // Enable full-text search on titles
    })
    .searchIndex("search_body", {
      searchField: "body", // Enable full-text search on content
    }),
  /**
   * Comments table for post discussions.
   *
   * @remarks
   * Denormalized Data:
   * authorName is stored alongside authorId to avoid additional
   * queries when displaying comments. This trades storage space
   * for query performance (no joins needed).
   *
   * If a user changes their name, existing comments retain the old
   * name (a common trade-off in real-time systems for performance).
   */
  comments: defineTable({
    postId: v.id("posts"), // Foreign key to posts table
    body: v.string(),
    authorId: v.string(), // User ID from Better Auth
    authorName: v.string(), // Denormalized for display performance
  }),
});

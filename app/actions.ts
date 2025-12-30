/**
 * Server Actions
 *
 * Next.js server actions that execute securely on the server with direct
 * database access. These functions handle form submissions, data mutations,
 * and authenticated operations.
 *
 * @remarks
 * Server actions provide:
 * - Type-safe form handling without API routes
 * - Automatic CSRF protection
 * - Server-side validation before database writes
 * - Direct integration with Convex backend
 * - Progressive enhancement (works without JavaScript)
 *
 * All actions follow the pattern:
 * 1. Validate input with Zod schemas
 * 2. Check authentication status
 * 3. Perform authorized mutations
 * 4. Revalidate affected cache tags
 * 5. Redirect or return result
 */

"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { fetchMutation } from "convex/nextjs";
import * as z from "zod";

import { api } from "@/convex/_generated/api";

import { getToken } from "@/lib/auth-server";

import { postSchema } from "./schemas/blog";

/**
 * Creates a new blog post with image upload.
 *
 * Multi-step process:
 * 1. Validate input data against schema (title, content, image size/type)
 * 2. Verify user authentication
 * 3. Generate secure upload URL from Convex
 * 4. Upload image directly to Convex storage
 * 5. Create post record with image reference
 * 6. Invalidate blog cache
 * 7. Redirect to blog listing
 *
 * @param values - Form data containing title, content, and image file
 * @returns Error object if validation/upload fails, otherwise redirects to /blog
 *
 * @remarks
 * Image Upload Flow:
 * - Convex generates a signed upload URL (expires after short time)
 * - Client uploads file directly to Convex (not through Next.js server)
 * - Convex returns storageId after successful upload
 * - Post mutation references storageId for serving images
 *
 * This approach keeps large file uploads off the Next.js server and
 * leverages Convex's built-in file storage and CDN capabilities.
 *
 * Error Handling:
 * - Validation errors return field-specific messages for form display
 * - Auth errors return generic "Unauthorized" to avoid user enumeration
 * - Upload/mutation errors caught and logged for debugging
 */
export const createBlogAction = async (values: z.infer<typeof postSchema>) => {
  try {
    // Validate form data against Zod schema before processing
    const parsed = postSchema.safeParse(values);

    if (!parsed.success) {
      return {
        error: "Invalid data",
        details: parsed.error.flatten().fieldErrors,
      };
    }

    // Verify user is authenticated before allowing post creation
    const token = await getToken();

    if (!token) {
      return {
        error: "Unauthorized",
      };
    }

    // Generate a secure, time-limited upload URL from Convex
    const imageUploadUrl = await fetchMutation(
      api.posts.generateImageUploadUrl,
      {},
      { token }
    );

    // Upload image file directly to Convex storage
    // Content-Type header ensures proper MIME type for serving
    const uploadResult = await fetch(imageUploadUrl, {
      method: "POST",
      headers: {
        "Content-Type": parsed.data.image.type,
      },
      body: parsed.data.image,
    });

    if (!uploadResult.ok) {
      return {
        error: "Failed to upload image",
      };
    }

    // Extract storage ID to reference in database
    const { storageId } = await uploadResult.json();

    // Create post record in database with uploaded image reference
    await fetchMutation(
      api.posts.createPost,
      {
        title: parsed.data.title,
        body: parsed.data.content,
        imageStorageId: storageId,
      },
      { token }
    );
  } catch (error) {
    // Log errors for debugging but return generic message to client
    // Avoid leaking sensitive implementation details in error messages
    console.error(error);
    return {
      error: "Failed to create post",
    };
  }

  // Invalidate Next.js cache for blog routes to show new post immediately
  updateTag("blog");

  // Redirect to blog listing - this throws a redirect error caught by Next.js
  return redirect("/blog");
};

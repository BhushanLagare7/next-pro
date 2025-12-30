/**
 * Individual Post Detail Page
 *
 * Displays a single blog post with its full content, image, metadata, and comments.
 * Implements dynamic routing via [postId] parameter and generates SEO metadata per post.
 *
 * @remarks
 * Key Features:
 * - Dynamic route parameter for post identification
 * - Parallel data fetching (post + comments + user) via Promise.all
 * - generateMetadata for dynamic SEO tags (title, description, OG images)
 * - Auth-gated viewing (redirects if not logged in)
 * - Real-time presence tracking (shows who else is viewing)
 * - Comment system with preloaded data
 *
 * Data Fetching Strategy:
 * - Post data: fetchQuery (fully loads for metadata)
 * - Comments: preloadQuery (starts loading, data passed to client component)
 * - User ID: fetchQuery with auth token (required for presence)
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/functions/generate-metadata} - Dynamic Metadata
 */

import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { fetchQuery, preloadQuery } from "convex/nextjs";
import { ArrowLeft } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { getToken } from "@/lib/auth-server";

import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CommentsSection } from "@/components/web/comments-section";
import { PostPresence } from "@/components/web/post-presence";

interface PostIdPageProps {
  params: Promise<{ postId: Id<"posts"> }>;
}

/**
 * Generates dynamic metadata for each post.
 *
 * Called by Next.js during build/request to create page-specific SEO tags.
 * Fetches post data to populate title, description, and Open Graph metadata.
 *
 * @param params - Route parameters containing postId
 * @returns Metadata object with post-specific SEO tags
 *
 * @remarks
 * SEO Strategy:
 * - Uses post title as page title
 * - Truncates body to 160 chars for meta description (Google's preferred length)
 * - Includes Open Graph image from post (for social sharing previews)
 * - Sets type="article" for proper content classification
 * - Includes publishedTime for article freshness signals
 *
 * Fallback behavior: Returns generic "Post not found" metadata if post doesn't exist.
 */
export async function generateMetadata({
  params,
}: PostIdPageProps): Promise<Metadata> {
  const { postId } = await params;

  const post = await fetchQuery(api.posts.getPostById, { postId });

  if (!post) {
    return {
      title: "Post not found",
      description: "The requested post could not be found.",
    };
  }

  // Truncate description to optimal length for search engines and social previews
  const truncatedDescription =
    post.body.length > 160 ? `${post.body.substring(0, 157)}...` : post.body;

  return {
    title: post.title,
    description: truncatedDescription,
    openGraph: {
      title: post.title,
      description: truncatedDescription,
      type: "article",
      locale: "en_US",
      siteName: "NextPro",
      publishedTime: new Date(post._creationTime).toISOString(),
      images: post.imageUrl ? [{ url: post.imageUrl, alt: post.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: truncatedDescription,
      images: post.imageUrl ? [post.imageUrl] : [],
    },
    publisher: "Bhushan Lagare",
  };
}

/**
 * Post detail page component.
 *
 * @param params - Route parameters containing post ID
 *
 * @remarks
 * Parallel Data Fetching:
 * Uses Promise.all to fetch post, comments, and user ID simultaneously,
 * reducing total wait time compared to sequential fetches.
 *
 * Auth Strategy:
 * - Checks for valid user ID (from auth token)
 * - Redirects to login if unauthenticated
 * - Prevents unauthorized users from viewing post content
 *
 * preloadQuery vs fetchQuery:
 * - fetchQuery: Fully loads data on server (needed for post display)
 * - preloadQuery: Starts loading, passes reference to client component
 *   (allows CommentsSection to subscribe to real-time updates)
 */
const PostIdPage = async ({ params }: PostIdPageProps) => {
  const { postId } = await params;

  const token = await getToken();

  // Parallel data fetching for optimal performance
  const [post, preloadedComments, userId] = await Promise.all([
    fetchQuery(api.posts.getPostById, { postId }),
    preloadQuery(api.comments.getCommentsByPostId, { postId }),
    fetchQuery(api.presence.getUserId, {}, { token }),
  ]);

  // Auth gate: redirect if user not authenticated
  if (!userId) {
    return redirect("/auth/login");
  }

  if (!post) {
    return (
      <div>
        <h1 className="py-20 text-6xl font-bold text-center">Post not found</h1>
      </div>
    );
  }

  return (
    <div className="relative px-4 py-8 mx-auto max-w-3xl duration-500 animate-in fade-in">
      <Link
        href="/blog"
        className={buttonVariants({ variant: "outline", className: "mb-4" })}
      >
        <HugeiconsIcon icon={ArrowLeft} className="size-4" />
        Back to Blog
      </Link>

      <div className="relative w-full h-[400px] mb-8 rounded-xl overflow-hidden shadow-sm">
        <Image
          src={post.imageUrl ?? "/placeholder.png"}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

      <div className="flex flex-col space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          {post.title}
        </h1>

        <div className="flex gap-2 items-center">
          <p className="text-sm text-muted-foreground">
            Posted on: {new Date(post._creationTime).toLocaleDateString()}
          </p>
          {userId && <PostPresence roomId={post._id} userId={userId} />}
        </div>
      </div>

      <Separator className="my-8" />

      <p className="text-lg leading-relaxed whitespace-pre-wrap text-foreground/90">
        {post.body}
      </p>

      <Separator className="my-8" />

      <CommentsSection preloadedComments={preloadedComments} />
    </div>
  );
};

export default PostIdPage;

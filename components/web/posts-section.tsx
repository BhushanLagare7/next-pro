/**
 * Posts Section Components
 *
 * Blog posts grid display with Next.js caching and skeleton loading states.
 * Uses Next.js 15 "use cache" directive for optimized data fetching.
 *
 * @remarks
 * Caching Strategy:
 * - "use cache" directive enables automatic request deduplication
 * - cacheLife("hours") sets revalidation period
 * - cacheTag("blog") enables manual cache invalidation on post creation
 *
 * Why Server Component:
 * Posts list doesn't need interactivity, so we fetch and render on server.
 * This provides better SEO and faster initial page load.
 *
 * @see {@link PostsSectionSkeleton} - Loading state component
 */

import { cacheLife, cacheTag } from "next/cache";
import Image from "next/image";
import Link from "next/link";

import { fetchQuery } from "convex/nextjs";

import { api } from "@/convex/_generated/api";

import { buttonVariants } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

/**
 * Async server component that fetches and displays blog posts.
 *
 * @remarks
 * Next.js 15 Caching:
 * - "use cache" at top makes entire function cacheable
 * - cacheLife("hours") caches for performance
 * - cacheTag("blog") allows invalidation when new posts are created
 *
 * Image Handling:
 * Uses Next.js Image component with fill mode for responsive images.
 * Falls back to placeholder if post has no image.
 */
export const PostsSection = async () => {
  "use cache";
  cacheLife("hours");
  cacheTag("blog");
  const posts = await fetchQuery(api.posts.getPosts);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Card key={post._id} className="pt-0">
          <div className="overflow-hidden relative w-full h-48">
            <Image
              src={post.imageUrl ?? "/placeholder.png"}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>

          <CardContent>
            <Link href={`/blog/${post._id}`}>
              <h1 className="text-2xl font-bold hover:text-primary">
                {post.title}
              </h1>
            </Link>
            <p className="text-muted-foreground line-clamp-3">{post.body}</p>
          </CardContent>

          <CardFooter>
            <Link
              href={`/blog/${post._id}`}
              className={buttonVariants({ className: "w-full" })}
            >
              Read more
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

/**
 * Skeleton loading state for posts grid.
 *
 * @remarks
 * Displayed via Suspense boundary while PostsSection loads.
 * Matches PostsSection layout exactly to prevent layout shift.
 * Shows 9 skeleton cards as a reasonable preview count.
 */
export const PostsSectionSkeleton = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, index) => (
        <Card key={index}>
          <div className="w-full h-48">
            <Skeleton className="w-full h-full" />
          </div>

          <CardContent>
            <Skeleton className="mb-2 w-3/4 h-5" />
            <Skeleton className="mb-2 w-full h-4" />
            <Skeleton className="mb-2 w-full h-4" />
            <Skeleton className="mb-2 w-1/2 h-4" />
          </CardContent>

          <CardFooter>
            <Skeleton className="w-full h-10" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

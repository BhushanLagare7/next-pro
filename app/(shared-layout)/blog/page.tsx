/**
 * Blog Listing Page
 *
 * Displays all blog posts with search and filtering capabilities.
 * Uses React Suspense for streaming data from Convex, showing skeleton
 * while posts load and allowing the page shell to render immediately.
 *
 * @remarks
 * Suspense Benefits:
 * - Immediate page shell rendering (header, title visible instantly)
 * - Progressive enhancement (posts stream in when ready)
 * - Proper loading states without manual isLoading flags
 * - Required for Next.js production builds with uncached data
 *
 * SEO Optimization:
 * - Static metadata for consistent social sharing
 * - Category tagging for content classification
 * - Open Graph and Twitter Card support
 */

import { Suspense } from "react";
import { Metadata } from "next";

import {
  PostsSection,
  PostsSectionSkeleton,
} from "@/components/web/posts-section";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Explore insights, thoughts, and trends from our team. Stay updated with the latest in web development and technology.",
  openGraph: {
    title: "Blog | NextPro",
    description:
      "Explore insights, thoughts, and trends from our team. Stay updated with the latest in web development and technology.",
    type: "website",
    locale: "en_US",
    siteName: "NextPro",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | NextPro",
    description:
      "Explore insights, thoughts, and trends from our team. Stay updated with the latest in web development and technology.",
  },
  creator: "Bhushan Lagare",
  publisher: "Bhushan Lagare",
  category: "Web Development",
};

/**
 * Blog listing page component.
 *
 * @remarks
 * Server component (async) that delegates data fetching to PostsSection.
 * Suspense boundary ensures:
 * 1. Page header/title render immediately
 * 2. PostsSection can fetch data asynchronously
 * 3. Skeleton shows during data load
 * 4. No layout shift when content appears
 */
const BlogPage = async () => {
  return (
    <div className="py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Our Blog
        </h1>
        <p className="pt-4 mx-auto max-w-2xl text-xl text-muted-foreground">
          Insights, thoughts, and trends from our team.
        </p>
      </div>

      <Suspense fallback={<PostsSectionSkeleton />}>
        <PostsSection />
      </Suspense>
    </div>
  );
};

export default BlogPage;

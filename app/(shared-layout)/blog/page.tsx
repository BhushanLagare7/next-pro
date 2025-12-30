import { Suspense } from "react";
import { Metadata } from "next";

import {
  PostsSection,
  PostsSectionSkeleton,
} from "@/components/web/posts-section";

// TODO: Update metadata
export const metadata: Metadata = {
  title: "Blog | NextPro",
  description: "Insights, thoughts, and trends from our team.",
  openGraph: {
    title: "Blog | NextPro",
    description: "Insights, thoughts, and trends from our team.",
    type: "website",
    locale: "en_US",
    siteName: "NextPro",
  },
  creator: "Bhushan Lagare",
  publisher: "Bhushan Lagare",
  category: "Web Development",
};

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

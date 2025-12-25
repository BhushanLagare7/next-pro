import { Suspense } from "react";

import {
  PostsSection,
  PostsSectionSkeleton,
} from "@/components/web/posts-section";

export const dynamic = "force-static";
export const revalidate = 30;

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

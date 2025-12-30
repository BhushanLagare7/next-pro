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

const PostIdPage = async ({ params }: PostIdPageProps) => {
  const { postId } = await params;

  const token = await getToken();

  const [post, preloadedComments, userId] = await Promise.all([
    fetchQuery(api.posts.getPostById, { postId }),
    preloadQuery(api.comments.getCommentsByPostId, { postId }),
    fetchQuery(api.presence.getUserId, {}, { token }),
  ]);

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

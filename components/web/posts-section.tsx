import { cacheLife, cacheTag } from "next/cache";
import Image from "next/image";
import Link from "next/link";

import { fetchQuery } from "convex/nextjs";

import { api } from "@/convex/_generated/api";

import { buttonVariants } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

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

import { Skeleton } from "@/components/ui/skeleton";

const PostIdLoading = () => {
  return (
    <div
      className="px-4 py-8 mx-auto max-w-3xl"
      role="status"
      aria-label="Loading blog post"
      aria-busy="true"
    >
      <Skeleton className="mb-6 w-24 h-10 rounded-lg" />
      <Skeleton className="w-full h-[400px] mb-8 rounded-xl" />
      <div className="space-y-4">
        <Skeleton className="w-3/4 h-12 rounded-lg" />
        <Skeleton className="w-32 h-4 rounded-lg" />
        <div className="mt-8 space-y-2">
          <Skeleton className="w-full h-4 rounded-lg" />
          <Skeleton className="w-full h-4 rounded-lg" />
          <Skeleton className="w-2/3 h-4 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default PostIdLoading;

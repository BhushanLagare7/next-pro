import * as z from "zod";

export const postSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(50, "Title must be at most 50 characters long"),
  content: z.string().min(10, "Content must be at least 10 characters long"),
  image: z.instanceof(File).refine((file) => file.size <= 1024 * 1024, {
    message: "File size must be less than 1MB",
  }),
});

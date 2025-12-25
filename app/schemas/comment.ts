import * as z from "zod";

import { Id } from "@/convex/_generated/dataModel";

export const commentSchema = z.object({
  body: z.string().min(3, "Comment must be at least 3 characters long"),
  postId: z.custom<Id<"posts">>(),
});

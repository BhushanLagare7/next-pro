"use server";

import { redirect } from "next/navigation";

import { fetchMutation } from "convex/nextjs";
import * as z from "zod";

import { api } from "@/convex/_generated/api";

import { getToken } from "@/lib/auth-server";

import { postSchema } from "./schemas/blog";

export const createBlogAction = async (values: z.infer<typeof postSchema>) => {
  const parsed = postSchema.safeParse(values);

  if (!parsed.success) {
    throw new Error("Invalid data");
  }

  const token = await getToken();

  if (!token) {
    throw new Error("Unauthorized");
  }

  await fetchMutation(
    api.posts.createPost,
    { title: parsed.data.title, body: parsed.data.content },
    { token }
  );

  return redirect("/");
};

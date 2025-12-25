"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { fetchMutation } from "convex/nextjs";
import * as z from "zod";

import { api } from "@/convex/_generated/api";

import { getToken } from "@/lib/auth-server";

import { postSchema } from "./schemas/blog";

export const createBlogAction = async (values: z.infer<typeof postSchema>) => {
  try {
    const parsed = postSchema.safeParse(values);

    if (!parsed.success) {
      return {
        error: "Invalid data",
        details: parsed.error.flatten().fieldErrors,
      };
    }

    const token = await getToken();

    if (!token) {
      return {
        error: "Unauthorized",
      };
    }

    const imageUploadUrl = await fetchMutation(
      api.posts.generateImageUploadUrl,
      {},
      { token }
    );

    const uploadResult = await fetch(imageUploadUrl, {
      method: "POST",
      headers: {
        "Content-Type": parsed.data.image.type,
      },
      body: parsed.data.image,
    });

    if (!uploadResult.ok) {
      return {
        error: "Failed to upload image",
      };
    }

    const { storageId } = await uploadResult.json();

    await fetchMutation(
      api.posts.createPost,
      {
        title: parsed.data.title,
        body: parsed.data.content,
        imageStorageId: storageId,
      },
      { token }
    );
  } catch (error) {
    console.error(error);
    return {
      error: "Failed to create post",
    };
  }

  revalidatePath("/blog");

  return redirect("/blog");
};

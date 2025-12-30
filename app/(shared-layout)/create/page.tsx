/**
 * Create Post Page
 *
 * Client-side form for creating new blog posts with real-time validation.
 * Uses React Hook Form with Zod for type-safe validation and optimistic UI updates.
 *
 * @remarks
 * Form Architecture:
 * - react-hook-form: Form state management and validation
 * - zodResolver: Bridges Zod schema with React Hook Form
 * - Controller: Connects controlled inputs to form state
 * - useTransition: Manages server action pending state
 *
 * Validation Strategy:
 * - Client-side validation via Zod schema (instant feedback)
 * - Server-side validation in createBlogAction (security)
 * - Field-level error display (aria-invalid for accessibility)
 *
 * Why Client Component:
 * Requires useState (useForm, useTransition) and event handlers,
 * which can only run client-side. The server action handles
 * the actual mutation securely.
 */

"use client";

import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { createBlogAction } from "@/app/actions";
import { postSchema } from "@/app/schemas/blog";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

/**
 * Create post page component.
 *
 * @remarks
 * useTransition Hook:
 * - Marks server action as non-blocking transition
 * - Keeps UI responsive during submission
 * - Enables loading state (isPending) for button feedback
 *
 * React Hook Form Setup:
 * - zodResolver ensures form data matches postSchema before submission
 * - defaultValues prevent "uncontrolled to controlled" warnings
 * - undefined for image allows proper file input reset
 */
const CreatePage = () => {
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      image: undefined, // File inputs need explicit undefined default
    },
  });

  /**
   * Form submission handler.
   *
   * @param values - Validated form data matching postSchema
   *
   * @remarks
   * startTransition wraps the async server action to:
   * - Mark it as a non-urgent update (React 18 Transitions)
   * - Keep the UI interactive during submission
   * - Automatically set isPending state
   *
   * The server action handles:
   * - Re-validation (never trust client-side validation alone)
   * - Authentication check
   * - Image upload to Convex
   * - Database mutation
   * - Cache invalidation
   * - Redirect to blog listing
   */
  const onSubmit = async (values: z.infer<typeof postSchema>) => {
    startTransition(async () => {
      await createBlogAction(values);
    });
  };

  return (
    <div className="py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Create New Post
        </h1>
        <p className="pt-4 text-xl text-muted-foreground">
          Use this space to share your thoughts and ideas with the world.
        </p>
      </div>

      <Card className="mx-auto w-full max-w-xl">
        <CardHeader>
          <CardTitle>Create Blog Article</CardTitle>
          <CardDescription>Create a new blog article</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-y-4">
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Title</FieldLabel>
                    <Input
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your title"
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="content"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Content</FieldLabel>
                    <Textarea
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your blog content"
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="image"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Image</FieldLabel>
                    <Input
                      aria-invalid={fieldState.invalid}
                      placeholder="Upload your image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        field.onChange(file || null);
                      }}
                    />
                    <span className="text-muted-foreground text-xs">
                      Note: Size should be less than 1MB
                    </span>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <HugeiconsIcon
                      icon={Loading03Icon}
                      strokeWidth={2}
                      className="animate-spin size-4"
                    />
                    <span>Creating...</span>
                  </>
                ) : (
                  <span>Create Post</span>
                )}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePage;

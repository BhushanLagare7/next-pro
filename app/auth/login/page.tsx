/**
 * Login Page
 *
 * Client-side authentication form using Better Auth for email/password login.
 * Provides instant validation feedback and handles auth errors gracefully.
 *
 * @remarks
 * Authentication Flow:
 * 1. Client-side validation via Zod schema (instant feedback)
 * 2. Form submission triggers Better Auth client
 * 3. Better Auth handles password verification
 * 4. Success: Show toast, redirect to homepage
 * 5. Error: Show specific error message via toast
 *
 * Error Handling Strategy:
 * - Network errors: caught by fetchOptions.onError
 * - Validation errors: displayed inline via FieldError
 * - Auth errors: displayed as toast notifications (better UX than inline)
 * - Redirects happen only on successful authentication
 *
 * @see {@link https://better-auth.com} - Better Auth Documentation
 */

"use client";

import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { loginSchema } from "@/app/schemas/auth";

import { authClient } from "@/lib/auth-client";

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

/**
 * Login page component.
 *
 * @remarks
 * useRouter for programmatic navigation after successful login.
 * useTransition provides loading state during async auth operation.
 */
const LoginPage = () => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  /**
   * Handles login form submission.
   *
   * @param values - Validated email and password from form
   *
   * @remarks
   * Better Auth Pattern:
   * - authClient.signIn.email() handles password hashing and verification
   * - fetchOptions callbacks handle success/error states
   * - Cookies/session are automatically managed by Better Auth
   * - No manual token storage needed (handled by Better Auth internals)
   *
   * Toast notifications provide non-blocking feedback without
   * disrupting the UI flow or requiring modal dialogs.
   */
  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    startTransition(async () => {
      await authClient.signIn.email({
        email: values.email,
        password: values.password,
        fetchOptions: {
          // Success: notify user and redirect to homepage
          onSuccess: () => {
            toast.success("Logged in successfully");
            router.push("/");
          },
          // Error: show specific error message (e.g., "Invalid credentials")
          onError: (error) => {
            toast.error(error.error.message || "Failed to log in");
          },
        },
      });
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Login to get started right away</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-y-4">
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    aria-invalid={fieldState.invalid}
                    placeholder="john.doe@example.com"
                    type="email"
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Password</FieldLabel>
                  <Input
                    aria-invalid={fieldState.invalid}
                    placeholder="••••••••"
                    type="password"
                    {...field}
                  />
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
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Login</span>
              )}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginPage;

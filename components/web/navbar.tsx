/**
 * Navigation Bar Component
 *
 * Main navigation component with responsive design and auth-aware rendering.
 * Displays different actions based on user authentication state.
 *
 * @remarks
 * Authentication Flow:
 * - Unauthenticated: Shows Sign Up and Login buttons
 * - Authenticated: Shows Logout button
 * - Loading: Hides auth buttons to prevent flash of incorrect state
 *
 * Features:
 * - Brand logo with home link
 * - Navigation links (Home, Blog, Create)
 * - Search input (hidden on mobile)
 * - Theme toggle (dark/light mode)
 * - Auth actions (context-dependent)
 *
 * Uses Convex's useConvexAuth hook for real-time auth state sync.
 */

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useConvexAuth } from "convex/react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

import { Button, buttonVariants } from "../ui/button";

import { SearchInput } from "./search-input";
import { ThemeToggle } from "./theme-toggle";

/**
 * Navbar component with auth-aware actions.
 *
 * @remarks
 * Logout Flow:
 * Uses authClient.signOut() which:
 * 1. Invalidates the session cookie
 * 2. Triggers Convex auth state update
 * 3. Shows success/error toast
 * 4. Redirects to home on success
 */
export const Navbar = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();

  return (
    <nav className="flex justify-between items-center py-5 w-full">
      <div className="flex gap-8 items-center">
        <Link href="/">
          <h1 className="text-3xl font-bold">
            Next<span className="text-primary">Pro</span>
          </h1>
        </Link>

        <div className="flex gap-2 items-center">
          <Link href="/" className={buttonVariants({ variant: "ghost" })}>
            Home
          </Link>
          <Link href="/blog" className={buttonVariants({ variant: "ghost" })}>
            Blog
          </Link>
          <Link href="/create" className={buttonVariants({ variant: "ghost" })}>
            Create
          </Link>
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <div className="hidden mr-2 md:block">
          <SearchInput />
        </div>
        {/* Hide auth buttons while loading to prevent flash of incorrect state */}
        {isLoading ? null : isAuthenticated ? (
          <Button
            onClick={() =>
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    toast.success("Logged out successfully");
                    router.push("/");
                  },
                  onError: (error) => {
                    toast.error(error.error.message || "Failed to log out");
                  },
                },
              })
            }
          >
            Logout
          </Button>
        ) : (
          <>
            <Link href="/auth/sign-up" className={buttonVariants()}>
              Sign up
            </Link>
            <Link
              href="/auth/login"
              className={buttonVariants({ variant: "outline" })}
            >
              Login
            </Link>
          </>
        )}
        <ThemeToggle />
      </div>
    </nav>
  );
};

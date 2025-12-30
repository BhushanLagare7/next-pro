/**
 * Convex Client Provider
 *
 * Initializes and provides the Convex React client with Better Auth integration
 * to enable real-time database queries and authentication state across the app.
 *
 * @remarks
 * This must be a client component ("use client") because it manages client-side
 * WebSocket connections for real-time updates and handles auth tokens in the browser.
 *
 * The provider wraps the app content and:
 * - Establishes WebSocket connection to Convex backend
 * - Syncs authentication state between Better Auth and Convex
 * - Manages automatic token refresh for authenticated queries
 * - Enables optimistic updates and real-time subscriptions
 *
 * @see {@link https://docs.convex.dev/client/react} - Convex React Client Docs
 * @see {@link https://better-auth.com} - Better Auth Documentation
 */

"use client";

import { ReactNode } from "react";

import { ConvexReactClient } from "convex/react";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";

import { authClient } from "@/lib/auth-client";

/**
 * Convex client instance configured for authenticated queries.
 *
 * @remarks
 * expectAuth: true prevents queries from executing until authentication completes.
 * This avoids unnecessary failed requests and potential data leaks by ensuring
 * all queries wait for auth tokens. Trade-off: slightly delays initial data load
 * but improves security and reduces backend errors.
 */
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!, {
  expectAuth: true, // Wait for auth before executing queries
});

/**
 * Provider component that wraps the application with Convex + Better Auth context.
 *
 * @param children - React children to wrap with Convex context
 * @param initialToken - Optional auth token from server-side rendering (SSR)
 *                       Enables authenticated queries on first render without waiting
 *                       for client-side auth check. Improves perceived performance.
 *
 * @remarks
 * ConvexBetterAuthProvider automatically:
 * - Listens for auth state changes from authClient
 * - Injects auth tokens into Convex query headers
 * - Handles token refresh and expiration
 * - Re-executes queries when auth state changes
 */
export function ConvexClientProvider({
  children,
  initialToken,
}: {
  children: ReactNode;
  initialToken?: string | null;
}) {
  return (
    <ConvexBetterAuthProvider
      client={convex}
      authClient={authClient}
      initialToken={initialToken}
    >
      {children}
    </ConvexBetterAuthProvider>
  );
}

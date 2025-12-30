/**
 * Better Auth Server Utilities for Next.js + Convex
 *
 * Provides server-side authentication helpers for Next.js Server Components,
 * Server Actions, and API routes. Integrates Better Auth with Convex backend.
 *
 * @remarks
 * Exported Functions:
 * - handler: Route handler for /api/auth/[...all] (handles all auth endpoints)
 * - getToken: Get auth token from server context (for Convex authenticated queries)
 * - isAuthenticated: Check if current request is authenticated
 * - preloadAuthQuery: Start loading authenticated Convex query
 * - fetchAuthQuery: Execute authenticated Convex query
 * - fetchAuthMutation: Execute authenticated Convex mutation
 * - fetchAuthAction: Execute authenticated Convex action
 *
 * Environment Variables Required:
 * - NEXT_PUBLIC_CONVEX_URL: Public Convex deployment URL
 * - NEXT_PUBLIC_CONVEX_SITE_URL: Production site URL for auth callbacks
 *
 * @see {@link https://better-auth.com/docs/integrations/convex} - Convex + Better Auth
 * @see {@link https://docs.convex.dev/auth/better-auth} - Convex Better Auth Docs
 */

import { convexBetterAuthNextJs } from "@convex-dev/better-auth/nextjs";

/**
 * Server-side auth helpers for Next.js + Convex integration.
 *
 * @remarks
 * These utilities automatically:
 * - Extract auth tokens from cookies/headers
 * - Inject tokens into Convex client calls
 * - Handle auth errors and redirects
 * - Manage session verification
 */
export const {
  handler, // API route handler for auth endpoints
  preloadAuthQuery, // Preload authenticated query (for Suspense)
  isAuthenticated, // Check auth status
  getToken, // Extract auth token
  fetchAuthQuery, // Execute authenticated query
  fetchAuthMutation, // Execute authenticated mutation
  fetchAuthAction, // Execute authenticated action
} = convexBetterAuthNextJs({
  convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL!,
  convexSiteUrl: process.env.NEXT_PUBLIC_CONVEX_SITE_URL!,
});

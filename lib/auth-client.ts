/**
 * Better Auth Client Configuration
 *
 * Initializes the client-side authentication instance with Convex integration.
 * This runs in the browser and handles auth state, login/logout, and session management.
 * \
 * @remarks
 * Convex Plugin:
 * The convexClient() plugin synchronizes authentication state between Better Auth
 * and Convex, enabling auth-aware database queries without manual token management.
 *
 * Why Client-Side:
 * - Runs in browser for client components
 * - Manages session cookies automatically
 * - Handles OAuth redirects
 * - Provides hooks for auth state (useUser, useSession, etc.)
 *
 * Paired with auth-server.ts which handles server-side auth operations.
 *
 * @see {@link https://better-auth.com/docs/integrations/convex} - Convex + Better Auth
 */

import { createAuthClient } from "better-auth/react";
import { convexClient } from "@convex-dev/better-auth/client/plugins";

/**
 * Client-side auth instance used throughout client components and hooks.
 * Automatically syncs auth state with Convex for authenticated queries.
 */
export const authClient = createAuthClient({
  plugins: [convexClient()], // Sync auth state with Convex backend
});

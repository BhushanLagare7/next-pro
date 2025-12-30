/**
 * Better Auth API Route Handler
 *
 * Catch-all route ([...all]) that delegates all /api/auth/* requests to Better Auth.
 * Required for Better Auth to handle authentication endpoints like:
 * - /api/auth/signin
 * - /api/auth/signout
 * - /api/auth/session
 * - /api/auth/callback/*
 *
 * @remarks
 * The [...all] dynamic segment captures ALL sub-paths under /api/auth/.
 * Better Auth's handler exports GET and POST methods to handle different
 * authentication flows (OAuth callbacks use GET, email/password use POST).
 *
 * This pattern is required by Better Auth's architecture - do not modify
 * the route structure or method exports without consulting Better Auth docs.
 *
 * @see {@link https://better-auth.com/docs/installation} - Better Auth Setup
 */

import { handler } from "@/lib/auth-server";

// Export HTTP methods handled by Better Auth
export const { GET, POST } = handler;

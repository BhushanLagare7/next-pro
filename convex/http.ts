/**
 * Convex HTTP Router Configuration
 *
 * Configures HTTP endpoints for authentication via Better Auth.
 * This file defines the public HTTP API served by Convex.
 *
 * @remarks
 * Registered Routes:
 * The authComponent.registerRoutes() call adds all Better Auth endpoints:
 * - POST /auth/sign-up - Create new account
 * - POST /auth/sign-in - Login with email/password
 * - POST /auth/sign-out - Logout and invalidate session
 * - GET /auth/session - Get current session
 * - Various OAuth callback routes (if configured)
 *
 * These routes are accessible at your Convex deployment URL,
 * e.g., https://your-app.convex.site/auth/sign-in
 *
 * @see {@link https://docs.convex.dev/functions/http-actions} - Convex HTTP Docs
 */

import { httpRouter } from "convex/server";

import { authComponent, createAuth } from "./auth";

/** HTTP router instance for Convex's public HTTP API */
const http = httpRouter();

// Register all Better Auth routes (sign-up, sign-in, sign-out, session, etc.)
authComponent.registerRoutes(http, createAuth);

export default http;

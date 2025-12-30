/**
 * Better Auth Configuration for Convex
 *
 * Configures authentication with Better Auth integrated into Convex backend.
 * This file sets up the auth component client and auth factory function.
 *
 * @remarks
 * Architecture Overview:
 * - authComponent: Typed client for accessing auth tables and helpers
 * - createAuth: Factory function that creates Better Auth instance per request
 *
 * Why Factory Pattern:
 * Each Convex function call gets a fresh context (ctx). The createAuth factory
 * accepts this context and creates a properly configured auth instance that
 * can read/write to the database through that specific context.
 *
 * Environment Variables Required:
 * - SITE_URL: Production site URL for auth callbacks and redirects
 *
 * @see {@link https://better-auth.com} - Better Auth Documentation
 * @see {@link https://docs.convex.dev/auth/better-auth} - Convex Integration
 */

import { betterAuth } from "better-auth/minimal";
import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";

import { components } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import authConfig from "./auth.config";

const siteUrl = process.env.SITE_URL!;

/**
 * Typed auth component client for Convex + Better Auth integration.
 *
 * @remarks
 * Provides methods for:
 * - adapter(ctx): Creates database adapter for Better Auth
 * - getAuthUser(ctx): Get current authenticated user (throws if none)
 * - safeGetAuthUser(ctx): Get current user or null (safe version)
 * - getAnyUserById(ctx, id): Lookup any user by ID
 * - registerRoutes(http, createAuth): Register auth HTTP endpoints
 */
export const authComponent = createClient<DataModel>(components.betterAuth);

/**
 * Factory function that creates a configured Better Auth instance.
 *
 * @param ctx - Convex function context with database access
 * @returns Configured Better Auth instance for the current request
 *
 * @remarks
 * Called per-request because Convex contexts are ephemeral.
 * Each mutation/query gets its own context, so we create a new
 * auth instance bound to that specific context's database adapter.
 *
 * Email Verification:
 * Currently disabled for development simplicity. Enable
 * requireEmailVerification: true for production security.
 */
export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth({
    baseURL: siteUrl,
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false, // Enable for production
    },
    plugins: [
      convex({ authConfig }), // Required for Convex compatibility
    ],
  });
};

/**
 * Query to get the current authenticated user.
 *
 * @returns User object if authenticated, throws error if not
 *
 * @remarks
 * Use safeGetAuthUser for optional auth checks that shouldn't throw.
 * This version throws to enforce auth requirements in protected routes.
 */
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.getAuthUser(ctx);
  },
});

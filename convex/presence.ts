/**
 * Real-Time Presence System
 *
 * Tracks which users are currently viewing specific pages/posts.
 * Uses Convex presence component for efficient real-time user tracking.
 *
 * @remarks
 * How Presence Works:
 * 1. Client sends periodic heartbeats while viewing a page (room)
 * 2. Server tracks active sessions per room with timestamps
 * 3. Stale sessions (no recent heartbeat) are automatically pruned
 * 4. Real-time subscribers see live updates as users join/leave
 *
 * Room Concept:
 * Each page (e.g., blog post) is a "room" identified by its ID.
 * Users can be in multiple rooms (multiple browser tabs).
 *
 * Session vs User:
 * - userId: The authenticated user
 * - sessionId: Unique per browser tab (handles multiple tabs)
 *
 * @see {@link https://github.com/get-convex/presence} - Convex Presence Component
 */

import { ConvexError, v } from "convex/values";
import { Presence } from "@convex-dev/presence";

import { components } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

/**
 * Presence component instance for managing real-time user tracking.
 * Handles session storage, expiration, and cleanup automatically.
 */
export const presence = new Presence(components.presence);

/**
 * Updates user's presence in a room (page).
 *
 * @param args.roomId - Room identifier (usually post ID)
 * @param args.userId - Current user's ID
 * @param args.sessionId - Unique session ID (per browser tab)
 * @param args.interval - Heartbeat interval in milliseconds
 * @throws ConvexError if user ID doesn't match authenticated user
 *
 * @remarks
 * Called periodically by client (typically every 30 seconds).
 * Validates that userId matches the authenticated user to prevent
 * spoofing presence as another user.
 */
export const heartbeat = mutation({
  args: {
    roomId: v.string(),
    userId: v.string(),
    sessionId: v.string(),
    interval: v.number(),
  },
  handler: async (ctx, { roomId, userId, sessionId, interval }) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user || user._id !== userId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "User not authorized",
      });
    }

    return await presence.heartbeat(ctx, roomId, userId, sessionId, interval);
  },
});

/**
 * Lists all users currently present in a room.
 *
 * @param args.roomToken - Room identifier to list presence for
 * @returns Array of presence entries with user names attached
 *
 * @remarks
 * Enriches presence entries with user names by looking up each userId.
 * This allows displaying "Alice, Bob are viewing" without client-side lookups.
 * Falls back to raw entry if user lookup fails (deleted user, etc.).
 */
export const list = query({
  args: { roomToken: v.string() },
  handler: async (ctx, { roomToken }) => {
    const entries = await presence.list(ctx, roomToken);

    return Promise.all(
      entries.map(async (entry) => {
        const user = await authComponent.getAnyUserById(ctx, entry.userId);

        if (!user) {
          return entry;
        }

        return {
          ...entry,
          name: user.name,
        };
      })
    );
  },
});

/**
 * Disconnects a user session from presence tracking.
 *
 * @param args.sessionToken - Session identifier to disconnect
 *
 * @remarks
 * Called when user navigates away or closes the page.
 * Uses sendBeacon API on client for reliable delivery during page unload.
 *
 * No Authentication Check:
 * sendBeacon doesn't support cookies/auth headers, so we can't verify
 * the user here. Session tokens are random and unpredictable, providing
 * reasonable security (can't disconnect others without their token).
 */
export const disconnect = mutation({
  args: { sessionToken: v.string() },
  handler: async (ctx, { sessionToken }) => {
    return await presence.disconnect(ctx, sessionToken);
  },
});

/**
 * Gets the current authenticated user's ID.
 *
 * @returns User ID if authenticated, null otherwise
 *
 * @remarks
 * Utility query for client-side presence initialization.
 * Client needs userId to start heartbeat but may not have it cached.
 */
export const getUserId = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      return null;
    }

    return user._id;
  },
});

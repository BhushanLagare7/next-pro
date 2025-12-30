/**
 * Post Presence Component
 *
 * Displays real-time viewer presence for a blog post using Convex presence.
 * Shows avatars of users currently viewing the same post.
 *
 * @remarks
 * Presence System:
 * - usePresence hook handles heartbeats, cleanup, and subscriptions
 * - FacePile renders avatar stack for all present users
 * - Component hides itself when no other viewers are present
 *
 * Real-Time Updates:
 * Presence state updates automatically as users:
 * - Join (navigate to post page)
 * - Leave (navigate away or close tab)
 * - Disconnect (network issues or tab close via sendBeacon)
 *
 * @see {@link presence} - Backend presence implementation
 */

"use client";

import FacePile from "@convex-dev/presence/facepile";
import usePresence from "@convex-dev/presence/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

/**
 * Props for the post presence component.
 *
 * @param roomId - Post ID to track presence for (acts as "room" identifier)
 * @param userId - Current authenticated user's ID
 */
interface PostPresenceProps {
  roomId: Id<"posts">;
  userId: string;
}

/**
 * Displays avatars of users currently viewing this post.
 *
 * @param roomId - Post ID acting as presence room
 * @param userId - Current user's ID for identifying self in presence
 *
 * @remarks
 * Returns null when:
 * - Presence data not yet loaded
 * - No other users viewing (to avoid showing empty state)
 */
export const PostPresence = ({ roomId, userId }: PostPresenceProps) => {
  const presenceState = usePresence(api.presence, roomId, userId);

  // Don't render if no presence data or no one else viewing
  if (!presenceState || presenceState.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-2 items-center">
      <p className="text-xs tracking-wide uppercase text-muted-foreground">
        Viewing now
      </p>
      <div className="text-primary">
        <FacePile presenceState={presenceState} />
      </div>
    </div>
  );
};

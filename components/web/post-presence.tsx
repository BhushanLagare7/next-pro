"use client";

import FacePile from "@convex-dev/presence/facepile";
import usePresence from "@convex-dev/presence/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface PostPresenceProps {
  roomId: Id<"posts">;
  userId: string;
}

export const PostPresence = ({ roomId, userId }: PostPresenceProps) => {
  const presenceState = usePresence(api.presence, roomId, userId);

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

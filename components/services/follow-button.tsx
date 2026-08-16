"use client";

import { Loader2, UserCheck, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFollowStatus } from "@/hooks/use-business-follows";

export function FollowButton({ providerId }: { providerId: string }) {
  const { isFollowing, loading, toggle } = useFollowStatus(providerId);

  return (
    <Button
      variant={isFollowing ? "secondary" : "default"}
      size="sm"
      onClick={toggle}
      disabled={loading}
      className="shrink-0"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isFollowing ? (
        <>
          <UserCheck className="h-4 w-4" /> Connected
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4" /> Connect
        </>
      )}
    </Button>
  );
}

"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import type { FollowedProvider } from "@/lib/types/database.types";
import type { LatLng } from "@/components/providers/location-provider";

export function useBusinessFollows(center: LatLng) {
  const [followed, setFollowed] = React.useState<FollowedProvider[]>([]);
  const [loading, setLoading] = React.useState(true);

  const refresh = React.useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase.rpc("followed_providers", {
      lat: center.lat,
      lng: center.lng,
    });
    setFollowed(data ?? []);
    setLoading(false);
  }, [center.lat, center.lng]);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  return { followed, loading, refresh };
}

export function useFollowStatus(providerId: string) {
  const [isFollowing, setIsFollowing] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        setLoading(false);
        return;
      }
      supabase
        .from("business_follows")
        .select("provider_id")
        .eq("follower_id", user.id)
        .eq("provider_id", providerId)
        .maybeSingle()
        .then(({ data }) => {
          setIsFollowing(!!data);
          setLoading(false);
        });
    });
  }, [providerId]);

  async function toggle() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    if (isFollowing) {
      const { error } = await supabase
        .from("business_follows")
        .delete()
        .eq("follower_id", user.id)
        .eq("provider_id", providerId);
      if (!error) setIsFollowing(false);
    } else {
      const { error } = await supabase
        .from("business_follows")
        .insert({ follower_id: user.id, provider_id: providerId });
      if (!error) setIsFollowing(true);
    }
  }

  return { isFollowing, loading, toggle };
}

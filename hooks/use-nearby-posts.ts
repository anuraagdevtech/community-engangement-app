"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import type { NearbyPost, Channel } from "@/lib/types/database.types";
import type { LatLng } from "@/components/providers/location-provider";

export function useNearbyPosts(center: LatLng, radiusM: number, channel: Channel | "all") {
  const [posts, setPosts] = React.useState<NearbyPost[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const refresh = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data, error: rpcError } = await supabase.rpc("nearby_posts", {
      lat: center.lat,
      lng: center.lng,
      radius_m: radiusM,
      channel_filter: channel === "all" ? null : channel,
    });
    if (rpcError) setError(rpcError.message);
    else setPosts(data ?? []);
    setLoading(false);
  }, [center.lat, center.lng, radiusM, channel]);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  return { posts, loading, error, refresh };
}

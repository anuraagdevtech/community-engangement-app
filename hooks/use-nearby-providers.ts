"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import type { NearbyProvider, ServiceCategory } from "@/lib/types/database.types";
import type { LatLng } from "@/components/providers/location-provider";

export function useNearbyProviders(center: LatLng, radiusM: number, category: ServiceCategory | "all") {
  const [providers, setProviders] = React.useState<NearbyProvider[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const refresh = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data, error: rpcError } = await supabase.rpc("nearby_providers", {
      lat: center.lat,
      lng: center.lng,
      radius_m: radiusM,
      category_filter: category === "all" ? null : category,
    });
    if (rpcError) setError(rpcError.message);
    else setProviders(data ?? []);
    setLoading(false);
  }, [center.lat, center.lng, radiusM, category]);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  return { providers, loading, error, refresh };
}

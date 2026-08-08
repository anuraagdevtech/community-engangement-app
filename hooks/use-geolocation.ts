"use client";

import { useCallback, useState } from "react";

interface GeoState {
  coords: { lat: number; lng: number } | null;
  loading: boolean;
  error: string | null;
}

/** Wraps the browser Geolocation API — free, no key required. */
export function useGeolocation() {
  const [state, setState] = useState<GeoState>({ coords: null, loading: false, error: null });

  const request = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setState({ coords: null, loading: false, error: "Geolocation isn't supported on this device." });
      return;
    }
    setState((s) => ({ ...s, loading: true, error: null }));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          coords: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          loading: false,
          error: null,
        });
      },
      (err) => {
        setState({ coords: null, loading: false, error: err.message || "Couldn't get your location." });
      },
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  }, []);

  return { ...state, request };
}

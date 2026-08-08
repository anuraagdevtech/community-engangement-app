"use client";

import * as React from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import { GOOGLE_MAPS_API_KEY, hasGoogleMapsKey } from "@/lib/google-maps";

/**
 * Wraps the app in Google Maps' script loader. If no API key is configured
 * (e.g. a fresh clone that hasn't set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY yet),
 * children still render — individual map components fall back to a friendly
 * empty state instead of crashing the page.
 */
export function GoogleMapsProvider({ children }: { children: React.ReactNode }) {
  if (!hasGoogleMapsKey) return <>{children}</>;
  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY} libraries={["places", "geocoding"]}>
      {children}
    </APIProvider>
  );
}

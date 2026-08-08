"use client";

import * as React from "react";
import { DEFAULT_CENTER } from "@/lib/google-maps";

export interface LatLng {
  lat: number;
  lng: number;
}

interface LocationContextValue {
  center: LatLng;
  radiusM: number;
  label: string;
  setCenter: (center: LatLng, label?: string) => void;
  setRadiusM: (radius: number) => void;
}

const LocationContext = React.createContext<LocationContextValue | null>(null);

const STORAGE_KEY = "mohalla:location";

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [center, setCenterState] = React.useState<LatLng>(DEFAULT_CENTER);
  const [radiusM, setRadiusMState] = React.useState<number>(1000);
  const [label, setLabel] = React.useState("Central Bengaluru (default)");

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { center: LatLng; radiusM: number; label: string };
        setCenterState(parsed.center);
        setRadiusMState(parsed.radiusM);
        setLabel(parsed.label);
      }
    } catch {
      // ignore malformed/blocked storage
    }
  }, []);

  const persist = React.useCallback((next: { center: LatLng; radiusM: number; label: string }) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore storage errors (private browsing, quota, etc.)
    }
  }, []);

  const setCenter = React.useCallback(
    (next: LatLng, nextLabel?: string) => {
      setCenterState(next);
      if (nextLabel) setLabel(nextLabel);
      persist({ center: next, radiusM, label: nextLabel ?? label });
    },
    [radiusM, label, persist],
  );

  const setRadiusM = React.useCallback(
    (radius: number) => {
      setRadiusMState(radius);
      persist({ center, radiusM: radius, label });
    },
    [center, label, persist],
  );

  return (
    <LocationContext.Provider value={{ center, radiusM, label, setCenter, setRadiusM }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useActiveLocation() {
  const ctx = React.useContext(LocationContext);
  if (!ctx) throw new Error("useActiveLocation must be used within a LocationProvider");
  return ctx;
}

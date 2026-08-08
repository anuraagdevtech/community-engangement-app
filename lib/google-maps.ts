export const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
export const hasGoogleMapsKey = GOOGLE_MAPS_API_KEY.length > 0;

/** Central Bengaluru — used only as a friendly default before a user grants location or sets a home address. */
export const DEFAULT_CENTER = { lat: 12.9716, lng: 77.5946 };

export const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID ?? undefined;

export const RADIUS_OPTIONS = [
  { label: "500m", value: 500 },
  { label: "1km", value: 1000 },
  { label: "3km", value: 3000 },
  { label: "5km", value: 5000 },
] as const;

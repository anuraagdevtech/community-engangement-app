import type { LatLng } from "@/components/providers/location-provider";

/** PostGIS/PostgREST accepts WKT text for geography columns on insert. */
export function toWKTPoint({ lat, lng }: LatLng): string {
  return `POINT(${lng} ${lat})`;
}

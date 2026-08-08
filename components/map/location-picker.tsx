"use client";

import * as React from "react";
import { Map, AdvancedMarker, Pin, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { Crosshair, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NoMapKey } from "@/components/map/no-map-key";
import { useGeolocation } from "@/hooks/use-geolocation";
import { hasGoogleMapsKey, MAP_ID } from "@/lib/google-maps";
import type { LatLng } from "@/components/providers/location-provider";

interface LocationPickerProps {
  value: LatLng;
  onChange: (value: LatLng, address?: string) => void;
  className?: string;
}

function PlacesSearch({ onSelect }: { onSelect: (loc: LatLng, address: string) => void }) {
  const places = useMapsLibrary("places");
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!places || !inputRef.current) return;
    const autocomplete = new places.Autocomplete(inputRef.current, {
      fields: ["geometry", "formatted_address"],
      componentRestrictions: { country: "in" },
    });
    const listener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      const loc = place.geometry?.location;
      if (loc) onSelect({ lat: loc.lat(), lng: loc.lng() }, place.formatted_address ?? "");
    });
    return () => listener.remove();
  }, [places, onSelect]);

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input ref={inputRef} placeholder="Search your street, society, or landmark" className="pl-9" />
    </div>
  );
}

function ClickToPlace({ onPlace }: { onPlace: (loc: LatLng) => void }) {
  const map = useMap();
  React.useEffect(() => {
    if (!map) return;
    const listener = map.addListener("click", (e: google.maps.MapMouseEvent) => {
      if (e.latLng) onPlace({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    });
    return () => listener.remove();
  }, [map, onPlace]);
  return null;
}

export function LocationPicker({ value, onChange, className }: LocationPickerProps) {
  const geocoding = useMapsLibrary("geocoding");
  const geocoderRef = React.useRef<google.maps.Geocoder | null>(null);
  const { coords, loading, request } = useGeolocation();
  const [address, setAddress] = React.useState<string>("");

  React.useEffect(() => {
    if (geocoding && !geocoderRef.current) geocoderRef.current = new geocoding.Geocoder();
  }, [geocoding]);

  const reverseGeocode = React.useCallback((loc: LatLng) => {
    geocoderRef.current?.geocode({ location: loc }, (results, status) => {
      if (status === "OK" && results?.[0]) setAddress(results[0].formatted_address);
    });
  }, []);

  const handlePlace = React.useCallback(
    (loc: LatLng, presetAddress?: string) => {
      onChange(loc, presetAddress);
      if (presetAddress) setAddress(presetAddress);
      else reverseGeocode(loc);
    },
    [onChange, reverseGeocode],
  );

  React.useEffect(() => {
    if (coords) handlePlace(coords);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords]);

  if (!hasGoogleMapsKey) return <NoMapKey className={className} />;

  return (
    <div className={className}>
      <div className="mb-3 flex flex-col gap-2 sm:flex-row">
        <div className="flex-1">
          <PlacesSearch onSelect={handlePlace} />
        </div>
        <Button type="button" variant="outline" onClick={request} disabled={loading} className="shrink-0">
          <Crosshair className="h-4 w-4" />
          {loading ? "Locating…" : "Use my location"}
        </Button>
      </div>
      <div className="h-64 w-full overflow-hidden rounded-2xl border border-border">
        <Map
          mapId={MAP_ID}
          defaultCenter={value}
          center={value}
          defaultZoom={15}
          gestureHandling="greedy"
          disableDefaultUI
          zoomControl
          className="h-full w-full"
        >
          <AdvancedMarker position={value}>
            <Pin background="#c65a24" borderColor="#8f3f16" glyphColor="#fff8f0" />
          </AdvancedMarker>
          <ClickToPlace onPlace={handlePlace} />
        </Map>
      </div>
      {address && <p className="mt-2 text-sm text-muted-foreground">📍 {address}</p>}
      <p className="mt-1 text-xs text-muted-foreground">Tap anywhere on the map to fine-tune the pin.</p>
    </div>
  );
}

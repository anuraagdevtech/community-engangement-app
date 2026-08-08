"use client";

import * as React from "react";
import { Map, AdvancedMarker, Pin, InfoWindow } from "@vis.gl/react-google-maps";
import { NoMapKey } from "@/components/map/no-map-key";
import { RadiusCircle } from "@/components/map/radius-circle";
import { hasGoogleMapsKey, MAP_ID } from "@/lib/google-maps";
import type { LatLng } from "@/components/providers/location-provider";

export interface MapMarkerItem {
  id: string;
  position: LatLng;
  color: string;
  title: string;
}

interface EntityMapProps {
  center: LatLng;
  radiusM: number;
  markers: MapMarkerItem[];
  renderInfo: (item: MapMarkerItem) => React.ReactNode;
  className?: string;
}

export function EntityMap({ center, radiusM, markers, renderInfo, className }: EntityMapProps) {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const active = markers.find((m) => m.id === activeId) ?? null;

  if (!hasGoogleMapsKey) return <NoMapKey className={className} />;

  return (
    <div className={className}>
      <Map
        mapId={MAP_ID}
        defaultCenter={center}
        defaultZoom={14}
        gestureHandling="greedy"
        disableDefaultUI
        zoomControl
        className="h-full w-full"
      >
        <RadiusCircle center={center} radiusM={radiusM} />
        <AdvancedMarker position={center}>
          <Pin background="#2c6e63" borderColor="#193f38" glyphColor="#f0faf7" scale={0.9} />
        </AdvancedMarker>
        {markers.map((m) => (
          <AdvancedMarker key={m.id} position={m.position} onClick={() => setActiveId(m.id)}>
            <Pin background={m.color} borderColor="#1a211c" glyphColor="#fff" />
          </AdvancedMarker>
        ))}
        {active && (
          <InfoWindow position={active.position} onCloseClick={() => setActiveId(null)} maxWidth={260}>
            {renderInfo(active)}
          </InfoWindow>
        )}
      </Map>
    </div>
  );
}

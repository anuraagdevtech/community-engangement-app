"use client";

import * as React from "react";
import { useMap } from "@vis.gl/react-google-maps";

interface RadiusCircleProps {
  center: { lat: number; lng: number };
  radiusM: number;
}

/** Draws (and keeps in sync) a translucent circle showing the active search radius. */
export function RadiusCircle({ center, radiusM }: RadiusCircleProps) {
  const map = useMap();
  const circleRef = React.useRef<google.maps.Circle | null>(null);

  React.useEffect(() => {
    if (!map) return;
    if (!circleRef.current) {
      circleRef.current = new google.maps.Circle({
        strokeColor: "#c65a24",
        strokeOpacity: 0.6,
        strokeWeight: 1.5,
        fillColor: "#c65a24",
        fillOpacity: 0.08,
        clickable: false,
      });
    }
    circleRef.current.setMap(map);
    return () => circleRef.current?.setMap(null);
  }, [map]);

  React.useEffect(() => {
    circleRef.current?.setOptions({ center, radius: radiusM });
  }, [center, radiusM]);

  React.useEffect(() => {
    if (map && circleRef.current) {
      map.fitBounds(circleRef.current.getBounds()!, 48);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, radiusM, center.lat, center.lng]);

  return null;
}

"use client";

import { useEffect, useRef } from "react";
import { useMap, useMapEvents } from "react-leaflet";

type BoundsPayload = {
  minLat: number;
  minLng: number;
  maxLat: number;
  maxLng: number;
};

type BoundsListenerProps = {
  onBoundsChange: (bounds: BoundsPayload) => void | Promise<void>;
};

function serializeBounds(map: ReturnType<typeof useMap>) {
  const bounds = map.getBounds();

  return {
    minLat: bounds.getSouth(),
    minLng: bounds.getWest(),
    maxLat: bounds.getNorth(),
    maxLng: bounds.getEast(),
  };
}

export function BoundsListener({ onBoundsChange }: BoundsListenerProps) {
  const callbackRef = useRef(onBoundsChange);
  const timerRef = useRef<number | null>(null);
  const lastBoundsRef = useRef("");
  const map = useMapEvents({
    moveend: () => {
      scheduleBoundsChange();
    },
    zoomend: () => {
      scheduleBoundsChange();
    },
  });

  function scheduleBoundsChange() {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      const bounds = serializeBounds(map);
      const serialized = [
        bounds.minLat.toFixed(5),
        bounds.minLng.toFixed(5),
        bounds.maxLat.toFixed(5),
        bounds.maxLng.toFixed(5),
      ].join(":");

      if (serialized === lastBoundsRef.current) {
        return;
      }

      lastBoundsRef.current = serialized;
      void callbackRef.current(bounds);
    }, 180);
  }

  useEffect(() => {
    callbackRef.current = onBoundsChange;
  }, [onBoundsChange]);

  useEffect(() => {
    void callbackRef.current(serializeBounds(map));
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [map]);

  return null;
}

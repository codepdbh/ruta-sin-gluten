'use client';

import { useEffect, useRef } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';

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
  const map = useMapEvents({
    moveend: () => {
      void callbackRef.current(serializeBounds(map));
    },
    zoomend: () => {
      void callbackRef.current(serializeBounds(map));
    },
  });

  useEffect(() => {
    callbackRef.current = onBoundsChange;
  }, [onBoundsChange]);

  useEffect(() => {
    void callbackRef.current(serializeBounds(map));
  }, [map]);

  return null;
}

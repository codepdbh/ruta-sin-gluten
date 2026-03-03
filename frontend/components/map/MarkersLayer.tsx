'use client';

import { CircleMarker, Popup } from 'react-leaflet';
import type { PlaceSummary } from '@/lib/types';

type MarkersLayerProps = {
  places: PlaceSummary[];
};

export function MarkersLayer({ places }: MarkersLayerProps) {
  return (
    <>
      {places.map((place) => {
        if (!place.location) {
          return null;
        }

        return (
          <CircleMarker
            key={place.id}
            center={[place.location.lat, place.location.lng]}
            radius={9}
            pathOptions={{
              color: '#ffd4a8',
              fillColor: '#ff8a1c',
              fillOpacity: 0.92,
              weight: 2.5,
            }}
          >
            <Popup>
              <strong>{place.businessName}</strong>
              <br />
              {place.businessType} · {place.city}
              <br />
              {place.location.addressText}
              <br />
              {place.hasShipping ? 'Hace envios' : 'Sin envios'}
            </Popup>
          </CircleMarker>
        );
      })}
    </>
  );
}

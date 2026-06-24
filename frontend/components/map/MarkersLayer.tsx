'use client';

import { memo } from 'react';
import { Marker } from 'react-leaflet';
import { DomEvent, divIcon, type DivIcon, type LeafletMouseEvent } from 'leaflet';
import type { PlaceSummary } from '@/lib/types';

type MarkersLayerProps = {
  places: PlaceSummary[];
  activePlaceId: string | null;
  onSelect: (placeId: string) => void;
};

function getMarkerKind(businessType: string) {
  if (businessType === 'RESTAURANTE') {
    return 'restaurant';
  }

  if (businessType === 'CAFETERIA') {
    return 'cafe';
  }

  if (businessType === 'PANADERIA') {
    return 'bakery';
  }

  return 'store';
}

function getMarkerSvg(kind: string) {
  if (kind === 'restaurant') {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="5.2"/><path d="M4.8 4v7"/><path d="M3 4v4.5a2 2 0 0 0 3.8 0V4"/><path d="M19 4v16"/><path d="M19 4c2 1.5 2.7 4.2 1.2 6.7H19"/></svg>';
  }

  if (kind === 'cafe') {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8h9.5v5a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V8Z"/><path d="M15.5 9.2H18a2.4 2.4 0 0 1 0 4.8h-2.5"/><path d="M7 20h10"/><path d="M9 5.2c-.7-.8-.2-1.5.5-2.2"/><path d="M13 5.2c-.7-.8-.2-1.5.5-2.2"/></svg>';
  }

  if (kind === 'bakery') {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 13.2c0-4.1 3.8-7 8-7s8 2.9 8 7v2.6a3.2 3.2 0 0 1-3.2 3.2H7.2A3.2 3.2 0 0 1 4 15.8v-2.6Z"/><path d="M8 9.4c1 1.2 1 3.2 0 4.7"/><path d="M12 8.5c1.2 1.4 1.2 4.2 0 5.8"/><path d="M16 9.4c1 1.2 1 3.2 0 4.7"/></svg>';
  }

  return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10h16"/><path d="M5 10l1.2-5h11.6L19 10"/><path d="M6 10v9h12v-9"/><path d="M9 19v-5h6v5"/><path d="M8 5h8"/><path d="M4.8 10c.8 1.2 2.4 1.2 3.2 0 .8 1.2 2.4 1.2 3.2 0 .8 1.2 2.4 1.2 3.2 0 .8 1.2 2.4 1.2 3.2 0"/></svg>';
}

function buildMarkerIcon(place: PlaceSummary, active: boolean) {
  const kind = getMarkerKind(place.businessType);

  return divIcon({
    className: 'map-place-marker__host',
    iconSize: [54, 62],
    iconAnchor: [27, 57],
    html: `
      <span class="map-place-marker map-place-marker--${kind} ${active ? 'is-active' : ''}">
        <span class="map-place-marker__pulse"></span>
        <span class="map-place-marker__body">
          <span class="map-place-marker__icon">${getMarkerSvg(kind)}</span>
        </span>
      </span>
    `,
  });
}

const iconCache = new Map<string, DivIcon>();

function getMarkerIcon(place: PlaceSummary, active: boolean) {
  const kind = getMarkerKind(place.businessType);
  const key = `${kind}:${active ? 'active' : 'idle'}`;
  const cachedIcon = iconCache.get(key);

  if (cachedIcon) {
    return cachedIcon;
  }

  const nextIcon = buildMarkerIcon(place, active);
  iconCache.set(key, nextIcon);
  return nextIcon;
}

export const MarkersLayer = memo(function MarkersLayer({
  places,
  activePlaceId,
  onSelect,
}: MarkersLayerProps) {
  return (
    <>
      {places.map((place) => {
        if (!place.location) {
          return null;
        }

        const isActive = place.id === activePlaceId;
        const markerIcon = getMarkerIcon(place, isActive);
        const handleSelect = (event: LeafletMouseEvent) => {
          DomEvent.stopPropagation(event.originalEvent);

          onSelect(place.id);
        };

        return (
          <Marker
            key={place.id}
            position={[place.location.lat, place.location.lng]}
            icon={markerIcon}
            bubblingMouseEvents={false}
            title={place.businessName}
            alt={place.businessName}
            zIndexOffset={isActive ? 1000 : 0}
            eventHandlers={{
              click: handleSelect,
            }}
          />
        );
      })}
    </>
  );
});

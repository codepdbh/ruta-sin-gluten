'use client';

import { useEffect } from 'react';
import { divIcon, Marker as LeafletMarker, type LeafletEvent } from 'leaflet';
import { CircleMarker, MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';

type PickerValue = {
  lat?: number;
  lng?: number;
};

type DeliveryPointValue = PickerValue & {
  id: string;
  name: string;
};

type LocationPickerProps = {
  value: PickerValue;
  onChange: (next: PickerValue) => void;
  deliveryPoints?: DeliveryPointValue[];
  heightClassName?: string;
};

const DEFAULT_CENTER: [number, number] = [-16.500113, -68.131226];
const SELECTED_PIN_ICON = divIcon({
  className: 'location-picker-pin__host',
  iconSize: [46, 56],
  iconAnchor: [23, 52],
  html: `
    <span class="location-picker-pin">
      <span class="location-picker-pin__dot"></span>
    </span>
  `,
});

function ClickListener({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(event) {
      onSelect(event.latlng.lat, event.latlng.lng);
    },
  });

  return null;
}

function Recenter({ value }: { value: PickerValue }) {
  const map = useMapEvents({});

  useEffect(() => {
    if (typeof value.lat === 'number' && typeof value.lng === 'number') {
      map.setView([value.lat, value.lng], Math.max(map.getZoom(), 15));
    }
  }, [map, value.lat, value.lng]);

  return null;
}

export function LocationPicker({
  value,
  onChange,
  deliveryPoints = [],
  heightClassName = 'location-picker',
}: LocationPickerProps) {
  const center =
    typeof value.lat === 'number' && typeof value.lng === 'number'
      ? ([value.lat, value.lng] as [number, number])
      : DEFAULT_CENTER;

  return (
    <div className={heightClassName}>
      <MapContainer center={center} zoom={13} scrollWheelZoom className="location-picker__map">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickListener onSelect={(lat, lng) => onChange({ lat, lng })} />
        <Recenter value={value} />
        {typeof value.lat === 'number' && typeof value.lng === 'number' ? (
          <Marker
            position={[value.lat, value.lng]}
            icon={SELECTED_PIN_ICON}
            draggable
            eventHandlers={{
              dragend(event: LeafletEvent) {
                const marker = event.target as LeafletMarker;
                const nextPosition = marker.getLatLng();
                onChange({ lat: nextPosition.lat, lng: nextPosition.lng });
              },
            }}
          />
        ) : null}
        {deliveryPoints.map((point) =>
          typeof point.lat === 'number' && typeof point.lng === 'number' ? (
            <CircleMarker
              key={point.id}
              center={[point.lat, point.lng]}
              radius={7}
              pathOptions={{
                color: '#fff3e2',
                fillColor: '#ef7c1a',
                fillOpacity: 0.9,
                weight: 2,
              }}
            />
          ) : null,
        )}
      </MapContainer>
      <p className="muted location-picker__hint">
        Haz click en el mapa para fijar el pin exacto. Tambien puedes arrastrarlo para ajustar la ubicacion.
      </p>
    </div>
  );
}

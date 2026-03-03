'use client';

import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => <div className="map-loading">Cargando mapa interactivo...</div>,
});

export function ClientMapShell() {
  return <MapView />;
}

'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getPlacesInBounds } from '@/lib/api/services/places';
import type { PlaceSummary } from '@/lib/types';

export default function PlacesPage() {
  const [places, setPlaces] = useState<PlaceSummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void getPlacesInBounds({
      minLat: -17.1,
      minLng: -68.8,
      maxLat: -16,
      maxLng: -67.7,
      verified: true,
    })
      .then(setPlaces)
      .catch((currentError) => {
        setError(currentError instanceof Error ? currentError.message : 'No se pudo cargar lugares.');
      });
  }, []);

  return (
    <section className="page-card">
      <p className="eyebrow">Directorio</p>
      <h1>Lugares aprobados</h1>
      <p className="muted">Listado rapido para escritorio y mobile.</p>
      {error ? <p className="status-pill">{error}</p> : null}
      <div className="data-list">
        {places.map((place) => (
          <article key={place.id} className="result-card">
            <h2>{place.businessName}</h2>
            <p>
              {place.businessType} · {place.city}
            </p>
            <p>{place.location?.addressText ?? 'Sin coordenadas publicas'}</p>
            <Link href={`/places/${place.id}`}>Abrir detalle</Link>
          </article>
        ))}
      </div>
    </section>
  );
}

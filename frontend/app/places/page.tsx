"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { buildAssetUrl } from "@/lib/api/client";
import { MediaWithFallback } from "@/components/ui/MediaWithFallback";
import { getPlacesInBounds } from "@/lib/api/services/places";
import type { PlaceSummary } from "@/lib/types";

export default function PlacesPage() {
  const [places, setPlaces] = useState<PlaceSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    void getPlacesInBounds({
      minLat: -17.1,
      minLng: -68.8,
      maxLat: -16,
      maxLng: -67.7,
      verified: true,
    })
      .then((response) => {
        if (active) {
          setPlaces(response);
        }
      })
      .catch((currentError) => {
        if (active) {
          setError(
            currentError instanceof Error
              ? currentError.message
              : "No se pudo cargar lugares.",
          );
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="page-card directory-page">
      <div className="directory-page__header">
        <div>
          <p className="eyebrow">Directorio</p>
          <h1>Lugares aprobados</h1>
          <p className="muted">
            Comercios y puntos visibles para explorar desde mapa o lista.
          </p>
        </div>
        <Link className="inline-link" href="/">
          Ver mapa
        </Link>
      </div>
      {error ? <p className="status-pill">{error}</p> : null}
      {isLoading ? <p className="empty-state">Cargando lugares...</p> : null}
      {!isLoading && !error && places.length === 0 ? (
        <p className="empty-state">Todavia no hay lugares visibles.</p>
      ) : null}
      <div className="data-list directory-grid">
        {places.map((place) => (
          <article key={place.id} className="result-card place-card">
            <div className="place-card__copy">
              <span className="task-card__meta">{place.businessType}</span>
              <h2>{place.businessName}</h2>
              <p>{place.city}</p>
              <p>
                {place.ratingCount
                  ? `★ ${place.ratingAverage.toFixed(1)} · ${place.ratingCount} puntuaciones`
                  : "Sin puntuaciones todavia"}
              </p>
              <p>{place.location?.addressText ?? "Sin coordenadas publicas"}</p>
              <Link className="inline-link" href={`/places/${place.id}`}>
                Abrir detalle
              </Link>
            </div>
            <MediaWithFallback
              className="place-card__logo"
              src={place.logoUrl ? buildAssetUrl(place.logoUrl) : undefined}
              alt={place.businessName}
            />
          </article>
        ))}
      </div>
    </section>
  );
}

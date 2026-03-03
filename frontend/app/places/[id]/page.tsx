'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getPlace } from '@/lib/api/services/places';
import type { PlaceDetail } from '@/lib/types';

export default function PlaceDetailPage() {
  const params = useParams<{ id: string }>();
  const [place, setPlace] = useState<PlaceDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.id) {
      return;
    }

    void getPlace(params.id)
      .then(setPlace)
      .catch((currentError) => {
        setError(currentError instanceof Error ? currentError.message : 'No se pudo cargar el comercio.');
      });
  }, [params.id]);

  if (error) {
    return <section className="page-card"><p className="status-pill">{error}</p></section>;
  }

  if (!place) {
    return <section className="empty-state">Cargando detalle del comercio...</section>;
  }

  return (
    <section className="page-card">
      <p className="eyebrow">Detalle del lugar</p>
      <h1>{place.businessName}</h1>
      <p className="muted">{place.description}</p>
      <div className="pill-row">
        <span className="pill">{place.businessType}</span>
        <span className="pill">{place.modality ?? 'Sin modalidad informada'}</span>
        <span className="pill">{place.hasShipping ? 'Hace envios' : 'Retiro / entrega'}</span>
      </div>
      <div className="split-layout">
        <article className="panel-card">
          <h2>Ubicacion y contacto</h2>
          <p>{place.location?.addressText ?? 'Sin ubicacion principal publica'}</p>
          <p>{place.location?.reference ?? 'Sin referencia adicional'}</p>
          <p>WhatsApp: {place.whatsapp}</p>
          <p>
            {place.city}, {place.department}
          </p>
        </article>
        <article className="panel-card">
          <h2>Envios y entregas</h2>
          <p>{place.shippingAreas.length ? 'Tiene cobertura configurada.' : 'Sin cobertura cargada.'}</p>
          <p>{place.deliveryPoints.length} puntos de entrega registrados.</p>
          <Link href="/products" className="inline-link">
            Ver productos
          </Link>
        </article>
      </div>
      <div className="data-list">
        {place.products.map((product) => (
          <article key={product.id} className="result-card">
            <h2>{product.name}</h2>
            <p>
              {product.category} · Bs {product.price}
            </p>
            <p>
              Stock: {product.stockQty} {product.stockUnit}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

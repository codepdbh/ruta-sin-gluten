'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getProductImageUrl, getPurchaseLink } from '@/lib/commerce';
import { MediaWithFallback } from '@/components/ui/MediaWithFallback';
import { listProducts } from '@/lib/api/services/products';
import type { Product } from '@/lib/types';

function formatPrice(price: number) {
  return Number.isInteger(price) ? price.toString() : price.toFixed(2);
}

export default function ProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    void listProducts({ pageSize: 12 })
      .then((response) => {
        if (active) {
          setItems(response.items);
        }
      })
      .catch((currentError) => {
        if (active) {
          setError(currentError instanceof Error ? currentError.message : 'No se pudo cargar productos.');
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
          <p className="eyebrow">Catalogo</p>
          <h1>Productos visibles</h1>
          <p className="muted">Opciones sin gluten con precio, comercio y contacto de compra.</p>
        </div>
        <Link className="inline-link" href="/places">
          Ver lugares
        </Link>
      </div>
      {error ? <p className="status-pill">{error}</p> : null}
      {isLoading ? <p className="empty-state">Cargando productos...</p> : null}
      {!isLoading && !error && items.length === 0 ? <p className="empty-state">Todavia no hay productos visibles.</p> : null}
      <div className="data-list directory-grid">
        {items.map((product) => (
          <article key={product.id} className="result-card product-card product-card--catalog">
            <div className="product-card__media-wrap">
              <MediaWithFallback
                className="product-card__media"
                src={getProductImageUrl(product) ?? undefined}
                alt={product.name}
              />
              <span className="product-card__price">Bs {formatPrice(product.price)}</span>
            </div>
            <div className="product-card__copy">
              <span className="task-card__meta">{product.category}</span>
              <h2>{product.name}</h2>
              <p>{product.glutenType}</p>
              <p className="product-card__seller">
                {product.sellerProfile?.businessName ?? 'Comercio sin nombre'}{product.sellerProfile?.city ? ` · ${product.sellerProfile.city}` : ''}
              </p>
              <div className="product-card__meta-row">
                <span>
                  {product.stockQty} {product.stockUnit}
                </span>
                <span>{product.isActive ? 'Disponible' : 'Pausado'}</span>
              </div>
              <div className="inline-actions product-card__actions">
                <Link href={`/products/${product.id}`} className="inline-link">
                  Ver detalle
                </Link>
                <a href={getPurchaseLink(product)} className="inline-link" target="_blank" rel="noreferrer">
                  Comprar
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

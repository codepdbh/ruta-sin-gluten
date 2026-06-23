'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getProductImageUrl, getPurchaseLink } from '@/lib/commerce';
import { MediaWithFallback } from '@/components/ui/MediaWithFallback';
import { getProduct } from '@/lib/api/services/products';
import type { Product } from '@/lib/types';

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.id) {
      return;
    }

    void getProduct(params.id)
      .then(setProduct)
      .catch((currentError) => {
        setError(currentError instanceof Error ? currentError.message : 'No se pudo cargar el producto.');
      });
  }, [params.id]);

  if (error) {
    return <section className="page-card"><p className="status-pill">{error}</p></section>;
  }

  if (!product) {
    return <section className="empty-state">Cargando producto...</section>;
  }

  return (
    <section className="page-card">
      <p className="eyebrow">Detalle del producto</p>
      <div className="product-detail">
        <div className="product-detail__copy">
          <h1>{product.name}</h1>
          <p className="muted">{product.description}</p>
          <div className="pill-row">
            <span className="pill">{product.category}</span>
            <span className="pill">{product.glutenType}</span>
            <span className="pill">Bs {product.price}</span>
          </div>
          <p>
            Stock actual: {product.stockQty} {product.stockUnit}
          </p>
          <p>
            Vende: {product.sellerProfile?.businessName ?? 'Comercio registrado'}
          </p>
          <div className="inline-actions">
            <a href={getPurchaseLink(product)} className="inline-link" target="_blank" rel="noreferrer">
              Comprar
            </a>
            {product.sellerProfile?.id ? <Link href={`/places/${product.sellerProfile.id}`}>Ver comercio</Link> : null}
          </div>
        </div>
        <MediaWithFallback
          className="product-detail__media"
          src={getProductImageUrl(product) ?? undefined}
          alt={product.name}
        />
      </div>
    </section>
  );
}

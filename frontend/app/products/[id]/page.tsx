'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
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
    </section>
  );
}

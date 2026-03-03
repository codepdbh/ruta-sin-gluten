'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { listProducts } from '@/lib/api/services/products';
import type { Product } from '@/lib/types';

export default function ProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void listProducts({ pageSize: 12 })
      .then((response) => setItems(response.items))
      .catch((currentError) => {
        setError(currentError instanceof Error ? currentError.message : 'No se pudo cargar productos.');
      });
  }, []);

  return (
    <section className="page-card">
      <p className="eyebrow">Catalogo</p>
      <h1>Productos visibles</h1>
      {error ? <p className="status-pill">{error}</p> : null}
      <div className="data-list">
        {items.map((product) => (
          <article key={product.id} className="result-card">
            <h2>{product.name}</h2>
            <p>
              {product.category} · Bs {product.price}
            </p>
            <p>{product.glutenType}</p>
            <Link href={`/products/${product.id}`}>Ver detalle</Link>
          </article>
        ))}
      </div>
    </section>
  );
}

'use client';

import { FormEvent, useEffect, useState } from 'react';
import { createProduct, listProducts } from '@/lib/api/services/products';
import type { Product } from '@/lib/types';

export default function SellerProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState('Cargá productos, precio y stock.');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        const response = await listProducts({ pageSize: 12 });
        if (active) {
          setProducts(response.items);
        }
      } catch {
        if (active) {
          setProducts([]);
        }
      }
    }

    void loadProducts();

    return () => {
      active = false;
    };
  }, [reloadKey]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      await createProduct({
        name: String(formData.get('name') ?? ''),
        category: String(formData.get('category') ?? ''),
        description: String(formData.get('description') ?? ''),
        price: Number(formData.get('price') ?? 0),
        stockQty: Number(formData.get('stockQty') ?? 0),
        stockUnit: String(formData.get('stockUnit') ?? ''),
        glutenType: String(formData.get('glutenType') ?? 'LIBRE_GLUTEN'),
        isActive: true,
      });

      setMessage('Producto creado.');
      event.currentTarget.reset();
      setReloadKey((current) => current + 1);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo crear el producto.');
    }
  }

  return (
    <section className="page-card">
      <p className="eyebrow">Seller</p>
      <h1>Productos y stock</h1>
      <form className="form-grid two-col" onSubmit={handleSubmit}>
        <label>
          Nombre
          <input name="name" required />
        </label>
        <label>
          Categoría
          <input name="category" required />
        </label>
        <label>
          Precio
          <input name="price" type="number" step="0.01" required />
        </label>
        <label>
          Stock
          <input name="stockQty" type="number" step="0.01" required />
        </label>
        <label>
          Unidad
          <input name="stockUnit" defaultValue="unidades" required />
        </label>
        <label>
          Tipo gluten
          <select name="glutenType" defaultValue="LIBRE_GLUTEN">
            <option value="LIBRE_GLUTEN">Libre gluten</option>
            <option value="OPCION_LIBRE_GLUTEN">Opción libre gluten</option>
            <option value="CONSULTAR">Consultar</option>
          </select>
        </label>
        <label style={{ gridColumn: '1 / -1' }}>
          Descripción
          <textarea name="description" />
        </label>
        <button className="primary-button" type="submit">
          Crear producto
        </button>
      </form>
      <p className="status-pill">{message}</p>
      <div className="data-list">
        {products.map((product) => (
          <article key={product.id} className="result-card">
            <h2>{product.name}</h2>
            <p>
              {product.category} · Bs {product.price}
            </p>
            <p>
              Stock {product.stockQty} {product.stockUnit}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

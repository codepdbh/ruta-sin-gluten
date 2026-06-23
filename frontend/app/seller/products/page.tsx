"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { MediaWithFallback } from "@/components/ui/MediaWithFallback";
import { uploadMedia } from "@/lib/api/services/media";
import { createProduct, listMyProducts } from "@/lib/api/services/products";
import { getProductImageUrl } from "@/lib/commerce";
import type { Product } from "@/lib/types";

const MAX_PRODUCT_PHOTOS = 4;

function formatPrice(price: number) {
  return Number.isInteger(price) ? price.toString() : price.toFixed(2);
}

export default function SellerProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [message, setMessage] = useState(
    "Carga tus productos, precio, stock y fotos.",
  );
  const [reloadKey, setReloadKey] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        const response = await listMyProducts({ pageSize: 48 });
        if (active) {
          setProducts(response.items);
        }
      } catch (error) {
        if (active) {
          setProducts([]);
          setMessage(
            error instanceof Error
              ? error.message
              : "No se pudieron cargar tus productos.",
          );
        }
      }
    }

    void loadProducts();

    return () => {
      active = false;
    };
  }, [reloadKey]);

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []).filter((file) =>
      file.type.startsWith("image/"),
    );
    const limitedFiles = files.slice(0, MAX_PRODUCT_PHOTOS);

    setPhotoFiles(limitedFiles);

    if (files.length > MAX_PRODUCT_PHOTOS) {
      setMessage(
        `Puedes subir hasta ${MAX_PRODUCT_PHOTOS} fotos por producto.`,
      );
    } else if (limitedFiles.length) {
      setMessage(
        `${limitedFiles.length} foto${limitedFiles.length === 1 ? "" : "s"} lista${limitedFiles.length === 1 ? "" : "s"} para subir.`,
      );
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const form = event.currentTarget;

    try {
      setSaving(true);
      setMessage(
        photoFiles.length
          ? "Subiendo fotos del producto..."
          : "Creando producto...",
      );

      const photoUrls = await Promise.all(
        photoFiles.map(async (file) => {
          const upload = await uploadMedia(file);
          return upload.url;
        }),
      );

      await createProduct({
        name: String(formData.get("name") ?? ""),
        category: String(formData.get("category") ?? ""),
        description: String(formData.get("description") ?? ""),
        price: Number(formData.get("price") ?? 0),
        stockQty: Number(formData.get("stockQty") ?? 0),
        stockUnit: String(formData.get("stockUnit") ?? ""),
        glutenType: String(formData.get("glutenType") ?? "LIBRE_GLUTEN"),
        isActive: true,
        photoUrls,
      });

      setMessage("Producto creado en tu inventario.");
      form.reset();
      setPhotoFiles([]);
      setReloadKey((current) => current + 1);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "No se pudo crear el producto.",
      );
    } finally {
      setSaving(false);
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
        <label style={{ gridColumn: "1 / -1" }}>
          Descripción
          <textarea name="description" />
        </label>
        <label className="upload-field" style={{ gridColumn: "1 / -1" }}>
          Fotos del producto
          <input
            name="photos"
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoChange}
          />
          {photoFiles.length ? (
            <span className="muted">
              {photoFiles.map((file) => file.name).join(", ")}
            </span>
          ) : null}
        </label>
        <button className="primary-button" type="submit" disabled={saving}>
          {saving ? "Guardando..." : "Crear producto"}
        </button>
      </form>
      <p className="status-pill">{message}</p>
      <div className="panel-home__header">
        <div>
          <p className="eyebrow">Mi inventario</p>
          <h2>Productos de mi comercio</h2>
        </div>
      </div>
      {products.length === 0 ? (
        <p className="empty-state">Aun no tienes productos cargados.</p>
      ) : null}
      <div className="data-list">
        {products.map((product) => (
          <article
            key={product.id}
            className="result-card product-card product-card--catalog"
          >
            <div className="product-card__media-wrap">
              <MediaWithFallback
                className="product-card__media"
                src={getProductImageUrl(product) ?? undefined}
                alt={product.name}
              />
              <span className="product-card__price">
                Bs {formatPrice(product.price)}
              </span>
            </div>
            <div className="product-card__copy">
              <span className="task-card__meta">{product.category}</span>
              <h2>{product.name}</h2>
              <p>
                Stock {product.stockQty} {product.stockUnit}
              </p>
              <div className="product-card__meta-row">
                <span>{product.glutenType}</span>
                <span>{product.photos?.length ?? 0} fotos</span>
                <span>{product.isActive ? "Activo" : "Pausado"}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

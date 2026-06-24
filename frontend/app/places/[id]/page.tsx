"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { buildAssetUrl } from "@/lib/api/client";
import { MediaWithFallback } from "@/components/ui/MediaWithFallback";
import {
  getMyPlaceRating,
  getPlace,
  ratePlace,
} from "@/lib/api/services/places";
import { getProductImageUrl } from "@/lib/commerce";
import type { PlaceDetail, Product } from "@/lib/types";

function getMapLink(lat?: number | null, lng?: number | null, label?: string) {
  if (typeof lat !== "number" || typeof lng !== "number") {
    return null;
  }

  const query = encodeURIComponent(label ?? `${lat},${lng}`);
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}%20(${query})`;
}

function normalizePhone(value?: string | null) {
  return value?.replace(/\D/g, "") ?? "";
}

function getPlaceProductPurchaseLink(product: Product, place: PlaceDetail) {
  const phone = normalizePhone(place.whatsapp);

  if (!phone) {
    return `/products/${product.id}`;
  }

  const message = encodeURIComponent(
    `Hola, quiero comprar "${product.name}" de ${place.businessName}.`,
  );
  return `https://wa.me/${phone}?text=${message}`;
}

function formatPrice(price: number) {
  return Number.isInteger(price) ? price.toString() : price.toFixed(2);
}

function formatRating(average: number, count: number) {
  if (!count) {
    return "Sin puntuaciones todavia";
  }

  return `${average.toFixed(1)} / 5 · ${count} ${count === 1 ? "puntuacion" : "puntuaciones"}`;
}

export default function PlaceDetailPage() {
  const params = useParams<{ id: string }>();
  const [place, setPlace] = useState<PlaceDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedScore, setSelectedScore] = useState(0);
  const [ratingComment, setRatingComment] = useState("");
  const [ratingMessage, setRatingMessage] = useState(
    "Inicia sesion para puntuar este comercio.",
  );
  const [ratingLoading, setRatingLoading] = useState(false);

  useEffect(() => {
    if (!params.id) {
      return;
    }

    void getPlace(params.id)
      .then((nextPlace) => {
        setPlace(nextPlace);

        if (typeof window === "undefined") {
          return;
        }

        const token = window.localStorage.getItem("rutasingluten_token");

        if (!token) {
          setRatingMessage("Inicia sesion para puntuar este comercio.");
          return;
        }

        void getMyPlaceRating(nextPlace.id)
          .then(({ rating }) => {
            if (rating) {
              setSelectedScore(rating.score);
              setRatingComment(rating.comment ?? "");
              setRatingMessage(
                "Ya puntuaste este comercio. Puedes actualizar tu puntuacion.",
              );
            } else {
              setRatingMessage(
                "Elige de 1 a 5 estrellas para puntuar este comercio.",
              );
            }
          })
          .catch(() => {
            setRatingMessage("No se pudo cargar tu puntuacion actual.");
          });
      })
      .catch((currentError) => {
        setError(
          currentError instanceof Error
            ? currentError.message
            : "No se pudo cargar el comercio.",
        );
      });
  }, [params.id]);

  async function handleRatingSubmit() {
    if (!place) {
      return;
    }

    if (!selectedScore) {
      setRatingMessage("Selecciona una puntuacion de 1 a 5 estrellas.");
      return;
    }

    if (
      typeof window !== "undefined" &&
      !window.localStorage.getItem("rutasingluten_token")
    ) {
      setRatingMessage("Necesitas iniciar sesion para puntuar.");
      return;
    }

    setRatingLoading(true);
    setRatingMessage("Guardando puntuacion...");

    try {
      const response = await ratePlace(place.id, {
        score: selectedScore,
        comment: ratingComment,
      });

      setPlace((current) =>
        current
          ? {
              ...current,
              ratingAverage: response.ratingAverage,
              ratingCount: response.ratingCount,
            }
          : current,
      );
      setSelectedScore(response.rating.score);
      setRatingComment(response.rating.comment ?? "");
      setRatingMessage("Gracias, tu puntuacion fue guardada.");
    } catch (currentError) {
      setRatingMessage(
        currentError instanceof Error
          ? currentError.message
          : "No se pudo guardar la puntuacion.",
      );
    } finally {
      setRatingLoading(false);
    }
  }

  if (error) {
    return (
      <section className="page-card">
        <p className="status-pill">{error}</p>
      </section>
    );
  }

  if (!place) {
    return (
      <section className="empty-state">
        Cargando detalle del comercio...
      </section>
    );
  }

  return (
    <section className="page-card place-detail-page">
      <p className="eyebrow">Detalle del lugar</p>
      <div className="place-detail__header">
        <div>
          <h1>{place.businessName}</h1>
          <p className="muted">{place.description}</p>
        </div>
        <MediaWithFallback
          className="place-detail__logo"
          src={place.logoUrl ? buildAssetUrl(place.logoUrl) : undefined}
          alt={place.businessName}
        />
      </div>
      <div className="pill-row">
        <span className="pill">{place.businessType}</span>
        <span className="pill">
          {place.modality ?? "Sin modalidad informada"}
        </span>
        <span className="pill">
          {place.hasShipping ? "Hace envios" : "Retiro / entrega"}
        </span>
        <span className="pill">
          {formatRating(place.ratingAverage, place.ratingCount)}
        </span>
      </div>
      <div className="split-layout">
        <article className="panel-card">
          <h2>Ubicacion y contacto</h2>
          <p>
            {place.location?.addressText ?? "Sin ubicacion principal publica"}
          </p>
          <p>{place.location?.reference ?? "Sin referencia adicional"}</p>
          <p>WhatsApp: {place.whatsapp}</p>
          <p>
            {place.city}, {place.department}
          </p>
          {getMapLink(
            place.location?.lat,
            place.location?.lng,
            place.businessName,
          ) ? (
            <a
              href={
                getMapLink(
                  place.location?.lat,
                  place.location?.lng,
                  place.businessName,
                ) ?? undefined
              }
              className="inline-link"
              target="_blank"
              rel="noreferrer"
            >
              Ver donde queda en el mapa
            </a>
          ) : null}
        </article>
        <article className="panel-card">
          <h2>Envios y entregas</h2>
          <p>
            {place.shippingAreas.length
              ? "Tiene cobertura configurada."
              : "Sin cobertura cargada."}
          </p>
          <p>{place.deliveryPoints.length} puntos de entrega registrados.</p>
          <p>
            {place.products.length
              ? `${place.products.length} ${place.products.length === 1 ? "producto disponible" : "productos disponibles"} en este comercio.`
              : "Este comercio todavia no cargo productos visibles."}
          </p>
          {place.products.length ? (
            <a href="#productos-del-comercio" className="inline-link">
              Ir al catalogo
            </a>
          ) : null}
        </article>
      </div>
      <article className="panel-card rating-card">
        <div>
          <p className="eyebrow">Puntuacion</p>
          <h2>Califica este comercio</h2>
          <p className="muted">
            {formatRating(place.ratingAverage, place.ratingCount)}
          </p>
        </div>
        <div className="rating-stars" aria-label="Seleccionar puntuacion">
          {[1, 2, 3, 4, 5].map((score) => (
            <button
              key={score}
              type="button"
              className={score <= selectedScore ? "is-active" : undefined}
              aria-label={`${score} estrellas`}
              onClick={() => setSelectedScore(score)}
            >
              ★
            </button>
          ))}
        </div>
        <label>
          Comentario opcional
          <textarea
            value={ratingComment}
            onChange={(event) => setRatingComment(event.target.value)}
            maxLength={500}
            placeholder="Cuéntanos si la experiencia fue clara, segura y amable."
          />
        </label>
        <div className="inline-actions">
          <button
            className="primary-button"
            type="button"
            disabled={ratingLoading}
            onClick={() => void handleRatingSubmit()}
          >
            {ratingLoading ? "Guardando..." : "Guardar puntuacion"}
          </button>
          <Link className="secondary-button" href="/login">
            Iniciar sesion
          </Link>
        </div>
        <p className="status-pill">{ratingMessage}</p>
      </article>
      {place.deliveryPoints.length ? (
        <div className="data-list">
          {place.deliveryPoints.map((point, index) => (
            <article key={point.id} className="result-card">
              <h3>{point.name || `Punto ${index + 1}`}</h3>
              <p>{point.addressText}</p>
              <p>{point.reference ?? "Sin referencia adicional"}</p>
              <p>{point.schedule ?? "Horario no informado"}</p>
              {getMapLink(
                point.lat,
                point.lng,
                `${place.businessName} ${point.name}`,
              ) ? (
                <a
                  href={
                    getMapLink(
                      point.lat,
                      point.lng,
                      `${place.businessName} ${point.name}`,
                    ) ?? undefined
                  }
                  className="inline-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  Ver este punto en el mapa
                </a>
              ) : null}
            </article>
          ))}
        </div>
      ) : null}
      <section id="productos-del-comercio" className="place-products-section">
        <div className="place-products-section__header">
          <div>
            <p className="eyebrow">Catalogo</p>
            <h2>Productos de {place.businessName}</h2>
          </div>
          {place.products.length ? (
            <span>
              {place.products.length}{" "}
              {place.products.length === 1 ? "producto" : "productos"}
            </span>
          ) : null}
        </div>
        {place.products.length ? (
          <div className="data-list place-products-grid">
            {place.products.map((product) => (
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
                  {product.description ? <p>{product.description}</p> : null}
                  <div className="product-card__meta-row">
                    <span>{product.glutenType}</span>
                    <span>
                      {product.stockQty} {product.stockUnit}
                    </span>
                  </div>
                  <div className="inline-actions product-card__actions">
                    <a
                      href={getPlaceProductPurchaseLink(product, place)}
                      className="inline-link"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Comprar
                    </a>
                    <Link
                      href={`/products/${product.id}`}
                      className="inline-link"
                    >
                      Detalle
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="empty-state">
            Aun no hay productos visibles para este comercio.
          </p>
        )}
      </section>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { buildAssetUrl } from "@/lib/api/client";
import {
  deleteAdminBusiness,
  getAdminBusinesses,
} from "@/lib/api/services/admin";
import type { AdminBusinessItem } from "@/lib/types";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-BO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getVideoLabel(business: AdminBusinessItem) {
  if (!business.verification) {
    return "Aun no envio video";
  }

  if (business.verification.status === "PENDING") {
    return "Video pendiente";
  }

  if (business.verification.status === "APPROVED") {
    return "Video aprobado";
  }

  if (business.verification.status === "OBSERVED") {
    return "Video observado";
  }

  return "Video rechazado";
}

export default function AdminBusinessesPage() {
  const [businesses, setBusinesses] = useState<AdminBusinessItem[]>([]);
  const [message, setMessage] = useState("Cargando comercios...");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    void getAdminBusinesses()
      .then((items) => {
        if (active) {
          setBusinesses(items);
          setMessage(
            items.length
              ? `${items.length} comercios registrados.`
              : "No hay comercios registrados.",
          );
        }
      })
      .catch((error) => {
        if (active) {
          setMessage(
            error instanceof Error
              ? error.message
              : "No se pudieron cargar comercios.",
          );
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(
    () => ({
      total: businesses.length,
      public: businesses.filter((business) => business.isPublic).length,
      withVideo: businesses.filter((business) => Boolean(business.verification))
        .length,
      pendingVideo: businesses.filter(
        (business) => business.verification?.status === "PENDING",
      ).length,
    }),
    [businesses],
  );

  async function handleDeleteBusiness(business: AdminBusinessItem) {
    const confirmed = window.confirm(
      `Se eliminara "${business.businessName}" del mapa, junto con productos, ubicacion, videos y puntajes asociados. Esta accion no se puede deshacer.`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(business.id);
    setMessage(`Eliminando ${business.businessName}...`);

    try {
      await deleteAdminBusiness(business.id);
      setBusinesses((current) =>
        current.filter((item) => item.id !== business.id),
      );
      setMessage(`${business.businessName} fue eliminado del mapa.`);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar el comercio.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="page-card admin-review-page">
      <div className="directory-page__header">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Comercios y negocios</h1>
          <p className="muted">
            Todos los vendedores registrados, su estado publico y si enviaron
            video de verificacion.
          </p>
        </div>
        <Link className="inline-link" href="/admin/approvals">
          Revisar videos pendientes
        </Link>
      </div>

      <div className="dashboard-grid admin-kpi-grid">
        <article className="metric-card metric-card--warm">
          <span>Total</span>
          <strong>{stats.total}</strong>
          <p>Comercios registrados.</p>
        </article>
        <article className="metric-card metric-card--cool">
          <span>Publicos</span>
          <strong>{stats.public}</strong>
          <p>Visibles en mapa y catalogo.</p>
        </article>
        <article className="metric-card metric-card--neutral">
          <span>Con video</span>
          <strong>{stats.withVideo}</strong>
          <p>Enviaron verificacion.</p>
        </article>
        <article className="metric-card metric-card--warm">
          <span>Pendientes</span>
          <strong>{stats.pendingVideo}</strong>
          <p>Videos esperando revision.</p>
        </article>
      </div>

      <p className="status-pill">{message}</p>

      <div className="data-list admin-entity-list">
        {businesses.map((business) => (
          <article key={business.id} className="result-card admin-entity-card">
            <div>
              <span className="task-card__meta">{business.businessType}</span>
              <h2>{business.businessName}</h2>
              <p>
                {business.city}, {business.department} · {business.country}
              </p>
              <p>
                Responsable: {business.user.name} · {business.user.email}
              </p>
              <p>WhatsApp: {business.whatsapp}</p>
            </div>

            <div className="admin-entity-card__meta">
              <span
                className={
                  business.isPublic
                    ? "status-chip is-ok"
                    : "status-chip is-pending"
                }
              >
                {business.isPublic ? "Publicado" : "No publicado"}
              </span>
              <span
                className={
                  business.verification
                    ? "status-chip is-ok"
                    : "status-chip is-pending"
                }
              >
                {getVideoLabel(business)}
              </span>
              <span className="status-chip">{business.status}</span>
              <small>
                {business.counts.products} productos ·{" "}
                {business.counts.deliveryPoints} puntos ·{" "}
                {business.counts.verificationSubmissions} videos
              </small>
              {business.verification ? (
                <a
                  href={buildAssetUrl(business.verification.videoUrl)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Ver video enviado
                </a>
              ) : null}
              <div className="admin-entity-card__actions">
                <Link href={`/places/${business.id}`}>Ver ficha publica</Link>
                <button
                  className="danger-button"
                  type="button"
                  disabled={deletingId === business.id}
                  onClick={() => void handleDeleteBusiness(business)}
                >
                  {deletingId === business.id
                    ? "Eliminando..."
                    : "Borrar negocio"}
                </button>
              </div>
              <small>Creado: {formatDate(business.createdAt)}</small>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

"use client";

import dynamic from "next/dynamic";
import { FormEvent, useEffect, useState } from "react";
import {
  createDeliveryPoint,
  createMainLocation,
  deleteDeliveryPoint,
  getSellerProfile,
} from "@/lib/api/services/vendors";
import type { SellerProfile } from "@/lib/types";

const LocationPicker = dynamic(
  () =>
    import("@/components/map/LocationPicker").then(
      (module) => module.LocationPicker,
    ),
  {
    ssr: false,
  },
);

export default function SellerLocationsPage() {
  const [mode, setMode] = useState<"main" | "delivery">("main");
  const [message, setMessage] = useState(
    "Registrá local principal o puntos de entrega.",
  );
  const [coordinates, setCoordinates] = useState<{
    lat?: number;
    lng?: number;
  }>({});
  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [deleteReferenceTime] = useState(() => Date.now());

  useEffect(() => {
    let active = true;

    void getSellerProfile()
      .then((response) => {
        if (active) {
          setProfile(response);
        }
      })
      .catch(() => {
        if (active) {
          setProfile(null);
        }
      });

    return () => {
      active = false;
    };
  }, [reloadKey]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const payload = {
      addressText: String(formData.get("addressText") ?? ""),
      reference: String(formData.get("reference") ?? ""),
      lat: formData.get("lat") ? Number(formData.get("lat")) : undefined,
      lng: formData.get("lng") ? Number(formData.get("lng")) : undefined,
    };

    try {
      if (mode === "main") {
        await createMainLocation(payload);
      } else {
        await createDeliveryPoint({
          ...payload,
          name: String(formData.get("name") ?? "Punto de entrega"),
          schedule: String(formData.get("schedule") ?? ""),
        });
      }

      setMessage(
        mode === "main"
          ? "Ubicación principal guardada."
          : "Punto de entrega agregado.",
      );
      setCoordinates({});
      event.currentTarget.reset();
      setReloadKey((current) => current + 1);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "No se pudo guardar la ubicación.",
      );
    }
  }

  async function handleDelete(pointId: string) {
    try {
      await deleteDeliveryPoint(pointId);
      setMessage("Punto eliminado.");
      setReloadKey((current) => current + 1);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "No se pudo borrar el punto.",
      );
    }
  }

  function canDelete(createdAt: string) {
    return (
      deleteReferenceTime - new Date(createdAt).getTime() >=
      2 * 24 * 60 * 60 * 1000
    );
  }

  return (
    <section className="page-card seller-page-card seller-locations">
      <p className="eyebrow">Seller</p>
      <h1>Ubicaciones y entregas</h1>
      <div className="inline-actions">
        <button
          className={mode === "main" ? "primary-button" : "secondary-button"}
          type="button"
          onClick={() => setMode("main")}
        >
          Local principal
        </button>
        <button
          className={
            mode === "delivery" ? "primary-button" : "secondary-button"
          }
          type="button"
          onClick={() => setMode("delivery")}
        >
          Punto de entrega
        </button>
      </div>
      <div className="seller-locations__layout">
        <div className="seller-locations__editor">
          <form className="form-grid two-col" onSubmit={handleSubmit}>
            {mode === "delivery" ? (
              <>
                <label>
                  Nombre del punto
                  <input name="name" required />
                </label>
                <label>
                  Horario
                  <input
                    name="schedule"
                    placeholder="Lun a Vie 09:00 - 18:00"
                  />
                </label>
              </>
            ) : null}
            <label>
              Dirección escrita
              <input name="addressText" required />
            </label>
            <label>
              Referencia
              <input name="reference" />
            </label>
            <label>
              Latitud
              <input
                name="lat"
                type="number"
                step="any"
                value={coordinates.lat ?? ""}
                onChange={(event) =>
                  setCoordinates((current) => ({
                    ...current,
                    lat: event.target.value
                      ? Number(event.target.value)
                      : undefined,
                  }))
                }
              />
            </label>
            <label>
              Longitud
              <input
                name="lng"
                type="number"
                step="any"
                value={coordinates.lng ?? ""}
                onChange={(event) =>
                  setCoordinates((current) => ({
                    ...current,
                    lng: event.target.value
                      ? Number(event.target.value)
                      : undefined,
                  }))
                }
              />
            </label>
            <div className="form-grid__full">
              <LocationPicker
                value={coordinates}
                onChange={(next) => setCoordinates(next)}
              />
            </div>
            <button className="primary-button" type="submit">
              Guardar {mode === "main" ? "ubicación" : "punto"}
            </button>
          </form>
          <p className="status-pill">{message}</p>
        </div>
        <div className="data-list seller-locations__list">
          {profile?.mainLocation ? (
            <article className="result-card">
              <h2>Local principal</h2>
              <p>{profile.mainLocation.addressText}</p>
              <p>
                {profile.mainLocation.reference ?? "Sin referencia adicional"}
              </p>
            </article>
          ) : null}
          {profile?.deliveryPoints?.length ? (
            profile.deliveryPoints.map((point) => (
              <article key={point.id} className="result-card seller-point-card">
                <div className="seller-point-card__copy">
                  <h2>{point.name}</h2>
                  <p>{point.addressText}</p>
                  <p>{point.reference ?? "Sin referencia adicional"}</p>
                  <p>{point.schedule ?? "Horario no informado"}</p>
                </div>
                <div className="seller-point-card__actions">
                  <small>
                    {canDelete(point.createdAt)
                      ? "Ya puedes borrarlo"
                      : "Disponible minimo 2 dias antes de borrar"}
                  </small>
                  <button
                    className="secondary-button"
                    type="button"
                    disabled={!canDelete(point.createdAt)}
                    onClick={() => void handleDelete(point.id)}
                  >
                    Borrar punto
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="empty-state">
              Aun no tienes puntos de entrega registrados.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

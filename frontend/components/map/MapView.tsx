"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Circle,
  CircleMarker,
  MapContainer,
  Polyline,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { BoundsListener } from "./BoundsListener";
import { MarkersLayer } from "./MarkersLayer";
import { getPlacesInBounds, getPlacesNearby } from "@/lib/api/services/places";
import type { PlaceSummary } from "@/lib/types";

type Filters = {
  businessType: string;
  modality: string;
  shippingAvailable: boolean;
};

type UserLocation = {
  lat: number;
  lng: number;
  accuracy: number;
};

type RoutePoint = [number, number];

type ResultMode = "bounds" | "nearby";

type OsrmRouteResponse = {
  routes?: Array<{
    distance?: number;
    duration?: number;
    geometry?: {
      coordinates?: Array<[number, number]>;
    };
  }>;
  message?: string;
};

const EXPLORER_GROUPS = [
  { id: "all", label: "Todos", hint: "Mapa completo" },
  { id: "bakery", label: "Panaderias", hint: "Pan y reposteria" },
  { id: "store", label: "Tiendas", hint: "Compra directa" },
  { id: "cafe", label: "Cafeterias", hint: "Cafe y snacks" },
  { id: "restaurant", label: "Restaurantes", hint: "Para comer ahi" },
  { id: "shipping", label: "Con envios", hint: "Entrega disponible" },
] as const;

type ExplorerGroup = (typeof EXPLORER_GROUPS)[number]["id"];

const DEFAULT_CENTER: [number, number] = [-16.500113, -68.131226];

function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, Math.max(map.getZoom(), 13), {
      duration: 0.35,
    });
  }, [center, map]);

  return null;
}

function MapZoomControls() {
  const map = useMap();

  return (
    <div className="map-shell__zoom">
      <button type="button" onClick={() => map.zoomIn()}>
        +
      </button>
      <button type="button" onClick={() => map.zoomOut()}>
        -
      </button>
    </div>
  );
}

function FitRouteBounds({ points }: { points: RoutePoint[] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length < 2) {
      return;
    }

    map.fitBounds(points, {
      animate: false,
      maxZoom: 15,
      padding: [36, 36],
    });
  }, [map, points]);

  return null;
}

function CloseSelectionOnMapClick({ onClose }: { onClose: () => void }) {
  useMapEvents({
    click: onClose,
  });

  return null;
}

function getDirectionsUrl(
  place: PlaceSummary,
  userLocation: UserLocation | null,
) {
  if (!place.location) {
    return null;
  }

  const params = new URLSearchParams({
    api: "1",
    destination: `${place.location.lat},${place.location.lng}`,
    query_destination: place.businessName,
    travelmode: "driving",
  });

  if (userLocation) {
    params.set("origin", `${userLocation.lat},${userLocation.lng}`);
  }

  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

function getGeolocationSecurityMessage() {
  const isLocalhost =
    typeof window !== "undefined" &&
    ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);

  if (
    typeof window !== "undefined" &&
    !window.isSecureContext &&
    !isLocalhost
  ) {
    return "En movil la ubicacion requiere HTTPS o abrir la app desde localhost.";
  }

  if (!navigator.geolocation) {
    return "Tu navegador no soporta geolocalizacion.";
  }

  return null;
}

function requestCurrentLocation() {
  return new Promise<UserLocation>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: Math.min(
            Math.max(position.coords.accuracy || 60, 40),
            1500,
          ),
        });
      },
      reject,
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );
  });
}

function formatRouteSummary(distance?: number, duration?: number) {
  const distanceText =
    typeof distance === "number"
      ? distance >= 1000
        ? `${(distance / 1000).toFixed(1)} km`
        : `${Math.round(distance)} m`
      : null;
  const durationText =
    typeof duration === "number"
      ? `${Math.max(1, Math.round(duration / 60))} min`
      : null;

  return [distanceText, durationText].filter(Boolean).join(" - ");
}

function formatBusinessType(type: string) {
  const labels: Record<string, string> = {
    TIENDA: "Tienda",
    EMPRENDIMIENTO: "Emprendimiento",
    PANADERIA: "Panaderia",
    CAFETERIA: "Cafeteria",
    RESTAURANTE: "Restaurante",
    OTRO: "Comercio",
  };

  return labels[type] ?? "Comercio";
}

function formatModality(modality?: string | null) {
  if (modality === "CIEN_PORCIENTO_LIBRE_GLUTEN") {
    return "100% libre gluten";
  }

  if (modality === "CON_OPCIONES") {
    return "Con opciones";
  }

  return null;
}

function placeMatchesFilters(place: PlaceSummary, filters: Filters) {
  if (filters.businessType && place.businessType !== filters.businessType) {
    return false;
  }

  if (filters.modality && place.modality !== filters.modality) {
    return false;
  }

  if (filters.shippingAvailable && !place.hasShipping) {
    return false;
  }

  return true;
}

export default function MapView() {
  const [places, setPlaces] = useState<PlaceSummary[]>([]);
  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [searchCenter, setSearchCenter] = useState<[number, number] | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isRouting, setIsRouting] = useState(false);
  const [activePlaceId, setActivePlaceId] = useState<string | null>(null);
  const [isPlaceCardCollapsed, setIsPlaceCardCollapsed] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [routeLine, setRouteLine] = useState<RoutePoint[]>([]);
  const [routeSummary, setRouteSummary] = useState<string | null>(null);
  const [activeGroup, setActiveGroup] = useState<ExplorerGroup>("all");
  const [resultMode, setResultMode] = useState<ResultMode>("bounds");
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [status, setStatus] = useState(
    'Mueve el mapa o usa "Cerca de mi" para descubrir comercios aprobados.',
  );
  const [filters, setFilters] = useState<Filters>({
    businessType: "",
    modality: "",
    shippingAvailable: false,
  });
  const visiblePlaces = useMemo(
    () => places.filter((place) => placeMatchesFilters(place, filters)),
    [filters, places],
  );
  const hasActiveFilters =
    Boolean(filters.businessType) ||
    Boolean(filters.modality) ||
    filters.shippingAvailable;
  const displayStatus = useMemo(() => {
    if (loading) {
      return "Cargando lugares...";
    }

    if (!places.length) {
      return status;
    }

    if (!visiblePlaces.length) {
      return hasActiveFilters
        ? "Sin resultados para estos filtros en esta zona."
        : status;
    }

    if (resultMode === "nearby") {
      return hasActiveFilters
        ? `${visiblePlaces.length} de ${places.length} comercios cerca coinciden.`
        : `${visiblePlaces.length} comercios dentro de 5 km.`;
    }

    return hasActiveFilters
      ? `${visiblePlaces.length} de ${places.length} comercios coinciden en la vista actual.`
      : `${visiblePlaces.length} comercios aprobados en la vista actual.`;
  }, [
    hasActiveFilters,
    loading,
    places.length,
    resultMode,
    status,
    visiblePlaces.length,
  ]);

  useEffect(() => {
    if (!actionMessage) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setActionMessage(null);
    }, 4200);

    return () => {
      window.clearTimeout(timer);
    };
  }, [actionMessage]);

  useEffect(() => {
    setRouteLine([]);
    setRouteSummary(null);
    setIsPlaceCardCollapsed(false);
  }, [activePlaceId]);

  useEffect(() => {
    setActivePlaceId((current) =>
      current && visiblePlaces.some((item) => item.id === current)
        ? current
        : null,
    );
  }, [visiblePlaces]);

  async function loadByBounds(bounds: {
    minLat: number;
    minLng: number;
    maxLat: number;
    maxLng: number;
  }) {
    try {
      setLoading(true);
      const items = await getPlacesInBounds({
        ...bounds,
        verified: true,
      });

      setPlaces(items);
      setResultMode("bounds");
      setStatus(
        items.length
          ? `${items.length} comercios aprobados en la vista actual.`
          : "Sin resultados en esta zona.",
      );
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "No se pudo cargar el mapa.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleNearby() {
    if (isLocating || loading) {
      return;
    }

    const unavailableMessage = getGeolocationSecurityMessage();

    if (unavailableMessage) {
      const message = unavailableMessage;
      setActionMessage(message);
      setStatus(message);
      return;
    }

    setIsLocating(true);
    setActionMessage("Solicitando tu ubicacion...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const nextCenter: [number, number] = [
          position.coords.latitude,
          position.coords.longitude,
        ];
        const nextUserLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: Math.min(
            Math.max(position.coords.accuracy || 60, 40),
            1500,
          ),
        };

        setUserLocation(nextUserLocation);
        setCenter(nextCenter);
        setSearchCenter(nextCenter);
        setIsLocating(false);
        setLoading(true);
        setActionMessage("Buscando comercios cerca de vos...");

        try {
          const items = await getPlacesNearby({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            radius: 5000,
            verified: true,
          });

          setPlaces(items);
          setResultMode("nearby");
          setStatus(
            items.length
              ? `${items.length} comercios dentro de 5 km.`
              : "No hay comercios aprobados cerca.",
          );
          setActionMessage(
            items.length
              ? `${items.length} lugares encontrados.`
              : "No hay comercios aprobados cerca.",
          );
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "No se pudo buscar cerca de vos.";
          setStatus(message);
          setActionMessage(message);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setIsLocating(false);
        const message =
          error.code === error.PERMISSION_DENIED
            ? "Permiti la ubicacion del navegador para usar esta opcion."
            : error.code === error.TIMEOUT
              ? "La ubicacion tardo demasiado. Intentalo otra vez."
              : "No se pudo acceder a tu ubicacion.";

        setStatus(message);
        setActionMessage(message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );
  }

  async function handleRouteToActivePlace() {
    if (!activePlace?.location || isRouting) {
      return;
    }

    const unavailableMessage = getGeolocationSecurityMessage();

    if (unavailableMessage) {
      setActionMessage(unavailableMessage);
      return;
    }

    setIsRouting(true);
    setActionMessage(
      userLocation
        ? "Calculando ruta en el mapa..."
        : "Necesito tu ubicacion para trazar la ruta...",
    );

    try {
      const origin = userLocation ?? (await requestCurrentLocation());
      setUserLocation(origin);

      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${activePlace.location.lng},${activePlace.location.lat}?overview=full&geometries=geojson&steps=false`,
        { cache: "no-store" },
      );

      if (!response.ok) {
        throw new Error("No se pudo calcular la ruta.");
      }

      const payload = (await response.json()) as OsrmRouteResponse;
      const route = payload.routes?.[0];
      const coordinates = route?.geometry?.coordinates;

      if (!route || !coordinates?.length) {
        throw new Error(
          payload.message ?? "No se encontro una ruta disponible.",
        );
      }

      const nextRoute = coordinates.map(
        ([lng, lat]) => [lat, lng] as RoutePoint,
      );
      const summary = formatRouteSummary(route.distance, route.duration);

      setRouteLine(nextRoute);
      setRouteSummary(summary || null);
      setActionMessage(
        summary ? `Ruta lista: ${summary}.` : "Ruta lista en el mapa.",
      );

      if (window.matchMedia("(max-width: 639px)").matches) {
        setIsPlaceCardCollapsed(true);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo calcular la ruta.";
      setActionMessage(message);
    } finally {
      setIsRouting(false);
    }
  }

  async function handleShareActivePlace() {
    if (!activePlace) {
      return;
    }

    const shareUrl =
      directionsUrl ??
      (typeof window !== "undefined"
        ? new URL(
            `/places/${activePlace.id}`,
            window.location.origin,
          ).toString()
        : "");

    if (!shareUrl) {
      return;
    }

    try {
      if (navigator.share) {
        await navigator.share({
          title: activePlace.businessName,
          text: `Mira este comercio en Ruta Sin Gluten: ${activePlace.businessName}`,
          url: shareUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      setActionMessage("Enlace copiado para compartir.");
    } catch {
      setActionMessage("No se pudo compartir el enlace.");
    }
  }

  function handleGroupSelect(group: ExplorerGroup) {
    setActiveGroup(group);
    setFilters((current) => {
      if (group === "shipping") {
        return {
          ...current,
          businessType: "",
          shippingAvailable: true,
        };
      }

      const businessTypeMap: Partial<Record<ExplorerGroup, string>> = {
        bakery: "PANADERIA",
        store: "TIENDA",
        cafe: "CAFETERIA",
        restaurant: "RESTAURANTE",
      };

      return {
        ...current,
        businessType: businessTypeMap[group] ?? "",
        shippingAvailable: false,
      };
    });
  }

  const activePlace =
    visiblePlaces.find((place) => place.id === activePlaceId) ?? null;
  const directionsUrl = activePlace
    ? getDirectionsUrl(activePlace, userLocation)
    : null;
  const shippingCount = visiblePlaces.filter((place) => place.hasShipping).length;
  const hasActiveRoute = routeLine.length > 0 || Boolean(routeSummary);

  const handleSelectPlace = useCallback((placeId: string) => {
    setIsPlaceCardCollapsed(false);
    setActivePlaceId(placeId);
  }, []);

  function handleHidePlaceCard() {
    if (isPlaceCardCollapsed) {
      setIsPlaceCardCollapsed(false);
      return;
    }

    if (hasActiveRoute) {
      setIsPlaceCardCollapsed(true);
      return;
    }

    setActivePlaceId(null);
  }

  function handleMapEmptyClick() {
    if (hasActiveRoute) {
      setIsPlaceCardCollapsed(true);
      return;
    }

    setActivePlaceId(null);
  }

  function handleClearRoute() {
    setRouteLine([]);
    setRouteSummary(null);
    setIsPlaceCardCollapsed(false);
    setActionMessage("Ruta quitada del mapa.");
  }

  return (
    <section className="map-shell">
      <div className="map-shell__frame">
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom
          zoomControl={false}
          className="leaflet-stage"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <BoundsListener onBoundsChange={loadByBounds} />
          <CloseSelectionOnMapClick onClose={handleMapEmptyClick} />
          <MarkersLayer
            places={visiblePlaces}
            activePlaceId={activePlaceId}
            onSelect={handleSelectPlace}
          />
          <MapZoomControls />
          {searchCenter ? (
            <>
              <RecenterMap center={searchCenter} />
              <Circle
                center={searchCenter}
                radius={5000}
                pathOptions={{
                  color: "#ff8a1c",
                  fillOpacity: 0.06,
                  weight: 1.5,
                }}
              />
            </>
          ) : null}
          {userLocation ? (
            <>
              <Circle
                center={[userLocation.lat, userLocation.lng]}
                radius={userLocation.accuracy}
                pathOptions={{
                  color: "#2f8d6f",
                  fillColor: "#2f8d6f",
                  fillOpacity: 0.08,
                  weight: 1.4,
                }}
              />
              <CircleMarker
                center={[userLocation.lat, userLocation.lng]}
                radius={8}
                interactive={false}
                pathOptions={{
                  color: "#ffffff",
                  fillColor: "#2f8d6f",
                  fillOpacity: 1,
                  weight: 3,
                }}
              />
            </>
          ) : null}
          {routeLine.length ? (
            <>
              <Polyline
                positions={routeLine}
                pathOptions={{
                  color: "#2f8d6f",
                  opacity: 0.92,
                  weight: 5,
                }}
              />
              <FitRouteBounds points={routeLine} />
            </>
          ) : null}
        </MapContainer>

        <aside className="map-shell__rail">
          <div className="map-shell__rail-header">
            <p className="eyebrow">Mapa publico</p>
            <h2>Encuentra lugares sin gluten</h2>
            <p className="muted">Comercios revisados y visibles en esta zona.</p>
          </div>

          <div className="map-shell__rail-nav">
            <span className="map-shell__rail-label">Categorias</span>
            <ul className="map-shell__rail-list">
              {EXPLORER_GROUPS.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={item.id === activeGroup ? "is-active" : undefined}
                    onClick={() => handleGroupSelect(item.id)}
                  >
                    <span
                      className={`map-shell__rail-dot map-shell__rail-dot--${item.id}`}
                      aria-hidden="true"
                    />
                    <span>
                      <strong>{item.label}</strong>
                      <small>{item.hint}</small>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="map-shell__headline">
            <p className="eyebrow">Filtros</p>
            <h3>Ajusta la busqueda</h3>
          </div>

          <div className="filters-grid map-shell__filters">
            <label>
              Tipo
              <select
                value={filters.businessType}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    businessType: event.target.value,
                  }))
                }
              >
                <option value="">Todos</option>
                <option value="TIENDA">Tienda</option>
                <option value="EMPRENDIMIENTO">Emprendimiento</option>
                <option value="PANADERIA">Panaderia</option>
                <option value="CAFETERIA">Cafeteria</option>
                <option value="RESTAURANTE">Restaurante</option>
                <option value="OTRO">Otro</option>
              </select>
            </label>

            <label>
              Modalidad
              <select
                value={filters.modality}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    modality: event.target.value,
                  }))
                }
              >
                <option value="">Todas</option>
                <option value="CIEN_PORCIENTO_LIBRE_GLUTEN">
                  100% libre gluten
                </option>
                <option value="CON_OPCIONES">Con opciones</option>
              </select>
            </label>

            <label className="checkbox-field">
              <input
                type="checkbox"
                checked={filters.shippingAvailable}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    shippingAvailable: event.target.checked,
                  }))
                }
              />
              Solo con envios
            </label>
          </div>

          <p className="status-pill map-shell__status">
            {displayStatus}
          </p>

          <div className="map-shell__stats">
            <article>
              <span>{visiblePlaces.length}</span>
              <small>Lugares</small>
            </article>
            <article>
              <span>{shippingCount}</span>
              <small>Con envios</small>
            </article>
            <article>
              <span>{searchCenter ? "5 km" : "Mapa"}</span>
              <small>Vista</small>
            </article>
          </div>
        </aside>

        <div className="map-shell__action-stack">
          <button
            className="primary-button map-shell__nearby"
            type="button"
            onClick={() => void handleNearby()}
            disabled={isLocating || loading}
          >
            {isLocating
              ? "Ubicando..."
              : loading
                ? "Buscando..."
                : "Cerca de mi"}
          </button>
          <Link
            href="/suggest"
            className="secondary-button map-shell__secondary-link"
          >
            Sugerir lugar
          </Link>
          {actionMessage ? (
            <p
              className="map-shell__action-feedback"
              role="status"
              aria-live="polite"
            >
              {actionMessage}
            </p>
          ) : null}
        </div>

        <section
          className={`map-shell__dock ${activePlace ? "has-selection" : ""} ${
            isPlaceCardCollapsed ? "is-collapsed" : ""
          }`}
        >
          {activePlace ? (
            <article
              className={`map-shell__place-card is-featured ${
                isPlaceCardCollapsed ? "is-collapsed" : ""
              }`}
            >
              <div className="map-shell__place-head">
                <div className="map-shell__place-meta">
                  <span>{formatBusinessType(activePlace.businessType)}</span>
                  {formatModality(activePlace.modality) ? (
                    <small>{formatModality(activePlace.modality)}</small>
                  ) : null}
                </div>
                <button
                  type="button"
                  className="map-shell__place-close"
                  onClick={handleHidePlaceCard}
                  aria-label={
                    isPlaceCardCollapsed
                      ? "Expandir ficha del comercio"
                      : hasActiveRoute
                        ? "Minimizar ficha del comercio"
                        : "Cerrar ficha del comercio"
                  }
                >
                  {isPlaceCardCollapsed
                    ? "Expandir"
                    : hasActiveRoute
                      ? "Minimizar"
                      : "Cerrar"}
                </button>
              </div>
              <div className="map-shell__place-copy">
                <h3>{activePlace.businessName}</h3>
                <p>
                  {activePlace.city} -{" "}
                  {activePlace.location?.addressText ??
                    "Sin coordenadas publicas"}
                </p>
                {activePlace.location?.reference ? (
                  <p>{activePlace.location.reference}</p>
                ) : null}
                {activePlace.location?.schedule ? (
                  <p>{activePlace.location.schedule}</p>
                ) : null}
                {routeSummary ? (
                  <p className="map-shell__route-summary">
                    Ruta: {routeSummary}
                  </p>
                ) : null}
              </div>
              <div
                className="map-shell__place-badges"
                aria-label="Servicios del comercio"
              >
                {activePlace.hasPhysicalStore ? (
                  <span>Tienda fisica</span>
                ) : null}
                {activePlace.hasShipping ? <span>Envios</span> : null}
                {activePlace.shippingAreasCount ? (
                  <span>{activePlace.shippingAreasCount} zonas</span>
                ) : null}
                {activePlace.ratingCount ? (
                  <span>★ {activePlace.ratingAverage.toFixed(1)}</span>
                ) : null}
              </div>
              <div className="map-shell__place-actions">
                <button
                  type="button"
                  onClick={() => void handleRouteToActivePlace()}
                  disabled={isRouting}
                >
                  {isRouting ? "Trazando..." : "Ruta aqui"}
                </button>
                {directionsUrl ? (
                  <a href={directionsUrl} target="_blank" rel="noreferrer">
                    Google Maps
                  </a>
                ) : null}
                <button
                  type="button"
                  onClick={() => void handleShareActivePlace()}
                >
                  Compartir
                </button>
                <Link href={`/places/${activePlace.id}`}>Detalle</Link>
                {hasActiveRoute ? (
                  <button type="button" onClick={handleClearRoute}>
                    Quitar ruta
                  </button>
                ) : null}
              </div>
            </article>
          ) : null}
        </section>
      </div>
    </section>
  );
}

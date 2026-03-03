'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Circle, MapContainer, TileLayer, useMap } from 'react-leaflet';
import { BoundsListener } from './BoundsListener';
import { MarkersLayer } from './MarkersLayer';
import { SearchBox } from './SearchBox';
import { getPlacesInBounds, getPlacesNearby } from '@/lib/api/services/places';
import type { PlaceSummary } from '@/lib/types';

type Filters = {
  businessType: string;
  modality: string;
  shippingAvailable: boolean;
};

const EXPLORER_GROUPS = [
  'Todos',
  'Panaderias',
  'Tiendas',
  'Cafeterias',
  'Restaurantes',
  'Con envios',
];

type ExplorerGroup = (typeof EXPLORER_GROUPS)[number];

const DEFAULT_CENTER: [number, number] = [-16.500113, -68.131226];

function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, Math.max(map.getZoom(), 13), {
      duration: 0.8,
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

export default function MapView() {
  const [places, setPlaces] = useState<PlaceSummary[]>([]);
  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [searchCenter, setSearchCenter] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [activeGroup, setActiveGroup] = useState<ExplorerGroup>('Todos');
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [status, setStatus] = useState('Mueve el mapa o usa "Cerca de mi" para descubrir comercios aprobados.');
  const [filters, setFilters] = useState<Filters>({
    businessType: '',
    modality: '',
    shippingAvailable: false,
  });

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

  async function loadByBounds(bounds: { minLat: number; minLng: number; maxLat: number; maxLng: number }) {
    try {
      setLoading(true);
      const items = await getPlacesInBounds({
        ...bounds,
        businessType: filters.businessType || undefined,
        modality: filters.modality || undefined,
        shippingAvailable: filters.shippingAvailable || undefined,
        verified: true,
      });

      setPlaces(items);
      setStatus(items.length ? `${items.length} comercios aprobados en la vista actual.` : 'Sin resultados en esta zona.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'No se pudo cargar el mapa.');
    } finally {
      setLoading(false);
    }
  }

  async function handleNearby() {
    if (isLocating || loading) {
      return;
    }

    const isLocalhost =
      typeof window !== 'undefined' &&
      ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);

    if (typeof window !== 'undefined' && !window.isSecureContext && !isLocalhost) {
      const message = 'En movil la ubicacion requiere HTTPS o abrir la app desde localhost.';
      setActionMessage(message);
      setStatus(message);
      return;
    }

    if (!navigator.geolocation) {
      const message = 'Tu navegador no soporta geolocalizacion.';
      setActionMessage(message);
      setStatus(message);
      return;
    }

    setIsLocating(true);
    setActionMessage('Solicitando tu ubicacion...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const nextCenter: [number, number] = [position.coords.latitude, position.coords.longitude];
        setCenter(nextCenter);
        setSearchCenter(nextCenter);
        setIsLocating(false);
        setLoading(true);
        setActionMessage('Buscando comercios cerca de vos...');

        try {
          const items = await getPlacesNearby({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            radius: 5000,
            businessType: filters.businessType || undefined,
            modality: filters.modality || undefined,
            shippingAvailable: filters.shippingAvailable || undefined,
            verified: true,
          });

          setPlaces(items);
          setStatus(items.length ? `${items.length} comercios dentro de 5 km.` : 'No hay comercios aprobados cerca.');
          setActionMessage(items.length ? `${items.length} lugares encontrados.` : 'No hay comercios aprobados cerca.');
        } catch (error) {
          const message = error instanceof Error ? error.message : 'No se pudo buscar cerca de vos.';
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
            ? 'Permiti la ubicacion del navegador para usar esta opcion.'
            : error.code === error.TIMEOUT
              ? 'La ubicacion tardo demasiado. Intentalo otra vez.'
              : 'No se pudo acceder a tu ubicacion.';

        setStatus(message);
        setActionMessage(message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );
  }

  function handleGroupSelect(group: ExplorerGroup) {
    setActiveGroup(group);
    setFilters((current) => {
      if (group === 'Con envios') {
        return {
          ...current,
          businessType: '',
          shippingAvailable: true,
        };
      }

      const businessTypeMap: Partial<Record<ExplorerGroup, string>> = {
        Panaderias: 'PANADERIA',
        Tiendas: 'TIENDA',
        Cafeterias: 'CAFETERIA',
        Restaurantes: 'RESTAURANTE',
      };

      return {
        ...current,
        businessType: businessTypeMap[group] ?? '',
        shippingAvailable: false,
      };
    });
  }

  const featuredPlaces = places.slice(0, 4);
  const shippingCount = places.filter((place) => place.hasShipping).length;

  return (
    <section className="map-shell">
      <div className="map-shell__frame">
        <MapContainer center={center} zoom={13} scrollWheelZoom zoomControl={false} className="leaflet-stage">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <BoundsListener onBoundsChange={loadByBounds} />
          <MarkersLayer places={places} />
          <MapZoomControls />
          {searchCenter ? (
            <>
              <RecenterMap center={searchCenter} />
              <Circle
                center={searchCenter}
                radius={5000}
                pathOptions={{ color: '#ff8a1c', fillOpacity: 0.06, weight: 1.5 }}
              />
            </>
          ) : null}
        </MapContainer>

        <aside className="map-shell__rail">
          <div className="map-shell__rail-nav">
            <span className="map-shell__rail-label">Collections</span>
            <ul className="map-shell__rail-list">
              {EXPLORER_GROUPS.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    className={item === activeGroup ? 'is-active' : undefined}
                    onClick={() => handleGroupSelect(item)}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="map-shell__headline">
            <p className="eyebrow">Mapa publico</p>
            <h2>Comercios verificados</h2>
            <p className="muted">
              Cada pin visible ya paso revision y ya puede mostrarse en el directorio publico.
            </p>
          </div>

          <SearchBox />

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
                <option value="CIEN_PORCIENTO_LIBRE_GLUTEN">100% libre gluten</option>
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

          <p className="status-pill map-shell__status">{loading ? 'Cargando lugares...' : status}</p>

          <div className="map-shell__stats">
            <article>
              <span>{places.length}</span>
              <small>Aprobados</small>
            </article>
            <article>
              <span>{shippingCount}</span>
              <small>Con envios</small>
            </article>
            <article>
              <span>{searchCenter ? '5km' : 'Live'}</span>
              <small>Rango</small>
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
            {isLocating ? 'Ubicando...' : loading ? 'Buscando...' : 'Cerca de mi'}
          </button>
          <Link href="/suggest" className="secondary-button map-shell__secondary-link">
            Sugerir lugar
          </Link>
          {actionMessage ? (
            <p className="map-shell__action-feedback" role="status" aria-live="polite">
              {actionMessage}
            </p>
          ) : null}
        </div>

        <section className="map-shell__dock">
          {featuredPlaces.length ? (
            featuredPlaces.map((place, index) => (
              <article key={place.id} className={`map-shell__place-card ${index === 0 ? 'is-featured' : ''}`}>
                <div className="map-shell__place-meta">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <small>{place.businessType}</small>
                </div>
                <div className="map-shell__place-copy">
                  <h3>{place.businessName}</h3>
                  <p>
                    {place.city} - {place.location?.addressText ?? 'Sin coordenadas publicas'}
                  </p>
                </div>
                <Link href={`/places/${place.id}`}>Ver detalle</Link>
              </article>
            ))
          ) : (
            <div className="map-shell__empty">Aun no hay comercios en esta vista. Mueve el mapa o cambia filtros.</div>
          )}
        </section>
      </div>
    </section>
  );
}

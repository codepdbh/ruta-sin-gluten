'use client';

import { FormEvent, useState } from 'react';
import { createDeliveryPoint, createMainLocation } from '@/lib/api/services/vendors';

export default function SellerLocationsPage() {
  const [mode, setMode] = useState<'main' | 'delivery'>('main');
  const [message, setMessage] = useState('Registrá local principal o puntos de entrega.');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const payload = {
      addressText: String(formData.get('addressText') ?? ''),
      reference: String(formData.get('reference') ?? ''),
      lat: formData.get('lat') ? Number(formData.get('lat')) : undefined,
      lng: formData.get('lng') ? Number(formData.get('lng')) : undefined,
    };

    try {
      if (mode === 'main') {
        await createMainLocation(payload);
      } else {
        await createDeliveryPoint({
          ...payload,
          name: String(formData.get('name') ?? 'Punto de entrega'),
          schedule: String(formData.get('schedule') ?? ''),
        });
      }

      setMessage(mode === 'main' ? 'Ubicación principal guardada.' : 'Punto de entrega agregado.');
      event.currentTarget.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo guardar la ubicación.');
    }
  }

  return (
    <section className="page-card">
      <p className="eyebrow">Seller</p>
      <h1>Ubicaciones y entregas</h1>
      <div className="inline-actions">
        <button className={mode === 'main' ? 'primary-button' : 'secondary-button'} type="button" onClick={() => setMode('main')}>
          Local principal
        </button>
        <button className={mode === 'delivery' ? 'primary-button' : 'secondary-button'} type="button" onClick={() => setMode('delivery')}>
          Punto de entrega
        </button>
      </div>
      <form className="form-grid two-col" onSubmit={handleSubmit}>
        {mode === 'delivery' ? (
          <>
            <label>
              Nombre del punto
              <input name="name" required />
            </label>
            <label>
              Horario
              <input name="schedule" placeholder="Lun a Vie 09:00 - 18:00" />
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
          <input name="lat" type="number" step="any" />
        </label>
        <label>
          Longitud
          <input name="lng" type="number" step="any" />
        </label>
        <button className="primary-button" type="submit">
          Guardar {mode === 'main' ? 'ubicación' : 'punto'}
        </button>
      </form>
      <p className="status-pill">{message}</p>
    </section>
  );
}

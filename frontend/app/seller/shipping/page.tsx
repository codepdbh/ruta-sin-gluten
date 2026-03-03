'use client';

import { FormEvent, useState } from 'react';
import { createShippingArea } from '@/lib/api/services/vendors';

export default function SellerShippingPage() {
  const [message, setMessage] = useState('Configurá cobertura y costo de envío.');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      await createShippingArea({
        department: String(formData.get('department') ?? ''),
        city: String(formData.get('city') ?? '') || undefined,
        deliveryType: String(formData.get('deliveryType') ?? ''),
        cost: formData.get('cost') ? Number(formData.get('cost')) : undefined,
        etaText: String(formData.get('etaText') ?? '') || undefined,
      });

      setMessage('Cobertura de envío guardada.');
      event.currentTarget.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo guardar el envío.');
    }
  }

  return (
    <section className="page-card">
      <p className="eyebrow">Seller</p>
      <h1>Envíos</h1>
      <form className="form-grid two-col" onSubmit={handleSubmit}>
        <label>
          Departamento
          <input name="department" required />
        </label>
        <label>
          Ciudad (opcional)
          <input name="city" />
        </label>
        <label>
          Tipo de entrega
          <input name="deliveryType" placeholder="Motorizado, encomienda..." required />
        </label>
        <label>
          Costo
          <input name="cost" type="number" step="0.01" />
        </label>
        <label style={{ gridColumn: '1 / -1' }}>
          Tiempo estimado
          <input name="etaText" placeholder="24 a 48 horas" />
        </label>
        <button className="primary-button" type="submit">
          Guardar cobertura
        </button>
      </form>
      <p className="status-pill">{message}</p>
    </section>
  );
}

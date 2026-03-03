'use client';

import { FormEvent, useState } from 'react';
import { createSuggestion } from '@/lib/api/services/suggestions';

export default function SuggestPage() {
  const [message, setMessage] = useState('Las sugerencias se envían como PENDING para revisión admin.');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setLoading(true);
    setMessage('Enviando sugerencia...');

    try {
      await createSuggestion({
        placeName: String(formData.get('placeName') ?? ''),
        typeGuess: String(formData.get('typeGuess') ?? ''),
        addressText: String(formData.get('addressText') ?? ''),
        reference: String(formData.get('reference') ?? ''),
        lat: formData.get('lat') ? Number(formData.get('lat')) : undefined,
        lng: formData.get('lng') ? Number(formData.get('lng')) : undefined,
        comment: String(formData.get('comment') ?? ''),
      });

      event.currentTarget.reset();
      setMessage('Sugerencia enviada. Quedó pendiente de revisión.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo enviar la sugerencia.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page-card">
      <p className="eyebrow">Comunidad</p>
      <h1>Sugerir un lugar</h1>
      <form className="form-grid two-col" onSubmit={handleSubmit}>
        <label>
          Nombre del lugar
          <input name="placeName" required />
        </label>
        <label>
          Tipo estimado
          <input name="typeGuess" placeholder="Panadería, cafetería..." required />
        </label>
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
        <label style={{ gridColumn: '1 / -1' }}>
          Comentario
          <textarea name="comment" />
        </label>
        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar sugerencia'}
        </button>
      </form>
      <p className="status-pill">{message}</p>
    </section>
  );
}

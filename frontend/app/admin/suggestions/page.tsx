'use client';

import { useEffect, useState } from 'react';
import { getPendingSuggestions, reviewSuggestion } from '@/lib/api/services/admin';
import type { SuggestionItem } from '@/lib/types';

export default function AdminSuggestionsPage() {
  const [items, setItems] = useState<SuggestionItem[]>([]);
  const [message, setMessage] = useState('Revisá sugerencias pendientes.');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadPending() {
      try {
        const pending = await getPendingSuggestions();
        if (active) {
          setItems(pending);
          setMessage(pending.length ? `${pending.length} sugerencias pendientes.` : 'No hay sugerencias pendientes.');
        }
      } catch (error) {
        if (active) {
          setMessage(error instanceof Error ? error.message : 'No se pudo cargar sugerencias.');
        }
      }
    }

    void loadPending();

    return () => {
      active = false;
    };
  }, [reloadKey]);

  async function handleReview(id: string, status: 'APPROVED' | 'REJECTED' | 'CONVERTED') {
    try {
      await reviewSuggestion(id, { status });
      setReloadKey((current) => current + 1);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo revisar la sugerencia.');
    }
  }

  return (
    <section className="page-card admin-review-page">
      <div className="directory-page__header">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Sugerencias pendientes</h1>
          <p className="muted">Aportes de la comunidad listos para validar, convertir o descartar.</p>
        </div>
      </div>
      <p className="status-pill">{message}</p>
      {!items.length ? <p className="empty-state">Cuando la comunidad sugiera lugares nuevos apareceran aqui.</p> : null}
      <div className="data-list">
        {items.map((item) => (
          <article key={item.id} className="result-card admin-review-card">
            <div className="admin-review-card__header">
              <div>
                <span className="task-card__meta">{item.typeGuess}</span>
                <h2>{item.placeName}</h2>
                <p>{item.addressText}</p>
              </div>
            </div>
            <p>{item.comment}</p>
            <div className="inline-actions admin-review-card__actions">
              <button className="primary-button" type="button" onClick={() => void handleReview(item.id, 'APPROVED')}>
                Aprobar
              </button>
              <button className="secondary-button" type="button" onClick={() => void handleReview(item.id, 'CONVERTED')}>
                Convertir
              </button>
              <button className="secondary-button" type="button" onClick={() => void handleReview(item.id, 'REJECTED')}>
                Rechazar
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

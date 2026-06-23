'use client';

import { useEffect, useState } from 'react';
import { getPendingVerifications, reviewVerification } from '@/lib/api/services/admin';
import { buildAssetUrl } from '@/lib/api/client';
import type { VerificationItem } from '@/lib/types';

export default function AdminApprovalsPage() {
  const [items, setItems] = useState<VerificationItem[]>([]);
  const [message, setMessage] = useState('Inicia sesion como ADMIN para revisar videos.');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadPending() {
      try {
        const pending = await getPendingVerifications();
        if (active) {
          setItems(pending);
          setMessage(pending.length ? `${pending.length} verificaciones pendientes.` : 'No hay verificaciones pendientes.');
        }
      } catch (error) {
        if (active) {
          setMessage(error instanceof Error ? error.message : 'No se pudo cargar verificaciones.');
        }
      }
    }

    void loadPending();

    return () => {
      active = false;
    };
  }, [reloadKey]);

  async function handleReview(id: string, status: 'APPROVED' | 'REJECTED' | 'OBSERVED') {
    try {
      await reviewVerification(id, {
        status,
        notes: `Revision ${status.toLowerCase()} desde el panel admin.`,
      });
      setReloadKey((current) => current + 1);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo revisar la verificación.');
    }
  }

  return (
    <section className="page-card admin-review-page">
      <div className="directory-page__header">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Aprobaciones de verificacion</h1>
          <p className="muted">Control de confianza para comercios que quieren aparecer como verificados.</p>
        </div>
      </div>
      <p className="status-pill">{message}</p>
      {!items.length ? <p className="empty-state">Cuando existan solicitudes nuevas apareceran aqui.</p> : null}
      <div className="data-list">
        {items.map((item) => (
          <article key={item.id} className="panel-card admin-review-card">
            <div className="admin-review-card__header">
              <div>
                <span className="task-card__meta">Comercio</span>
                <h2>{item.sellerProfile.businessName}</h2>
                <p>
                  {item.sellerProfile.user.name} · {item.sellerProfile.user.email}
                </p>
              </div>
            </div>
            <video className="video-frame" controls src={buildAssetUrl(item.videoUrl)} />
            <div className="inline-actions admin-review-card__actions">
              <button className="primary-button" type="button" onClick={() => void handleReview(item.id, 'APPROVED')}>
                Aprobar
              </button>
              <button className="secondary-button" type="button" onClick={() => void handleReview(item.id, 'OBSERVED')}>
                Observar
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

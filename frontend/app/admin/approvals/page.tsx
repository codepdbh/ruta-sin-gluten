'use client';

import { useEffect, useState } from 'react';
import { getPendingVerifications, reviewVerification } from '@/lib/api/services/admin';
import type { VerificationItem } from '@/lib/types';

export default function AdminApprovalsPage() {
  const [items, setItems] = useState<VerificationItem[]>([]);
  const [message, setMessage] = useState('Cargá una sesión ADMIN para revisar videos.');
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
        notes: `Revisión ${status.toLowerCase()} desde el panel MVP.`,
      });
      setReloadKey((current) => current + 1);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo revisar la verificación.');
    }
  }

  return (
    <section className="page-card">
      <p className="eyebrow">Admin</p>
      <h1>Aprobaciones de verificación</h1>
      <p className="status-pill">{message}</p>
      <div className="data-list">
        {items.map((item) => (
          <article key={item.id} className="panel-card">
            <h2>{item.sellerProfile.businessName}</h2>
            <p>
              {item.sellerProfile.user.name} · {item.sellerProfile.user.email}
            </p>
            <video className="video-frame" controls src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${item.videoUrl}`} />
            <div className="inline-actions">
              <button className="primary-button" type="button" onClick={() => void handleReview(item.id, 'APPROVED')}>
                Approve
              </button>
              <button className="secondary-button" type="button" onClick={() => void handleReview(item.id, 'OBSERVED')}>
                Observe
              </button>
              <button className="secondary-button" type="button" onClick={() => void handleReview(item.id, 'REJECTED')}>
                Reject
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

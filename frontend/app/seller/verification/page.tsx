'use client';

import { FormEvent, useState } from 'react';
import { apiFetch } from '@/lib/api/client';

export default function SellerVerificationPage() {
  const [message, setMessage] = useState('Subí el video y luego enviá la solicitud.');
  const [videoUrl, setVideoUrl] = useState('');

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      const file = formData.get('file');
      const uploadBody = new FormData();

      if (file instanceof File) {
        uploadBody.append('file', file);
      }

      const upload = await apiFetch<{ url: string }>('/media/upload', {
        method: 'POST',
        auth: true,
        body: uploadBody,
      });

      setVideoUrl(upload.url);
      setMessage('Archivo subido. Ahora enviá la verificación.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo subir el video.');
    }
  }

  async function handleSubmit() {
    try {
      await apiFetch('/verification/submit', {
        method: 'POST',
        auth: true,
        body: {
          videoUrl,
        },
      });

      setMessage('Verificación enviada con estado PENDING.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo enviar la verificación.');
    }
  }

  return (
    <section className="page-card">
      <p className="eyebrow">Seller</p>
      <h1>Verificación por video</h1>
      <form className="form-grid" onSubmit={handleUpload}>
        <label>
          Archivo de video
          <input name="file" type="file" accept="video/*" required />
        </label>
        <button className="primary-button" type="submit">
          Subir video
        </button>
      </form>
      <label>
        URL del video
        <input value={videoUrl} onChange={(event) => setVideoUrl(event.target.value)} placeholder="/uploads/mi-video.mp4" />
      </label>
      <button className="secondary-button" type="button" onClick={() => void handleSubmit()} disabled={!videoUrl}>
        Enviar para revisión
      </button>
      <p className="status-pill">{message}</p>
    </section>
  );
}

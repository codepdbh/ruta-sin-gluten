'use client';

import { FormEvent, useState } from 'react';
import { login } from '@/lib/api/services/auth';
import { saveAuthToken } from '@/lib/api/client';

export default function LoginPage() {
  const [message, setMessage] = useState('Iniciá sesión para usar el dashboard seller o admin.');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setLoading(true);
    setMessage('Validando credenciales...');

    try {
      const response = await login({
        email: String(formData.get('email') ?? ''),
        password: String(formData.get('password') ?? ''),
      });

      saveAuthToken(response.accessToken);
      setMessage(`Sesión iniciada como ${response.user.role}. Token guardado en este navegador.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo iniciar sesión.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page-card">
      <p className="eyebrow">Acceso</p>
      <h1>Ingresar</h1>
      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          Correo
          <input name="email" type="email" defaultValue="seller@rutasingluten.local" required />
        </label>
        <label>
          Contraseña
          <input name="password" type="password" defaultValue="Password123!" required />
        </label>
        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
      <p className="status-pill">{message}</p>
    </section>
  );
}

'use client';

import { FormEvent, useState } from 'react';
import { register } from '@/lib/api/services/auth';
import { saveAuthToken } from '@/lib/api/client';

export default function RegisterPage() {
  const [message, setMessage] = useState('Creá una cuenta USER o SELLER.');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setLoading(true);
    setMessage('Creando cuenta...');

    try {
      const response = await register({
        name: String(formData.get('name') ?? ''),
        email: String(formData.get('email') ?? ''),
        password: String(formData.get('password') ?? ''),
        phone: String(formData.get('phone') ?? ''),
        role: String(formData.get('role') ?? 'USER') as 'USER' | 'SELLER',
      });

      saveAuthToken(response.accessToken);
      setMessage(`Cuenta creada como ${response.user.role}. Ya podés seguir con el flujo.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo registrar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page-card">
      <p className="eyebrow">Registro</p>
      <h1>Crear cuenta</h1>
      <form className="form-grid two-col" onSubmit={handleSubmit}>
        <label>
          Nombre
          <input name="name" required />
        </label>
        <label>
          Celular
          <input name="phone" />
        </label>
        <label>
          Correo
          <input name="email" type="email" required />
        </label>
        <label>
          Rol
          <select name="role" defaultValue="USER">
            <option value="USER">USER</option>
            <option value="SELLER">SELLER</option>
          </select>
        </label>
        <label>
          Contraseña
          <input name="password" type="password" minLength={8} required />
        </label>
        <div className="inline-actions">
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </button>
        </div>
      </form>
      <p className="status-pill">{message}</p>
    </section>
  );
}

"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/lib/api/services/auth";

export default function RecoverPasswordPage() {
  const [message, setMessage] = useState(
    "Ingresa tu correo y te enviaremos un enlace para crear una nueva contraseña.",
  );
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setLoading(true);
    setMessage("Preparando el enlace de recuperacion...");

    try {
      const response = await requestPasswordReset({
        email: String(formData.get("email") ?? ""),
      });

      setSent(true);
      setMessage(response.message);
      form.reset();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "No se pudo iniciar la recuperacion.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page-card">
      <p className="eyebrow">Recuperacion</p>
      <h1>Recuperar contraseña</h1>
      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          Correo de tu cuenta
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="tu-correo@ejemplo.com"
            required
          />
        </label>
        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Enviar enlace"}
        </button>
      </form>
      <p className={`status-pill ${sent ? "" : "is-warning"}`}>{message}</p>
      <div className="auth-links">
        <p>
          ¿Recordaste tu contraseña? <Link href="/login">Ingresar</Link>
        </p>
      </div>
    </section>
  );
}

"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { resetPassword } from "@/lib/api/services/auth";

export default function ResetPasswordPage() {
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("Cargando enlace de recuperacion...");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const nextToken = new URLSearchParams(window.location.search).get("token");

    if (!nextToken) {
      setMessage("El enlace no incluye un token de recuperacion.");
      return;
    }

    setToken(nextToken);
    setMessage("Escribe una nueva contraseña de al menos 8 caracteres.");
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      setMessage("El enlace no incluye un token de recuperacion.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    setMessage("Actualizando contraseña...");

    try {
      const response = await resetPassword({ token, password });
      setDone(true);
      setMessage(response.message);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "No se pudo restablecer la contraseña.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page-card">
      <p className="eyebrow">Nueva contraseña</p>
      <h1>Restablecer acceso</h1>
      {!done ? (
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Nueva contraseña
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              placeholder="Minimo 8 caracteres"
              required
            />
          </label>
          <label>
            Repetir contraseña
            <input
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              minLength={8}
              placeholder="Repite tu contraseña"
              required
            />
          </label>
          <button
            className="primary-button"
            type="submit"
            disabled={loading || !token}
          >
            {loading ? "Guardando..." : "Guardar contraseña"}
          </button>
        </form>
      ) : null}
      <p className={`status-pill ${done ? "" : "is-warning"}`}>{message}</p>
      <div className="auth-links">
        <p>
          ¿Ya tienes acceso? <Link href="/login">Ingresar</Link>
        </p>
      </div>
    </section>
  );
}

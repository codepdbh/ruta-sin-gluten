"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api/services/auth";
import { saveAuthToken } from "@/lib/api/client";

function getPostLoginPath(role: string) {
  if (role === "SELLER") {
    return "/seller/dashboard";
  }

  if (role === "ADMIN") {
    return "/admin/dashboard";
  }

  return "/mi-cuenta";
}

export default function LoginPage() {
  const router = useRouter();
  const [message, setMessage] = useState(
    "Iniciá sesión para usar el dashboard seller o admin.",
  );
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setLoading(true);
    setMessage("Validando credenciales...");

    try {
      const response = await login({
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
      });

      saveAuthToken(response.accessToken);
      const nextPath = getPostLoginPath(response.user.role);
      setMessage(
        response.user.emailVerified
          ? "Sesion iniciada. Te llevamos a tu panel..."
          : "Sesion iniciada. Tu correo todavia no esta verificado; te llevamos a tu cuenta.",
      );
      router.replace(nextPath);
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "No se pudo iniciar sesión.",
      );
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
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="tu-correo@ejemplo.com"
            required
          />
        </label>
        <label>
          Contraseña
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Tu contraseña"
            required
          />
        </label>
        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
      <div className="auth-links">
        <Link className="inline-link" href="/recuperar-password">
          ¿Olvidaste tu contraseña?
        </Link>
        <p>
          ¿Sin cuenta aun?{" "}
          <Link href="/register">Crea una cuenta</Link>
        </p>
      </div>
      <p className="status-pill">{message}</p>
    </section>
  );
}

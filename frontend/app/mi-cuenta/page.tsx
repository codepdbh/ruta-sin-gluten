"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clearAuthToken } from "@/lib/api/client";
import { getMe, resendEmailVerification } from "@/lib/api/services/auth";

type SessionUser = Awaited<ReturnType<typeof getMe>>;
type AccountState = "loading" | "guest" | "ready" | "error";

export default function MyAccountPage() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [accountState, setAccountState] = useState<AccountState>("loading");
  const [message, setMessage] = useState("Cargando tu cuenta...");
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = window.localStorage.getItem("rutasingluten_token");

      if (!token) {
        setAccountState("guest");
        setMessage("");
        return;
      }
    }

    void getMe()
      .then((currentUser) => {
        setUser(currentUser);
        setAccountState("ready");
        setMessage("");
      })
      .catch((error) => {
        const errorMessage =
          error instanceof Error ? error.message : "No se pudo cargar tu cuenta.";

        if (/unauthorized|401|no autorizado/i.test(errorMessage)) {
          clearAuthToken();
          setAccountState("guest");
          setMessage("");
          return;
        }

        setAccountState("error");
        setMessage(errorMessage);
      });
  }, []);

  async function handleResendVerification() {
    setResending(true);
    setMessage("Enviando correo de verificacion...");

    try {
      const response = await resendEmailVerification();
      setMessage(response.message);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "No se pudo enviar la verificacion.",
      );
    } finally {
      setResending(false);
    }
  }

  if (accountState === "loading") {
    return (
      <section className="page-card account-page account-page--compact">
        <p className="status-pill">{message}</p>
      </section>
    );
  }

  if (accountState === "guest") {
    return (
      <section className="page-card account-page account-gate">
        <div className="account-gate__badge">Cuenta</div>
        <h1>Ingresa para ver tu perfil</h1>
        <p className="muted">
          Guarda tus datos, registra comercios, revisa verificaciones y administra tus aportes desde aqui.
        </p>
        <div className="inline-actions account-gate__actions">
          <Link className="primary-button" href="/login">
            Ingresar
          </Link>
          <Link className="secondary-button" href="/register">
            Crear cuenta
          </Link>
        </div>
      </section>
    );
  }

  if (accountState === "error" || !user) {
    return (
      <section className="page-card account-page account-page--compact">
        <p className="status-pill is-warning">{message || "No se pudo cargar tu cuenta."}</p>
      </section>
    );
  }

  return (
    <section className="page-card account-page">
      <div className="account-page__header">
        <div>
          <p className="eyebrow">Mi cuenta</p>
          <h1>{user.name}</h1>
        </div>
        <span className={user.emailVerified ? "status-chip is-ok" : "status-chip is-pending"}>
          {user.emailVerified ? "Correo verificado" : "Verificacion pendiente"}
        </span>
      </div>
      <div className="data-list">
        <article className="result-card">
          <h2>Datos principales</h2>
          <p>Correo: {user.email}</p>
          <p>Correo verificado: {user.emailVerified ? "Si" : "Pendiente"}</p>
          <p>Rol: {user.role}</p>
          <p>Celular: {user.phone ?? "No registrado"}</p>
          {!user.emailVerified ? (
            <button
              className="secondary-button"
              type="button"
              onClick={handleResendVerification}
              disabled={resending}
            >
              {resending ? "Enviando..." : "Reenviar verificacion"}
            </button>
          ) : null}
        </article>
      </div>
      {message ? <p className="status-pill">{message}</p> : null}
    </section>
  );
}

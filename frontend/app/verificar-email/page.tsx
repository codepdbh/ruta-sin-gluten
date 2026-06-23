"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { confirmEmailVerification } from "@/lib/api/services/auth";

export default function VerifyEmailPage() {
  const [message, setMessage] = useState("Verificando tu correo...");
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");

  useEffect(() => {
    async function verifyToken() {
      const token = new URLSearchParams(window.location.search).get("token");

      if (!token) {
        await Promise.resolve();
        setStatus("error");
        setMessage("El enlace no incluye un token de verificacion.");
        return;
      }

      try {
        const response = await confirmEmailVerification(token);
        setStatus("ok");
        setMessage(response.message);
      } catch (error) {
        setStatus("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "No se pudo verificar el correo.",
        );
      }
    }

    void verifyToken();
  }, []);

  return (
    <section className="page-card">
      <p className="eyebrow">Verificacion de correo</p>
      <h1>{status === "ok" ? "Correo verificado" : "Confirmando acceso"}</h1>
      <p className={`status-pill ${status === "error" ? "is-warning" : ""}`}>
        {message}
      </p>
      <div className="inline-actions">
        <Link className="primary-button" href="/mi-cuenta">
          Ir a mi cuenta
        </Link>
      </div>
    </section>
  );
}

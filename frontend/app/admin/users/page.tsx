"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { deleteAdminUser, getAdminUsers } from "@/lib/api/services/admin";
import type { AdminUserItem } from "@/lib/types";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-BO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [message, setMessage] = useState("Cargando usuarios...");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    void getAdminUsers()
      .then((items) => {
        if (active) {
          setUsers(items);
          setMessage(
            items.length
              ? `${items.length} usuarios registrados.`
              : "No hay usuarios registrados.",
          );
        }
      })
      .catch((error) => {
        if (active) {
          setMessage(
            error instanceof Error
              ? error.message
              : "No se pudieron cargar usuarios.",
          );
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(
    () => ({
      total: users.length,
      verified: users.filter((user) => user.emailVerified).length,
      sellers: users.filter((user) => user.role === "SELLER").length,
      admins: users.filter((user) => user.role === "ADMIN").length,
    }),
    [users],
  );

  async function handleDeleteUser(user: AdminUserItem) {
    const commerceText = user.sellerProfile
      ? ` Tambien se eliminara el comercio "${user.sellerProfile.businessName}" con productos, ubicaciones, videos y puntajes asociados.`
      : "";
    const confirmed = window.confirm(
      `Se eliminara la cuenta de ${user.name} (${user.email}).${commerceText} Esta accion no se puede deshacer.`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(user.id);
    setMessage(`Eliminando usuario ${user.email}...`);

    try {
      await deleteAdminUser(user.id);
      setUsers((current) => current.filter((item) => item.id !== user.id));
      setMessage(`${user.email} fue eliminado correctamente.`);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar el usuario.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="page-card admin-review-page">
      <div className="directory-page__header">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Usuarios</h1>
          <p className="muted">
            Listado completo de cuentas, roles y estado de verificacion de
            correo.
          </p>
        </div>
        <Link className="inline-link" href="/admin/businesses">
          Ver comercios
        </Link>
      </div>

      <div className="dashboard-grid admin-kpi-grid">
        <article className="metric-card metric-card--warm">
          <span>Total</span>
          <strong>{stats.total}</strong>
          <p>Cuentas registradas.</p>
        </article>
        <article className="metric-card metric-card--cool">
          <span>Verificados</span>
          <strong>{stats.verified}</strong>
          <p>Correos confirmados.</p>
        </article>
        <article className="metric-card metric-card--neutral">
          <span>Vendedores</span>
          <strong>{stats.sellers}</strong>
          <p>Cuentas con rol comercio.</p>
        </article>
        <article className="metric-card metric-card--warm">
          <span>Admins</span>
          <strong>{stats.admins}</strong>
          <p>Acceso operativo.</p>
        </article>
      </div>

      <p className="status-pill">{message}</p>

      <div className="data-list admin-entity-list">
        {users.map((user) => (
          <article key={user.id} className="result-card admin-entity-card">
            <div>
              <span className="task-card__meta">{user.role}</span>
              <h2>{user.name}</h2>
              <p>{user.email}</p>
              <p>
                {user.phone
                  ? `Celular: ${user.phone}`
                  : "Sin celular registrado"}
              </p>
            </div>
            <div className="admin-entity-card__meta">
              <span
                className={
                  user.emailVerified
                    ? "status-chip is-ok"
                    : "status-chip is-pending"
                }
              >
                {user.emailVerified ? "Correo verificado" : "Correo pendiente"}
              </span>
              {user.sellerProfile ? (
                <span className="status-chip">
                  {user.sellerProfile.businessName} ·{" "}
                  {user.sellerProfile.status}
                </span>
              ) : null}
              <div className="admin-entity-card__actions">
                {user.sellerProfile ? (
                  <Link href={`/places/${user.sellerProfile.id}`}>
                    Ver comercio
                  </Link>
                ) : null}
                <button
                  className="danger-button"
                  type="button"
                  disabled={deletingId === user.id}
                  onClick={() => void handleDeleteUser(user)}
                >
                  {deletingId === user.id ? "Eliminando..." : "Eliminar usuario"}
                </button>
              </div>
              <small>Creado: {formatDate(user.createdAt)}</small>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

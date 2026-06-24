"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AUTH_EVENT, clearAuthToken } from "@/lib/api/client";
import { getMe } from "@/lib/api/services/auth";

type SessionUser = Awaited<ReturnType<typeof getMe>>;

type UserAccountMenuProps = {
  mobile?: boolean;
};

function getInitials(name?: string | null) {
  if (!name) {
    return "RS";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase() ?? "")
    .join("");
}

function getMenuItems(user: SessionUser) {
  const items = [
    { href: "/mi-cuenta", label: "Mi cuenta" },
    { href: "/donativos", label: "Donativos" },
  ];

  if (user.role === "SELLER") {
    items.splice(
      1,
      0,
      { href: "/seller/dashboard", label: "Panel de comercio" },
      { href: "/seller/locations", label: "Ubicaciones" },
      { href: "/seller/products", label: "Productos" },
    );
  }

  if (user.role === "ADMIN") {
    items.splice(1, 0, { href: "/admin/dashboard", label: "Panel admin" });
  }

  return items;
}

export function UserAccountMenu({ mobile = false }: UserAccountMenuProps) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    async function syncUser() {
      if (typeof window === "undefined") {
        return;
      }

      const token = window.localStorage.getItem("rutasingluten_token");

      if (!token) {
        setUser(null);
        return;
      }

      try {
        const me = await getMe();
        setUser(me);
      } catch {
        clearAuthToken();
        setUser(null);
      }
    }

    void syncUser();

    const handleAuthChange = () => {
      void syncUser();
    };

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!containerRef.current) {
        return;
      }

      const target = event.target;

      if (target instanceof Node && !containerRef.current.contains(target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener(AUTH_EVENT, handleAuthChange as EventListener);
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener(AUTH_EVENT, handleAuthChange as EventListener);
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const items = useMemo(() => (user ? getMenuItems(user) : []), [user]);

  function handleLogout() {
    clearAuthToken();
    setOpen(false);
    setUser(null);
    router.push("/");
    router.refresh();
  }

  if (!user) {
    return mobile ? (
      <div className="mobile-account__links">
        <Link href="/register" onClick={() => setOpen(false)}>
          Crear cuenta
        </Link>
        <Link href="/login" onClick={() => setOpen(false)}>
          Ingresar
        </Link>
      </div>
    ) : (
      <>
        <Link href="/register">Crear cuenta</Link>
        <Link href="/login">Ingresar</Link>
      </>
    );
  }

  if (mobile) {
    return (
      <div
        className="mobile-account__links mobile-account__links--user"
        ref={containerRef}
      >
        <div className="account-menu__summary account-menu__summary--mobile">
          {user.avatarUrl ? (
            <img
              className="account-menu__avatar"
              src={user.avatarUrl}
              alt={user.name}
            />
          ) : (
            <span className="account-menu__avatar account-menu__avatar--fallback">
              {getInitials(user.name)}
            </span>
          )}
          <div className="account-menu__copy">
            <small>Bienvenido</small>
            <strong>{user.name}</strong>
          </div>
        </div>
        {items.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
        <button
          type="button"
          className="mobile-account__logout"
          onClick={handleLogout}
        >
          Cerrar sesion
        </button>
      </div>
    );
  }

  return (
    <div className={`account-menu ${open ? "is-open" : ""}`} ref={containerRef}>
      <button
        type="button"
        className="account-menu__trigger"
        aria-expanded={open}
        aria-label="Abrir menu de usuario"
        onClick={() => setOpen((current) => !current)}
      >
        {user.avatarUrl ? (
          <img
            className="account-menu__avatar"
            src={user.avatarUrl}
            alt={user.name}
          />
        ) : (
          <span className="account-menu__avatar account-menu__avatar--fallback">
            {getInitials(user.name)}
          </span>
        )}
        <span className="account-menu__copy">
          <small>Bienvenido</small>
          <strong>{user.name}</strong>
        </span>
      </button>
      {open ? (
        <div className="account-menu__panel">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <button
            type="button"
            className="account-menu__logout"
            onClick={handleLogout}
          >
            Cerrar sesion
          </button>
        </div>
      ) : null}
    </div>
  );
}

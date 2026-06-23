"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_TABS = [
  { href: "/admin/dashboard", label: "Resumen" },
  { href: "/admin/approvals", label: "Verificaciones" },
  { href: "/admin/suggestions", label: "Sugerencias" },
  { href: "/admin/users", label: "Usuarios" },
  { href: "/admin/businesses", label: "Comercios" },
  { href: "/admin/reports", label: "Reportes" },
];

export function AdminTabs() {
  const pathname = usePathname();

  return (
    <nav className="admin-tabs" aria-label="Panel de administracion">
      {ADMIN_TABS.map((tab) => {
        const active =
          pathname === tab.href || pathname.startsWith(`${tab.href}/`);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={active ? "is-active" : undefined}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

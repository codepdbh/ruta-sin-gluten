"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const BASE_LINKS = [
  { href: "/places", label: "Lugares" },
  { href: "/products", label: "Productos" },
  { href: "/suggest", label: "Sugerir" },
  { href: "/donativos", label: "Donativos" },
];

export function HeaderNav() {
  const pathname = usePathname();
  const links =
    pathname === "/"
      ? BASE_LINKS
      : [{ href: "/", label: "Mapa" }, ...BASE_LINKS];

  return (
    <nav className="topbar__nav">
      {links.map((link) => (
        <Link key={link.href} href={link.href}>
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

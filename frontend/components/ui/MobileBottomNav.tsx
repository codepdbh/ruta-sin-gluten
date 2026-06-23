"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MOBILE_LINKS = [
  { href: "/", label: "Mapa" },
  { href: "/places", label: "Lugares" },
  { href: "/products", label: "Productos" },
  { href: "/donativos", label: "Donar" },
  { href: "/mi-cuenta", label: "Cuenta" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="mobile-bottom-nav" aria-label="Navegacion principal movil">
      {MOBILE_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={isActive(pathname, link.href) ? "is-active" : undefined}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

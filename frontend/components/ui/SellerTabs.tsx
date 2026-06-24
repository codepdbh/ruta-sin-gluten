'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SELLER_TABS = [
  { href: '/seller/verification', label: 'Verificacion' },
  { href: '/seller/dashboard', label: 'Resumen' },
  { href: '/seller/business', label: 'Perfil' },
  { href: '/seller/locations', label: 'Ubicaciones' },
  { href: '/seller/products', label: 'Productos' },
  { href: '/seller/shipping', label: 'Envios' },
];

export function SellerTabs() {
  const pathname = usePathname();

  return (
    <nav className="seller-tabs" aria-label="Panel de comercio">
      {SELLER_TABS.map((tab) => {
        const isActive = pathname === tab.href;

        return (
          <Link key={tab.href} href={tab.href} className={isActive ? 'is-active' : undefined}>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

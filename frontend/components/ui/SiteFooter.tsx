'use client';

import { usePathname } from 'next/navigation';

export function SiteFooter() {
  const pathname = usePathname();

  if (pathname === '/') {
    return null;
  }

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p className="site-footer__headline">Desarrollado en Bolivia 🇧🇴</p>
        <p className="site-footer__copy">Ing. Paulo Daniel Batuani Hurtado y Codex 5.4</p>
      </div>
    </footer>
  );
}

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { HeaderNav } from '@/components/ui/HeaderNav';
import { MobileAccountMenu } from '@/components/ui/MobileAccountMenu';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import './globals.css';

export const metadata: Metadata = {
  title: 'RutaSinGluten',
  description: 'Mapa y directorio de comercios sin gluten verificados',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <header className="topbar">
          <Link href="/" className="brandmark">
            <span className="brandmark__crest brandmark__crest--image">
              <Image src="/logo.png" alt="RutaSinGluten" width={360} height={300} priority />
            </span>
          </Link>
          <MobileAccountMenu />
          <HeaderNav />
          <div className="topbar__actions">
            <ThemeToggle />
            <Link href="/register">Crear cuenta</Link>
            <Link href="/login">Ingresar</Link>
          </div>
        </header>
        <main className="app-frame">{children}</main>
      </body>
    </html>
  );
}

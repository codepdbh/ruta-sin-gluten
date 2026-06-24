import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HeaderNav } from "@/components/ui/HeaderNav";
import { MobileAccountMenu } from "@/components/ui/MobileAccountMenu";
import { MobileBottomNav } from "@/components/ui/MobileBottomNav";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { UserAccountMenu } from "@/components/ui/UserAccountMenu";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Ruta Sin Gluten Bolivia",
    template: "%s | Ruta Sin Gluten",
  },
  description:
    "Mapa, directorio y comunidad para encontrar comercios, productos y lugares sin gluten verificados en Bolivia.",
  metadataBase: new URL("https://rutasingluten.lat"),
  applicationName: "Ruta Sin Gluten",
  alternates: {
    canonical: "https://rutasingluten.lat",
  },
  keywords: [
    "sin gluten Bolivia",
    "celiaquia Bolivia",
    "comercios sin gluten",
    "productos sin gluten",
  ],
  icons: {
    icon: [{ url: "/favicon.png?v=2", type: "image/png" }],
    shortcut: ["/favicon.png?v=2"],
    apple: [{ url: "/favicon.png?v=2", type: "image/png" }],
  },
  openGraph: {
    title: "Ruta Sin Gluten Bolivia",
    description:
      "Descubre comercios, productos y lugares sin gluten en Bolivia, con informacion clara para usuarios y vendedores.",
    url: "https://rutasingluten.lat",
    siteName: "Ruta Sin Gluten",
    locale: "es_BO",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1167,
        height: 393,
        alt: "Logo de RutaSinGluten",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ruta Sin Gluten Bolivia",
    description:
      "Mapa, directorio y comunidad para encontrar comercios, productos y lugares sin gluten verificados en Bolivia.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <header className="topbar">
          <Link href="/" className="brandmark">
            <span className="brandmark__crest brandmark__crest--image">
              <Image
                src="/logo.png"
                alt="RutaSinGluten"
                width={360}
                height={300}
                priority
              />
            </span>
          </Link>
          <MobileAccountMenu />
          <HeaderNav />
          <div className="topbar__actions">
            <ThemeToggle />
            <UserAccountMenu />
          </div>
        </header>
        <main className="app-frame">
          {children}
          <SiteFooter />
        </main>
        <MobileBottomNav />
      </body>
    </html>
  );
}

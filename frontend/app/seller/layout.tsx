import { SellerTabs } from '@/components/ui/SellerTabs';

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="stack-page seller-shell">
      <div className="page-card seller-shell__header">
        <p className="eyebrow">Panel de comercio</p>
        <h1>Gestiona tu negocio</h1>
        <p className="muted">Cambia entre perfil, ubicaciones, productos, envios y verificacion sin perderte.</p>
        <SellerTabs />
      </div>
      {children}
    </section>
  );
}

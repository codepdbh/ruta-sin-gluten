import { RoutePlaceholder } from '@/components/ui/RoutePlaceholder';

export default function SellerDashboardPage() {
  return (
    <RoutePlaceholder
      title="Panel Seller"
      description="Desde aqui el vendedor completa perfil, ubicaciones, envios, productos y video de verificacion."
      links={[
        { href: '/seller/business', label: 'Perfil del comercio' },
        { href: '/seller/locations', label: 'Ubicaciones' },
        { href: '/seller/products', label: 'Productos' },
        { href: '/seller/verification', label: 'Verificacion' },
      ]}
    />
  );
}

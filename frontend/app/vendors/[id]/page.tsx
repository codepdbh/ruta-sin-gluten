import { RoutePlaceholder } from '@/components/ui/RoutePlaceholder';

export default function VendorDetailPage() {
  return (
    <RoutePlaceholder
      title="Detalle del vendedor"
      description="Usá la ruta /places/[id] para ver la ficha publica completa en este MVP."
      links={[{ href: '/places', label: 'Ir al directorio' }]}
    />
  );
}

import { RoutePlaceholder } from '@/components/ui/RoutePlaceholder';

export default function VendorsPage() {
  return (
    <RoutePlaceholder
      title="Vendedores"
      description="En este MVP la ficha publica del vendedor coincide con la ficha del lugar aprobado."
      links={[{ href: '/places', label: 'Ver lugares aprobados' }]}
    />
  );
}

import { RoutePlaceholder } from '@/components/ui/RoutePlaceholder';

export default function AdminDashboardPage() {
  return (
    <RoutePlaceholder
      title="Panel Admin"
      description="Este panel concentra verificaciones pendientes y revision de sugerencias."
      links={[
        { href: '/admin/approvals', label: 'Aprobaciones' },
        { href: '/admin/suggestions', label: 'Sugerencias' },
      ]}
    />
  );
}

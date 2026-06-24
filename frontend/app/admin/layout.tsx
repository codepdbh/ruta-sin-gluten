import { AdminTabs } from "@/components/ui/AdminTabs";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="stack-page admin-shell">
      <div className="page-card admin-shell__header">
        <p className="eyebrow">Administracion</p>
        <h1>Centro de control</h1>
        <p className="muted">
          Revisa verificaciones, sugerencias, usuarios y actividad publica desde un solo lugar.
        </p>
        <AdminTabs />
      </div>
      {children}
    </section>
  );
}

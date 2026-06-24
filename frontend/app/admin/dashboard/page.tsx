import Link from "next/link";

const REVIEW_CARDS = [
  {
    href: "/admin/approvals",
    eyebrow: "Verificaciones",
    title: "Videos de comercios",
    copy: "Aprueba, observa o rechaza solicitudes de vendedores antes de que aparezcan como verificados.",
    action: "Revisar",
  },
  {
    href: "/admin/suggestions",
    eyebrow: "Comunidad",
    title: "Sugerencias de lugares",
    copy: "Ordena aportes de usuarios y convierte los datos confiables en negocios visibles.",
    action: "Ver sugerencias",
  },
  {
    href: "/admin/users",
    eyebrow: "Cuentas",
    title: "Usuarios y roles",
    copy: "Centraliza soporte, roles y estado de cuentas para usuarios, vendedores y administradores.",
    action: "Abrir usuarios",
  },
  {
    href: "/admin/reports",
    eyebrow: "Calidad",
    title: "Reportes",
    copy: "Agrupa reclamos y observaciones para mantener el directorio limpio y confiable.",
    action: "Ver reportes",
  },
];

const PRIORITIES = [
  "Revisar verificaciones pendientes",
  "Depurar sugerencias duplicadas",
  "Completar panel de usuarios",
  "Preparar reportes de calidad",
];

export default function AdminDashboardPage() {
  return (
    <section className="page-card panel-home admin-dashboard">
      <div className="panel-home__header">
        <div>
          <p className="eyebrow">Resumen operativo</p>
          <h2>Trabajo pendiente y control de calidad</h2>
        </div>
        <Link className="inline-link" href="/admin/approvals">
          Ir a verificaciones
        </Link>
      </div>

      <div className="dashboard-grid">
        <article className="metric-card metric-card--warm">
          <span>Verificaciones</span>
          <strong>En cola</strong>
          <p>Solicitudes de vendedores con video y datos de comercio.</p>
        </article>
        <article className="metric-card metric-card--cool">
          <span>Sugerencias</span>
          <strong>Por validar</strong>
          <p>Aportes de usuarios que pueden convertirse en lugares nuevos.</p>
        </article>
        <article className="metric-card metric-card--neutral">
          <span>Usuarios</span>
          <strong>Roles</strong>
          <p>Base para administrar compradores, vendedores y moderadores.</p>
        </article>
      </div>

      <div className="task-grid">
        {REVIEW_CARDS.map((card) => (
          <Link key={card.href} className="task-card" href={card.href}>
            <span className="task-card__meta">{card.eyebrow}</span>
            <strong>{card.title}</strong>
            <p>{card.copy}</p>
            <span>{card.action}</span>
          </Link>
        ))}
      </div>

      <aside className="workflow-list" aria-label="Prioridades del panel">
        <h3>Prioridades</h3>
        {PRIORITIES.map((priority) => (
          <p key={priority}>{priority}</p>
        ))}
      </aside>
    </section>
  );
}

import Link from "next/link";

const SELLER_TASKS = [
  {
    href: "/seller/verification",
    title: "Verificacion",
    copy: "Video y datos de respaldo para que el comercio gane confianza.",
    status: "Confianza",
  },
  {
    href: "/seller/business",
    title: "Perfil del comercio",
    copy: "Nombre, ciudad, descripcion, logo y datos publicos del negocio.",
    status: "Base",
  },
  {
    href: "/seller/locations",
    title: "Ubicaciones",
    copy: "Puntos en el mapa, direcciones y referencia para llegar sin friccion.",
    status: "Mapa",
  },
  {
    href: "/seller/products",
    title: "Productos",
    copy: "Catalogo visible, fotos, precios y enlaces de compra o contacto.",
    status: "Catalogo",
  },
];

const QUICK_STEPS = [
  "Enviar video de verificacion",
  "Completar datos publicos del negocio",
  "Agregar al menos una ubicacion",
  "Subir productos con foto clara",
];

export default function SellerDashboardPage() {
  return (
    <section className="page-card panel-home seller-dashboard">
      <div className="panel-home__header">
        <div>
          <p className="eyebrow">Resumen del vendedor</p>
          <h2>Tu negocio en Ruta Sin Gluten</h2>
        </div>
        <Link className="inline-link" href="/seller/business">
          Editar perfil
        </Link>
      </div>

      <div className="dashboard-grid">
        <article className="metric-card metric-card--warm">
          <span>Perfil</span>
          <strong>Datos claros</strong>
          <p>La informacion basica ayuda a que usuarios confien antes de visitar.</p>
        </article>
        <article className="metric-card metric-card--cool">
          <span>Mapa</span>
          <strong>Ubicaciones</strong>
          <p>Cada punto visible mejora busquedas por zona y referencia cercana.</p>
        </article>
        <article className="metric-card metric-card--neutral">
          <span>Catalogo</span>
          <strong>Productos</strong>
          <p>Fotos, precios y links reducen preguntas repetidas por WhatsApp.</p>
        </article>
      </div>

      <div className="task-grid">
        {SELLER_TASKS.map((task) => (
          <Link key={task.href} className="task-card" href={task.href}>
            <span className="task-card__meta">{task.status}</span>
            <strong>{task.title}</strong>
            <p>{task.copy}</p>
            <span>Abrir</span>
          </Link>
        ))}
      </div>

      <aside className="workflow-list" aria-label="Pasos sugeridos para vendedores">
        <h3>Orden recomendado</h3>
        {QUICK_STEPS.map((step) => (
          <p key={step}>{step}</p>
        ))}
      </aside>
    </section>
  );
}

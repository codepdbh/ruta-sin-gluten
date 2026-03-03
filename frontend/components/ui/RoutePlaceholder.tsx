import Link from 'next/link';

type RoutePlaceholderProps = {
  title: string;
  description: string;
  links?: Array<{ href: string; label: string }>;
};

export function RoutePlaceholder({ title, description, links = [] }: RoutePlaceholderProps) {
  return (
    <section className="page-card">
      <p className="eyebrow">Ruta preparada</p>
      <h1>{title}</h1>
      <p className="muted">{description}</p>
      {links.length ? (
        <div className="inline-actions">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="inline-link">
              {link.label}
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  );
}

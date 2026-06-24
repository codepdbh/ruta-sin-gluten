import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Donativos",
  description: "Apoya Ruta Sin Gluten mediante QR o WhatsApp.",
};

export default function DonationsPage() {
  return (
    <section className="page-card donation-page">
      <div className="donation-page__header">
        <p className="eyebrow">Donativos</p>
        <h1>Apoya Ruta Sin Gluten</h1>
        <p className="muted">Puedes donar en el siguiente QR.</p>
      </div>

      <div className="donation-page__content">
        <article className="donation-page__qr-card">
          <Image
            src="/image.png"
            alt="QR para donativos de Ruta Sin Gluten"
            width={1070}
            height={1298}
            priority
          />
        </article>

        <aside className="panel-card donation-page__contact">
          <p className="eyebrow">Otros medios?</p>
          <h2>WhatsApp</h2>
          <a
            className="primary-button"
            href="https://wa.me/59168057091"
            target="_blank"
            rel="noreferrer"
          >
            +59168057091
          </a>
        </aside>
      </div>
    </section>
  );
}

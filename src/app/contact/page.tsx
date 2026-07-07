import { ContactForm } from "@/components/ContactForm";
import { COMPANY } from "@/lib/constants";

export const metadata = { title: "Contact — Vert La Planète" };

export default function ContactPage() {
  return (
    <div className="page active">
      <div className="contact-layout">
        <div>
          <div className="kicker">Contact</div>
          <h1 className="contact-info-h">
            Parlons de votre <em>projet vert</em>
          </h1>
          <p className="contact-info-p">
            Une question sur une commande, l&apos;envie de vendre vos produits, ou un partenariat ?
            Notre équipe vous répond rapidement.
          </p>
          <div className="contact-items">
            <div className="contact-item">
              <div className="contact-item-icon">📍</div>
              <div>
                <div className="contact-item-lbl">Adresse</div>
                <div className="contact-item-val">Paris, France</div>
              </div>
            </div>
            <a className="contact-item" href={`mailto:${COMPANY.email}`} style={{ cursor: "pointer" }}>
              <div className="contact-item-icon">✉️</div>
              <div>
                <div className="contact-item-lbl">Écrivez-nous directement</div>
                <div className="contact-item-val">{COMPANY.email} →</div>
              </div>
            </a>
            <a className="contact-item" href={COMPANY.domain} target="_blank" rel="noreferrer" style={{ cursor: "pointer" }}>
              <div className="contact-item-icon">🌍</div>
              <div>
                <div className="contact-item-lbl">Site officiel</div>
                <div className="contact-item-val">{COMPANY.domainLabel} ↗</div>
              </div>
            </a>
            <div className="contact-item">
              <div className="contact-item-icon">🌱</div>
              <div>
                <div className="contact-item-lbl">Devenir vendeur</div>
                <div className="contact-item-val">Ouvrez votre boutique en quelques minutes</div>
              </div>
            </div>
          </div>
        </div>
        <div className="contact-form-card">
          <div className="contact-form-h">Nous écrire</div>
          <p className="contact-form-sub">
            Acheteurs, producteurs, artisans, marques — toutes les prises de contact sont les
            bienvenues.
          </p>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

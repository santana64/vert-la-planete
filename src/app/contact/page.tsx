import { ContactForm } from "@/components/ContactForm";
import { COMPANY } from "@/lib/constants";

export const metadata = { title: "Contact — Vert La Planète" };

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  );
}

export default function ContactPage() {
  return (
    <div className="page active">
      <div className="explorer-header">
        <div className="explorer-header-inner">
          <div className="kicker">Contact</div>
          <h1 className="explorer-h1">
            Parlons de votre <em style={{ fontStyle: "italic", color: "var(--fn)" }}>projet vert</em>
          </h1>
          <p className="explorer-sub" style={{ marginBottom: 0 }}>
            Une question, l&apos;envie de devenir partenaire, un partenariat ? Écrivez-nous — on
            vous répond vite.
          </p>
        </div>
      </div>

      <div className="section" style={{ paddingTop: 44 }}>
        {/* Canal direct */}
        <div className="contact-cta-grid contact-cta-grid--solo">
          <a className="contact-cta em" href={`mailto:${COMPANY.email}`}>
            <div className="contact-cta-ico">
              <MailIcon />
            </div>
            <div>
              <div className="contact-cta-kicker">Le plus direct</div>
              <div className="contact-cta-h">Écrivez-nous un e-mail</div>
            </div>
            <p className="contact-cta-p">
              Une question ou un projet ? Envoyez-nous un e-mail, nous revenons vers vous dès que
              possible.
            </p>
            <div className="contact-cta-val">{COMPANY.email}</div>
            <span className="contact-cta-btn">
              <MailIcon />
              Envoyer un e-mail →
            </span>
            <span className="contact-cta-note">✉️ Réponse sous 24-48 h ouvrées</span>
          </a>
        </div>

        {/* Formulaire + infos */}
        <div className="contact-layout" style={{ padding: 0 }}>
          <div>
            <div className="kicker">Ou via le site</div>
            <h2 className="contact-info-h" style={{ fontSize: 30 }}>
              Laissez-nous un <em>message</em>
            </h2>
            <p className="contact-info-p">
              Votre message est enregistré et transmis directement à l&apos;équipe — particuliers,
              producteurs, artisans, marques : toutes les prises de contact sont les bienvenues.
            </p>
            <div className="contact-items">
              <div className="contact-item">
                <div className="contact-item-icon">📍</div>
                <div>
                  <div className="contact-item-lbl">Siège</div>
                  <div className="contact-item-val">Le Mée-sur-Seine, France</div>
                </div>
              </div>
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
                  <div className="contact-item-lbl">Devenir partenaire</div>
                  <div className="contact-item-val">Ouvrez votre fiche en quelques minutes</div>
                </div>
              </div>
            </div>
          </div>
          <div className="contact-form-card">
            <div className="contact-form-h">Nous écrire</div>
            <p className="contact-form-sub">
              Réponse par e-mail — pensez à vérifier vos indésirables.
            </p>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}

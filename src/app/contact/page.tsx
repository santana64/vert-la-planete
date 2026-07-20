import { ContactForm } from "@/components/ContactForm";
import { COMPANY } from "@/lib/constants";

export const metadata = { title: "Contact — Vert La Planète" };

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

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
            Une question, l&apos;envie de devenir partenaire, un partenariat ? Choisissez votre
            canal — on vous répond vite.
          </p>
        </div>
      </div>

      <div className="section" style={{ paddingTop: 44 }}>
        {/* Canaux directs */}
        <div className="contact-cta-grid">
          <a
            className="contact-cta wa"
            href={COMPANY.whatsappUrl}
            target="_blank"
            rel="noreferrer"
          >
            <div className="contact-cta-ico">
              <WhatsAppIcon />
            </div>
            <div>
              <div className="contact-cta-kicker">Le plus rapide</div>
              <div className="contact-cta-h">Appelez-nous sur WhatsApp</div>
            </div>
            <p className="contact-cta-p">
              Message ou appel — c&apos;est le canal le plus direct pour échanger avec l&apos;équipe.
            </p>
            <div className="contact-cta-val">{COMPANY.phone}</div>
            <span className="contact-cta-btn">
              <WhatsAppIcon />
              Ouvrir WhatsApp →
            </span>
            <span className="contact-cta-note">
              <span className="contact-cta-dot" />
              Réponse rapide en journée
            </span>
          </a>

          <a className="contact-cta em" href={`mailto:${COMPANY.email}`}>
            <div className="contact-cta-ico">
              <MailIcon />
            </div>
            <div>
              <div className="contact-cta-kicker">Si nous ne pouvons pas répondre</div>
              <div className="contact-cta-h">Écrivez-nous un e-mail</div>
            </div>
            <p className="contact-cta-p">
              Indisponibles sur WhatsApp ? Envoyez un e-mail, nous revenons vers vous dès que
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

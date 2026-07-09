import Link from "next/link";
import { LeafMark } from "@/components/Logo";
import { COMPANY, ENGAGEMENTS_SHORT } from "@/lib/constants";

export function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-top">
          <div>
            <div className="footer-logo">
              <LeafMark size={32} />
              <span>Vert La Planète</span>
            </div>
            <p className="footer-desc">
              Le réseau des acteurs de la transition écologique : partenaires engagés,
              déchetteries, centres écologiques et ramassages de déchets — partout en France.
            </p>
            <p className="footer-mention">{ENGAGEMENTS_SHORT}</p>
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
              <a href={COMPANY.domain} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: "var(--s)", fontWeight: 500 }}>
                🌍 {COMPANY.domainLabel} ↗
              </a>
              <a href={COMPANY.whatsappUrl} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: "var(--s)", fontWeight: 500 }}>
                💬 WhatsApp : {COMPANY.phone}
              </a>
              <a href={`mailto:${COMPANY.email}`} style={{ fontSize: 13, color: "var(--s)", fontWeight: 500 }}>
                ✉️ {COMPANY.email}
              </a>
            </div>
          </div>

          <div>
            <h4 className="footer-col-h">Découvrir</h4>
            <div className="footer-links">
              <Link href="/partenaires">Boutiques partenaires</Link>
              <Link href="/partenaires#carte">Carte de France</Link>
              <Link href="/actualites">Actualités</Link>
              <Link href="/emplois">Emplois & Formations</Link>
            </div>
          </div>

          <div>
            <h4 className="footer-col-h">Participer</h4>
            <div className="footer-links">
              <Link href="/devenir-partenaire">Devenir partenaire</Link>
              <Link href="/offres">Offres & tarifs</Link>
              <Link href="/lieux/proposer">Proposer un lieu</Link>
              <Link href="/compte">Mon compte</Link>
            </div>
          </div>

          <div>
            <h4 className="footer-col-h">Informations</h4>
            <div className="footer-links">
              <Link href="/a-propos">À propos</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/mentions-legales">Mentions légales</Link>
              <Link href="/cgv">CGV</Link>
              <Link href="/confidentialite">Confidentialité</Link>
              <Link href="/rgpd">RGPD & vos droits</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            © {new Date().getFullYear()} {COMPANY.name} · SAS · {COMPANY.domainLabel}
          </p>
          <div className="footer-btm-links">
            <Link href="/mentions-legales">Mentions légales</Link>
            <Link href="/cgv">CGV</Link>
            <Link href="/rgpd">RGPD</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

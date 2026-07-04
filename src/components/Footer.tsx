import Link from "next/link";
import { LeafMark } from "@/components/Logo";
import { COMPANY } from "@/lib/constants";

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
              L&apos;annuaire des producteurs, artisans et marques engagés. Des partenaires
              écologiques, locaux et vérifiés — au plus près de chez vous.
            </p>
            <p className="footer-mention">🌍 Circuits courts · Démarches vérifiées · Éco-conçu</p>
          </div>

          <div>
            <h4 className="footer-col-h">Découvrir</h4>
            <div className="footer-links">
              <Link href="/partenaires">Boutiques partenaires</Link>
              <Link href="/actualites">Actualités</Link>
              <Link href="/emplois">Emplois & Formations</Link>
              <Link href="/offres">Nos offres</Link>
            </div>
          </div>

          <div>
            <h4 className="footer-col-h">Partenaires</h4>
            <div className="footer-links">
              <Link href="/devenir-partenaire">Devenir partenaire</Link>
              <Link href="/offres">Offres Pro</Link>
              <Link href="/connexion">Connexion</Link>
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
              <Link href="/rgpd">RGPD</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            © {new Date().getFullYear()} {COMPANY.name} — {COMPANY.legalForm.split(" — ")[0]} · Tous
            droits réservés.
          </p>
          <div className="footer-btm-links">
            <Link href="/mentions-legales">Mentions légales</Link>
            <Link href="/cgv">CGV</Link>
            <Link href="/confidentialite">Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

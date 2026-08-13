import Link from "next/link";
import { LeafMark } from "@/components/Logo";
import { COMPANY, LEETCHI_URL, SLOGAN, SOCIAL } from "@/lib/constants";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden fill="currentColor">
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.03 4.39 11.03 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8v8.44C19.61 23.1 24 18.1 24 12.07z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden fill="currentColor">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

export function Footer() {
  const hasSocial = SOCIAL.instagram || SOCIAL.facebook || SOCIAL.linkedin || LEETCHI_URL;

  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-top footer-top--lean">
          <div>
            <div className="footer-logo">
              <LeafMark size={32} />
              <span>Vert La Planète</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <a href={COMPANY.domain} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: "var(--s)", fontWeight: 500 }}>
                🌍 {COMPANY.domainLabel} ↗
              </a>
              <a href={`mailto:${COMPANY.email}`} style={{ fontSize: 13, color: "var(--s)", fontWeight: 500 }}>
                ✉️ {COMPANY.email}
              </a>
            </div>

            {hasSocial ? (
              <div className="footer-social">
                <div className="footer-social-icons">
                  {SOCIAL.instagram ? (
                    <a href={SOCIAL.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="footer-social-btn">
                      <InstagramIcon />
                    </a>
                  ) : null}
                  {SOCIAL.facebook ? (
                    <a href={SOCIAL.facebook} target="_blank" rel="noreferrer" aria-label="Communauté Facebook Messenger" className="footer-social-btn">
                      <FacebookIcon />
                    </a>
                  ) : null}
                  {SOCIAL.linkedin ? (
                    <a href={SOCIAL.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="footer-social-btn">
                      <LinkedInIcon />
                    </a>
                  ) : null}
                </div>
                {LEETCHI_URL ? (
                  <a href={LEETCHI_URL} target="_blank" rel="noreferrer" className="footer-leetchi">
                    💚 Soutenir le projet
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>

          <div>
            <h4 className="footer-col-h">Dossiers</h4>
            <div className="footer-links">
              <Link href="/mobilite-verte">Mobilité verte</Link>
              <Link href="/recyclage">Recyclage &amp; réemploi</Link>
              <Link href="/partenaires#carte">Carte des acteurs</Link>
              <Link href="/lieux/proposer">Proposer un lieu</Link>
            </div>
          </div>

          <div>
            <h4 className="footer-col-h">Informations légales</h4>
            <div className="footer-links">
              <Link href="/mentions-legales">Mentions légales</Link>
              <Link href="/cgv">CGV</Link>
              <Link href="/confidentialite">Confidentialité</Link>
              <Link href="/rgpd">RGPD & vos droits</Link>
            </div>
          </div>
        </div>

        <figure className="footer-slogan">
          <blockquote>« {SLOGAN.text} »</blockquote>
          <figcaption>— {SLOGAN.author}</figcaption>
        </figure>

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

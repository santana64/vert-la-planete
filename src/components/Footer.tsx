import Link from "next/link";
import { LeafMark } from "@/components/Logo";
import { COMPANY, ENGAGEMENTS_SHORT, LEETCHI_URL, SOCIAL } from "@/lib/constants";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
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
  const hasSocial = SOCIAL.instagram || SOCIAL.linkedin || LEETCHI_URL;

  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-top footer-top--lean">
          <div>
            <div className="footer-logo">
              <LeafMark size={32} />
              <span>Vert La Planète</span>
            </div>
            <p className="footer-desc">
              Le réseau des acteurs de la transition écologique : partenaires engagés,
              points de collecte, initiatives urbaines et événements groupés — partout en France.
            </p>
            <p className="footer-mention">{ENGAGEMENTS_SHORT}</p>
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
              <a href={COMPANY.domain} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: "var(--s)", fontWeight: 500 }}>
                🌍 {COMPANY.domainLabel} ↗
              </a>
              <a href={`mailto:${COMPANY.email}`} style={{ fontSize: 13, color: "var(--s)", fontWeight: 500 }}>
                ✉️ {COMPANY.email}
              </a>
            </div>

            {hasSocial ? (
              <div className="footer-social">
                {SOCIAL.instagram ? (
                  <a href={SOCIAL.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="footer-social-btn">
                    <InstagramIcon />
                  </a>
                ) : null}
                {SOCIAL.linkedin ? (
                  <a href={SOCIAL.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="footer-social-btn">
                    <LinkedInIcon />
                  </a>
                ) : null}
                {LEETCHI_URL ? (
                  <a href={LEETCHI_URL} target="_blank" rel="noreferrer" className="footer-leetchi">
                    💚 Soutenir le projet
                  </a>
                ) : null}
              </div>
            ) : null}
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

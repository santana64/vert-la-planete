import Link from "next/link";
import { LeafMark } from "@/components/Logo";
import { COMPANY, LEETCHI_URL, SLOGAN, SOCIAL } from "@/lib/constants";

/**
 * Logos officiels des trois réseaux, dans leurs couleurs de marque.
 *
 * Usage prévu et autorisé par chaque plateforme : renvoyer vers NOS propres
 * comptes. Les chartes imposent en revanche de ne pas déformer le glyphe ni
 * d'inventer des couleurs — d'où le dégradé Instagram reproduit fidèlement,
 * le bleu Facebook #1877F2 et le bleu LinkedIn #0A66C2.
 */

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="34" height="34" aria-hidden focusable="false">
      <defs>
        <radialGradient id="vlp-ig" cx="30%" cy="107%" r="150%">
          <stop offset="0" stopColor="#FDF497" />
          <stop offset="0.05" stopColor="#FDF497" />
          <stop offset="0.45" stopColor="#FD5949" />
          <stop offset="0.6" stopColor="#D6249F" />
          <stop offset="0.9" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect width="24" height="24" rx="6.5" fill="url(#vlp-ig)" />
      <rect x="6" y="6" width="12" height="12" rx="3.6" fill="none" stroke="#fff" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="3" fill="none" stroke="#fff" strokeWidth="1.6" />
      <circle cx="16.4" cy="7.6" r="0.95" fill="#fff" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="34" height="34" aria-hidden focusable="false">
      <circle cx="12" cy="12" r="12" fill="#1877F2" />
      <path
        fill="#fff"
        d="M16.67 15.47 17.2 12h-3.33V9.75c0-.95.47-1.88 1.96-1.88h1.51V4.92s-1.37-.23-2.68-.23c-2.74 0-4.52 1.66-4.52 4.66V12H6.9v3.47h3.05v8.39a12.1 12.1 0 0 0 3.92 0v-8.39h2.8z"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="34" height="34" aria-hidden focusable="false">
      <rect width="24" height="24" rx="4.2" fill="#0A66C2" />
      <path
        fill="#fff"
        d="M8.34 18.34H5.67V9.75h2.67v8.59zM7 8.58a1.55 1.55 0 1 1 0-3.1 1.55 1.55 0 0 1 0 3.1zm11.34 9.76h-2.66v-4.18c0-1-.02-2.28-1.39-2.28-1.39 0-1.6 1.09-1.6 2.21v4.25h-2.67V9.75h2.56v1.17h.04c.36-.68 1.23-1.39 2.53-1.39 2.7 0 3.2 1.78 3.2 4.1v4.71z"
      />
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

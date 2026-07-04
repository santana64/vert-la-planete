export function LegalLayout({
  title,
  intro,
  children
}: {
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="page active">
      <div className="about-hero" style={{ paddingBottom: 36 }}>
        <div style={{ maxWidth: 820, margin: "0 auto", position: "relative" }}>
          <div className="kicker">Informations légales</div>
          <h1 className="about-h" style={{ fontSize: 38 }}>
            {title}
          </h1>
          {intro ? (
            <p style={{ fontSize: 15, color: "var(--pb)", fontWeight: 300, marginTop: 10, lineHeight: 1.7 }}>
              {intro}
            </p>
          ) : null}
        </div>
      </div>
      <div className="section legal-body" style={{ maxWidth: 820 }}>
        {children}
        <p
          style={{
            marginTop: 32,
            paddingTop: 18,
            borderTop: ".5px solid rgba(0,0,0,.07)",
            fontSize: 12,
            color: "var(--sd)",
            fontWeight: 300,
            lineHeight: 1.6
          }}
        >
          Ce texte est fourni comme modèle de travail et ne constitue pas un conseil juridique.
          L&apos;éditeur reste responsable de sa validation finale et de sa conformité à son
          activité réelle.
        </p>
      </div>
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 24 }}>
      <h2
        style={{
          fontFamily: "var(--serif)",
          fontSize: 20,
          color: "var(--f)",
          fontWeight: 400,
          margin: "0 0 8px"
        }}
      >
        {title}
      </h2>
      <div style={{ fontSize: 14.5, color: "var(--st)", fontWeight: 300, lineHeight: 1.8 }}>
        {children}
      </div>
    </section>
  );
}

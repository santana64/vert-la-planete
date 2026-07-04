import { LegalLayout, LegalSection } from "@/components/LegalLayout";
import { COMPANY } from "@/lib/constants";

export const metadata = { title: "Mentions légales — Vert La Planète" };

export default function MentionsLegalesPage() {
  return (
    <LegalLayout title="Mentions légales">
      <LegalSection title="Éditeur du site">
        <p>
          {COMPANY.name} — {COMPANY.legalForm}
          <br />
          SIREN : {COMPANY.siren} · SIRET : {COMPANY.siret}
          <br />
          Code APE : {COMPANY.ape}
          <br />
          Siège social : {COMPANY.address}
          <br />
          Représentant légal & directeur de la publication : {COMPANY.representative}
          <br />
          Contact : {COMPANY.email}
        </p>
      </LegalSection>

      <LegalSection title="Hébergement">
        <p>
          Le site est hébergé par {COMPANY.host.name}
          <br />
          {COMPANY.host.address}
          <br />
          {COMPANY.host.url}
        </p>
      </LegalSection>

      <LegalSection title="Propriété intellectuelle">
        <p>
          L&apos;ensemble des contenus présents sur le site (textes, visuels, logo, charte
          graphique, structure) est protégé par le droit de la propriété intellectuelle et reste la
          propriété de {COMPANY.name} ou de ses partenaires. Toute reproduction ou représentation,
          totale ou partielle, sans autorisation écrite préalable est interdite.
        </p>
      </LegalSection>

      <LegalSection title="Responsabilité">
        <p>
          {COMPANY.name} s&apos;efforce d&apos;assurer l&apos;exactitude des informations diffusées
          mais ne saurait être tenue responsable des erreurs, omissions ou indisponibilités
          temporaires du site. Les informations relatives aux partenaires sont fournies par ces
          derniers, qui en restent responsables.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}

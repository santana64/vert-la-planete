import { LegalLayout, LegalSection } from "@/components/LegalLayout";
import { COMPANY } from "@/lib/constants";

export const metadata = { title: "RGPD — Vert La Planète" };

export default function RgpdPage() {
  return (
    <LegalLayout
      title="RGPD & vos droits"
      intro="Conformément au Règlement Général sur la Protection des Données, vous disposez de droits sur vos données personnelles."
    >
      <LegalSection title="Vos droits">
        <p>
          Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, de
          limitation, d&apos;opposition et de portabilité de vos données personnelles. Vous pouvez
          également définir des directives relatives au sort de vos données après votre décès.
        </p>
      </LegalSection>

      <LegalSection title="Exercer vos droits">
        <p>
          Pour exercer ces droits, contactez l&apos;éditeur à l&apos;adresse {COMPANY.email}. Une
          réponse vous sera apportée dans un délai d&apos;un mois. En cas de difficulté, vous pouvez
          saisir la CNIL (www.cnil.fr).
        </p>
      </LegalSection>

      <LegalSection title="Suppression du compte">
        <p>
          Vous pouvez demander la suppression de votre compte et des données associées à tout
          moment. Les données strictement nécessaires aux obligations légales (facturation) peuvent
          être conservées le temps requis par la loi.
        </p>
      </LegalSection>

      <LegalSection title="Cookies">
        <p>
          Le site utilise uniquement des cookies techniques nécessaires à son fonctionnement
          (session de connexion). Aucun cookie publicitaire ou de mesure d&apos;audience tiers
          n&apos;est déposé.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}

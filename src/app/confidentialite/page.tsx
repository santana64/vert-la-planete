import { LegalLayout, LegalSection } from "@/components/LegalLayout";
import { COMPANY } from "@/lib/constants";

export const metadata = { title: "Politique de confidentialité — Vert La Planète" };

export default function ConfidentialitePage() {
  return (
    <LegalLayout
      title="Politique de confidentialité"
      intro="Comment vos données personnelles sont collectées et utilisées sur Vert La Planète."
    >
      <LegalSection title="Données collectées">
        <p>
          Lors de la création d&apos;un compte : nom, adresse e-mail et mot de passe (stocké de
          façon chiffrée). Pour les partenaires : informations de la fiche (activité, ville,
          description). Lors d&apos;une souscription Pro : les données de paiement sont traitées
          directement par Stripe ; {COMPANY.name} ne stocke aucune coordonnée bancaire.
        </p>
      </LegalSection>

      <LegalSection title="Finalités">
        <p>
          Les données sont utilisées pour la gestion des comptes, l&apos;affichage des fiches
          partenaires, la gestion des abonnements et la réponse aux demandes de contact.
        </p>
      </LegalSection>

      <LegalSection title="Conservation">
        <p>
          Les données de compte sont conservées tant que le compte est actif, puis supprimées ou
          anonymisées. Les données de facturation sont conservées conformément aux obligations
          légales.
        </p>
      </LegalSection>

      <LegalSection title="Pas de tracking publicitaire">
        <p>
          Le site n&apos;utilise pas de traceurs publicitaires ni de revente de données. Aucune
          newsletter n&apos;est imposée.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>Pour toute question relative à vos données : {COMPANY.email}.</p>
      </LegalSection>
    </LegalLayout>
  );
}

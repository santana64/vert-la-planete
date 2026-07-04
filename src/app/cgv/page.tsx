import { LegalLayout, LegalSection } from "@/components/LegalLayout";
import { COMPANY } from "@/lib/constants";

export const metadata = { title: "Conditions générales de vente — Vert La Planète" };

export default function CgvPage() {
  return (
    <LegalLayout
      title="Conditions générales de vente"
      intro="Les présentes CGV encadrent la souscription aux offres partenaires de Vert La Planète."
    >
      <LegalSection title="1. Objet">
        <p>
          Les présentes conditions régissent la souscription, par un professionnel, aux offres
          d&apos;abonnement « Partenaire » proposées par {COMPANY.name} permettant le référencement
          et la mise en avant de son activité sur le site Vert La Planète.
        </p>
      </LegalSection>

      <LegalSection title="2. Offres et tarifs">
        <p>
          Offre Gratuite : 0 €. Offre Pro Mensuelle : 14,90 € par mois. Offre Pro Annuelle :
          118,80 € par an. TVA non applicable, art. 293 B du CGI. Les tarifs sont indiqués en euros
          et peuvent évoluer ; le tarif applicable est celui en vigueur au moment de la
          souscription.
        </p>
      </LegalSection>

      <LegalSection title="3. Paiement">
        <p>
          Le paiement des offres Pro s&apos;effectue en ligne par carte bancaire via notre
          prestataire de paiement sécurisé Stripe. L&apos;abonnement est reconduit automatiquement
          à échéance (mensuelle ou annuelle) jusqu&apos;à résiliation.
        </p>
      </LegalSection>

      <LegalSection title="4. Durée et résiliation">
        <p>
          L&apos;offre Pro Mensuelle est sans engagement et résiliable à tout moment ; la
          résiliation prend effet à la fin de la période en cours. L&apos;offre Pro Annuelle est
          souscrite pour douze mois. La résiliation s&apos;effectue depuis l&apos;espace partenaire.
        </p>
      </LegalSection>

      <LegalSection title="5. Obligations du partenaire">
        <p>
          Le partenaire garantit l&apos;exactitude des informations publiées et la légalité de son
          activité, de ses produits et de ses contenus. {COMPANY.name} se réserve le droit de
          suspendre une fiche non conforme.
        </p>
      </LegalSection>

      <LegalSection title="6. Droit applicable">
        <p>
          Les présentes CGV sont soumises au droit français. En cas de litige, une solution amiable
          sera recherchée en priorité, à défaut le tribunal compétent de Melun sera saisi.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}

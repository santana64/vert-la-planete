import { LegalLayout, LegalSection } from "@/components/LegalLayout";
import { COMPANY } from "@/lib/constants";

export const metadata = { title: "RGPD — Vert La Planète" };

export default function RgpdPage() {
  return (
    <LegalLayout
      title="RGPD & vos droits"
      intro="Ce que le Règlement Général sur la Protection des Données (UE 2016/679) implique concrètement sur ce site : qui traite vos données, sur quelle base légale, et comment exercer vos droits."
    >
      <LegalSection title="Responsable de traitement">
        <p>
          {COMPANY.name} ({COMPANY.legalForm}), SIREN {COMPANY.siren}, dont le siège est situé{" "}
          {COMPANY.address}, représentée par {COMPANY.representative}. Contact :{" "}
          {COMPANY.email}.
        </p>
      </LegalSection>

      <LegalSection title="Traitements et bases légales">
        <p>
          <strong>Compte utilisateur</strong> (nom, e-mail, mot de passe chiffré) — base légale :
          exécution du contrat (art. 6.1.b RGPD), pour vous fournir le service.
          <br />
          <strong>Fiche partenaire</strong> (activité, ville, description) — exécution du contrat
          d&apos;abonnement partenaire.
          <br />
          <strong>Formulaire de contact</strong> (identité, e-mail, message) — intérêt légitime
          (art. 6.1.f) : répondre à votre demande.
          <br />
          <strong>Abonnement Pro</strong> — exécution du contrat ; les données bancaires sont
          traitées exclusivement par Stripe (certifié PCI-DSS), jamais par nos serveurs.
          <br />
          <strong>Lieux proposés sur la carte</strong> (nom du lieu, position) — intérêt légitime :
          animer la carte communautaire. Aucune position personnelle n&apos;est collectée : seul le
          lieu que vous déclarez est enregistré.
        </p>
      </LegalSection>

      <LegalSection title="Cartographie — pourquoi OpenStreetMap">
        <p>
          La carte utilise <strong>OpenStreetMap</strong> (projet communautaire à but non lucratif)
          plutôt qu&apos;un service publicitaire. Lors de l&apos;affichage, votre navigateur
          télécharge les fonds de carte depuis les serveurs de la fondation OSM : votre adresse IP
          leur est techniquement transmise (nécessité technique, art. 6.1.f), mais{" "}
          <strong>aucun cookie publicitaire ni profilage</strong> n&apos;en résulte — contrairement
          aux cartes propriétaires. La géolocalisation de votre appareil n&apos;est{" "}
          <strong>jamais</strong> demandée.
        </p>
      </LegalSection>

      <LegalSection title="Destinataires et sous-traitants">
        <p>
          Hébergement applicatif : Vercel Inc. · Base de données : Neon (UE — région
          eu-west) · Paiements : Stripe · Fonds de carte : OpenStreetMap Foundation. Aucune
          donnée n&apos;est vendue ni transmise à des tiers à des fins publicitaires.
        </p>
      </LegalSection>

      <LegalSection title="Durées de conservation">
        <p>
          Compte : tant qu&apos;il est actif, puis suppression. Messages de contact : 24 mois
          maximum. Données de facturation : 10 ans (obligation légale comptable). Avis publiés :
          tant que la fiche du partenaire existe, sauf demande de suppression.
        </p>
      </LegalSection>

      <LegalSection title="Vos droits (art. 15 à 22 RGPD)">
        <p>
          Accès, rectification, effacement, limitation, opposition, portabilité, et directives
          post-mortem. Pour les exercer : {COMPANY.email} — réponse sous un mois. En cas de
          désaccord persistant, vous pouvez saisir la CNIL (cnil.fr), autorité de contrôle
          française.
        </p>
      </LegalSection>

      <LegalSection title="Cookies">
        <p>
          Le site dépose uniquement un <strong>cookie de session strictement nécessaire</strong>{" "}
          (connexion à votre compte, httpOnly, 30 jours) — exempté de consentement selon la
          délibération CNIL. Aucun cookie publicitaire, statistique ou tiers : c&apos;est pourquoi
          aucune bannière cookies n&apos;est requise.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}

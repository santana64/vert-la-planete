# Vert La Planète — site de lancement

Site vitrine + **annuaire de partenaires** écologiques + **offres d'abonnement Pro**, construit à
partir du template de design **Vert La Planète** (repris à l'identique : polices Fraunces / DM Sans,
palette verte, composants) et porté en application Next.js avec back-end PostgreSQL.

> **Périmètre conforme au contrat de prestation V4** (version de lancement professionnelle).
> Ce n'est volontairement **pas** une marketplace transactionnelle multi-vendeurs ni un dashboard
> vendeur avancé (hors périmètre, art. 3 du contrat).

## Stack

- **Next.js 15** (App Router, Server Components + Server Actions) · **TypeScript** strict
- **Tailwind CSS** + design system CSS porté du template (`src/app/globals.css`)
- **Drizzle ORM** + **PostgreSQL**
- Auth maison (e-mail / mot de passe, `bcryptjs` + session JWT `jose` en cookie httpOnly)
- **Stripe** (abonnements aux offres Pro)

## Périmètre livré (art. 2 du contrat)

**Pages** : Accueil · À propos · Actualités/Blog · Boutiques partenaires (+ fiche partenaire) ·
Emplois & Formations · Tarifs/Offres · Contact · Espace partenaire / Compte · Mentions légales ·
CGV · Politique de confidentialité · RGPD.

**Fonctionnalités** : formulaire de contact · formulaire « Devenir partenaire » · compte
utilisateur simple · espace partenaire simple (fiche + produits) · **logique d'accès restreint
selon l'offre** (offre Gratuite limitée à 3 produits, offres Pro illimitées + mise en avant) ·
**3 offres** (Gratuite · Pro Mensuelle 14,90 € · Pro Annuelle 118,80 €) avec **paiement Stripe** ·
base boutique partenaire · SEO de base.

## Démarrage

```bash
npm install
cp .env.example .env.local   # renseigner DATABASE_URL + AUTH_SECRET (+ Stripe, voir plus bas)

# Base de données (PostgreSQL local via Docker) :
docker run --name vlp-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=vert_la_planete -p 5432:5432 -d postgres:16

npm run db:generate && npm run db:migrate   # schéma
npm run db:seed                              # données de démo (FR)
npm run dev                                  # http://localhost:3000
```

`DATABASE_URL` accepte aussi une base Supabase / Neon hébergée.

### Stripe (offres Pro)

Le code est complet ; il suffit d'ajouter vos clés **de test** dans `.env.local` :

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...   # via: stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Les Produits/Prix Stripe (14,90 €/mois, 118,80 €/an) sont créés automatiquement au premier paiement
(idempotent par `lookup_key`). Sans clé Stripe, le site fonctionne et le bouton « Souscrire »
affiche simplement un message « paiement non configuré ».

## Comptes de démonstration (`password123`)

| Rôle       | E-mail                     |
| ---------- | -------------------------- |
| Membre     | `marie@vertlaplanete.fr`   |
| Partenaire Pro | `maxime@vertlaplanete.fr` |

## Structure

```
src/
  app/
    page.tsx                     Accueil
    partenaires/                 Annuaire + fiche partenaire (+ carte)
    actualites/                  Blog + article
    emplois/                     Emplois & Formations + détail
    offres/                      Tarifs/Offres + Stripe + page de remerciement
    devenir-partenaire/          Formulaire "Devenir partenaire"
    contact/ a-propos/           Pages éditoriales
    mentions-legales/ cgv/ confidentialite/ rgpd/   Pages légales
    connexion/ inscription/ compte/                 Comptes
    espace-partenaire/           Espace partenaire simple (fiche, produits)
    api/stripe/webhook/          Webhook abonnements
    actions/                     Server Actions (auth, partenaire, abonnement)
  components/                    UI (Nav, Footer, cartes, formulaires…)
  db/                            Schéma Drizzle + client + seed
  lib/                           auth, requêtes, stripe, helpers, constantes (offres + infos société)
```

## Scripts

| Commande            | Rôle                          |
| ------------------- | ----------------------------- |
| `npm run dev`       | serveur de développement      |
| `npm run build`     | build de production           |
| `npm run typecheck` | `tsc --noEmit` (strict)       |
| `npm run lint`      | ESLint (`--max-warnings=0`)   |
| `npm run db:generate` / `db:migrate` / `db:seed` | base de données |

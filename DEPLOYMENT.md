# Déploiement sur Vercel

Ce site est une application Next.js 15 avec back-end (PostgreSQL, auth, Stripe). Vercel
l'héberge nativement. Compter ~15 minutes.

## 1. Base de données PostgreSQL hébergée (Neon — gratuit)

1. Créer un compte sur https://neon.tech puis un projet.
2. Copier la **connection string _poolée_** (bouton « Pooled connection »). Elle contient
   `-pooler` dans l'hôte et se termine par `?sslmode=require`. Exemple :
   `postgres://user:pass@ep-xxx-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require`

> Important : utiliser l'URL **poolée** (le client `postgres-js` est déjà configuré avec
> `prepare: false`, compatible pgBouncer).

## 2. Appliquer le schéma + données de démo (depuis votre machine, une fois)

```bash
# Remplacer par votre URL Neon
export DATABASE_URL="postgres://...-pooler.../neondb?sslmode=require"
npm run db:migrate     # crée les tables
npm run db:seed        # (optionnel) données de démo FR
```

## 3. Importer le repo sur Vercel

1. https://vercel.com/new → **Import** `santana64/vert-la-planete`.
2. Framework détecté : **Next.js** (laisser les réglages par défaut).
3. Avant de cliquer *Deploy*, ajouter les variables d'environnement ci-dessous.

## 4. Variables d'environnement (Vercel → Settings → Environment Variables)

| Nom                     | Valeur                                                        |
| ----------------------- | ------------------------------------------------------------ |
| `DATABASE_URL`          | l'URL poolée Neon (étape 1)                                   |
| `AUTH_SECRET`           | une chaîne aléatoire longue — `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"` |
| `APP_URL`               | l'URL du site, ex. `https://vert-la-planete.vercel.app`      |
| `STRIPE_SECRET_KEY`     | `sk_test_...` (ou `sk_live_...` en production)                |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` (étape 6)                                         |

Puis **Deploy**.

## 5. Stripe — webhook

1. Dashboard Stripe → Developers → Webhooks → **Add endpoint**.
2. URL : `https://<votre-domaine-vercel>/api/stripe/webhook`
3. Événements : `checkout.session.completed`, `customer.subscription.updated`,
   `customer.subscription.deleted`.
4. Copier le **Signing secret** (`whsec_...`) dans `STRIPE_WEBHOOK_SECRET` sur Vercel, puis
   redéployer.

> Les Produits/Prix Stripe (14,90 €/mois, 118,80 €/an) sont créés automatiquement au premier
> paiement (idempotent par `lookup_key`).

## 6. Domaine personnalisé — vertlaplanete.com (Hostinger)

1. Vercel → Settings → **Domains** → Add → `vertlaplanete.com` (et `www.vertlaplanete.com`).
2. Vercel affiche les enregistrements DNS à créer. Chez **Hostinger** (hPanel → Domaines →
   vertlaplanete.com → DNS) :
   - Enregistrement **A** : `@` → `76.76.21.21`
   - Enregistrement **CNAME** : `www` → `cname.vercel-dns.com`
   (⚠️ le site WordPress actuel sur ce domaine sera remplacé — sauvegarder avant si besoin.)
3. Attendre la propagation (minutes → quelques heures). Vercel émet le certificat HTTPS seul.
4. Mettre `APP_URL=https://vertlaplanete.com` dans Vercel puis redéployer.

## 7. Transfert des messages de contact par e-mail (optionnel)

Les messages du formulaire sont toujours enregistrés en base. Pour les recevoir aussi par
e-mail : créer une clé sur https://resend.com (gratuit, 100 e-mails/jour) puis ajouter sur
Vercel :

| Nom                | Valeur                                   |
| ------------------ | ---------------------------------------- |
| `RESEND_API_KEY`   | `re_...`                                 |
| `CONTACT_EMAIL_TO` | l'adresse qui reçoit (ex. Gmail du client) |

## Notes

- Chaque `git push` sur `main` redéclenche un déploiement automatique.
- Les migrations ne tournent pas pendant le build Vercel : relancer `npm run db:migrate` (étape 2)
  après toute évolution du schéma.
- Comptes de démo (si seed exécuté) : `marie@vertlaplanete.fr` / `maxime@vertlaplanete.fr`,
  mot de passe `password123`.

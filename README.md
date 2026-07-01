<div align="center">

# Lency

**La communauté des créatifs audiovisuels.**

Lency réunit les créatifs de l'audiovisuel : trouvez des projets, partagez vos créations et collaborez avec des talents du monde entier.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-149eca?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-7-2d3748?logo=prisma)](https://www.prisma.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)

</div>

---

## Sommaire

- [Aperçu](#aperçu)
- [Fonctionnalités](#fonctionnalités)
- [Stack technique](#stack-technique)
- [Architecture](#architecture)
- [Démarrage rapide](#démarrage-rapide)
- [Variables d'environnement](#variables-denvironnement)
- [Scripts npm](#scripts-npm)
- [Base de données (Prisma)](#base-de-données-prisma)
- [Authentification](#authentification)
- [Déploiement](#déploiement)
- [Conventions de code](#conventions-de-code)

---

## Aperçu

Lency est une plateforme SaaS destinée aux **créatifs de l'audiovisuel** (réalisateurs, monteurs, cadreurs, comédiens, techniciens…). Elle combine :

- une **communauté** pour partager des posts, des ressources et échanger,
- une **marketplace** de projets et de talents avec recherche géolocalisée sur carte,
- une **messagerie temps réel** et un système de **notifications**,
- un **espace d'administration** (gestion de contenu, emails, blog).

Le projet suit une architecture stricte **front / back / app** détaillée dans la section [Architecture](#architecture).

---

## Fonctionnalités

| Domaine | Détail |
|---|---|
| 🎬 **Marketplace projets** | Publication de projets audiovisuels, candidatures, invitations, filtres avancés (type, niveau, rémunération, mode de travail, **lieu géolocalisé**) et carte interactive avec animation *fly-to*. |
| 👥 **Talents** | Annuaire de talents, profils publics, carte des talents. |
| 💬 **Communauté** | Posts (texte / image), commentaires, votes, sauvegardes, catégories, ressources partagées, signalements. |
| ✉️ **Messagerie** | Messages directs et messagerie projet en **temps réel** (Ably). |
| 🔔 **Notifications** | Centre de notifications (candidatures, messages, communauté) avec préférences par type. |
| 📝 **Blog** | Articles éditoriaux avec éditeur riche (TipTap). |
| 🔐 **Authentification** | Email / mot de passe, **Google OAuth**, vérification & reset par **OTP email**. |
| 🛠️ **Administration** | Gestion des catégories, emails, blog, utilisateurs et modération. |
| 🌓 **Thème** | Mode clair / sombre, design responsive mobile-first. |

---

## Stack technique

| Catégorie | Technologie |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router, Turbopack) + [React 19](https://react.dev) + [TypeScript 5.9](https://www.typescriptlang.org) |
| **UI** | [Tailwind CSS 4](https://tailwindcss.com) · [shadcn/ui](https://ui.shadcn.com) (Radix UI) · [lucide-react](https://lucide.dev) |
| **Data fetching** | [TanStack React Query 5](https://tanstack.com/query) + fetch wrappers custom |
| **State** | [Zustand 5](https://zustand-demo.pmnd.rs) (état global) · [nuqs](https://nuqs.47ng.com) (état d'URL) |
| **Formulaires** | [react-hook-form](https://react-hook-form.com) + [Zod 4](https://zod.dev) + `@hookform/resolvers` |
| **Auth** | [better-auth](https://better-auth.com) (Email/Password + Google OAuth + Email OTP) |
| **ORM / DB** | [Prisma 7](https://www.prisma.io) + [PostgreSQL](https://www.postgresql.org) via [Neon](https://neon.tech) (adapters Neon HTTP & `pg`) |
| **Temps réel** | [Ably](https://ably.com) (messagerie, notifications) |
| **Upload média** | [ImageKit](https://imagekit.io) (`@imagekit/next`) |
| **Emails** | [React Email](https://react.email) + [Resend](https://resend.com) |
| **Éditeur de texte** | [TipTap 3](https://tiptap.dev) |
| **Notifications UI** | [sonner](https://sonner.emilkowal.ski) (toasts) |
| **Cartographie** | [Leaflet](https://leafletjs.com) / react-leaflet + géocodage Nominatim (OpenStreetMap) |
| **Secrets** | [Doppler](https://www.doppler.com) (dev) / Vercel (prod) |
| **Tests** | [Vitest](https://vitest.dev) |

---

## Architecture

```
src/
├── app/                     # App Router Next.js (47 pages, 100 route handlers)
│   ├── (pages)/
│   │   ├── (public)/        # Site vitrine + app communautaire + auth
│   │   ├── account/         # Espace privé (dashboard)
│   │   └── admin/           # Administration
│   └── api/                 # Route Handlers (auth, projects, posts, geocode…)
├── front/                   # Tout ce qui est client
│   ├── components/          # Composants React (shadcn/ui + métier)
│   ├── emails/              # Templates React Email
│   ├── hooks/               # Hooks génériques (useDebounce, useMediaQuery…)
│   ├── lib/api/             # Fetch wrappers (un fichier par entité)
│   ├── queries/             # Hooks React Query (un fichier par entité)
│   ├── schemas/             # Schemas Zod + types dérivés de Prisma
│   └── states/              # Stores Zustand + Contexts
└── back/                    # Tout ce qui est serveur
    ├── lib/                 # auth, prisma, session, send-email
    ├── repositories/        # Accès aux données (*.action.ts)
    ├── services/            # Logique métier (*.service.ts)
    ├── schemas/             # Validation Zod serveur (next-zod-route)
    └── prisma/              # Schema Prisma modulaire (fichiers .prisma)
```

**Flux de données** — chaque fonctionnalité avec appel API suit ce chemin unidirectionnel :

```
Page (Next.js)
  └── Composant (React Hook Form + shadcn/ui)
        └── Schema Zod front ........ src/front/schemas/zod/{entity}.zod.ts
        └── Fetch wrapper ........... src/front/lib/api/{entity}.ts
              └── Route Handler ..... src/app/api/{entity}/route.ts   (validation Zod serveur)
                    └── Service ..... src/back/services/{entity}.service.ts   (logique métier + auth)
                          └── Repository ... src/back/repositories/{entity}.action.ts   (accès DB pur)
                                └── Prisma → PostgreSQL (Neon)
```

Chaque couche a une responsabilité unique : le **Route Handler** ne fait que du contrôle (pas de logique métier), le **Service** porte la logique et la vérification d'auth, le **Repository** ne fait que de l'accès aux données.

---

## Démarrage rapide

### Prérequis

- **Node.js** ≥ 20
- **npm**
- Une base **PostgreSQL** (locale ou [Neon](https://neon.tech))
- [**Doppler CLI**](https://docs.doppler.com/docs/install-cli) (recommandé pour la gestion des secrets)

### Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/tim-vdb/Lency.git
cd Lency

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
#    Via Doppler (recommandé) ou un fichier .env.local (voir section ci-dessous)

# 4. Générer le client Prisma + appliquer le schéma
npm run generate
npm run migrate        # ou `npm run push` pour un prototypage rapide

# 5. Lancer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

> 💡 **Doppler** : toutes les commandes touchant la base injectent `DATABASE_URL` via `doppler run --`. Sans Doppler, définissez les variables dans `.env.local` et retirez le préfixe `doppler run --` des scripts, ou utilisez `npm run all:local`.

### Démarrage tout-en-un

```bash
npm run all          # dev + Prisma Studio (via Doppler)
npm run all:local    # generate + db push + dev + studio (sans Doppler)
```

---

## Variables d'environnement

| Variable | Requis | Description |
|---|:---:|---|
| `DATABASE_URL` | ✅ | Chaîne de connexion PostgreSQL (Neon en prod). |
| `BASE_URL` | ✅ | URL de base de l'app (ex. `http://localhost:3000`). |
| `BETTER_AUTH_SECRET` | ✅ | Secret de signature des sessions better-auth. |
| `GOOGLE_CLIENT_ID` | ⚪ | OAuth Google (connexion sociale). |
| `GOOGLE_CLIENT_SECRET` | ⚪ | OAuth Google. |
| `RESEND_API_KEY` | ✅ | Envoi d'emails transactionnels (Resend). |
| `RESEND_FROM_AUTH_EMAIL` | ✅ | Expéditeur des emails d'auth (ex. `Lency <auth@infos.lency.net>`). |
| `AUTH_EMAIL_OTP_EXPIRES_IN` | ⚪ | Durée de validité des OTP en secondes (défaut : `300`). |
| `ABLY_API_KEY` | ✅ | Messagerie & notifications temps réel. |
| `IMAGEKIT_PRIVATE_KEY` | ✅ | Clé privée ImageKit (upload). |
| `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY` | ✅ | Clé publique ImageKit (client). |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASSWORD` / `SMTP_SECURE` / `SMTP_FROM` | ⚪ | Configuration SMTP alternative (emails). |
| `NEXT_PUBLIC_MAINTENANCE_MODE` | ⚪ | Active la page de maintenance. |

> ⚪ = optionnel selon les fonctionnalités activées.

---

## Scripts npm

| Script | Description |
|---|---|
| `npm run dev` | Serveur de développement (Turbopack). |
| `npm run build` | Build de production. |
| `npm run start` | Lance le build de production. |
| `npm run lint` / `lint:fix` | ESLint (vérification / correction auto). |
| `npm run test` / `test:watch` | Tests Vitest. |
| `npm run email` | Prévisualisation des templates React Email (port 4000). |
| **Prisma** | |
| `npm run migrate` | Crée & applique une migration (dev). |
| `npm run migrate:prod` | Applique les migrations en attente (prod). |
| `npm run migrate:status` | État des migrations. |
| `npm run generate` | Génère le client Prisma. |
| `npm run push` | Synchronise le schéma sans migration (prototypage). |
| `npm run seed` | Seed de la base. |
| `npm run reset` | Réinitialise la base. |
| `npm run studio` | Prisma Studio (port 5555). |

> La plupart des scripts Prisma utilisent `doppler run --` pour injecter `DATABASE_URL`.

---

## Base de données (Prisma)

Le schéma est **modulaire** (plusieurs fichiers `.prisma` dans `src/back/prisma/`). Principaux modèles :

- **Utilisateurs & auth** : `User`, `UserConfig`, `UserFollow`, `UserReport`
- **Projets** : `Project`, `ProjectInvitation`, `ProjectMessage`, `MapLocation` (géolocalisation)
- **Communauté** : `Post`, `Comment`, `PostVote`, `PostSave`, `PostReport`, `Category`, `CategoryFollow`, `Resource`, `ResourceVote`, `ResourceSave`
- **Messagerie & notifications** : `Conversation`, `DirectMessage`, `Notification`, `CategoryNotificationSubscription`
- **Contenu & admin** : `Blog`, `AdminEmail`

Le client Prisma est généré dans `src/back/generated/` (ignoré par git, régénéré au build).

---

## Authentification

Gérée par [**better-auth**](https://better-auth.com) (`src/back/lib/auth.ts`) :

- **Email / mot de passe**
- **Google OAuth** (connexion sociale)
- **Email OTP** — vérification d'email et réinitialisation de mot de passe (code à 6 chiffres, 3 tentatives, expiration configurable)

**Pages d'auth :**

- `/login` · `/sign-up`
- `/verify-email` — vérification de l'email par OTP
- `/forgot-password` — demande d'OTP de réinitialisation
- `/reset-password` — soumission de l'OTP + nouveau mot de passe

**Templates emails :** `src/front/emails/VerifyEmailOTP.tsx`, `src/front/emails/ResetPasswordOTP.tsx`

---

## Déploiement

### Vercel (production)

Le déploiement principal se fait sur **Vercel**. Le build utilise le script `vercel-build` (génération du client Prisma + build Next). Les secrets sont gérés via l'intégration Vercel.

### Docker (hors Vercel)

Un **Dockerfile multi-stage** et un **`docker-compose.yml`** sont fournis pour un déploiement autonome (Railway, Fly.io, Render, VPS, Kubernetes…). Next est buildé en mode **`standalone`**.

```bash
# Lance PostgreSQL + migrations + app
docker compose up --build
# → app disponible sur http://localhost:3000
```

Le compose orchestre trois services : `postgres` (base locale), `migrate` (applique les migrations puis se termine) et `app` (serveur Next). Les secrets externes se passent en variables d'environnement au conteneur.

---

## Conventions de code

Le projet suit des conventions strictes pour rester cohérent et maintenable.

### Nommage

| Élément | Convention | Emplacement |
|---|---|---|
| Composants | PascalCase | `front/components/` |
| React Query hooks | `{entity}.ts` | `front/queries/` |
| Stores Zustand | `{entity}.store.ts` | `front/states/stores/` |
| Contexts | `{entity}.context.tsx` | `front/states/contexts/` |
| Fetch wrappers | `{entity}.ts` | `front/lib/api/` |
| Schemas Zod | `{entity}.zod.ts` | `front|back/schemas/zod/` |
| Types dérivés | `{entity}.type.ts` | `front|back/schemas/types/` |
| Repositories | `{entity}.action.ts` | `back/repositories/` |
| Services | `{entity}.service.ts` | `back/services/` |

### Règles principales

- **Types dérivés de Prisma** (`Prisma.EntityGetPayload<…>`) — jamais redéfinis à la main. Zéro `any`.
- **Un fichier par entité** pour fetch wrappers, queries, services et repositories.
- **Séparation stricte des couches** : Route Handler (contrôle) → Service (métier + auth) → Repository (DB). Jamais d'accès Prisma direct depuis un Route Handler.
- **Validation Zod** côté formulaire (react-hook-form) **et** côté serveur (`next-zod-route`).
- **Mutations React Query** avec optimistic updates.
- **Zustand** pour l'état global partagé, **nuqs** pour l'état synchronisé à l'URL (filtres, pagination), `useState` pour l'état purement local.
- **Imports via l'alias `@/`** (racine `src/`) — jamais de chemins relatifs `../../`.
- **shadcn/ui en priorité** ; classes conditionnelles via `cn()` (jamais de template literals).
- **`"use client"` le plus bas possible** dans l'arbre — maximiser les Server Components.
- **Composants Next.js** (`next/link`, `next/image`) plutôt que les balises HTML natives.
- **Day.js** pour toute manipulation de date ; helpers partagés dans `front/lib/utils.ts`.
- **Petits fichiers à responsabilité unique**, organisés dans des dossiers explicites.
- Fichiers spéciaux par segment de route : `loading.tsx`, `error.tsx`, `not-found.tsx`, `generateMetadata` pour le SEO.

---

<div align="center">

Fait avec ❤️ pour la communauté des créatifs audiovisuels.

</div>

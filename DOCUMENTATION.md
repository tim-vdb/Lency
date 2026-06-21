# Lency — Documentation complète du projet

> Plateforme créative pour trouver des collaborateurs et partager des ressources.

---

## Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Stack technique](#stack-technique)
3. [Architecture](#architecture)
4. [Modèles de données](#modèles-de-données)
5. [API — Routes Handler](#api--routes-handler)
6. [Flux de données](#flux-de-données)
7. [Authentification](#authentification)
8. [Temps réel — Ably](#temps-réel--ably)
9. [Upload d'images — ImageKit](#upload-dimages--imagekit)
10. [Emails — Resend](#emails--resend)
11. [Gestion des secrets — Doppler](#gestion-des-secrets--doppler)
12. [Commandes de développement](#commandes-de-développement)
13. [Conventions de code](#conventions-de-code)
14. [Variables d'environnement](#variables-denvironnement)

---

## Vue d'ensemble

Lency est une plateforme web communautaire dédiée aux créatifs. Elle permet de :

- **Publier et rejoindre des projets** (marketplace) — courts métrages, clips, séries, documentaires…
- **Partager du contenu** — posts communautaires, articles, ressources pédagogiques
- **Collaborer en temps réel** — messagerie directe et messagerie de projet via Ably
- **Découvrir des talents** — annuaire de profils créatifs
- **Gérer une communauté** — catégories, abonnements, notifications, badges
- **Localiser des spots** — carte interactive avec Leaflet

---

## Stack technique

| Catégorie | Technologie | Version |
|---|---|---|
| Framework | Next.js (App Router, Turbopack) | 16.2.6 |
| UI Runtime | React | 19.2.3 |
| Langage | TypeScript | 5.9.3 |
| UI Components | shadcn/ui (Radix UI + Tailwind CSS 4) | — |
| Data fetching | TanStack React Query | 5.90.21 |
| Forms | React Hook Form + Zod + @hookform/resolvers | 7.65.0 / 4.1.12 |
| Auth | Better Auth (Email/Password + Google OAuth + OTP) | 1.3.31 |
| ORM | Prisma 7 (PostgreSQL via Neon) | 7.8.0 |
| Upload | ImageKit (`@imagekit/next`) | 2.1.5 |
| Emails | React Email + Resend | 5.2.9 / 6.9.3 |
| Temps réel | Ably | 2.21.0 |
| Cartes | Leaflet + React Leaflet | 1.9.4 / 5.0.0 |
| State global | Zustand | 5.0.12 |
| URL state | Nuqs | — |
| Icônes | lucide-react + react-icons | — |
| Notifications | Sonner (toasts) | — |
| Dates | Day.js | — |
| Secrets | Doppler CLI (dev) / Vercel Env (prod) | — |
| Déploiement | Vercel | — |
| Linting | ESLint 9 + Prettier | 9.38.0 / 3.7.4 |

---

## Architecture

### Structure des dossiers

```
src/
├── app/                          # App Router Next.js
│   ├── (pages)/
│   │   ├── (public)/
│   │   │   ├── (auth)/          # Pages d'authentification
│   │   │   ├── (app)/           # Application communautaire (marketplace, community, user…)
│   │   │   └── (website)/       # Site public (landing, pricing, support…)
│   │   ├── account/             # Dashboard utilisateur connecté
│   │   ├── admin/               # Interface d'administration
│   │   └── maintenance/         # Page de maintenance
│   ├── api/                     # Route Handlers (87+ routes)
│   └── layout.tsx               # Layout racine (providers, fonts, thème)
│
├── back/                        # Tout ce qui est serveur
│   ├── generated/
│   │   └── prisma_client/       # Client Prisma généré
│   ├── lib/
│   │   ├── auth.ts              # Configuration Better Auth
│   │   ├── auth-client.ts       # Utilitaires auth côté client
│   │   ├── auth-session.ts      # getUser() helper
│   │   ├── prisma.ts            # Instance Prisma singleton
│   │   ├── ably.ts              # Configuration Ably (temps réel)
│   │   ├── send-auth-otp-email.ts
│   │   ├── send-email-change-confirmation.ts
│   │   └── send-password-changed-email.ts
│   ├── prisma/                  # Schéma modulaire (10 fichiers .prisma)
│   │   ├── schema.prisma        # Datasource + modèles core (User, Session…)
│   │   ├── community.prisma     # Badge, Subscription, Blog…
│   │   ├── content.prisma       # Article, Category, Post, Comment…
│   │   ├── config.prisma        # UserConfig, Resource…
│   │   ├── enums.prisma         # Toutes les énumérations
│   │   ├── location.prisma      # MapLocation, Spot…
│   │   ├── messages.prisma      # Conversation, DirectMessage, ProjectMessage…
│   │   ├── notifications.prisma # Notification, CategoryNotificationSubscription…
│   │   ├── projects.prisma      # Project, ProjectApplication, ProjectInvitation…
│   │   └── seed.ts              # Script de seed
│   ├── repositories/            # Data access layer (25 fichiers *.action.ts)
│   └── schemas/
│       └── zod/                 # Schemas Zod pour validation Route Handlers
│
└── front/                       # Tout ce qui est client
    ├── components/
    │   ├── ui/                  # 39 composants Shadcn/Radix UI
    │   ├── Private/             # Composants authentifiés
    │   ├── Public/              # Composants publics
    │   ├── Modals/              # Modales globales
    │   ├── DarkMode/            # Toggle thème
    │   ├── SearchBar/           # Barre de recherche
    │   ├── common/              # Composants partagés (upload, feedback…)
    │   ├── providers/           # QueryProvider, NotificationsProvider
    │   └── ux/                  # Composants UX
    ├── emails/                  # Templates React Email
    ├── hooks/                   # Hooks custom (useDebounce, useUser, useMediaQuery…)
    ├── lib/
    │   ├── api/                 # Fetch wrappers (17 fichiers, un par entité)
    │   ├── upload.ts            # Helpers ImageKit
    │   └── utils.ts             # Fonctions utilitaires partagées (cn, getDisplayName…)
    ├── queries/                 # React Query hooks (16 fichiers, un par entité)
    ├── schemas/
    │   ├── types/               # Types Prisma dérivés + types TS (*.type.ts)
    │   └── zod/                 # Schemas Zod pour formulaires (*.zod.ts)
    └── states/
        ├── stores/              # Stores Zustand (*.store.ts)
        └── contexts/            # React Contexts stables (*.context.tsx)
```

### Flux de données

```
Client (composant React)
  └── React Query hook (front/queries/)
        └── Fetch wrapper (front/lib/api/)
              └── Route Handler (app/api/) ← validation next-zod-route
                    └── Service (back/services/) ← logique métier + auth
                          └── Repository (back/repositories/) ← accès DB pur
                                └── Prisma → PostgreSQL (Neon)
```

---

## Modèles de données

### Enuérations

| Enum | Valeurs |
|---|---|
| `Role` | `ADMIN`, `USER`, `MEMBER`, `PREMIUM` |
| `ResourceType` | `ASSET`, `TUTORIAL`, `LINK` |
| `ProjectStatus` | `DRAFT`, `PUBLISHED`, `ARCHIVED` |
| `ProjectLevel` | `DEBUTANT`, `INTERMEDIAIRE`, `AVANCE` |
| `ProjectType` | `COURT_METRAGE`, `LONG_METRAGE`, `SERIE`, `CLIP`, `DOCUMENTAIRE`, `YOUTUBE`, `AUTRE` |
| `WorkMode` | `PRESENTIEL`, `DISTANCIEL`, `HYBRIDE` |
| `RemunerationType` | `NON_REMUNERE`, `REMUNERE` |
| `SubscriptionStatus` | `ACTIVE`, `CANCELED`, `EXPIRED` |
| `Visibility` | `PUBLIC`, `PRIVATE`, `MEMBERS_ONLY` |
| `BlogStatus` | `DRAFT`, `PUBLISHED`, `ARCHIVED` |
| `ContactType` | `SUPPORT_TECHNIQUE`, `CONTACT_GENERAL`, `FACTURATION`, `PARTENARIAT`, `AUTRE` |
| `ContactStatus` | `EN_ATTENTE`, `EN_COURS`, `RESOLU`, `FERME` |

### Modèles principaux

#### `User` (schema.prisma)
Profil utilisateur central. Contient les informations d'identité, le rôle, les liens sociaux, l'avatar (ImageKit), et les relations avec toutes les autres entités.

#### `Project` (projects.prisma)
Projet créatif publié sur la marketplace. Champs clés : `title`, `description`, `status` (DRAFT/PUBLISHED/ARCHIVED), `type` (ProjectType), `level`, `workMode`, `remunerationType`, `spots` (postes recherchés), `coverUrl`.

#### `Spot` (projects.prisma / location.prisma)
- **`Spot` dans projects** : poste recherché dans un projet (rôle créatif à pourvoir)
- **`Spot` dans location** : lieu physique sur la carte interactive avec système de notation

#### `Post` (content.prisma)
Post communautaire. Supporte le vote (upvote), la sauvegarde, les commentaires, le signalement. Lié à une `Category`.

#### `Resource` (config.prisma)
Ressource pédagogique (tutoriel, asset, lien). Types : `ASSET`, `TUTORIAL`, `LINK`. Supporte vote et sauvegarde.

#### `Article` (content.prisma)
Article de blog avec slug, contenu markdown, auteur.

#### `Conversation` + `DirectMessage` (messages.prisma)
Messagerie directe entre utilisateurs, avec temps réel via Ably.

#### `ProjectMessage` (messages.prisma)
Messagerie interne à un projet (entre membres).

#### `Notification` (notifications.prisma)
Notifications utilisateur avec payload JSON pour contextualiser le type d'événement.

#### `Badge` (community.prisma)
Système de badges attribuables aux utilisateurs.

#### `MapLocation` (location.prisma)
Localisation géographique liée à une entité (utilisateur, projet, spot).

---

## API — Routes Handler

**87+ routes** organisées par entité. Convention : les Route Handlers sont de simples contrôleurs — aucune logique métier, uniquement l'appel au Service correspondant.

### Authentification
| Route | Méthodes |
|---|---|
| `/api/auth/[...all]` | Toutes (géré par Better Auth) |

### Utilisateurs
| Route | Méthodes |
|---|---|
| `/api/users` | GET, POST |
| `/api/users/[userId]` | GET, PATCH, DELETE |
| `/api/users/[userId]/follow` | POST, DELETE |
| `/api/users/[userId]/report` | POST |
| `/api/users/search` | GET |
| `/api/users/social-links` | GET, POST |
| `/api/users/username/[userName]` | GET |
| `/api/users/change-password` | POST |
| `/api/users/confirm-email-change` | POST |
| `/api/users/verify-email-change` | POST |

### Projets
| Route | Méthodes |
|---|---|
| `/api/projects` | GET, POST |
| `/api/projects/[projectId]` | GET, PATCH, DELETE |
| `/api/projects/[projectId]/apply` | POST |
| `/api/projects/[projectId]/applications` | GET |
| `/api/projects/[projectId]/comments` | GET, POST |
| `/api/projects/[projectId]/invitations` | GET, POST |
| `/api/projects/[projectId]/messages` | GET, POST |
| `/api/projects/[projectId]/report` | POST |
| `/api/projects/drafts` | GET |
| `/api/projects/mine` | GET |
| `/api/projects/invitations/[invitationId]` | PATCH |
| `/api/applications/[id]` | GET, PATCH, DELETE |
| `/api/applications/[id]/accept` | POST |
| `/api/applications/[id]/reject` | POST |

### Posts communautaires
| Route | Méthodes |
|---|---|
| `/api/posts` | GET, POST |
| `/api/posts/[postId]` | GET, PATCH, DELETE |
| `/api/posts/[postId]/vote` | POST, DELETE |
| `/api/posts/[postId]/save` | POST, DELETE |
| `/api/posts/[postId]/report` | POST |
| `/api/posts/[postId]/comments` | GET, POST |
| `/api/posts/[postId]/comments/[commentId]` | GET, PATCH, DELETE |
| `/api/posts/[postId]/comments/[commentId]/vote` | POST, DELETE |
| `/api/posts/drafts` | GET |
| `/api/posts/followed` | GET |
| `/api/posts/saved` | GET |
| `/api/posts/validate` | POST |

### Ressources
| Route | Méthodes |
|---|---|
| `/api/resources` | GET, POST |
| `/api/resources/[resourceId]` | GET, PATCH, DELETE |
| `/api/resources/[resourceId]/vote` | POST, DELETE |
| `/api/resources/[resourceId]/save` | POST, DELETE |
| `/api/resources/[resourceId]/comments` | GET, POST |
| `/api/resources/[resourceId]/comments/[commentId]/vote` | POST, DELETE |
| `/api/resources/saved` | GET |

### Catégories
| Route | Méthodes |
|---|---|
| `/api/categories` | GET, POST |
| `/api/categories/[categoryId]` | GET, PATCH, DELETE |
| `/api/categories/[categoryId]/follow` | POST |
| `/api/categories/[categoryId]/notify` | POST |
| `/api/categories/[categoryId]/posts` | GET |
| `/api/categories/followed` | GET |
| `/api/categories/slug/[slug]` | GET |

### Messagerie
| Route | Méthodes |
|---|---|
| `/api/conversations` | GET, POST |
| `/api/conversations/[id]/messages` | GET, POST |

### Notifications
| Route | Méthodes |
|---|---|
| `/api/notifications` | GET |
| `/api/notifications/[id]` | PATCH |

### Divers
| Route | Entité |
|---|---|
| `/api/articles` | Articles |
| `/api/blogs` | Blogs |
| `/api/badges` | Badges |
| `/api/events` | Événements |
| `/api/feedback` | Feedback utilisateur |
| `/api/geocode` | Géocodage d'adresses |
| `/api/imagekit/auth` | Auth tokens ImageKit |
| `/api/mails` | Emails internes |
| `/api/mapLocations` | Localisations carte |
| `/api/newsletterSubscribers` | Newsletter |
| `/api/search` | Recherche globale |
| `/api/spots` | Spots locaux + notation |
| `/api/subscriptions` | Abonnements |
| `/api/talents` | Annuaire talents |
| `/api/userConfig` | Configuration utilisateur |
| `/api/emails/welcome` | Email de bienvenue |

---

## Authentification

Gérée par **Better Auth** (`back/lib/auth.ts`).

### Méthodes disponibles
- **Email + Mot de passe** — inscription / connexion classique
- **Google OAuth** — connexion via compte Google
- **Email OTP** — code à usage unique envoyé par email (Resend)

### Helpers

```typescript
// Côté serveur (Service, Route Handler)
import { getUser } from "@/back/lib/auth-session";
const user = await getUser();
if (!user) throw new Error("Unauthorized");

// Côté client (composant)
import { useUser } from "@/front/hooks/useUser";
const { user } = useUser();
```

### Protection des routes serveur

Le layout `/account/layout.tsx` redirige côté serveur si l'utilisateur n'est pas connecté :

```typescript
const user = await getUser();
if (!user) redirect("/login");
```

---

## Temps réel — Ably

Lency utilise **Ably** pour la messagerie en temps réel (`back/lib/ably.ts`).

- **Token auth** : `/api/ably` génère des tokens signés côté serveur
- **Cas d'usage** : messagerie directe (`Conversation`), messagerie de projet (`ProjectMessage`), notifications push
- **Client** : `ably` package côté front, abonné via hooks dans les composants de messagerie

---

## Upload d'images — ImageKit

Toutes les images passent par **ImageKit** (`@imagekit/next`).

- **Auth** : `/api/imagekit/auth` génère les paramètres de signature
- **Upload helper** : `front/lib/upload.ts`
- **Composants** : `front/components/common/ImageKitUploader.tsx`, `CommentMediaUploader.tsx`
- **Affichage** : utiliser `<img>` natif ou `IKImage` d'ImageKit — **ne pas utiliser `next/image`** avec les URLs ImageKit (paramètres `tr=` incompatibles)

---

## Emails — Resend

Les emails transactionnels sont envoyés via **Resend**.

### Templates
Tous les templates sont dans `src/front/emails/` — composants React avec `@react-email/components`.

### Helpers d'envoi (back/lib/)
| Fichier | Usage |
|---|---|
| `send-auth-otp-email.ts` | Envoi du code OTP |
| `send-email-change-confirmation.ts` | Confirmation changement d'email |
| `send-password-changed-email.ts` | Notification mot de passe modifié |

### Preview en dev
```bash
npm run email
# Ouvre React Email dev server sur http://localhost:4000
```

---

## Gestion des secrets — Doppler

En développement, **Doppler CLI** injecte les variables d'environnement. Sans le préfixe `doppler run --`, toute commande Prisma qui touche la DB échoue.

En production, les variables sont gérées directement dans **Vercel**.

---

## Commandes de développement

```bash
# Démarrage
npm run dev              # Next.js + Turbopack sur http://localhost:3000
npm run all              # Next.js + Prisma Studio en parallèle

# Base de données (requiert Doppler)
npm run migrate          # doppler run -- npx prisma migrate dev
npm run studio           # doppler run -- prisma studio (port 5555)
npm run seed             # doppler run -- npx prisma db seed
npm run reset            # doppler run -- npx prisma migrate reset

# Build
npm run build            # Build production standard
# vercel-build : prisma generate → next build → prisma migrate deploy

# Qualité de code
npm run lint             # ESLint
npm run email            # React Email dev server (port 4000)
```

---

## Conventions de code

### Nommage des fichiers

| Élément | Convention | Exemple |
|---|---|---|
| Composants | PascalCase | `PostCard.tsx` |
| React Query hooks | `{entity}.ts` | `front/queries/talents.ts` |
| Hooks custom | `use{Feature}.ts` | `front/hooks/useDebounce.ts` |
| Stores Zustand | `{entity}.store.ts` | `front/states/stores/user.store.ts` |
| Contexts | `{entity}.context.tsx` | `front/states/contexts/auth.context.tsx` |
| Fetch wrappers | `{entity}.ts` | `front/lib/api/talents.ts` |
| Schemas Zod (front) | `{entity}.zod.ts` | `front/schemas/zod/user.zod.ts` |
| Types (front) | `{entity}.type.ts` | `front/schemas/types/user.type.ts` |
| Schemas Zod (back) | `{entity}.zod.ts` | `back/schemas/zod/project.zod.ts` |
| Repositories | `{entity}.action.ts` | `back/repositories/posts.action.ts` |

### Règles essentielles

**Types** — toujours dérivés de Prisma, jamais redéfinis manuellement :
```typescript
export type ProjectWithAuthor = Prisma.ProjectGetPayload<{
    include: { author: true };
}>;
```

**CSS conditionnel** — toujours `cn()` :
```typescript
import { cn } from "@/front/lib/utils";
<div className={cn("base", isActive && "active")} />
```

**Noms affichés** — toujours via les helpers :
```typescript
import { getDisplayName, getInitialName } from "@/front/lib/utils";
```

**Imports** — toujours `@/`, jamais de chemins relatifs :
```typescript
import { Button } from "@/front/components/ui/button";
```

**React keys** — toujours l'`id`, jamais l'index :
```typescript
{projects.map(project => <ProjectCard key={project.id} project={project} />)}
```

**Mutations React Query** — toujours avec optimistic updates.

**State global partagé** — Zustand, pas `useContext`.

**URL state** — Nuqs pour synchroniser avec l'URL.

**`"use client"`** — au minimum, le plus bas possible dans l'arbre.

**Zéro `any`** — utiliser les types Prisma dérivés ou `unknown` + type guard.

**Dates** — Day.js uniquement (jamais `date-fns` hors composants Shadcn natifs).

**Erreurs serveur** — format `{ error: string }` standard dans les Route Handlers.

**Ressource introuvable** — `notFound()` de Next.js, jamais une redirection ou un état vide.

**Transactions multi-tables** — toujours `prisma.$transaction([...])`.

**Fichiers spéciaux par segment** — `loading.tsx` + `error.tsx` + `not-found.tsx` pour chaque segment qui fait un `await`.

---

## Variables d'environnement

| Variable | Description |
|---|---|
| `DATABASE_URL` | URL PostgreSQL Neon (injectée par Doppler en dev) |
| `BASE_URL` | URL de base de l'application (ex: `http://localhost:3000`) |
| `RESEND_API_KEY` | Clé API Resend pour l'envoi d'emails |
| `RESEND_FROM_AUTH_EMAIL` | Adresse expéditeur auth (ex: `Lency <auth@infos.lency.net>`) |
| `AUTH_EMAIL_OTP_EXPIRES_IN` | Durée de validité OTP en secondes (défaut : `300`) |
| `ABLY_API_KEY` | Clé API Ably pour le temps réel |
| `IMAGEKIT_*` | Clés ImageKit (public key, private key, URL endpoint) |
| `GOOGLE_CLIENT_ID` | OAuth Google (Better Auth) |
| `GOOGLE_CLIENT_SECRET` | OAuth Google (Better Auth) |
| `BETTER_AUTH_SECRET` | Secret JWT Better Auth |

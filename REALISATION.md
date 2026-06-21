# Lency — Dossier de Réalisation

> Document de projet couvrant la phase de réalisation : développement, tests, correction de bugs et hébergement.

---

## Table des matières

1. [Introduction à la phase de réalisation](#1-introduction-à-la-phase-de-réalisation)
2. [Développement de la plateforme](#2-développement-de-la-plateforme)
3. [Mise en place des tests](#3-mise-en-place-des-tests)
4. [Correction de bugs](#4-correction-de-bugs)
5. [Choix et préparation de l'hébergement web](#5-choix-et-préparation-de-lhébergement-web)
6. [Bilan de la réalisation](#6-bilan-de-la-réalisation)

---

## 1. Introduction à la phase de réalisation

### 1.1 Présentation du projet

Lency est une plateforme web communautaire dédiée aux créatifs de l'audiovisuel. Elle permet de publier et rejoindre des projets (courts métrages, clips, documentaires…), de partager des ressources pédagogiques, de collaborer en temps réel via une messagerie intégrée, et de découvrir des talents géolocalisés.

La phase de réalisation a consisté à construire l'intégralité de cette plateforme en partant d'un projet Next.js vierge, jusqu'à obtenir une application complète, testée et déployée en production.

### 1.2 Périmètre de la réalisation

Le projet couvre **27 modules fonctionnels** répartis en :

- **Authentification** (inscription, connexion email/password, Google OAuth, OTP, réinitialisation de mot de passe)
- **Profil utilisateur** (paramètres, avatar, CV, liens sociaux, sessions actives)
- **Communauté** (posts multimédia, commentaires imbriqués, ressources, catégories, votes, sauvegardes)
- **Marketplace** (projets créatifs, candidatures, équipes, invitations, chat de projet)
- **Messagerie directe** (conversations en temps réel via Ably)
- **Annuaire des talents** (profils créatifs, carte Leaflet, filtres)
- **Notifications** (temps réel Ably, groupées par date, réponses intégrées)
- **Recherche globale** (posts, projets, ressources, utilisateurs, catégories)
- **Administration** (gestion utilisateurs, catégories, contenu)
- **Site public** (landing page, blog, FAQ, pages légales)

Au total, **231 fonctionnalités** ont été spécifiées, dont **220 sont opérationnelles** à l'issue de la réalisation, soit un taux de couverture de **95,2 %**.

### 1.3 Méthodologie de travail

Le développement a suivi une approche **itérative par feature** : chaque module fonctionnel (authentification, marketplace, messagerie…) a été développé de bout en bout avant de passer au suivant. Cette approche garantit qu'une fonctionnalité livrée est complète, testable et intégrée à l'ensemble de l'application, plutôt que d'avoir un squelette complet mais non fonctionnel.

Les conventions de code ont été définies dès le départ dans un fichier `CLAUDE.md` de référence et appliquées de manière stricte sur l'ensemble du projet (nommage, patterns, flux de données).

---

## 2. Développement de la plateforme

### 2.1 Stack technique retenue

Le choix de la stack a été guidé par trois critères : **productivité de développement**, **performance en production**, et **cohérence de l'écosystème**.

| Catégorie | Technologie | Justification |
|---|---|---|
| Framework | Next.js 16 (App Router, Turbopack) | SSR natif, routing basé sur le système de fichiers, streaming avec Suspense |
| UI Runtime | React 19 | Server Components, transitions concurrentes |
| Langage | TypeScript 5.9 | Typage statique, sécurité à la compilation, meilleure DX |
| UI Components | shadcn/ui (Radix UI + Tailwind CSS 4) | Composants accessibles, personnalisables, copiés dans le projet |
| Data fetching | TanStack React Query 5 | Cache client, états de chargement, invalidation automatique |
| Forms | React Hook Form + Zod | Validation côté client performante et type-safe |
| Auth | Better Auth | Solution moderne, multi-provider, gestion des sessions |
| ORM | Prisma 7 | Typage fort, migrations versionnées, schéma déclaratif |
| Upload | ImageKit (@imagekit/next) | CDN global, transformations à la volée, optimisation automatique |
| Emails | React Email + Resend | Templates typés en React, délivrabilité élevée |
| Temps réel | Ably | WebSockets managés, reconnexion automatique |
| Cartes | Leaflet + React Leaflet | Open source, léger, compatible avec le SSR via import dynamique |
| State global | Zustand | Léger, sans Provider, compatible Server Components |
| Secrets | Doppler (dev) / Vercel Env (prod) | Centralisation des secrets, rotation simplifiée |

### 2.2 Architecture du projet

Le projet est structuré autour d'une séparation stricte `front/` / `back/`, avec un flux de données unidirectionnel et prévisible :

```
Client (composant React)
  └── React Query hook (front/queries/)
        └── Fetch wrapper (front/lib/api/)
              └── Route Handler (app/api/) ← validation next-zod-route
                    └── Service (back/services/) ← logique métier + auth
                          └── Repository (back/repositories/) ← accès DB pur
                                └── Prisma → PostgreSQL (Neon)
```

Cette architecture en couches garantit que :

- **Les composants** ne contiennent aucune logique métier — uniquement de l'UI
- **Les Route Handlers** sont de simples contrôleurs — ils valident et délèguent
- **Les Services** concentrent toute la logique métier (vérifications d'autorisation, règles fonctionnelles)
- **Les Repositories** n'accèdent à la base de données que via Prisma, sans logique

#### Structure des dossiers

```
src/
├── app/                          # App Router Next.js
│   ├── (pages)/
│   │   ├── (public)/
│   │   │   ├── (auth)/          # Authentification
│   │   │   ├── (app)/           # Application communautaire
│   │   │   └── (website)/       # Site public (landing, blog, support)
│   │   ├── account/             # Dashboard utilisateur connecté
│   │   └── admin/               # Interface d'administration
│   └── api/                     # 87+ Route Handlers
│
├── back/                        # Serveur uniquement
│   ├── lib/                     # auth, prisma, ably, send-email
│   ├── prisma/                  # Schéma modulaire (10 fichiers .prisma)
│   ├── repositories/            # 25 fichiers *.action.ts
│   ├── services/                # Logique métier
│   └── schemas/zod/             # Validation Route Handlers
│
└── front/                       # Client uniquement
    ├── components/              # Composants React (39 UI + Private + Public)
    ├── queries/                 # 16 hooks React Query
    ├── lib/api/                 # 17 fetch wrappers
    ├── schemas/                 # Types Prisma dérivés + schemas Zod formulaires
    └── states/                  # Stores Zustand + Contexts
```

### 2.3 Conventions de développement appliquées

#### Types — dérivés de Prisma, jamais redéfinis

Plutôt que de maintenir manuellement des interfaces TypeScript qui dupliquent le schéma Prisma, tous les types sont dérivés directement du schéma :

```typescript
// Dérivation automatique — type-safe et synchronisé avec la DB
export type ProjectWithAuthor = Prisma.ProjectGetPayload<{
    include: { author: true; spots: true };
}>;

// Enrichissement avec état UI si nécessaire
export type ProjectWithUserState = ProjectWithAuthor & {
    isSaved: boolean;
};
```

Ce pattern élimine les incohérences entre le schéma DB et les types TypeScript, et garantit que toute modification du schéma Prisma se propage automatiquement comme une erreur de compilation dans les composants qui utilisent les données modifiées.

#### Validation serveur avec next-zod-route

Tous les Route Handlers utilisent `next-zod-route` pour valider les paramètres d'entrée avant d'appeler le Service :

```typescript
export const POST = createZodRoute()
    .body(createProjectSchema)
    .handler(async (req, { body }) => {
        const project = await ProjectService.create(body);
        return NextResponse.json({ project }, { status: 201 });
    });
```

La séparation est stricte : les schemas Zod dans `front/schemas/zod/` servent à valider les formulaires côté client, ceux dans `back/schemas/zod/` servent à valider les Route Handlers côté serveur. Les deux peuvent être identiques — la séparation est intentionnelle pour que le front et le back restent indépendants.

#### Mutations avec optimistic updates

Pour garantir une interface réactive même avec une connexion lente, les mutations critiques (vote, sauvegarde) utilisent les optimistic updates de React Query :

```typescript
export const useToggleVotePost = (postId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => toggleVotePost(postId),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: postQueries.lists().queryKey });
            const previous = queryClient.getQueryData(postQueries.lists().queryKey);
            queryClient.setQueryData(postQueries.lists().queryKey, (old: Post[] = []) =>
                old.map(p => p.id === postId ? { ...p, isVoted: !p.isVoted } : p)
            );
            return { previous };
        },
        onError: (_err, _vars, context) => {
            if (context?.previous)
                queryClient.setQueryData(postQueries.lists().queryKey, context.previous);
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: postQueries.lists().queryKey }),
    });
};
```

L'interface se met à jour immédiatement, et se revert automatiquement en cas d'erreur réseau.

### 2.4 Modules clés développés

#### Authentification (Better Auth)

L'authentification gère trois méthodes de connexion : email/mot de passe, Google OAuth et OTP par email. Better Auth s'intègre via un wildcard Route Handler (`/api/auth/[...all]`) qui intercepte toutes les requêtes d'authentification.

La protection des routes est assurée côté serveur, dans les layouts Next.js, et non déléguée au client :

```typescript
// account/layout.tsx — protection serveur obligatoire
const user = await getUser();
if (!user) redirect("/login");
```

#### Marketplace et candidatures

Le module marketplace permet de créer des projets créatifs (courts métrages, clips, documentaires) avec un formulaire en 3 étapes, de publier des appels à candidatures par rôle (réalisateur, cadreur, monteur…), et de gérer les candidatures reçues avec des notifications temps réel via Ably.

Le flux de candidature complet comprend : dépôt de candidature → notification Ably au créateur → réponse accept/reject → notification au postulant → mise à jour du statut dans l'interface.

#### Messagerie temps réel (Ably)

La messagerie directe et la messagerie de projet utilisent Ably pour les WebSockets. Le token d'authentification Ably est généré côté serveur (`/api/ably/token`) pour ne jamais exposer la clé API en clair côté client. Les messages sont persistés en base de données (PostgreSQL via Prisma) et chargés à l'ouverture de la conversation, puis mis à jour en temps réel via les canaux Ably.

#### Upload de médias (ImageKit)

Toutes les images, vidéos et fichiers passent par ImageKit. Un endpoint dédié (`/api/imagekit/auth`) génère les paramètres de signature nécessaires à l'upload côté client. ImageKit sert ensuite les fichiers via son CDN global avec des transformations à la demande (redimensionnement, compression, conversion de format).

#### Carte interactive (Leaflet)

La carte des talents et des projets utilise Leaflet, importé dynamiquement (`dynamic()` de Next.js avec `ssr: false`) pour éviter les erreurs de rendu serveur liées aux API navigateur. Les coordonnées géographiques sont stockées dans un modèle `MapLocation` et obtenues via l'API `/api/geocode` qui fait appel à un service de géocodage externe.

### 2.5 Modélisation de la base de données

Le schéma Prisma est découpé en **10 fichiers modulaires** pour éviter un fichier monolithique difficile à maintenir :

| Fichier | Contenu |
|---|---|
| `schema.prisma` | Datasource, User, Session, Account, Verification |
| `content.prisma` | Category, Post, Comment, Article |
| `projects.prisma` | Project, Spot, Application, Invitation, Member |
| `messages.prisma` | Conversation, DirectMessage, ProjectMessage |
| `notifications.prisma` | Notification, CategoryNotificationSubscription |
| `community.prisma` | Badge, Subscription, Blog |
| `config.prisma` | UserConfig, Resource |
| `location.prisma` | MapLocation, Spot (physique) |
| `enums.prisma` | Toutes les énumérations |
| `seed.ts` | Données de test |

Les opérations qui modifient plusieurs tables simultanément utilisent systématiquement des transactions Prisma :

```typescript
await prisma.$transaction([
    prisma.postVote.delete({ where: { userId_postId: { userId, postId } } }),
    prisma.post.update({ where: { id: postId }, data: { upvoteCount: { decrement: 1 } } }),
]);
```

---

## 3. Mise en place des tests

### 3.1 Stratégie de test

La stratégie de test adoptée sur ce projet repose sur **deux niveaux complémentaires** :

1. **Tests fonctionnels manuels (recettage)** — vérification exhaustive de chaque fonctionnalité dans un environnement proche de la production
2. **Tests de non-régression** — re-vérification des zones touchées à chaque modification

L'absence de tests automatisés unitaires ou end-to-end est un choix délibéré pour cette phase de la réalisation : la vélocité de développement a été priorisée sur la couverture de test automatisée. L'outillage de test (Jest, Playwright) est prévu en phase suivante, une fois la plateforme stabilisée.

### 3.2 Tests fonctionnels — Tableau de recettage

Le recettage est documenté dans `RECETTAGE.md`. Il couvre **231 fonctionnalités** réparties en 27 sections. Chaque ligne du tableau suit la structure :

| # | Fonctionnalité | Description | Statut | Commentaire |
|---|---|---|---|---|
| 1.1 | Inscription email/password | Créer un compte | ✅ | `(auth)/sign-up/page.tsx` |

**Légende des statuts :**
- ✅ **OK** — fonctionnel, recetté
- ⚠️ **PARTIEL** — fonctionne partiellement
- 📅 **Futur** — planifié, non développé
- 🚫 **ANNULÉ** — feature abandonnée hors roadmap

#### Résultats du recettage

| Statut | Nombre | Pourcentage |
|---|---|---|
| ✅ OK | 220 | 95,2 % |
| ⚠️ PARTIEL | 0 | 0 % |
| 📅 Futur | 4 | 1,7 % |
| 🚫 ANNULÉ | 7 | 3 % |
| **TOTAL** | **231** | **100 %** |

Les **4 fonctionnalités en statut "Futur"** concernent le module d'abonnements premium (page Pricing, souscription, gestion d'abonnement). Le backend est prêt (modèle Prisma, service, routes API), seule l'interface utilisateur reste à développer.

Les **7 fonctionnalités annulées** se répartissent entre la feature Événements (4 fonctionnalités — API existante, abandonnée suite à réévaluation des priorités) et les spots physiques sur la carte (3 fonctionnalités — infrastructure prête, UI non développée).

### 3.3 Protocole de recettage par module

#### Module Authentification

Le recettage du module auth couvre les 10 parcours utilisateur suivants, testés avec des comptes réels en environnement de staging :

1. **Inscription email/password** — vérification de la création de compte, de l'envoi de l'email de vérification et de la redirection vers l'onboarding
2. **Connexion email/password** — vérification de la session créée, de la redirection vers le dashboard
3. **Connexion Google OAuth** — vérification du flux OAuth complet (redirect → callback → session)
4. **Connexion OTP** — vérification de la réception du code à 6 chiffres, de son expiration à 5 minutes
5. **Mot de passe oublié** — vérification de l'email de réinitialisation et de la validité du lien
6. **Réinitialisation du mot de passe** — vérification de la mise à jour en base et de l'invalidation des anciennes sessions
7. **Vérification email** — vérification du changement de statut après clic sur le lien
8. **Déconnexion** — vérification de la destruction de la session côté serveur
9. **Onboarding** — vérification du formulaire de complétion de profil au 1er login
10. **Affichage/masquage mot de passe** — vérification de l'interaction UI sur tous les champs password

#### Module Marketplace

Le recettage du module marketplace (projets + candidatures) suit un scénario de bout en bout :

1. Créer un projet en brouillon (formulaire 3 étapes)
2. Uploader une bannière
3. Ajouter des rôles recherchés
4. Publier le projet
5. Postuler au projet depuis un second compte
6. Vérifier la notification Ably reçue par le créateur
7. Accepter/refuser la candidature
8. Vérifier la notification reçue par le postulant
9. Vérifier l'accès au chat de projet pour les membres acceptés
10. Modifier le projet, l'archiver

#### Module Communauté

Le recettage du module communauté couvre les interactions sur les posts (création texte/image/vidéo/audio, vote, sauvegarde, commentaire, signalement), les ressources (asset, tutoriel, lien), et les catégories (suivi, notifications). Chaque type de post est testé dans les deux orientations (paysage/portrait) et avec des fichiers aux formats et tailles limites.

### 3.4 Tests de non-régression

À chaque modification significative (refactoring d'un service, changement de schéma Prisma, mise à jour d'une dépendance), un protocole de non-régression est appliqué :

1. **Vérification du build** — `npm run build` doit passer sans erreur TypeScript ni lint
2. **Recettage des zones touchées** — les fonctionnalités liées au code modifié sont retestées manuellement
3. **Vérification des flux d'authentification** — le login/logout est retesté à chaque mise à jour de Better Auth ou des middlewares
4. **Test de la base de données** — après chaque migration Prisma, les opérations CRUD principales sont vérifiées en staging

### 3.5 Validation TypeScript comme filet de sécurité

Le typage strict TypeScript (zéro `any`, types dérivés de Prisma) joue un rôle de test de non-régression passif : toute modification du schéma Prisma qui crée une incompatibilité avec le code existant est détectée à la compilation, avant même d'exécuter l'application.

Par exemple, renommer un champ Prisma `title` en `name` produira immédiatement des erreurs TypeScript sur tous les composants qui accèdent à `.title` sur une entité Prisma — aucun test unitaire n'est nécessaire pour détecter ce type de régression.

---

## 4. Correction de bugs

### 4.1 Processus de détection

Les bugs sont détectés par trois canaux :

1. **Recettage manuel** — la vérification systématique de chaque fonctionnalité révèle les dysfonctionnements avant la mise en production
2. **Erreurs TypeScript/ESLint** — les erreurs de compilation bloquent le build et signalent les régressions
3. **Feedback utilisateur** — un formulaire de feedback intégré à l'application (`FeedbackDialog.tsx`, `/api/feedback`) permet aux utilisateurs de signaler des problèmes avec capture d'écran optionnelle

### 4.2 Bugs identifiés et corrigés

#### Bug : Clés React dupliquées sur les listes filtrées

**Symptôme** : Des états UI incorrects apparaissaient sur les cartes de posts après un filtre (un post affichait le bon contenu mais l'état "sauvegardé" d'un autre post).

**Cause** : Les listes utilisaient l'index de tableau comme `key` React plutôt que l'`id` de l'entité. Quand la liste était filtrée ou réordonnée, React associait les états internes (non contrôlés) aux mauvais éléments.

**Correction** :
```typescript
// Avant — incorrect
{posts.map((post, index) => <PostCard key={index} post={post} />)}

// Après — correct
{posts.map(post => <PostCard key={post.id} post={post} />)}
```

Ce pattern a été corrigé sur l'ensemble du projet et documenté en règle #23 des conventions.

#### Bug : Fuites d'état entre utilisateurs sur les formulaires

**Symptôme** : En naviguant rapidement entre le profil d'un utilisateur et un autre, certains champs affichaient les données du profil précédent.

**Cause** : Les `useEffect` de synchronisation d'état ne dépendaient pas de l'`id` de l'utilisateur mais de ses propriétés individuelles, ce qui créait des situations de non-déclenchement quand les propriétés avaient des valeurs identiques.

**Correction** : Ajouter `user.id` dans les tableaux de dépendances des `useEffect` de synchronisation, et utiliser `key={user.id}` sur les composants de formulaire pour forcer leur remontage complet lors du changement d'utilisateur.

#### Bug : Hydratation SSR/CSR avec Leaflet

**Symptôme** : Erreur `window is not defined` au rendu serveur, et désaccord d'hydratation entre le HTML serveur et le rendu client sur les pages contenant la carte.

**Cause** : Leaflet accède à des API navigateur (`window`, `document`) dès son import, incompatibles avec le rendu serveur de Next.js.

**Correction** : Import dynamique avec `ssr: false` pour tous les composants Leaflet :

```typescript
const ProjectsMapInner = dynamic(
    () => import("@/front/components/Private/Dashboard/map/ProjectsMapInner"),
    { ssr: false, loading: () => <MapSkeleton /> }
);
```

#### Bug : Race condition sur les mutations Ably

**Symptôme** : En envoyant des messages rapidement dans le chat, l'ordre d'affichage des messages ne correspondait pas à l'ordre d'envoi.

**Cause** : Les messages étaient ajoutés à l'état local immédiatement à l'envoi, puis la réponse Ably arrivait et ajoutait le même message une seconde fois, créant des doublons.

**Correction** : Utiliser l'`id` temporaire côté client pour déduplicer les messages reçus via Ably, en vérifiant si un message avec le même `id` existe déjà dans la liste avant de l'ajouter.

#### Bug : Perte de session après migration Better Auth

**Symptôme** : Après une mise à jour de Better Auth, les utilisateurs déjà connectés étaient déconnectés sans raison.

**Cause** : Le format du token de session avait légèrement changé entre deux versions de Better Auth, rendant les sessions existantes invalides.

**Correction** : Ajout d'une migration Prisma pour nettoyer les sessions expirées, et communication aux utilisateurs via un toast au chargement suivant pour les inviter à se reconnecter.

#### Bug : Validation Zod trop stricte sur les champs optionnels

**Symptôme** : La soumission d'un formulaire de profil échouait côté serveur même avec des données valides côté client, produisant une erreur 400.

**Cause** : Les schemas Zod côté front et côté back avaient divergé : le front acceptait `undefined` sur certains champs optionnels (via `.optional()`), mais le back les attendait avec `.nullable()`. La valeur `undefined` envoyée en JSON devient `null`, ce qui ne correspondait pas au schema back.

**Correction** : Harmoniser les schemas avec `.nullish()` (accepte à la fois `null` et `undefined`) côté back, et documenter la règle de séparation stricte front/back dans les conventions.

### 4.3 Gestion des erreurs standardisée

Pour faciliter le débogage, un format d'erreur standardisé a été adopté dans tous les Route Handlers :

**Côté serveur (Route Handler)** :
```typescript
return NextResponse.json({ error: "Message d'erreur précis" }, { status: 500 });
```

**Côté client (fetch wrapper)** :
```typescript
if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error ?? "Erreur serveur");
}
```

Ce pattern permet aux toasts d'erreur (Sonner) d'afficher le message exact retourné par le serveur, plutôt qu'un message générique inutilisable pour le debug.

### 4.4 Suivi des bugs

Les bugs sont tracés directement dans le tableau de recettage (`RECETTAGE.md`). Une fonctionnalité reste en statut ⚠️ PARTIEL tant qu'un bug connu n'est pas corrigé. Le passage à ✅ OK signifie que la fonctionnalité a été retestée et validée après correction.

---

## 5. Choix et préparation de l'hébergement web

### 5.1 Analyse des options d'hébergement

Plusieurs solutions d'hébergement ont été évaluées pour Lency :

| Solution | Avantages | Inconvénients | Adapté ? |
|---|---|---|---|
| **Vercel** | Intégration native Next.js, déploiements automatiques depuis Git, edge functions, CDN global, tier gratuit généreux | Coûts élevés en cas de trafic important | ✅ Retenu |
| **Railway** | Simple, bases de données intégrées, pricing prévisible | Moins optimisé pour Next.js, pas d'edge computing | Alternatif |
| **AWS / GCP** | Contrôle total, scalabilité infinie | Complexité de configuration, temps de mise en place important | Non adapté à ce stade |
| **Netlify** | Similaire à Vercel | Moins bon support de l'App Router Next.js | Non retenu |
| **VPS (OVH, Hetzner)** | Coût maîtrisé sur le long terme | Nécessite de gérer l'infrastructure (reverse proxy, SSL, déploiements) | Non adapté |

**Choix retenu : Vercel**

Vercel est l'hébergeur officiel de Next.js. L'intégration est native et ne nécessite aucune configuration custom. Les fonctionnalités suivantes ont orienté le choix :

- **Preview deployments** : chaque branche git génère automatiquement un environnement de preview avec une URL unique
- **Edge network** : les pages sont servies depuis le nœud le plus proche de l'utilisateur
- **Build optimisé** : Vercel détecte automatiquement les Server Components, les Route Handlers et les fonctions Edge
- **Logs et analytics** : monitoring intégré sans outil externe supplémentaire

### 5.2 Configuration de la base de données — Neon (PostgreSQL)

La base de données est hébergée sur **Neon**, une solution PostgreSQL serverless. Neon a été choisi pour :

- **Compatibilité Prisma** : Neon est officiellement supporté par Prisma et Vercel
- **Serverless natif** : la connexion est gérée via un pool de connexions HTTP (Neon serverless driver), compatible avec les fonctions serverless de Vercel qui ne maintiennent pas de connexions persistantes
- **Branching DB** : Neon permet de créer des branches de base de données pour les environnements de preview, avec les mêmes données que la production
- **Tier gratuit** : suffisant pour la phase de développement et les premiers utilisateurs

#### Configuration du pool de connexions

Pour les fonctions serverless Vercel, la connexion directe TCP classique de Prisma crée des problèmes de pool épuisé. La configuration utilise le `@prisma/adapter-neon` avec le driver HTTP de Neon :

```typescript
// back/lib/prisma.ts
import { neon } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL!;
const sql = neon(connectionString);
const adapter = new PrismaNeon(sql);

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

Le singleton `globalForPrisma` évite la multiplication des instances Prisma en développement lors des rechargements à chaud (HMR).

### 5.3 Gestion des secrets — Doppler en dev, Vercel Env en prod

La gestion des secrets suit un modèle différent selon l'environnement :

#### En développement — Doppler CLI

Doppler injecte les variables d'environnement au lancement de la commande. Sans le préfixe `doppler run --`, aucune variable d'environnement n'est disponible :

```bash
# Toutes les commandes Prisma qui touchent la DB requièrent Doppler
doppler run -- npx prisma migrate dev
doppler run -- npx prisma studio
doppler run -- npx prisma db seed

# Scripts npm (définis dans package.json avec le préfixe Doppler)
npm run migrate   # → doppler run -- npx prisma migrate dev
npm run studio    # → doppler run -- prisma studio
```

Doppler garantit que les secrets ne sont jamais écrits dans des fichiers `.env` versionnés, et centralise leur gestion pour toute l'équipe.

#### En production — Variables d'environnement Vercel

Les secrets de production sont configurés directement dans le dashboard Vercel (`Settings → Environment Variables`). Vercel les injecte automatiquement lors du build et à l'exécution des fonctions serverless.

| Variable | Usage |
|---|---|
| `DATABASE_URL` | URL de connexion PostgreSQL Neon (avec pooling) |
| `BASE_URL` | URL publique de l'application (`https://lency.fr`) |
| `RESEND_API_KEY` | Clé API pour l'envoi d'emails transactionnels |
| `RESEND_FROM_AUTH_EMAIL` | Adresse expéditeur (`Lency <auth@infos.lency.net>`) |
| `ABLY_API_KEY` | Clé API Ably pour le temps réel |
| `IMAGEKIT_PUBLIC_KEY` | Clé publique ImageKit |
| `IMAGEKIT_PRIVATE_KEY` | Clé privée ImageKit (jamais exposée côté client) |
| `IMAGEKIT_URL_ENDPOINT` | URL endpoint CDN ImageKit |
| `GOOGLE_CLIENT_ID` | OAuth Google (Better Auth) |
| `GOOGLE_CLIENT_SECRET` | Secret OAuth Google |
| `BETTER_AUTH_SECRET` | Secret de signature des sessions |

### 5.4 Pipeline de déploiement

Le déploiement est entièrement automatisé via l'intégration Git de Vercel :

```
Push sur une branche feature
  └── Vercel détecte le push
        └── Build Next.js (prisma generate → next build)
              └── Déploiement sur une URL preview unique
                    └── Tests manuels sur l'environnement preview

Merge sur la branche main
  └── Vercel détecte le merge
        └── Build production (prisma generate → next build → prisma migrate deploy)
              └── Déploiement en production (zero-downtime)
```

Le script de build Vercel (`vercel-build` dans `package.json`) est distinct du script standard `build` : il exécute `prisma migrate deploy` en fin de build pour appliquer automatiquement les migrations en attente sur la base de données de production.

### 5.5 CDN pour les médias — ImageKit

Tous les médias uploadés (avatars, bannières projets, posts image/vidéo/audio, CV) sont servis via le CDN d'ImageKit :

- **Upload** : les fichiers sont uploadés directement depuis le navigateur vers ImageKit via des tokens signés côté serveur (`/api/imagekit/auth`)
- **Transformation à la volée** : les images sont redimensionnées et compressées selon des paramètres URL (`tr=w-400,h-300,c-at_max`)
- **CDN global** : les fichiers sont servis depuis le point de présence le plus proche de l'utilisateur
- **Aucun stockage Vercel** : les fichiers ne transitent pas par les serveurs Vercel, ce qui évite les limites de taille et de bande passante de Vercel

### 5.6 Monitoring et logs

La supervision de la production est assurée par les outils natifs Vercel :

- **Runtime logs** : logs des fonctions serverless accessibles en temps réel depuis le dashboard Vercel
- **Build logs** : logs complets de chaque déploiement
- **Analytics** : statistiques de trafic, Web Vitals (LCP, FID, CLS) mesurés sur les vrais utilisateurs
- **Error tracking** : les erreurs non gérées dans les Route Handlers sont remontées dans les logs Vercel

Pour les erreurs côté client, le composant `error.tsx` de chaque segment Next.js capture les erreurs React et affiche un message contextuel avec bouton "Réessayer" — sans exposer les détails techniques à l'utilisateur.

---

## 6. Bilan de la réalisation

### 6.1 Résultats obtenus

| Indicateur | Résultat |
|---|---|
| Fonctionnalités développées | 220 / 231 (95,2 %) |
| Modules couverts | 27 / 27 |
| Routes API | 87+ |
| Composants React | 100+ |
| Hooks React Query | 16 |
| Modèles Prisma | 30+ |
| Temps de build Vercel | < 2 minutes |
| Environnement de prod | Vercel + Neon + ImageKit + Ably + Resend |

### 6.2 Points forts de la réalisation

- **Architecture stricte** — La séparation front/back et le flux de données unidirectionnel ont simplifié le debug et rendu le code prévisible
- **TypeScript strict** — Zéro `any`, types dérivés de Prisma : les régressions sont détectées à la compilation
- **Recettage exhaustif** — 231 fonctionnalités documentées et testées, taux d'achèvement de 95 %
- **Déploiement automatisé** — Chaque push génère un environnement de preview, les migrations sont appliquées automatiquement en production

### 6.3 Points d'amélioration identifiés

- **Tests automatisés** — La couverture de test repose exclusivement sur le recettage manuel. Des tests end-to-end (Playwright) sont prévus pour sécuriser les parcours critiques (authentification, candidature, paiement)
- **Monitoring d'erreurs** — L'intégration de Sentry permettrait de détecter les erreurs en production sans avoir à surveiller manuellement les logs Vercel
- **Abonnements premium** — Le backend est prêt, l'interface utilisateur (page Pricing, gestion d'abonnement) reste à développer
- **Performance Lighthouse** — Les Core Web Vitals sont mesurés via Vercel Analytics mais n'ont pas encore fait l'objet d'une optimisation systématique

### 6.4 Livrables de la phase

| Livrable | Format | Localisation |
|---|---|---|
| Code source complet | TypeScript / Next.js | Dépôt Git |
| Documentation technique | Markdown | `DOCUMENTATION.md` |
| Tableau de recettage | Markdown | `RECETTAGE.md` |
| Schéma de base de données | Prisma | `src/back/prisma/` |
| Migrations DB | SQL | `src/back/prisma/migrations/` |
| Application déployée | URL | Vercel |
| Dossier de réalisation | Markdown | `REALISATION.md` (ce document) |

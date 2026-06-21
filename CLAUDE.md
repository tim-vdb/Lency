# Lency — Référence Claude

> Le projet est en cours d'optimisation. Les patterns décrits ici sont ceux **à suivre** (pas toujours encore appliqués partout). En cas de contradiction entre ce fichier et le code existant, suivre ce fichier.

---

## Stack technique

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- **UI** : shadcn/ui (Radix UI + Tailwind CSS 4)
- **Data fetching** : TanStack React Query 5 + fetch wrappers custom
- **Forms** : react-hook-form + zod + @hookform/resolvers
- **Auth** : better-auth (Email/Password + Google OAuth + Email OTP)
- **ORM** : Prisma 7 (PostgreSQL via Neon)
- **Upload** : ImageKit (`@imagekit/next`)
- **Emails** : React Email + resend
- **Icônes** : lucide-react (prioritaire) + react-icons (complément si icône absente de lucide)
- **Notifications** : sonner (toasts)
- **Secrets** : Doppler CLI en dev et Vercel en prod

---

## Architecture

```
src/
├── app/                     # App Router Next.js
│   ├── (pages)/            # Route groups
│   │   ├── (public)/       # Site public + app community + auth
│   │   ├── account/        # Pages privées (dashboard)
│   │   └── admin/          # Admin
│   └── api/                # Route Handlers (54 routes)
├── front/                  # Tout ce qui est client
│   ├── assets/             # Images, icônes, fonts statiques
│   ├── components/         # Composants React
│   ├── emails/             # React Email templates
│   ├── hooks/              # Hooks custom génériques (useDebounce, useMediaQuery...)
│   ├── lib/
│   │   ├── api/            # Fetch wrappers vers l'API (un fichier par entité)
│   │   ├── upload.ts       # Helpers ImageKit (@imagekit/next)
│   │   └── utils.ts        # Fonctions utilitaires partagées
│   ├── queries/            # React Query hooks (useQuery / useMutation, un fichier par entité)
│   ├── schemas/
│   │   ├── zod/            # Schemas Zod de validation — nommage : {entity}.zod.ts
│   │   └── types/          # Types Prisma dérivés + types TS — nommage : {entity}.type.ts
│   └── states/
│       ├── stores/         # Stores Zustand — nommage : {entity}.store.ts
│       └── contexts/       # React Contexts stables (auth, thème) — nommage : {entity}.context.tsx
└── back/                   # Tout ce qui est serveur
    ├── lib/                # auth, prisma, session, send-email
    ├── repositories/       # Data access layer (*.action.ts)
    ├── services/           # Business logic (*.service.ts)
    ├── schemas/
    │   ├── zod/            # Schemas Zod pour validation Route Handlers — nommage : {entity}.zod.ts
    │   └── types/          # Types Prisma dérivés côté back — nommage : {entity}.type.ts
    └── prisma/             # Schema modulaire (6 fichiers .prisma)
```

**Flux de données** :
```
Client → fetch wrapper (front/lib/api/) → Route Handler (app/api/) → Service → Repository → Prisma → PostgreSQL
```

---

## Conventions de nommage

| Élément | Convention | Exemple |
|---|---|---|
| Composants | PascalCase | `PostCard.tsx` |
| React Query hooks | `{entity}.ts` dans `front/queries/` | `talents.ts` |
| Hooks custom | `use{Feature}.ts` dans `front/hooks/` | `useDebounce.ts` |
| Stores Zustand | `{entity}.store.ts` dans `front/states/stores/` | `user.store.ts` |
| Contexts | `{entity}.context.tsx` dans `front/states/contexts/` | `auth.context.tsx` |
| Fetch wrappers | `{entity}.ts` dans `front/lib/api/` | `talents.ts` |
| Schemas Zod (front) | `{entity}.zod.ts` dans `front/schemas/zod/` | `user.zod.ts` |
| Types Prisma/TS (front) | `{entity}.type.ts` dans `front/schemas/types/` | `user.type.ts` |
| Schemas Zod (back) | `{entity}.zod.ts` dans `back/schemas/zod/` | `project.zod.ts` |
| Types Prisma/TS (back) | `{entity}.type.ts` dans `back/schemas/types/` | `project.type.ts` |
| Repositories | `{entity}.action.ts` dans `back/repositories/` | `posts.action.ts` |
| Services | `{entity}.service.ts` dans `back/services/` | `posts.service.ts` |

---

## Patterns à suivre

### 1. Flux complet — de la Page à la DB

Le flux **obligatoire** pour toute feature avec formulaire ou appel API :

```
Page (Next.js)
  └── Composant formulaire (Shadcn Form + React Hook Form)
        └── Schema Zod front  (src/front/schemas/zod/entity.zod.ts)
        └── Types front       (src/front/schemas/types/entity.type.ts)
        └── Submit → fetch wrapper (src/front/lib/api/entity.ts)
              └── Route Handler — "controller" (src/app/api/entity/route.ts)
                    └── Validation Zod back  (src/back/schemas/zod/entity.zod.ts)  ← next-zod-route
                    └── Types back           (src/back/schemas/types/entity.type.ts)
                    └── Service — logique métier (src/back/services/entity.service.ts)
                          └── Repository — accès DB (src/back/repositories/entity.action.ts)
                                └── Prisma → PostgreSQL (Neon)
```

**Types** (`src/front/schemas/types/entity.type.ts`) — dériver de Prisma, jamais redéfinir :
```typescript
import type { Prisma } from "@prisma/client";

export type EntityWithAuthor = Prisma.EntityGetPayload<{
    include: { author: true };
}>;

// Enrichir avec état UI si nécessaire
export type EntityWithUserState = EntityWithAuthor & {
    isSaved: boolean;
};
```

**Schema Zod** (`src/front/schemas/zod/entity.zod.ts`) :
```typescript
import { z } from "zod";

export const createEntitySchema = z.object({
    name: z.string().min(1, "Requis"),
});

export type CreateEntityInput = z.infer<typeof createEntitySchema>;
```

**Fetch wrapper** (`src/front/lib/api/entity.ts`) :
```typescript
import type { EntityWithAuthor } from "@/front/schemas/types/entity.type";

export async function fetchEntities(): Promise<EntityWithAuthor[]> {
    const res = await fetch('/api/entity', { cache: 'no-store' });
    if (!res.ok) throw new Error('Erreur fetch');
    return (await res.json()).items;
}

export async function createEntity(data: CreateEntityInput): Promise<EntityWithAuthor> {
    const res = await fetch('/api/entity', { method: 'POST', body: JSON.stringify(data) });
    if (!res.ok) throw new Error('Erreur fetch');
    return (await res.json()).item;
}
```

**React Query hook** (`src/front/queries/entity.ts`) :
```typescript
const ENTITY_ROOT = ["entity"] as const;

export const entityQueries = {
    lists: () => queryOptions({
        queryKey: [...ENTITY_ROOT, "list"],
        queryFn: fetchEntities,
        staleTime: 1000 * 60 * 5,
    }),
};

export const useEntities = () => useQuery(entityQueries.lists());

export const useCreateEntity = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createEntity,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [...ENTITY_ROOT, "list"] }),
    });
};
```

**Route Handler** (`src/app/api/entity/route.ts`) — controller uniquement, pas de logique métier :
```typescript
export async function GET() {
    try {
        const items = await EntityService.findAll();
        return NextResponse.json({ items });
    } catch {
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const item = await EntityService.create(data);
        return NextResponse.json({ item }, { status: 201 });
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized")
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
```

**Service** (`src/back/services/entity.service.ts`) — logique métier + vérification auth :
```typescript
export const EntityService = {
    findAll: async () => EntityAction.findAll(),
    create: async (data: CreateEntityInput) => {
        const user = await getUser();
        if (!user) throw new Error("Unauthorized");
        return EntityAction.create({ ...data, authorId: user.id });
    },
};
```

**Repository** (`src/back/repositories/entity.action.ts`) — accès DB pur, aucune logique métier :
```typescript
export const EntityAction = {
    findAll: () => prisma.entity.findMany({ include: { author: true } }),
    findById: (id: string) => prisma.entity.findUnique({ where: { id }, include: { author: true } }),
    create: (data: Prisma.EntityCreateInput) => prisma.entity.create({ data }),
    update: (id: string, data: Prisma.EntityUpdateInput) => prisma.entity.update({ where: { id }, data }),
    delete: (id: string) => prisma.entity.delete({ where: { id } }),
};
```

---

### 2. Types — dériver de Prisma, jamais redéfinir

```typescript
// ✅ À faire — type-safe dérivé du schema Prisma
export type PostWithAuthorAndCategory = Prisma.PostGetPayload<{
    include: { author: true; category: true }
}>;

// Enrichir avec état UI si nécessaire
export type PostWithUserState = PostWithAuthorAndCategory & {
    isSaved: boolean;
    isVoted: boolean;
};

// ❌ À éviter — redéfinir manuellement ce que Prisma génère déjà
export type Post = { id: string; content: string; authorId: string; ... };
```

---

### 3. Mutations React Query — toujours avec optimistic updates

```typescript
export const useToggleVotePost = (postId: string) => {
    const queryClient = useQueryClient();
    const listKey = postQueries.lists().queryKey;

    return useMutation({
        mutationFn: () => toggleVotePost(postId),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: listKey });
            const previous = queryClient.getQueryData(listKey);
            // Mise à jour optimiste du cache
            queryClient.setQueryData(listKey, (old: Post[] = []) =>
                old.map(p => p.id === postId ? { ...p, isVoted: !p.isVoted } : p)
            );
            return { previous };
        },
        onError: (_err, _vars, context) => {
            if (context?.previous) queryClient.setQueryData(listKey, context.previous);
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: listKey }),
    });
};
```

---

### 4. Formulaires — pattern standardisé

Toujours : **React Hook Form + composants Form de Shadcn/ui + Zod**.
Schema Zod dans `src/front/schemas/zod/entity.zod.ts` — jamais inline dans le composant.

```typescript
// src/front/components/.../EntityForm.tsx
"use client";
import { createEntitySchema, type CreateEntityInput } from "@/front/schemas/zod/entity.zod";

export default function EntityForm() {
    const form = useForm<CreateEntityInput>({ resolver: zodResolver(createEntitySchema) });
    const { mutate, isPending } = useCreateEntity();

    function onSubmit(values: CreateEntityInput) {
        mutate(values, {
            onSuccess: () => toast.success("Créé !"),
            onError: () => toast.error("Erreur"),
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <Button type="submit" disabled={isPending}>Créer</Button>
            </form>
        </Form>
    );
}
```

---

### 5. Composants interactifs — extraire le state dans un hook, spread sur les enfants

Ne jamais dupliquer du state ou des handlers dans plusieurs composants. Extraire dans un hook dédié, puis passer avec `{...state}`.

```typescript
// ✅ À faire
const postState = usePostState(post);
const { openComments } = postState; // ne destructurer que ce dont on a besoin localement

<PostActionsPopup post={post} {...postState} />  // spread — jamais de props explicites redondantes
<PostActions post={post} {...postState} />
```

```typescript
// ❌ À éviter — dupliquer useState/useEffect/handlers inline dans chaque composant
const [isSaved, setIsSaved] = useState(post.isSaved ?? false);
useEffect(() => { setIsSaved(post.isSaved ?? false); }, [post.id]);
// ... handleSave, handleVote, menuItems, <Popover> inline ...

// ❌ À éviter — passer des props explicites quand le spread suffit
<PostActionsPopup post={post} isSaved={isSaved} setIsSaved={setIsSaved} />
```

Ce pattern s'applique à tout composant qui partage de l'état entre plusieurs sous-composants.

---

### 6. Utilitaires — toujours vérifier `lib/utils.ts` avant de créer

Avant d'écrire une fonction utilitaire ou un helper, vérifier si elle existe déjà dans `src/front/lib/utils.ts`. Ne jamais recréer inline ce qui y est déjà défini.

```typescript
// ✅ À faire — réutiliser ce qui existe
import { getDisplayName, getInitialName, cn } from "@/front/lib/utils";

// ❌ À éviter — recréer inline
const name = user.firstname + " " + user.lastname;
const initials = user.firstname[0] + user.lastname[0];
```

> À terme, `lib/utils.ts` sera découpé en dossier `lib/utils/` — en attendant, tout reste dans ce fichier unique.

---

### 7. Noms affichés — toujours via les helpers utils

```typescript
import { getDisplayName, getInitialName } from "@/front/lib/utils";

const displayName = getDisplayName(author);  // firstname + lastname ou username ou "Anonyme"
const initials = getInitialName(author);     // initiales pour les avatars fallback
```

Ne jamais recalculer `firstname + lastname` inline dans un composant.

---

### 8. Récupérer l'utilisateur connecté

**Côté back** (Service, Route Handler) — `getUser` :
```typescript
import { getUser } from "@/back/lib/auth-session";

const user = await getUser();
if (!user) throw new Error("Unauthorized"); // ou return 401
```

**Côté front** (composant client) — `useUser` :
```typescript
import { useUser } from "@/front/hooks/useUser"; // ou depuis le contexte auth

const { user } = useUser();
```

Ne jamais accéder à Prisma directement depuis un Route Handler — passer par Service → Repository.

---

### 9. Opérations multi-tables — toujours une transaction Prisma

```typescript
await prisma.$transaction([
    prisma.postVote.delete({ where: { userId_postId: { userId, postId } } }),
    prisma.post.update({ where: { id: postId }, data: { upvoteCount: { decrement: 1 } } }),
]);
```

---

### 10. Emails — React Email templates

Les templates sont dans `src/front/emails/`. Chaque email est un composant `.tsx` avec `@react-email/components`. L'envoi passe par les helpers dans `src/back/lib/send-*.ts`.

---

### 11. State global — préférer Zustand à useContext

Pour tout état partagé entre plusieurs composants non directement liés (éviter le prop drilling), utiliser **Zustand** plutôt que `useContext` + `useState`.

```typescript
// ✅ À faire — store Zustand
import { create } from "zustand";

type ModalStore = {
    isOpen: boolean;
    open: () => void;
    close: () => void;
};

export const useModalStore = create<ModalStore>((set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
}));

// Consommation dans n'importe quel composant, sans Provider ni prop drilling
const { isOpen, open, close } = useModalStore();
```

```typescript
// ❌ À éviter pour de l'état global/partagé
const MyContext = createContext<...>(null);
export const MyProvider = ({ children }) => {
    const [value, setValue] = useState(...);
    return <MyContext.Provider value={{ value, setValue }}>{children}</MyContext.Provider>;
};
```

`useContext` reste acceptable pour de l'injection de dépendance stable (thème, auth user déjà fourni par `UserContext`). Pour tout état UI partagé ou données cross-composants, Zustand.

---

### 12. Éléments HTML natifs — toujours les composants Next.js équivalents

Toujours utiliser les composants Next.js optimisés plutôt que les balises HTML brutes.

```typescript
// ✅ À faire
import Link from "next/link";
import Image from "next/image";

<Link href="/profile">Mon profil</Link>
<Image src="/avatar.png" alt="Avatar" width={40} height={40} />

// ❌ À éviter
<a href="/profile">Mon profil</a>
<img src="/avatar.png" alt="Avatar" />
```

**Exception `<Image>` :** les images servies via **ImageKit** (transformations dynamiques, URLs avec paramètres `tr=`) peuvent utiliser `<img>` natif ou le composant `IKImage` d'ImageKit directement — `next/image` peut interférer avec le pipeline de transformation ImageKit.

---

### 13. Organisation des fichiers — petits fichiers, dossiers bien nommés

Préférer plusieurs petits fichiers responsabilité unique, organisés dans des dossiers au nom explicite, plutôt qu'un seul gros fichier qui regroupe plusieurs features.

```
✅ À faire
src/front/components/Private/Account/Notifs/
├── NotifsSheet.tsx          # conteneur principal (layout + orchestration)
├── NotifsPreference.tsx     # section préférences
├── NotifsItem.tsx           # item individuel
└── NotifsEmpty.tsx          # état vide

❌ À éviter
src/front/components/Private/Account/NotificationsSheet.tsx  # 400+ lignes avec tout dedans
```

Règles :
- Un composant = une responsabilité. Si un fichier dépasse ~150 lignes, questionner le découpage.
- Le nom du dossier parent donne le contexte, les fichiers enfants n'ont pas besoin de le répéter (`Notifs/NotifsItem.tsx` et non `Notifications/NotificationsItem.tsx`).
- L'architecture n'est **pas feature-based** — `front/components/` reste le dossier global des composants réutilisables.
- **Exception** : pour les pages publiques, les composants utilisés **uniquement sur cette page** peuvent vivre dans un dossier `_components/` colocalisé à côté de la page (convention Next.js, le `_` les exclut du routing).

```
✅ Composant isolé à une page publique
src/app/(pages)/(public)/(website)/support/
├── page.tsx
└── _components/
    ├── SupportFaq.tsx
    └── SupportForm.tsx

✅ Composant réutilisable entre plusieurs pages
src/front/components/...
```

---

### 14. URL state — Nuqs pour les paramètres d'URL

Dès qu'un état doit être synchronisé avec l'URL (filtres, pagination, onglets, recherche…), utiliser **Nuqs** plutôt qu'un `useState` local.

```typescript
import { useQueryState } from "nuqs";

const [search, setSearch] = useQueryState("q");
const [page, setPage] = useQueryState("page", { defaultValue: 1 });
```

`useState` reste valide pour de l'état purement local qui n'a pas de raison d'être dans l'URL (ouverture d'une modal, toggle UI éphémère…).

---

### 15. UI — toujours Shadcn en priorité

Avant de créer un élément HTML brut, vérifier si un composant Shadcn existe. Utiliser et étendre les composants Shadcn plutôt que de recréer from scratch.

```typescript
// ✅ À faire
import { Button } from "@/front/components/ui/button";
import { Input } from "@/front/components/ui/input";
import { Badge } from "@/front/components/ui/badge";

// ❌ À éviter
<button className="px-4 py-2 bg-blue-500 text-white rounded">Envoyer</button>
<input type="text" className="border rounded px-3" />
```

---

### 16. Classes CSS conditionnelles — toujours `cn()`

Utiliser `cn()` (de `@/front/lib/utils`) dès qu'il y a des conditions ou de la composition de classes. Jamais de template literals avec `${}` pour les classNames.

```typescript
import { cn } from "@/front/lib/utils";

// ✅ À faire
<div className={cn("base-class", isActive && "active", variant === "primary" && "bg-primary")} />

// ❌ À éviter
<div className={`base-class ${isActive ? "active" : ""} ${variant === "primary" ? "bg-primary" : ""}`} />
```

`cn()` n'est pas obligatoire quand le className est une string statique sans condition.

---

### 17. Dates — toujours Day.js, vérifier utils.ts d'abord

Pour toute manipulation ou formatage de date, utiliser **Day.js**. Avant d'écrire une fonction de date, vérifier si elle existe déjà dans `src/front/lib/utils.ts`.

```typescript
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

dayjs(date).format("DD/MM/YYYY")
dayjs(date).fromNow()          // "il y a 3 jours"
dayjs(date).isBefore(dayjs())
```

Jamais `new Date().toLocaleDateString()`, `date-fns`, ou manipulation de timestamps à la main.

**Exception `date-fns`** : uniquement dans les composants Shadcn qui en dépendent nativement (ex: `DatePickerRange` via `react-day-picker`). Ne pas l'utiliser ailleurs.

---

### 18. Fonctions réutilisables — les mettre dans `utils.ts`

Toute fonction qui a des chances d'être réutilisée ailleurs dans le projet doit être écrite dans `src/front/lib/utils.ts`, pas inline dans un composant. S'applique aux helpers de formatage, calculs, transformations de données, etc.

```typescript
// ✅ Dans utils.ts — réutilisable partout
export function formatPrice(amount: number, currency = "EUR"): string {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(amount);
}

// ❌ Recréé inline dans 3 composants différents
const price = `${amount.toFixed(2)} €`;
```

---

### 19. `"use client"` — au minimum, le plus bas possible dans l'arbre

Ne mettre `"use client"` que sur le composant qui en a **réellement** besoin (hooks, interactivité, événements). Jamais sur une page ou un wrapper si seul un enfant en a besoin. Garder un maximum de Server Components pour bénéficier du rendu serveur et réduire le JS côté client.

```typescript
// ✅ Seul le composant interactif est client
// page.tsx — Server Component, fetch direct, pas de "use client"
export default async function ProjectsPage() {
    const projects = await ProjectService.findAll();
    return <ProjectsList projects={projects} />;
}

// ProjectsFilter.tsx — "use client" uniquement ici car useState
"use client";
export function ProjectsFilter({ ... }) { ... }

// ❌ À éviter — toute la page devient client inutilement
"use client";
export default function ProjectsPage() { ... }
```

---

### 20. Gestion des erreurs — standardiser Route Handlers et fetch wrappers

**Route Handlers** — toujours retourner `{ error: string }` en cas d'erreur :
```typescript
// ✅ Format standard
return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
```

**Fetch wrappers** — throw avec le message du serveur, pas un message générique :
```typescript
// ✅ Remonter le message serveur
const res = await fetch('/api/entity', { method: 'POST', body: JSON.stringify(data) });
if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error ?? "Erreur serveur");
}

// ❌ Message générique qui cache le vrai problème
if (!res.ok) throw new Error("Erreur fetch");
```

---

### 21. `loading.tsx` et `error.tsx` — par segment de route

**`loading.tsx`** — réutiliser les skeletons déjà créés dans `front/components/`. Next.js l'affiche automatiquement pendant le chargement du Server Component.

```typescript
// src/app/(pages)/(public)/(app)/marketplace/loading.tsx
import { ProjectCardSkeleton } from "@/front/components/...";

export default function Loading() {
    return (
        <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <ProjectCardSkeleton key={i} />)}
        </div>
    );
}
```

**`error.tsx`** — contextualiser le message à la feature, pas un message générique. Créer un `error.tsx` par section qui a ses propres données critiques.

```typescript
// src/app/(pages)/(public)/(app)/marketplace/error.tsx
"use client";
export default function Error({ reset }: { reset: () => void }) {
    return (
        <div>
            <p>Impossible de charger les projets.</p>
            <Button onClick={reset}>Réessayer</Button>
        </div>
    );
}
```

Un `error.tsx` global à la racine de `(app)` capture les erreurs non gérées par les segments enfants.

---

### 22. TypeScript — zéro `any`

Ne jamais utiliser `any`. Utiliser les types Prisma dérivés (`Prisma.EntityGetPayload<...>`), `unknown` + type guard, ou définir un type explicite dans `schemas/types/`.

```typescript
// ✅ À faire
function isError(value: unknown): value is Error {
    return value instanceof Error;
}

// ✅ Type Prisma dérivé
type ProjectWithAuthor = Prisma.ProjectGetPayload<{ include: { author: true } }>;

// ❌ À éviter — coupe tout le bénéfice du typage
const data: any = await res.json();
function handleError(error: any) { ... }
```

---

### 23. React keys — toujours l'`id`, jamais l'index

Pour toute liste dynamique (filtrée, triée, paginée), utiliser l'`id` de l'entité comme `key`. Avec l'index, React identifie les éléments par position — si la liste change, des états internes peuvent se retrouver attachés au mauvais élément.

```typescript
// ✅ À faire
{projects.map(project => <ProjectCard key={project.id} project={project} />)}

// ❌ À éviter pour les listes dynamiques
{projects.map((project, index) => <ProjectCard key={index} project={project} />)}
```

L'index est acceptable uniquement pour des listes 100% statiques qui ne seront jamais filtrées ni réordonnées.

---

### 24. Ressource introuvable — `notFound()` de Next.js

Quand une ressource demandée n'existe pas (page de détail avec un id inexistant), appeler `notFound()` plutôt que de rediriger ou afficher un état vide. Next.js affiche alors le `not-found.tsx` le plus proche dans l'arbre.

```typescript
// src/app/(pages)/(public)/(app)/marketplace/[projectId]/page.tsx
import { notFound } from "next/navigation";

const project = await ProjectService.findById(projectId);
if (!project) notFound();
```

Créer un `not-found.tsx` contextuel par section si le message doit être spécifique à la feature.

---

### 25. Metadata — chaque page publique doit exporter ses métadonnées

Pour le SEO, toute page publique doit exporter `metadata` (statique) ou `generateMetadata` (dynamique si les données viennent de la DB).

```typescript
// Page statique
export const metadata: Metadata = {
    title: "Marketplace — Lency",
    description: "Découvrez les projets créatifs...",
};

// Page dynamique (détail projet)
export async function generateMetadata({ params }: { params: { projectId: string } }): Promise<Metadata> {
    const project = await ProjectService.findById(params.projectId);
    if (!project) return { title: "Projet introuvable" };
    return {
        title: `${project.title} — Lency`,
        description: project.description,
    };
}
```

---

### 26. Prisma — `select` sur les listes

Pour les requêtes qui retournent de nombreux résultats, utiliser `select` pour ne récupérer que les champs réellement affichés. Évite de transférer des champs lourds (description longue, blobs) inutilement.

```typescript
// ✅ Liste — seulement les champs nécessaires à la card
findAll: () => prisma.project.findMany({
    select: {
        id: true,
        title: true,
        coverUrl: true,
        author: { select: { id: true, username: true, avatarUrl: true } },
    },
}),

// ✅ Détail — include complet justifié
findById: (id: string) => prisma.project.findUnique({
    where: { id },
    include: { author: true, skills: true, applications: true },
}),
```

---

### 27. Imports — toujours `@/`, jamais de chemins relatifs

Toujours utiliser l'alias `@/` (racine `src/`). Les chemins relatifs `../../` cassent à chaque refacto de structure.

```typescript
// ✅ À faire
import { Button } from "@/front/components/ui/button";
import { ProjectService } from "@/back/services/projects.service";
import type { ProjectWithAuthor } from "@/front/schemas/types/project.type";

// ❌ À éviter
import { Button } from "../../../components/ui/button";
import { ProjectService } from "../../back/services/projects.service";
```

---

### 28. Validation Zod côté serveur — `next-zod-route`

Utiliser **[next-zod-route](https://github.com/Melvynx/next-zod-route)** pour valider `params`, `query` et `body` dans les Route Handlers. Le formulaire peut être contourné — la validation serveur est la vraie garantie.

Séparation stricte :
- `front/schemas/zod/` → schemas pour la validation des **formulaires** (React Hook Form)
- `back/schemas/zod/` → schemas pour la validation des **Route Handlers** (next-zod-route)

Les deux peuvent être identiques pour une même entité — c'est voulu, la séparation front/back est explicite.

```typescript
import { createZodRoute } from "next-zod-route";
import { createProjectSchema } from "@/back/schemas/zod/project.zod";
import { z } from "zod";

// Route avec validation body
export const POST = createZodRoute()
    .body(createProjectSchema)
    .handler(async (req, { body }) => {
        const project = await ProjectService.create(body);
        return NextResponse.json({ project }, { status: 201 });
    });

// Route avec params + query
export const GET = createZodRoute()
    .params(z.object({ projectId: z.string() }))
    .query(z.object({ include: z.string().optional() }))
    .handler(async (req, { params, query }) => {
        const project = await ProjectService.findById(params.projectId);
        if (!project) notFound();
        return NextResponse.json({ project });
    });
```

---

### 29. `useDebounce` — obligatoire sur les inputs qui déclenchent une requête

Tout input de recherche ou filtre texte qui déclenche une requête API doit passer par `useDebounce` (disponible dans `front/hooks/`). Sans ça, une requête part à chaque frappe clavier.

```typescript
import { useDebounce } from "@/front/hooks/useDebounce";

const [search, setSearch] = useState("");
const debouncedSearch = useDebounce(search, 300);

// La requête ne se refait que 300ms après la dernière frappe
const { data } = useQuery({
    queryKey: ["projects", debouncedSearch],
    queryFn: () => fetchProjects(debouncedSearch),
    enabled: debouncedSearch.length > 0,
});
```

---

### 30. Props typées — `type Props` dédié

Pour les composants simples, un `type Props` inline dans le fichier suffit. Pour les composants avec des props complexes, créer un fichier `.type.ts` colocalisé dans le dossier du composant.

```
front/components/Marketplace/ProjectCard/
├── ProjectCard.tsx
└── ProjectCard.type.ts
```

```typescript
// ProjectCard.type.ts
import type { ProjectWithAuthor } from "@/front/schemas/types/project.type";

export type ProjectCardProps = {
    project: ProjectWithAuthor;
    onApply?: (projectId: string) => void;
    variant?: "grid" | "list";
};
```

```typescript
// ProjectCard.tsx — simple, jamais de type inline complexe
import type { ProjectCardProps } from "./ProjectCard.type";

export function ProjectCard({ project, onApply, variant = "grid" }: ProjectCardProps) { ... }
```

Règle : props simples → `type Props` inline. Props complexes ou réutilisées → fichier `.type.ts` colocalisé.

---

### 31. Suspense — `loading.tsx` pour la page, `<Suspense>` pour les sections

`loading.tsx` et `<Suspense>` sont complémentaires, pas concurrents :
- **`loading.tsx`** → Suspense boundary automatique de Next.js, couvre toute la page pendant son chargement initial
- **`<Suspense>` explicite** → sections indépendantes à l'intérieur d'une page, chacune s'affiche dès que ses données sont prêtes (streaming)

```tsx
// loading.tsx — skeleton de toute la page
export default function Loading() {
    return <PageSkeleton />;
}

// page.tsx — sections qui streament indépendamment
export default function Page() {
    return (
        <>
            <Suspense fallback={<ProjectsSkeleton />}>
                <ProjectsSection />  {/* Server Component async */}
            </Suspense>
            <Suspense fallback={<TalentsSkeleton />}>
                <TalentsSection />   {/* Server Component async */}
            </Suspense>
        </>
    );
}
```

Réutiliser les skeletons existants dans `front/components/` comme fallback — ne pas créer de nouveaux skeletons ad hoc.

---

### 32. Fichiers spéciaux — carte par section

Chaque section qui charge des données doit avoir ses trois fichiers Next.js. Règle : si une page fait un `await`, son segment a besoin des trois.

**Carte des fichiers en place dans ce projet :**

| Segment | `loading.tsx` | `error.tsx` | `not-found.tsx` |
|---|---|---|---|
| `src/app/` | — | ✅ (catch-all) | ✅ (catch-all) |
| `(app)/marketplace/` | ✅ | ✅ | ✅ |
| `(app)/marketplace/[projectId]/` | ✅ | — (hérite) | ✅ |
| `(app)/community/` | ✅ | ✅ | ✅ |
| `(app)/community/[slug]/post/[id]/` | ✅ | — (hérite) | ✅ |
| `(app)/community/[slug]/resources/[resourceId]/` | — | — (hérite) | ✅ |
| `(app)/user/[userName]/` | ✅ | — (hérite) | ✅ |
| `account/` | ✅ | ✅ | — |
| `admin/` | — | ✅ | — |

**Règles :**
- `not-found.tsx` → toujours dans le segment **le plus proche** de la route dynamique. Le message doit nommer la ressource ("Ce projet n'existe pas", pas "Page introuvable").
- `error.tsx` → **ne pas dupliquer** par route dynamique : le segment parent capture les enfants. Un `error.tsx` par section suffit.
- `loading.tsx` → **ne pas créer** sur les pages auth ou les pages website statiques (pas d'`await` = pas d'intérêt).
- `unauthorized.tsx` → un seul à la racine `src/app/`, appelé via `unauthorized()` de `next/navigation`.

**Protection serveur sur `/account/` :**

Le layout `/account/layout.tsx` doit rediriger côté serveur si l'utilisateur n'est pas connecté, comme le fait `/admin/layout.tsx`. Ne pas déléguer cette protection au composant client.

```typescript
// account/layout.tsx
const user = await getUser();
if (!user) redirect("/login");
```

---

## Commandes utiles

### Prisma (migrations, db push, studio...)

`DATABASE_URL` est injecté par Doppler — sans le préfixe `doppler run --`, toute commande Prisma qui touche la DB échoue.

```bash
doppler run -- npx prisma migrate dev
doppler run -- npx prisma db push
doppler run -- npx prisma studio
# ou via le script npm si défini :
npm run migrate
```

---

## Ce qui est en cours d'optimisation

Ces patterns existent déjà dans certains endroits mais ne sont pas encore appliqués partout :
- Optimistic updates (certaines mutations font juste `invalidateQueries`)
- Extraction de state en hooks (certains composants ont encore du state inline)
- Typage strict Prisma (quelques `any` peuvent subsister)

Quand tu modifies du code existant qui ne suit pas ces patterns, tu peux le corriger au passage — mais ne refactore pas pour refactorer, seulement si c'est dans le périmètre de la tâche demandée.

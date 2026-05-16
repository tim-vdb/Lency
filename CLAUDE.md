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
- **Upload** : UploadThing + ImageKit
- **Emails** : React Email + nodemailer / resend
- **Notifications** : sonner (toasts)
- **Secrets** : Doppler CLI en dev

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
│   ├── components/         # Composants React
│   ├── hooks/              # Hooks custom + React Query hooks
│   ├── lib/api/            # Fetch wrappers vers l'API
│   ├── types/              # Zod schemas + types Prisma dérivés
│   ├── context/            # React Context (UserContext)
│   └── emails/             # React Email templates
└── back/                   # Tout ce qui est serveur
    ├── lib/                # auth, prisma, session, send-email
    ├── repositories/       # Data access layer (*.action.ts)
    ├── services/           # Business logic (*.service.ts)
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
| Hooks query | `use-{entity}.ts` | `use-posts.ts` |
| Hooks custom | `use-{feature}.ts` | `use-share.ts` |
| Repositories | `{entity}.action.ts` | `posts.action.ts` |
| Services | `{entity}.service.ts` | `posts.service.ts` |
| Types/Schemas | `{entity}.schema.ts` | `post.schema.ts` |
| Fetch wrappers | camelCase | `fetchPosts`, `createPost` |

---

## Patterns à suivre

### 1. Flux complet pour une nouvelle entité

**Repository** (`src/back/repositories/entity.action.ts`) — data access pur, pas de logique métier :
```typescript
export const EntityAction = {
    findAll: () => prisma.entity.findMany({ include: { author: true } }),
    findById: (id: string) => prisma.entity.findUnique({ where: { id }, include: { author: true } }),
    create: (data: Prisma.EntityCreateInput) => prisma.entity.create({ data }),
    update: (id: string, data: Prisma.EntityUpdateInput) => prisma.entity.update({ where: { id }, data }),
    delete: (id: string) => prisma.entity.delete({ where: { id } }),
};
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

**Route Handler** (`src/app/api/entity/route.ts`) :
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

**Fetch wrapper** (`src/front/lib/api/entity.ts`) :
```typescript
export async function fetchEntities(): Promise<Entity[]> {
    const res = await fetch('/api/entity', { cache: 'no-store' });
    if (!res.ok) throw new Error('Erreur fetch');
    return (await res.json()).items;
}
```

**React Query hook** (`src/front/hooks/queries/use-entity.ts`) :
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

```typescript
"use client";

const schema = z.object({ name: z.string().min(1) });

export default function EntityForm() {
    const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });
    const { mutate } = useCreateEntity();

    function onSubmit(values: z.infer<typeof schema>) {
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
                <Button type="submit">Créer</Button>
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

### 6. Noms affichés — toujours via les helpers utils

```typescript
import { getDisplayName, getInitialName } from "@/front/lib/utils";

const displayName = getDisplayName(author);  // firstname + lastname ou username ou "Anonyme"
const initials = getInitialName(author);     // initiales pour les avatars fallback
```

Ne jamais recalculer `firstname + lastname` inline dans un composant.

---

### 7. Session serveur

```typescript
import { getUser } from "@/back/lib/auth-session";

// Dans un Service ou Route Handler
const user = await getUser();
if (!user) throw new Error("Unauthorized"); // ou return 401
```

Ne jamais accéder à Prisma directement depuis un Route Handler — passer par Service → Repository.

---

### 8. Opérations multi-tables — toujours une transaction Prisma

```typescript
await prisma.$transaction([
    prisma.postVote.delete({ where: { userId_postId: { userId, postId } } }),
    prisma.post.update({ where: { id: postId }, data: { upvoteCount: { decrement: 1 } } }),
]);
```

---

### 9. Emails — React Email templates

Les templates sont dans `src/front/emails/`. Chaque email est un composant `.tsx` avec `@react-email/components`. L'envoi passe par les helpers dans `src/back/lib/send-*.ts`.

---

## Ce qui est en cours d'optimisation

Ces patterns existent déjà dans certains endroits mais ne sont pas encore appliqués partout :
- Optimistic updates (certaines mutations font juste `invalidateQueries`)
- Extraction de state en hooks (certains composants ont encore du state inline)
- Typage strict Prisma (quelques `any` peuvent subsister)

Quand tu modifies du code existant qui ne suit pas ces patterns, tu peux le corriger au passage — mais ne refactore pas pour refactorer, seulement si c'est dans le périmètre de la tâche demandée.

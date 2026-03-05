/**
 * Factory queryOptions pour les catégories
 *
 * Pattern recommandé TanStack Query v5+:
 * - queryOptions() centralise queryKey + queryFn + staleTime au même endroit
 * - Une seule source de vérité pour les clés de cache
 * - Préfetch/SSR avec prefetchQuery(categoryQueries.lists()) — 1 ligne
 * - categoryMutations reçoit queryClient en paramètre pour l'invalidation
 */

import { queryOptions, type QueryClient } from "@tanstack/react-query"
import {
    createCategory,
    deleteCategory,
    fetchCategories,
    fetchCategoryById,
    updateCategory,
    type Category,
    type CreateCategoryInput,
} from "@/front/lib/api/categories"

// ─── Clé racine utilisée pour invalider toutes les queries catégories ─────────
const CATEGORY_ROOT = ["categories"] as const

// ─── Queries (GET) ─────────────────────────────────────────────────────────────

export const categoryQueries = {
    /**
     * Liste de toutes les catégories
     * Usage: useQuery(categoryQueries.lists())
     *        prefetchQuery(categoryQueries.lists())
     */
    lists: () =>
        queryOptions({
            queryKey: [...CATEGORY_ROOT, "list"] as const,
            queryFn: fetchCategories,
            staleTime: 1000 * 60 * 5, // 5 min – centralisé ici, pas à répéter dans chaque hook
        }),

    /**
     * Une catégorie par ID
     * Usage: useQuery(categoryQueries.detail(id))
     */
    detail: (id: string) =>
        queryOptions({
            queryKey: [...CATEGORY_ROOT, "detail", id] as const,
            queryFn: () => fetchCategoryById(id),
            staleTime: 1000 * 60 * 5,
        }),
}

// ─── Mutations (POST / PUT / DELETE) ──────────────────────────────────────────
// queryClient est passé en paramètre car on ne peut pas appeler useQueryClient() hors d'un hook.

export const categoryMutations = {
    /**
     * Créer une catégorie
     * Usage: useMutation(categoryMutations.create(queryClient))
     */
    create: (queryClient: QueryClient) => ({
        mutationFn: createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...CATEGORY_ROOT, "list"] })
        },
    }),

    /**
     * Mettre à jour une catégorie
     * Usage: useMutation(categoryMutations.update(queryClient))
     */
    update: (queryClient: QueryClient) => ({
        mutationFn: ({ id, data }: { id: string; data: Partial<CreateCategoryInput> }) =>
            updateCategory(id, data),
        onSuccess: () => {
            // Invalide toutes les queries catégories (liste + détails)
            queryClient.invalidateQueries({ queryKey: CATEGORY_ROOT })
        },
    }),

    /**
     * Supprimer une catégorie (avec optimistic update)
     * Usage: useMutation(categoryMutations.delete(queryClient))
     */
    delete: (queryClient: QueryClient) => ({
        mutationFn: deleteCategory,
        onMutate: async (categoryId: string) => {
            const listKey = categoryQueries.lists().queryKey

            await queryClient.cancelQueries({ queryKey: listKey })
            const previousCategories = queryClient.getQueryData<Category[]>(listKey)

            // Retire optimistiquement la catégorie du cache
            queryClient.setQueryData<Category[]>(listKey, (old = []) =>
                old.filter((cat) => cat.id !== categoryId)
            )

            return { previousCategories }
        },
        onError: (
            _err: unknown,
            _categoryId: string,
            context: { previousCategories: Category[] | undefined } | undefined
        ) => {
            if (context?.previousCategories !== undefined) {
                queryClient.setQueryData(categoryQueries.lists().queryKey, context.previousCategories)
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [...CATEGORY_ROOT, "list"] })
        },
    }),
}

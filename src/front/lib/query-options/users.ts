/**
 * Factory queryOptions pour les utilisateurs
 *
 * Pattern recommandé TanStack Query v5+:
 * - queryOptions() centralise queryKey + queryFn + staleTime au même endroit
 * - Une seule source de vérité pour les clés de cache
 * - Préfetch/SSR avec prefetchQuery(userQueries.lists()) — 1 ligne
 * - userMutations reçoit queryClient en paramètre pour l'invalidation
 */

import { queryOptions, type QueryClient } from "@tanstack/react-query"
import {
    deleteUser,
    fetchUserById,
    fetchUsers,
    updateUser,
    type UpdateUserInput,
} from "@/front/lib/api/users"

// ─── Clé racine utilisée pour invalider toutes les queries utilisateurs ─────────
const USER_ROOT = ["users"] as const

// ─── Queries (GET) ─────────────────────────────────────────────────────────────

export const userQueries = {
    /**
     * Toutes les clés utilisateurs
     */
    all: USER_ROOT,

    /**
     * Liste de tous les utilisateurs
     * Usage: useQuery(userQueries.lists())
     *        prefetchQuery(userQueries.lists())
     */
    lists: () =>
        queryOptions({
            queryKey: [...USER_ROOT, "list"] as const,
            queryFn: fetchUsers,
            staleTime: 1000 * 60 * 5, // 5 min
        }),

    /**
     * Un utilisateur par ID
     * Usage: useQuery(userQueries.detail(id))
     */
    detail: (id: string) =>
        queryOptions({
            queryKey: [...USER_ROOT, "detail", id] as const,
            queryFn: () => fetchUserById(id),
            staleTime: 1000 * 60 * 5,
        }),
}

// ─── Mutations (POST / PUT / DELETE) ──────────────────────────────────────────
// queryClient est passé en paramètre car on ne peut pas appeler useQueryClient() hors d'un hook.

export const userMutations = {
    /**
     * Mettre à jour un utilisateur
     * Usage: useMutation(userMutations.update(queryClient))
     */
    update: (queryClient: QueryClient) => ({
        mutationFn: ({ id, data }: { id: string; data: UpdateUserInput }) =>
            updateUser(id, data),
        onSuccess: () => {
            // Invalide toutes les queries utilisateurs (liste + détails)
            queryClient.invalidateQueries({ queryKey: USER_ROOT })
        },
    }),

    /**
     * Supprimer un utilisateur (avec optimistic update)
     * Usage: useMutation(userMutations.delete(queryClient))
     */
    delete: (queryClient: QueryClient) => ({
        mutationFn: deleteUser,
        onSettled: () => {
            // Après suppression, invalide tous les caches utilisateurs
            queryClient.invalidateQueries({ queryKey: USER_ROOT })
        },
    }),
}

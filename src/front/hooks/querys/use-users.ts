/**
 * Hooks React Query pour les utilisateurs — pattern queryOptions/factory (TanStack Query v5+)
 *
 * Ces hooks sont intentionnellement fins : toute la logique (queryKey, queryFn,
 * staleTime, invalidation, optimistic update) est centralisée dans
 * src/front/lib/query-options/users.ts
 *
 * Avantages :
 * - Une seule source de vérité pour les clés de cache
 * - prefetchQuery / hydration SSR en 1 ligne depuis n'importe où
 * - Ajout de staleTime / gcTime / select une seule fois dans le factory
 * - Moins de boilerplate, plus cohérent sur un gros projet
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { userMutations, userQueries } from "@/front/lib/query-options/users"

// ─── Queries ──────────────────────────────────────────────────────────────────

/** Récupère tous les utilisateurs */
export const useUsers = () => useQuery(userQueries.lists())

/** Récupère un utilisateur par son ID */
export const useUserById = (id: string) => useQuery(userQueries.detail(id))

// ─── Mutations ────────────────────────────────────────────────────────────────

/** Met à jour un utilisateur existant */
export const useUpdateUser = () => {
    const queryClient = useQueryClient()
    return useMutation(userMutations.update(queryClient))
}

/** Supprime un utilisateur */
export const useDeleteUser = () => {
    const queryClient = useQueryClient()
    return useMutation(userMutations.delete(queryClient))
}

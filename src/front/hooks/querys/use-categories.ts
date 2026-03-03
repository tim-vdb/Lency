import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
    createCategory,
    deleteCategory,
    fetchCategories,
    updateCategory,
    type Category,
    type CreateCategoryInput,
} from "@/front/lib/api/categories"

/**
 * Query Keys - Identifiants uniques pour chaque requête
 * 
 * Bonnes pratiques:
 * - Utiliser des arrays pour les query keys
 * - Plus c'est spécifique, mieux c'est (ex: ['categories', id] pour une catégorie spécifique)
 * - Permet d'invalider facilement les requêtes (refetch après mutation)
 */
export const categoryKeys = {
    // Toutes les requêtes liées aux catégories
    all: ['categories'] as const,
    // Liste de toutes les catégories
    lists: () => [...categoryKeys.all, 'list'] as const,
    // Une catégorie spécifique par ID
    detail: (id: string) => [...categoryKeys.all, 'detail', id] as const,
}

/**
 * Hook pour récupérer toutes les catégories
 * 
 * Exemple d'utilisation:
 * const { data: categories, isLoading, error } = useCategories()
 */
export function useCategories() {
    return useQuery({
        queryKey: categoryKeys.lists(),
        queryFn: fetchCategories,
    })
}

/**
 * Hook pour créer une nouvelle catégorie
 * 
 * Bonnes pratiques implémentées:
 * - onSuccess: Invalide le cache pour refetch les catégories
 * - onError: Affiche un message d'erreur
 * - Optimistic update: Ajoute la catégorie au cache avant la réponse serveur
 * 
 * Exemple d'utilisation:
 * const createCategoryMutation = useCreateCategory()
 * createCategoryMutation.mutate({ name: "Tech", slug: "tech" })
 */
export function useCreateCategory() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createCategory,

        // OPTIMISTIC UPDATE
        // Ajoute immédiatement la nouvelle catégorie au cache avant la réponse du serveur
        // Améliore l'UX en rendant l'interface réactive
        onMutate: async (newCategory) => {
            // 1. Annule les requêtes en cours pour éviter les conflits
            await queryClient.cancelQueries({ queryKey: categoryKeys.lists() })

            // 2. Sauvegarde l'état actuel pour pouvoir rollback en cas d'erreur
            const previousCategories = queryClient.getQueryData(categoryKeys.lists())

            // 3. Ajoute optimistiquement la nouvelle catégorie
            queryClient.setQueryData<Category[]>(categoryKeys.lists(), (old = []) => [
                ...old,
                {
                    // Données temporaires (seront remplacées par les vraies données du serveur)
                    id: 'temp-' + Date.now(),
                    ...newCategory,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                } as Category,
            ])

            // 4. Retourne le contexte pour pouvoir rollback
            return { previousCategories }
        },

        // Si erreur, rollback à l'état précédent
        onError: (err, newCategory, context) => {
            if (context?.previousCategories) {
                queryClient.setQueryData(categoryKeys.lists(), context.previousCategories)
            }
        },

        // Quand la requête se termine (succès ou erreur)
        // Invalide le cache pour refetch les vraies données du serveur
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
        },
    })
}

/**
 * Hook pour mettre à jour une catégorie
 */
export function useUpdateCategory() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<CreateCategoryInput> }) =>
            updateCategory(id, data),
        onSuccess: () => {
            // Invalide toutes les requêtes de catégories pour refetch
            queryClient.invalidateQueries({ queryKey: categoryKeys.all })
        },
    })
}

/**
 * Hook pour supprimer une catégorie
 */
export function useDeleteCategory() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteCategory,
        onMutate: async (categoryId) => {
            await queryClient.cancelQueries({ queryKey: categoryKeys.lists() })
            const previousCategories = queryClient.getQueryData(categoryKeys.lists())

            // Retire optimistiquement la catégorie
            queryClient.setQueryData<Category[]>(categoryKeys.lists(), (old = []) =>
                old.filter((cat) => cat.id !== categoryId)
            )

            return { previousCategories }
        },
        onError: (err, categoryId, context) => {
            if (context?.previousCategories) {
                queryClient.setQueryData(categoryKeys.lists(), context.previousCategories)
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
        },
    })
}

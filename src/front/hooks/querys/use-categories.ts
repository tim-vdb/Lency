import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
    createCategory,
    deleteCategory,
    fetchCategories,
    fetchCategoryById,
    updateCategory,
    type Category,
    type CreateCategoryInput,
} from "@/front/lib/api/categories"

const CATEGORY_ROOT = ["categories"] as const

// ─── Query options (exportés pour le prefetch SSR) ────────────────────────────

export const categoryQueries = {
    all: CATEGORY_ROOT,

    lists: () =>
        queryOptions({
            queryKey: [...CATEGORY_ROOT, "list"] as const,
            queryFn: fetchCategories,
            staleTime: 1000 * 60 * 5,
        }),

    detail: (id: string) =>
        queryOptions({
            queryKey: [...CATEGORY_ROOT, "detail", id] as const,
            queryFn: () => fetchCategoryById(id),
            staleTime: 1000 * 60 * 5,
        }),
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export const useCategories = () => useQuery(categoryQueries.lists())

export const useCategoryById = (id: string) => useQuery(categoryQueries.detail(id))

// ─── Mutations ────────────────────────────────────────────────────────────────

export const useCreateCategory = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createCategory,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [...CATEGORY_ROOT, "list"] }),
    })
}

export const useUpdateCategory = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<CreateCategoryInput> }) => updateCategory(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: CATEGORY_ROOT }),
    })
}

export const useDeleteCategory = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deleteCategory,
        onMutate: async (categoryId: string) => {
            const listKey = categoryQueries.lists().queryKey
            await queryClient.cancelQueries({ queryKey: listKey })
            const previousCategories = queryClient.getQueryData<Category[]>(listKey)
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
        onSettled: () => queryClient.invalidateQueries({ queryKey: [...CATEGORY_ROOT, "list"] }),
    })
}

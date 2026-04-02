import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
    changePassword,
    deleteUser,
    fetchUserById,
    fetchUsers,
    updateUser,
    verifyEmailChange,
    type ChangePasswordInput,
    type UpdateUserInput,
    type VerifyEmailChangeInput,
} from "@/front/lib/api/users"

const USER_ROOT = ["users"] as const

// ─── Query options (exportés pour le prefetch SSR) ────────────────────────────

export const userQueries = {
    all: USER_ROOT,

    lists: () =>
        queryOptions({
            queryKey: [...USER_ROOT, "list"] as const,
            queryFn: fetchUsers,
            staleTime: 1000 * 60 * 5,
        }),

    detail: (id: string) =>
        queryOptions({
            queryKey: [...USER_ROOT, "detail", id] as const,
            queryFn: () => fetchUserById(id),
            staleTime: 1000 * 60 * 5,
        }),
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export const useUsers = () => useQuery(userQueries.lists())

export const useUserById = (id: string) => useQuery(userQueries.detail(id))

// ─── Mutations ────────────────────────────────────────────────────────────────

export const useUpdateUser = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateUserInput }) => updateUser(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: USER_ROOT }),
    })
}

export const useDeleteUser = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deleteUser,
        onSettled: () => queryClient.invalidateQueries({ queryKey: USER_ROOT }),
    })
}

export const useChangePassword = () =>
    useMutation({ mutationFn: (input: ChangePasswordInput) => changePassword(input) })

export const useVerifyEmailChange = () =>
    useMutation({ mutationFn: (input: VerifyEmailChangeInput) => verifyEmailChange(input) })

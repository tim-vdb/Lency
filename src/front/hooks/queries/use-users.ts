import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
    changePassword,
    deleteUser,
    fetchUserById,
    fetchUserByUsername,
    fetchUsers,
    getFollowStatus,
    reportUser,
    toggleFollowUser,
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

    byUsername: (username: string) =>
        queryOptions({
            queryKey: [...USER_ROOT, "username", username] as const,
            queryFn: () => fetchUserByUsername(username),
            staleTime: 1000 * 60 * 5,
            enabled: !!username,
        }),
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export const useUsers = () => useQuery(userQueries.lists())

export const useUserById = (id: string) => useQuery(userQueries.detail(id))

export const useUserByUsername = (username: string) => useQuery(userQueries.byUsername(username))

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

export const useFollowStatus = (userId: string) =>
    useQuery({
        queryKey: [...USER_ROOT, userId, "follow"] as const,
        queryFn: () => getFollowStatus(userId),
        staleTime: 1000 * 60,
        enabled: !!userId,
    })

export const useToggleFollowUser = (userId: string, username: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: () => toggleFollowUser(userId),
        onMutate: async () => {
            const followKey = [...USER_ROOT, userId, "follow"]
            await queryClient.cancelQueries({ queryKey: followKey })
            const previous = queryClient.getQueryData<{ following: boolean }>(followKey)
            queryClient.setQueryData(followKey, { following: !previous?.following })
            return { previous }
        },
        onError: (_err, _vars, context) => {
            if (context?.previous !== undefined) {
                queryClient.setQueryData([...USER_ROOT, userId, "follow"], context.previous)
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [...USER_ROOT, userId, "follow"] })
            queryClient.invalidateQueries({ queryKey: [...USER_ROOT, "username", username] })
        },
    })
}

export const useReportUser = (userId: string) =>
    useMutation({ mutationFn: (reason?: string) => reportUser(userId, reason) })

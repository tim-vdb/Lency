"use client"

import { useMutation, useQuery, useQueryClient, queryOptions } from "@tanstack/react-query"
import {
    fetchAdminEmails,
    fetchAdminEmail,
    sendAdminEmail,
    replyToAdminEmail,
    patchAdminEmail,
    deleteAdminEmail,
    fetchUnreadCounts,
} from "@/front/lib/api/admin-emails"
import { AdminEmailBox } from "@/back/generated/prisma_client"
import type { SendEmailInput, ReplyEmailInput } from "@/front/schemas/zod/admin-email.zod"
import { toast } from "sonner"

const ADMIN_EMAILS_ROOT = ["admin-emails"] as const

export const adminEmailQueries = {
    lists: (box?: AdminEmailBox) =>
        queryOptions({
            queryKey: [...ADMIN_EMAILS_ROOT, "list", box ?? "all"],
            queryFn: () => fetchAdminEmails(box),
            staleTime: 1000 * 30,
        }),
    detail: (id: string) =>
        queryOptions({
            queryKey: [...ADMIN_EMAILS_ROOT, "detail", id],
            queryFn: () => fetchAdminEmail(id),
            staleTime: 1000 * 30,
            enabled: !!id,
        }),
    unread: () =>
        queryOptions({
            queryKey: [...ADMIN_EMAILS_ROOT, "unread"],
            queryFn: fetchUnreadCounts,
            staleTime: 1000 * 60,
            refetchInterval: 1000 * 60,
        }),
}

export const useAdminEmails = (box?: AdminEmailBox) =>
    useQuery(adminEmailQueries.lists(box))

export const useAdminEmail = (id: string) =>
    useQuery(adminEmailQueries.detail(id))

export const useUnreadCounts = () =>
    useQuery(adminEmailQueries.unread())

export const useSendAdminEmail = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: SendEmailInput) => sendAdminEmail(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ADMIN_EMAILS_ROOT })
            toast.success("Email envoyé")
        },
        onError: (err: Error) => toast.error(err.message),
    })
}

export const useReplyAdminEmail = (parentId: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: ReplyEmailInput) => replyToAdminEmail(parentId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ADMIN_EMAILS_ROOT })
            toast.success("Réponse envoyée")
        },
        onError: (err: Error) => toast.error(err.message),
    })
}

export const usePatchAdminEmail = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, ...data }: { id: string; isRead?: boolean; isStarred?: boolean }) =>
            patchAdminEmail(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ADMIN_EMAILS_ROOT }),
    })
}

export const useDeleteAdminEmail = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => deleteAdminEmail(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ADMIN_EMAILS_ROOT })
            toast.success("Email supprimé")
        },
        onError: (err: Error) => toast.error(err.message),
    })
}

import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
    createMail,
    deleteMail,
    fetchMails,
    fetchMailById,
    updateMailStatus,
    type Mail,
    ContactStatus,
} from "@/front/lib/api/mails"

const MAIL_ROOT = ["mails"] as const

// ─── Query options (exportés pour le prefetch SSR) ────────────────────────────

export const mailQueries = {
    all: MAIL_ROOT,

    lists: () =>
        queryOptions({
            queryKey: [...MAIL_ROOT, "list"] as const,
            queryFn: fetchMails,
            staleTime: 1000 * 60 * 5,
        }),

    detail: (id: string) =>
        queryOptions({
            queryKey: [...MAIL_ROOT, "detail", id] as const,
            queryFn: () => fetchMailById(id),
            staleTime: 1000 * 60 * 5,
        }),
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export const useMails = () => useQuery(mailQueries.lists())

export const useMailById = (id: string) => useQuery(mailQueries.detail(id))

// ─── Mutations ────────────────────────────────────────────────────────────────

export const useCreateMail = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createMail,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [...MAIL_ROOT, "list"] }),
    })
}

export const useUpdateMailStatus = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: ContactStatus }) => updateMailStatus(id, status),
        onSuccess: (_data, { id }) =>
            queryClient.invalidateQueries({ queryKey: [...MAIL_ROOT, "detail", id] }),
        onSettled: () => queryClient.invalidateQueries({ queryKey: [...MAIL_ROOT, "list"] }),
    })
}

export const useDeleteMail = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deleteMail,
        onMutate: async (mailId: string) => {
            const listKey = mailQueries.lists().queryKey
            await queryClient.cancelQueries({ queryKey: listKey })
            const previousMails = queryClient.getQueryData<Mail[]>(listKey)
            queryClient.setQueryData<Mail[]>(listKey, (old = []) =>
                old.filter((mail) => mail.id !== mailId)
            )
            return { previousMails }
        },
        onError: (
            _err: unknown,
            _mailId: string,
            context: { previousMails: Mail[] | undefined } | undefined
        ) => {
            if (context?.previousMails !== undefined) {
                queryClient.setQueryData(mailQueries.lists().queryKey, context.previousMails)
            }
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: [...MAIL_ROOT, "list"] }),
    })
}
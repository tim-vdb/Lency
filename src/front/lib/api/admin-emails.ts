import type { AdminEmailListItem, AdminEmailWithReplies, UnreadCounts } from "@/front/schemas/types/admin-email.type"
import type { SendEmailInput, ReplyEmailInput } from "@/front/schemas/zod/admin-email.zod"
import { AdminEmailBox } from "@/back/generated/prisma_client"

export async function fetchAdminEmails(box?: AdminEmailBox): Promise<AdminEmailListItem[]> {
    const url = box ? `/api/admin/emails?box=${box}` : "/api/admin/emails"
    const res = await fetch(url, { cache: "no-store" })
    if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error ?? "Erreur serveur")
    }
    return (await res.json()).emails
}

export async function fetchAdminEmail(id: string): Promise<AdminEmailWithReplies> {
    const res = await fetch(`/api/admin/emails/${id}`, { cache: "no-store" })
    if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error ?? "Erreur serveur")
    }
    return (await res.json()).email
}

export async function sendAdminEmail(data: SendEmailInput): Promise<AdminEmailWithReplies> {
    const res = await fetch("/api/admin/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
    if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error ?? "Erreur serveur")
    }
    return (await res.json()).email
}

export async function replyToAdminEmail(id: string, data: ReplyEmailInput): Promise<AdminEmailWithReplies> {
    const res = await fetch(`/api/admin/emails/${id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
    if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error ?? "Erreur serveur")
    }
    return (await res.json()).reply
}

export async function patchAdminEmail(id: string, data: { isRead?: boolean; isStarred?: boolean }): Promise<void> {
    const res = await fetch(`/api/admin/emails/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
    if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error ?? "Erreur serveur")
    }
}

export async function deleteAdminEmail(id: string): Promise<void> {
    const res = await fetch(`/api/admin/emails/${id}`, { method: "DELETE" })
    if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error ?? "Erreur serveur")
    }
}

export async function fetchUnreadCounts(): Promise<UnreadCounts> {
    const res = await fetch("/api/admin/emails/unread", { cache: "no-store" })
    if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error ?? "Erreur serveur")
    }
    return res.json()
}

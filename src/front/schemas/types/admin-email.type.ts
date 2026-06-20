import type { Prisma } from "@/back/generated/prisma_client"

export type AdminEmailWithReplies = Prisma.AdminEmailGetPayload<{
    include: {
        replies: { orderBy: { createdAt: "asc" } }
        parent: true
    }
}>

export type AdminEmailListItem = Prisma.AdminEmailGetPayload<{
    select: {
        id: true
        type: true
        box: true
        fromEmail: true
        fromName: true
        toEmail: true
        subject: true
        isRead: true
        isStarred: true
        createdAt: true
        _count: { select: { replies: true } }
    }
}>

export type UnreadCounts = {
    support: number
    messages: number
    dev: number
    total: number
}

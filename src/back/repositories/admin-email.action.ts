import { prisma } from "@/back/lib/prisma"
import { AdminEmailBox, AdminEmailType, Prisma } from "@/back/generated/prisma_client"

export const AdminEmailAction = {
    findAll: (box?: AdminEmailBox) =>
        prisma.adminEmail.findMany({
            where: {
                parentId: null,
                ...(box ? { box } : {}),
            },
            select: {
                id: true,
                type: true,
                box: true,
                fromEmail: true,
                fromName: true,
                toEmail: true,
                subject: true,
                isRead: true,
                isStarred: true,
                createdAt: true,
                _count: { select: { replies: true } },
            },
            orderBy: { createdAt: "desc" },
        }),

    findById: (id: string) =>
        prisma.adminEmail.findUnique({
            where: { id },
            include: {
                replies: { orderBy: { createdAt: "asc" } },
                parent: true,
            },
        }),

    findByMessageId: (messageId: string) =>
        prisma.adminEmail.findUnique({ where: { messageId } }),

    create: (data: Prisma.AdminEmailCreateInput) =>
        prisma.adminEmail.create({ data }),

    update: (id: string, data: Prisma.AdminEmailUpdateInput) =>
        prisma.adminEmail.update({ where: { id }, data }),

    delete: (id: string) =>
        prisma.adminEmail.delete({ where: { id } }),

    markAllReadByBox: (box: AdminEmailBox) =>
        prisma.adminEmail.updateMany({
            where: { box, isRead: false },
            data: { isRead: true },
        }),

    countUnread: (box: AdminEmailBox) =>
        prisma.adminEmail.count({
            where: { box, isRead: false, type: AdminEmailType.RECEIVED },
        }),
}

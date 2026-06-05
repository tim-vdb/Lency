import { prisma } from "@/back/lib/prisma";

export const ProjectInvitationAction = {
    create: (data: { projectId: string; userId: string }) =>
        prisma.projectInvitation.create({ data, include: { user: true, project: true } }),

    findById: (id: string) =>
        prisma.projectInvitation.findUnique({
            where: { id },
            include: { user: true, project: true },
        }),

    findByProjectAndUser: (projectId: string, userId: string) =>
        prisma.projectInvitation.findUnique({
            where: { projectId_userId: { projectId, userId } },
        }),

    findByProjectId: (projectId: string) =>
        prisma.projectInvitation.findMany({
            where: { projectId },
            include: { user: { select: { id: true, firstname: true, lastname: true, username: true, image: true, avatarUrl: true } } },
            orderBy: { sentAt: "desc" },
        }),

    updateStatus: (id: string, status: "ACCEPTED" | "REJECTED") =>
        prisma.projectInvitation.update({
            where: { id },
            data: { status, respondedAt: new Date() },
            include: { user: true, project: true },
        }),

    delete: (id: string) => prisma.projectInvitation.delete({ where: { id } }),
};

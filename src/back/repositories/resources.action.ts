import { Prisma } from "../generated/prisma_client";
import prisma from "../lib/prisma";

export const ResourcesAction = {
    findById: async (id: string, userId?: string) => {
        const resource = await prisma.resource.findUnique({
            where: { id },
            include: { author: true, category: true },
        });
        if (!resource) return null;
        if (!userId) return { ...resource, isSaved: false, isVoted: false };
        const { savedIds, votedIds } = await ResourcesAction.getUserStates(userId, [id]);
        return { ...resource, isSaved: savedIds.has(id), isVoted: votedIds.has(id) };
    },

    findSaved: async (userId: string) => {
        const saves = await prisma.resourceSave.findMany({
            where: { userId },
            include: { resource: { include: { author: true, category: true } } },
            orderBy: { createdAt: "desc" },
        });
        const resources = saves.map((s) => s.resource).filter(Boolean);
        if (resources.length === 0) return [];
        const { savedIds, votedIds } = await ResourcesAction.getUserStates(userId, resources.map((r) => r.id));
        return resources.map((r) => ({ ...r, isSaved: savedIds.has(r.id), isVoted: votedIds.has(r.id) }));
    },

    findAll: async (opts?: { categoryId?: string; authorId?: string; userId?: string }) => {
        const resources = await prisma.resource.findMany({
            where: opts?.categoryId
                ? { categoryId: opts.categoryId }
                : opts?.authorId
                  ? { authorId: opts.authorId }
                  : undefined,
            include: { author: true, category: true },
            orderBy: { createdAt: "desc" },
        });
        if (!opts?.userId) return resources.map((r) => ({ ...r, isSaved: false, isVoted: false }));
        const { savedIds, votedIds } = await ResourcesAction.getUserStates(
            opts.userId,
            resources.map((r) => r.id),
        );
        return resources.map((r) => ({
            ...r,
            isSaved: savedIds.has(r.id),
            isVoted: votedIds.has(r.id),
        }));
    },

    getUserStates: async (userId: string, resourceIds: string[]) => {
        const [saves, votes] = await Promise.all([
            prisma.resourceSave.findMany({
                where: { userId, resourceId: { in: resourceIds } },
                select: { resourceId: true },
            }),
            prisma.resourceVote.findMany({
                where: { userId, resourceId: { in: resourceIds } },
                select: { resourceId: true },
            }),
        ]);
        return {
            savedIds: new Set(saves.map((s) => s.resourceId)),
            votedIds: new Set(votes.map((v) => v.resourceId)),
        };
    },

    create: async (authorId: string, data: {
        title: string;
        description?: string | null;
        type: "ASSET" | "TUTORIAL" | "LINK";
        url?: string | null;
        imageUrl?: string | null;
        videoUrl?: string | null;
        audioUrl?: string | null;
        categoryId: string;
    }) => {
        return prisma.resource.create({ data: { ...data, authorId } });
    },

    update: async (id: string, data: Prisma.ResourceUncheckedUpdateInput) => {
        return prisma.resource.update({ where: { id }, data });
    },

    delete: async (id: string) => {
        return prisma.resource.delete({ where: { id } });
    },

    toggleSave: async (userId: string, resourceId: string) => {
        const existing = await prisma.resourceSave.findUnique({
            where: { userId_resourceId: { userId, resourceId } },
        });
        if (existing) {
            await prisma.$transaction([
                prisma.resourceSave.delete({ where: { userId_resourceId: { userId, resourceId } } }),
                prisma.resource.update({ where: { id: resourceId }, data: { saveCount: { decrement: 1 } } }),
            ]);
            return { saved: false };
        }
        await prisma.$transaction([
            prisma.resourceSave.create({ data: { userId, resourceId } }),
            prisma.resource.update({ where: { id: resourceId }, data: { saveCount: { increment: 1 } } }),
        ]);
        return { saved: true };
    },

    toggleVote: async (userId: string, resourceId: string) => {
        const existing = await prisma.resourceVote.findUnique({
            where: { userId_resourceId: { userId, resourceId } },
        });
        if (existing) {
            await prisma.$transaction([
                prisma.resourceVote.delete({ where: { userId_resourceId: { userId, resourceId } } }),
                prisma.resource.update({ where: { id: resourceId }, data: { upvoteCount: { decrement: 1 } } }),
            ]);
            return { voted: false };
        }
        await prisma.$transaction([
            prisma.resourceVote.create({ data: { userId, resourceId } }),
            prisma.resource.update({ where: { id: resourceId }, data: { upvoteCount: { increment: 1 } } }),
        ]);
        return { voted: true };
    },

    incrementViewCount: async (id: string) => {
        return prisma.resource.update({
            where: { id },
            data: { viewCount: { increment: 1 } },
        });
    },
};

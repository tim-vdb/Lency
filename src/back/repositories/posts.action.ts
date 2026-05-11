import prisma from "../lib/prisma"

export const PostsAction = {
    findById: async (id: string, userId?: string) => {
        const post = await prisma.post.findUnique({
            where: { id },
            include: { author: true, category: true },
        });
        if (!post) return null;
        if (!userId) return { ...post, isSaved: false, isVoted: false };
        const { savedIds, votedIds } = await PostsAction.getUserStates(userId, [id]);
        return { ...post, isSaved: savedIds.has(id), isVoted: votedIds.has(id) };
    },

    create: async (userId: string, data: {
        content: string;
        categoryId: string;
        format?: "TEXT" | "IMAGE" | "VIDEO" | "AUDIO";
        orientation?: "LANDSCAPE" | "PORTRAIT";
        imageUrl?: string;
        videoUrl?: string;
        audioUrl?: string;
        isPublished?: boolean;
    }) => {
        return prisma.post.create({
            data: {
                ...data,
                authorId: userId,
            },
            include: { author: true, category: true },
        });
    },

    update: async (id: string, data: {
        title?: string;
        content?: string;
        isPublished?: boolean;
        isLocked?: boolean;
        categoryId?: string;
        imageUrl?: string;
        videoUrl?: string;
        audioUrl?: string;
    }) => {
        return prisma.post.update({
            where: { id },
            data,
        });
    },

    delete: async (id: string) => {
        return prisma.post.delete({ where: { id } });
    },

    getUserStates: async (userId: string, postIds: string[]) => {
        const [saves, votes] = await Promise.all([
            prisma.postSave.findMany({
                where: { userId, postId: { in: postIds } },
                select: { postId: true },
            }),
            prisma.postVote.findMany({
                where: { userId, postId: { in: postIds } },
                select: { postId: true },
            }),
        ]);
        return {
            savedIds: new Set(saves.map((s) => s.postId)),
            votedIds: new Set(votes.map((v) => v.postId)),
        };
    },

    findAll: async (userId?: string) => {
        const posts = await prisma.post.findMany({
            include: { author: true, category: true },
            orderBy: { createdAt: "desc" },
        });
        if (!userId) return posts.map((p) => ({ ...p, isSaved: false, isVoted: false }));
        const { savedIds, votedIds } = await PostsAction.getUserStates(userId, posts.map((p) => p.id));
        return posts.map((p) => ({ ...p, isSaved: savedIds.has(p.id), isVoted: votedIds.has(p.id) }));
    },

    toggleSave: async (userId: string, postId: string) => {
        const existing = await prisma.postSave.findUnique({
            where: { userId_postId: { userId, postId } },
        });
        if (existing) {
            await prisma.$transaction([
                prisma.postSave.delete({ where: { userId_postId: { userId, postId } } }),
                prisma.post.update({ where: { id: postId }, data: { saveCount: { decrement: 1 } } }),
            ]);
            return { saved: false };
        }
        await prisma.$transaction([
            prisma.postSave.create({ data: { userId, postId } }),
            prisma.post.update({ where: { id: postId }, data: { saveCount: { increment: 1 } } }),
        ]);
        return { saved: true };
    },

    toggleVote: async (userId: string, postId: string) => {
        const existing = await prisma.postVote.findUnique({
            where: { userId_postId: { userId, postId } },
        });
        if (existing) {
            await prisma.$transaction([
                prisma.postVote.delete({ where: { userId_postId: { userId, postId } } }),
                prisma.post.update({ where: { id: postId }, data: { upvoteCount: { decrement: 1 } } }),
            ]);
            return { voted: false };
        }
        await prisma.$transaction([
            prisma.postVote.create({ data: { userId, postId } }),
            prisma.post.update({ where: { id: postId }, data: { upvoteCount: { increment: 1 } } }),
        ]);
        return { voted: true };
    },

    reportPost: async (userId: string, postId: string, reason?: string) => {
        return prisma.postReport.upsert({
            where: { userId_postId: { userId, postId } },
            create: { userId, postId, reason },
            update: { reason },
        });
    },
};
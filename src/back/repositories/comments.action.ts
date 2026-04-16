import prisma from "../lib/prisma"

export const CommentsAction = {
    findById: async (id: string) => {
        return prisma.comment.findUnique({ where: { id } });
    },

    findAll: async (postId: string) => {
        const flat = await prisma.comment.findMany({
            where: { postId },
            include: { author: true },
            orderBy: { createdAt: "asc" },
        });

        type Node = typeof flat[number] & { children: Node[] };

        const map = new Map<string, Node>();
        for (const c of flat) map.set(c.id, { ...c, children: [] });

        const roots: Node[] = [];
        for (const c of flat) {
            const node = map.get(c.id)!;
            if (c.parentId && map.has(c.parentId)) {
                map.get(c.parentId)!.children.push(node);
            } else if (!c.parentId) {
                roots.push(node);
            }
        }

        return roots.reverse(); // commentaires récents en premier
    },

    create: async (userId: string, data: {
        content: string;
        postId: string;
        parentId?: string;
    }) => {
        const comment = await prisma.comment.create({
            data: {
                content: data.content,
                postId: data.postId,
                authorId: userId,
                parentId: data.parentId,
            },
        });

        // Incrémenter le commentCount du post
        await prisma.post.update({
            where: { id: data.postId },
            data: { commentCount: { increment: 1 } },
        });

        return comment;
    },

    voteUpdate: async (
        id: string,
        prev: "upvote" | "downvote" | null,
        next: "upvote" | "downvote" | null,
    ) => {
        const data: {
            upvoteCount?: { increment: number } | { decrement: number };
            downvoteCount?: { increment: number } | { decrement: number };
        } = {};
        if (prev === "upvote") data.upvoteCount = { decrement: 1 };
        if (prev === "downvote") data.downvoteCount = { decrement: 1 };
        if (next === "upvote") data.upvoteCount = { increment: 1 };
        if (next === "downvote") data.downvoteCount = { increment: 1 };
        return prisma.comment.update({ where: { id }, data });
    },

    update: async (id: string, data: {
        content: string;
    }) => {
        return prisma.comment.update({
            where: { id },
            data: { content: data.content },
        });
    },

    delete: async (id: string) => {
        // Récupérer le commentaire avant de le supprimer
        const comment = await prisma.comment.findUnique({
            where: { id },
        });

        if (!comment) throw new Error("Comment not found");

        // Supprimer le commentaire
        await prisma.comment.delete({ where: { id } });

        // Décrémenter le commentCount du post
        await prisma.post.update({
            where: { id: comment.postId },
            data: { commentCount: { decrement: 1 } },
        });
    },
};
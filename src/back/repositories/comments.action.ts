import prisma from "../lib/prisma"

export const CommentsAction = {
    findById: async (id: string) => {
        return prisma.comment.findUnique({ where: { id } });
    },

    findByPostId: async (postId: string) => {
        const flat = await prisma.comment.findMany({
            where: { postId },
            include: { author: true },
            orderBy: { createdAt: "asc" },
        });
        return buildTree(flat);
    },

    findByResourceId: async (resourceId: string) => {
        const flat = await prisma.comment.findMany({
            where: { resourceId },
            include: { author: true },
            orderBy: { createdAt: "asc" },
        });
        return buildTree(flat);
    },

    create: async (userId: string, data: {
        content: string;
        postId?: string;
        resourceId?: string;
        parentId?: string;
    }) => {
        const comment = await prisma.comment.create({
            data: {
                content: data.content,
                postId: data.postId,
                resourceId: data.resourceId,
                authorId: userId,
                parentId: data.parentId,
            },
        });

        if (data.postId) {
            await prisma.post.update({
                where: { id: data.postId },
                data: { commentCount: { increment: 1 } },
            });
        } else if (data.resourceId) {
            await prisma.resource.update({
                where: { id: data.resourceId },
                data: { commentCount: { increment: 1 } },
            });
        }

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
        const comment = await prisma.comment.findUnique({
            where: { id },
        });

        if (!comment) throw new Error("Comment not found");

        await prisma.comment.delete({ where: { id } });

        if (comment.postId) {
            await prisma.post.update({
                where: { id: comment.postId },
                data: { commentCount: { decrement: 1 } },
            });
        } else if (comment.resourceId) {
            await prisma.resource.update({
                where: { id: comment.resourceId },
                data: { commentCount: { decrement: 1 } },
            });
        }
    },
};

type FlatComment = Awaited<ReturnType<typeof prisma.comment.findMany<{ include: { author: true } }>>>[number];

function buildTree(flat: FlatComment[]) {
    type Node = FlatComment & { children: Node[] };
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

    return roots.reverse();
}

import prisma from "../lib/prisma"


async function findCommentsByEntity(filter: {
    postId?: string;
    resourceId?: string;
    projectId?: string;
}): Promise<ReturnType<typeof buildTree>> {
    const { postId, resourceId, projectId } = filter;

    const where = postId ? { postId } : resourceId ? { resourceId } : projectId ? { projectId } : null;
    if (!where) return [];

    const comments = await prisma.comment.findMany({
        where,
        include: { author: true },
        orderBy: { createdAt: "asc" },
    });

    if (comments.length === 0) return [];

    return buildTree(comments);
}

export const CommentsAction = {
    findById: async (id: string) => {
        return prisma.comment.findUnique({ where: { id } });
    },

    findByPostId: (postId: string) =>
        findCommentsByEntity({ postId }),

    findByResourceId: (resourceId: string) =>
        findCommentsByEntity({ resourceId }),

    findByProjectId: (projectId: string) =>
        findCommentsByEntity({ projectId }),

    create: async (userId: string, data: {
        content: string;
        imageUrls?: string[];
        videoUrls?: string[];
        audioUrls?: string[];
        postId?: string;
        resourceId?: string;
        projectId?: string;
        parentId?: string;
    }) => {
        const comment = await prisma.comment.create({
            data: {
                content: data.content,
                imageUrls: data.imageUrls ?? [],
                videoUrls: data.videoUrls ?? [],
                audioUrls: data.audioUrls ?? [],
                postId: data.postId,
                resourceId: data.resourceId,
                projectId: data.projectId,
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
        } else if (data.projectId) {
            await prisma.project.update({
                where: { id: data.projectId },
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

    update: async (id: string, data: { content: string }) => {
        return prisma.comment.update({
            where: { id },
            data: { content: data.content },
        });
    },

    delete: async (id: string) => {
        const comment = await prisma.comment.findUnique({ where: { id } });
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
        } else if (comment.projectId) {
            await prisma.project.update({
                where: { id: comment.projectId },
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

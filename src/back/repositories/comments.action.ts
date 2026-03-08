import prisma from "../lib/prisma"

export const CommentsAction = {
    findById: async (id: string) => {
        return prisma.comment.findUnique({
            where: { id },
        })
    },
    findAll: async () => {
        return prisma.comment.findMany()
    },
    create: async (userId: string, data: { content: string, postId: string, authorId: string, parentId?: string, upvoteCount: number }) => {
        return prisma.comment.create({
            data: {
                content: data.content,
                postId: data.postId,
                authorId: userId,
                parentId: data.parentId || undefined,
                upvoteCount: data.upvoteCount,
            },
        })
    },
    update: async (id: string, data: { content: string, postId: string, authorId: string, parentId?: string, upvoteCount: number }) => {
        const updateData: Record<string, unknown> = {
            ...(data.content !== undefined && { content: data.content }),
            ...(data.postId !== undefined && { postId: data.postId }),
            ...(data.authorId !== undefined && { authorId: data.authorId }),
            ...(data.parentId !== undefined && { parentId: data.parentId }),
            ...(data.upvoteCount !== undefined && { upvoteCount: data.upvoteCount }),
        };

        if (data.postId !== undefined) {
            updateData.post = { connect: { id: data.postId } };
        }
        if (data.authorId !== undefined) {
            updateData.author = { connect: { id: data.authorId } };
        }
        if (data.parentId !== undefined) {
            if (data.parentId === null) {
                updateData.parent = { disconnect: true };
            } else {
                updateData.parent = { connect: { id: data.parentId } };
            }
        }

        return prisma.comment.update({
            where: { id },
            data: updateData,
        })
    },
    delete: async (id: string) => {
        return prisma.comment.delete({
            where: { id },
        })
    },
}
import prisma from "../lib/prisma"

export const CommentsAction = {
    findById: async (id: string) => {
        return prisma.comment.findUnique({ where: { id } });
    },

    findAll: async (postId: string) => {
        return prisma.comment.findMany({
            where: { postId, parentId: null },
            include: {
                author: true,
                children: { include: { author: true }, orderBy: { createdAt: "asc" } },
            },
            orderBy: { createdAt: "desc" },
        });
    },

    create: async (userId: string, data: {
        content: string;
        postId: string;
        parentId?: string;
    }) => {
        return prisma.comment.create({
            data: {
                content: data.content,
                postId: data.postId,
                authorId: userId,
                parentId: data.parentId,
            },
        });
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
        return prisma.comment.delete({ where: { id } });
    },
};